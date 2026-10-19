import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  createArchitecturalMaterials,
  type ArchitecturalMaterials,
} from "./materials";
import { FurnitureFactory } from "./furnitureFactory";
import type {
  Project3DConfig,
  FloorDefinition,
  Waypoint,
} from "./architecturalScenes";

export type ViewMode = "assembled" | "exploded" | "selected" | "walkthrough";

type ArchitecturalCanvasProps = {
  projectConfig: Project3DConfig;
  mode: ViewMode;
  selectedFloorId: string;
  onSelectFloor: (floorId: string) => void;
  onEnterWalkthrough: () => void;
  onExitWalkthrough: () => void;
  onWaypointChange?: (waypoint: Waypoint, progress: number) => void;
};

export default function ArchitecturalCanvas({
  projectConfig,
  mode,
  selectedFloorId,
  onSelectFloor,
  onEnterWalkthrough,
  onExitWalkthrough,
  onWaypointChange,
}: ArchitecturalCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Walkthrough scroll progress (0.0 to 1.0)
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const [activeWaypoint, setActiveWaypoint] = useState<Waypoint | null>(null);

  // Inverted mouse pan preference
  const [invertedLook, setInvertedLook] = useState(false);

  // User Sensitivity value (default 65 = Medium, adjustable via slider)
  const [sensitivityValue, setSensitivityValue] = useState(65);

  // References for Three.js scene instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const floorGroupsRef = useRef<Map<string, THREE.Group>>(new Map());
  const roofGroupRef = useRef<THREE.Group | null>(null);
  const baseGroupRef = useRef<THREE.Group | null>(null);
  const walkthroughCeilingRef = useRef<THREE.Group | null>(null);
  const guideLinesRef = useRef<THREE.LineSegments | null>(null);
  const materialsRef = useRef<ArchitecturalMaterials | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Synchronized refs for 60fps render loop (prevents stale closure issues)
  const modeRef = useRef<ViewMode>(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Track previous mode to snap camera instantly when entering walkthrough
  const prevModeRef = useRef<ViewMode>(mode);

  // Camera animation targets
  const cameraTargetPos = useRef<THREE.Vector3>(new THREE.Vector3(18, 16, 20));
  const cameraTargetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));
  const cameraCurrentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));

  // Natural head look offset in walkthrough (yaw, pitch) with smooth easing
  const lookYaw = useRef(0);
  const lookPitch = useRef(0);
  const targetYaw = useRef(0);
  const targetPitch = useRef(0);
  const isMouseDown = useRef(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Orbit angles for overview mode
  const orbitAngles = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4,
    phi: Math.PI / 3.4,
    radius: 28,
  });

  const activeFloor =
    projectConfig.floors.find((f) => f.id === selectedFloorId) ||
    projectConfig.floors[0];

  const activeFloorRef = useRef(activeFloor);
  useEffect(() => {
    activeFloorRef.current = activeFloor;
  }, [activeFloor]);

  const lastUiProgress = useRef(0);
  const activeWaypointId = useRef<string | null>(null);

  /**
   * Calculate camera position and lookAt along waypoints for walkthrough
   */
  const getWalkthroughCameraState = useCallback(
    (progress: number, floor: FloorDefinition) => {
      const waypoints = floor.waypoints;
      if (!waypoints || waypoints.length === 0) {
        return {
          pos: new THREE.Vector3(0, 1.6, 5),
          look: new THREE.Vector3(0, 1.5, 0),
          currentWp: null,
        };
      }

      if (waypoints.length === 1) {
        const wp = waypoints[0];
        return {
          pos: new THREE.Vector3(...wp.position),
          look: new THREE.Vector3(...wp.lookAt),
          currentWp: wp,
        };
      }

      const totalSegments = Math.max(1, waypoints.length - 1);
      const clampedProgress = Math.max(0, Math.min(1.0, progress));
      const scaledProgress = clampedProgress * totalSegments;
      const index = Math.min(waypoints.length - 2, Math.floor(scaledProgress));
      const t = Math.max(0, Math.min(1.0, scaledProgress - index));

      const wpA = waypoints[index];
      const wpB = waypoints[index + 1];

      const posA = new THREE.Vector3(...wpA.position);
      const posB = new THREE.Vector3(...wpB.position);
      // Hermite smoothstep curve for natural walking motion
      const smoothT = t * t * (3 - 2 * t);
      const pos = new THREE.Vector3().lerpVectors(posA, posB, smoothT);

      const lookA = new THREE.Vector3(...wpA.lookAt);
      const lookB = new THREE.Vector3(...wpB.lookAt);
      const look = new THREE.Vector3().lerpVectors(lookA, lookB, smoothT);

      const currentWp = smoothT >= 0.5 ? wpB : wpA;

      return { pos, look, currentWp };
    },
    []
  );

  /**
   * Initialize Three.js Scene, Renderer, Lights, and Project Geometry
   */
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x131412);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 160);
    camera.position.set(18, 16, 20);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // 4. Architectural Lighting System
    const ambientLight = new THREE.AmbientLight(0xfff7ec, 0.85);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xedf2f4, 0x222420, 0.6);
    hemiLight.position.set(0, 30, 0);
    scene.add(hemiLight);

    // Main Directional Sun
    const sunLight = new THREE.DirectionalLight(0xfff5e4, 1.9);
    sunLight.position.set(22, 36, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 90;
    const d = 19;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);

    // Warm Interior Accent Fill Light
    const interiorFill = new THREE.PointLight(0xffecd2, 1.5, 26, 1.2);
    interiorFill.position.set(-2, 3.2, 1);
    scene.add(interiorFill);

    // 5. Materials & Factory
    const materials = createArchitecturalMaterials(projectConfig.theme);
    materialsRef.current = materials;
    const factory = new FurnitureFactory(materials);

    // 6. Build Project Geometry Layers safely
    const floorGroups = new Map<string, THREE.Group>();

    // Site Base
    try {
      const siteBase = projectConfig.createSiteBase(materials);
      scene.add(siteBase);
      baseGroupRef.current = siteBase;
    } catch (err) {
      console.error("Error creating site base:", err);
    }

    // Floors
    projectConfig.floors.forEach((floorDef) => {
      try {
        const group = floorDef.buildMeshGroup(materials, factory);
        group.position.y = floorDef.elevationAssembled;
        scene.add(group);
        floorGroups.set(floorDef.id, group);
      } catch (err) {
        console.error(`Error building floor ${floorDef.id}:`, err);
      }
    });
    floorGroupsRef.current = floorGroups;

    // Roof
    try {
      const roof = projectConfig.createRoof(materials);
      const topFloorElev = projectConfig.floors.length > 1 ? 6.2 : 3.2;
      roof.position.y = topFloorElev;
      scene.add(roof);
      roofGroupRef.current = roof;
    } catch (err) {
      console.error("Error creating roof:", err);
    }

    // Walkthrough Architectural Ceiling Group (Encloses interior with warm downlights during walkthrough)
    const ceilingGroup = new THREE.Group();
    const cMat = materials.ceiling;
    // North ceiling slab
    const cNorth = new THREE.Mesh(new THREE.BoxGeometry(14, 0.12, 4), cMat);
    cNorth.position.set(0, 3.0, -4);
    ceilingGroup.add(cNorth);
    // South ceiling slab
    const cSouth = new THREE.Mesh(new THREE.BoxGeometry(14, 0.12, 4), cMat);
    cSouth.position.set(0, 3.0, 4);
    ceilingGroup.add(cSouth);
    // West ceiling slab
    const cWest = new THREE.Mesh(new THREE.BoxGeometry(5, 0.12, 4), cMat);
    cWest.position.set(-4.5, 3.0, 0);
    ceilingGroup.add(cWest);
    // East ceiling slab
    const cEast = new THREE.Mesh(new THREE.BoxGeometry(5, 0.12, 4), cMat);
    cEast.position.set(4.5, 3.0, 0);
    ceilingGroup.add(cEast);

    // Warm recessed architectural downlights
    const downlight1 = new THREE.PointLight(0xffebd2, 1.4, 9, 1.8);
    downlight1.position.set(-4.5, 2.85, 1.8);
    ceilingGroup.add(downlight1);

    const downlight2 = new THREE.PointLight(0xffebd2, 1.4, 9, 1.8);
    downlight2.position.set(-4.5, 2.85, -3.8);
    ceilingGroup.add(downlight2);

    const downlight3 = new THREE.PointLight(0xffebd2, 1.4, 9, 1.8);
    downlight3.position.set(4.5, 2.85, -2.5);
    ceilingGroup.add(downlight3);

    const downlight4 = new THREE.PointLight(0xffecd2, 1.2, 8, 1.8);
    downlight4.position.set(0, 2.85, 4.6);
    ceilingGroup.add(downlight4);

    ceilingGroup.visible = false;
    scene.add(ceilingGroup);
    walkthroughCeilingRef.current = ceilingGroup;

    // Exploded Axonometric Vertical Guidelines (4 Corner Columns)
    const lineGeo = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    const corners = [
      [-6.8, -5.8],
      [6.8, -5.8],
      [-6.8, 5.8],
      [6.8, 5.8],
    ];
    corners.forEach(([cx, cz]) => {
      linePositions.push(cx, 0, cz);
      linePositions.push(cx, 12.0, cz);
    });
    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    const lineMat = new THREE.LineDashedMaterial({
      color: 0xc8a663,
      dashSize: 0.4,
      gapSize: 0.25,
      transparent: true,
      opacity: 0.65,
    });
    const guideLines = new THREE.LineSegments(lineGeo, lineMat);
    guideLines.computeLineDistances();
    guideLines.visible = false;
    scene.add(guideLines);
    guideLinesRef.current = guideLines;

    // Grid Floor Guide in scene
    const grid = new THREE.GridHelper(36, 36, 0x474944, 0x222421);
    grid.position.y = -0.32;
    scene.add(grid);

    // Handle Window Resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 7. Render Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // In Walkthrough: smoothly interpolate camera along waypoints with natural head look
      if (modeRef.current === "walkthrough") {
        // Interpolate scroll progress towards target with smooth dolly damping
        const diffProg = targetProgressRef.current - scrollProgressRef.current;
        if (Math.abs(diffProg) > 0.00001) {
          scrollProgressRef.current += diffProg * 0.085;
        }

        // Dynamically compute camera waypoint position and lookAt on the fly
        const floor = activeFloorRef.current;
        const { pos, look, currentWp } = getWalkthroughCameraState(
          scrollProgressRef.current,
          floor
        );
        cameraTargetPos.current.copy(pos);
        cameraTargetLookAt.current.copy(look);

        // Smooth camera position interpolation
        camera.position.lerp(cameraTargetPos.current, 0.16);
        cameraCurrentLookAt.current.lerp(cameraTargetLookAt.current, 0.16);

        // Smooth look yaw and pitch for natural head panning
        lookYaw.current += (targetYaw.current - lookYaw.current) * 0.1;
        lookPitch.current += (targetPitch.current - lookPitch.current) * 0.1;

        const targetLook = cameraCurrentLookAt.current.clone();
        const fwd = targetLook.clone().sub(camera.position).normalize();

        if (fwd.lengthSq() > 0.001) {
          const baseYaw = Math.atan2(-fwd.x, -fwd.z);
          const basePitch = Math.asin(Math.max(-0.95, Math.min(0.95, fwd.y)));

          const finalYaw = baseYaw + lookYaw.current;
          const finalPitch = Math.max(
            -0.75,
            Math.min(0.75, basePitch + lookPitch.current)
          );

          const lookDir = new THREE.Vector3(
            -Math.sin(finalYaw) * Math.cos(finalPitch),
            Math.sin(finalPitch),
            -Math.cos(finalYaw) * Math.cos(finalPitch)
          );
          camera.lookAt(camera.position.clone().add(lookDir));
        } else {
          camera.lookAt(targetLook);
        }

        // Throttled sync to React state so UI stays completely fluid and synchronized
        const curProg = scrollProgressRef.current;
        if (
          Math.abs(curProg - lastUiProgress.current) > 0.003 ||
          (currentWp && currentWp.id !== activeWaypointId.current)
        ) {
          lastUiProgress.current = curProg;
          setScrollProgress(curProg);
          if (currentWp && currentWp.id !== activeWaypointId.current) {
            activeWaypointId.current = currentWp.id;
            setActiveWaypoint(currentWp);
            if (onWaypointChange) {
              onWaypointChange(currentWp, curProg);
            }
          }
        }
      } else {
        const lerpSpeed = Math.min(delta * 5.2, 0.3);
        camera.position.lerp(cameraTargetPos.current, lerpSpeed);
        cameraCurrentLookAt.current.lerp(cameraTargetLookAt.current, lerpSpeed);
        camera.lookAt(cameraCurrentLookAt.current);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      resizeObserver.disconnect();

      // Dispose Geometries and Materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [projectConfig]);

  /**
   * Update 3D Floor Elevations & Camera Positions when Mode or Selected Floor changes
   */
  useEffect(() => {
    const floorGroups = floorGroupsRef.current;
    const roof = roofGroupRef.current;
    const base = baseGroupRef.current;
    const guideLines = guideLinesRef.current;
    const ceilingGroup = walkthroughCeilingRef.current;
    const camera = cameraRef.current;
    if (!floorGroups || !roof) return;

    if (mode === "assembled") {
      // Stack floors tightly at realistic architectural elevations
      projectConfig.floors.forEach((floorDef) => {
        const grp = floorGroups.get(floorDef.id);
        if (grp) {
          grp.position.y = floorDef.elevationAssembled;
          grp.visible = true;
        }
      });
      roof.position.y = projectConfig.floors.length > 1 ? 6.2 : 3.2;
      roof.visible = true;
      if (base) base.visible = true;
      if (guideLines) guideLines.visible = false;
      if (ceilingGroup) ceilingGroup.visible = false;

      // Overview Axonometric Camera Target
      const { theta, phi, radius } = orbitAngles.current;
      cameraTargetPos.current.set(
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );
      cameraTargetLookAt.current.set(0, 2.2, 0);
    } else if (mode === "exploded") {
      // Explode layers along the Y axis in true 3D space
      projectConfig.floors.forEach((floorDef, idx) => {
        const grp = floorGroups.get(floorDef.id);
        if (grp) {
          grp.position.y = idx === 0 ? 0.8 : 5.8;
          grp.visible = true;
        }
      });
      roof.position.y = 10.8;
      roof.visible = true;
      if (base) base.visible = true;
      if (guideLines) guideLines.visible = true;
      if (ceilingGroup) ceilingGroup.visible = false;

      // Higher angle exploded view
      cameraTargetPos.current.set(22, 19, 22);
      cameraTargetLookAt.current.set(0, 4.8, 0);
    } else if (mode === "selected") {
      // Isolate the selected floor with open ceiling to inspect layout & furniture from above
      projectConfig.floors.forEach((floorDef) => {
        const grp = floorGroups.get(floorDef.id);
        if (grp) {
          if (floorDef.id === selectedFloorId) {
            grp.position.y = 0;
            grp.visible = true;
          } else {
            grp.position.y = 12.0;
            grp.visible = false;
          }
        }
      });
      roof.visible = false;
      if (base) base.visible = true;
      if (guideLines) guideLines.visible = false;
      if (ceilingGroup) ceilingGroup.visible = false;

      // Focused floor overview
      cameraTargetPos.current.set(15, 12, 15);
      cameraTargetLookAt.current.set(0, 1.4, 0);
    } else if (mode === "walkthrough") {
      // In walkthrough: position all floors at their true assembled elevations so the entire building is intact
      projectConfig.floors.forEach((floorDef) => {
        const grp = floorGroups.get(floorDef.id);
        if (grp) {
          grp.position.y = floorDef.elevationAssembled;
          grp.visible = true;
        }
      });
      roof.visible = false;
      if (base) base.visible = true;
      if (guideLines) guideLines.visible = false;
      if (ceilingGroup) {
        ceilingGroup.position.y = activeFloor.elevationAssembled;
        ceilingGroup.visible = true;
      }

      // Snap camera directly to starting waypoint of this level
      targetProgressRef.current = 0;
      scrollProgressRef.current = 0;
      lookYaw.current = 0;
      lookPitch.current = 0;
      targetYaw.current = 0;
      targetPitch.current = 0;

      const { pos, look, currentWp } = getWalkthroughCameraState(
        0,
        activeFloor
      );

      if (camera) {
        camera.position.copy(pos);
      }
      cameraCurrentLookAt.current.copy(look);
      cameraTargetPos.current.copy(pos);
      cameraTargetLookAt.current.copy(look);

      if (currentWp) {
        setActiveWaypoint(currentWp);
        setScrollProgress(0);
        if (onWaypointChange) {
          onWaypointChange(currentWp, 0);
        }
      }
    }

    prevModeRef.current = mode;
  }, [
    mode,
    selectedFloorId,
    projectConfig,
    activeFloor,
    getWalkthroughCameraState,
    onWaypointChange,
  ]);

  /**
   * Handle Wheel Scrolling:
   * - In Walkthrough: Responsive medium advancement calibrated for standard mice & trackpads
   * - In Overview: Measured orbit zoom
   */
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();

      // Sensitivity multiplier calculated from sensitivityValue (50 = baseline 1.0x)
      const sensMultiplier = sensitivityValue / 50;

      if (modeRef.current === "walkthrough") {
        // Normalize wheel step to handle both mouse notches (~100 deltaY) and smooth trackpad events
        const sign = Math.sign(e.deltaY);
        const absDelta = Math.abs(e.deltaY);
        const normalizedSteps =
          absDelta >= 60 ? 1 : Math.max(0.3, absDelta / 80);

        // Medium responsive step: ~0.009 (takes ~3-4 comfortable finger rolls per room)
        const step = 0.009 * normalizedSteps * sensMultiplier;
        targetProgressRef.current = Math.max(
          0,
          Math.min(1.0, targetProgressRef.current + sign * step)
        );
      } else {
        // Overview orbit zoom: calm and steady
        const clampedZoom =
          Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 30);
        orbitAngles.current.radius = Math.max(
          12,
          Math.min(48, orbitAngles.current.radius + clampedZoom * 0.005 * sensMultiplier)
        );
        const { theta, phi, radius } = orbitAngles.current;
        cameraTargetPos.current.set(
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.cos(theta)
        );
      }
    },
    [sensitivityValue]
  );

  /**
   * Keyboard Navigation
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modeRef.current === "walkthrough") {
        if (e.key === "ArrowDown" || e.key === " " || e.key === "ArrowRight") {
          e.preventDefault();
          targetProgressRef.current = Math.min(1.0, targetProgressRef.current + 0.05);
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          targetProgressRef.current = Math.max(0, targetProgressRef.current - 0.05);
        } else if (e.key === "Escape") {
          onExitWalkthrough();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExitWalkthrough]);

  /**
   * Mouse Drag Handlers:
   * - In overview modes: Orbit rotation around the building
   * - In walkthrough mode: Natural head look (sliding left turns left, sliding up looks up)
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("input")) {
      return;
    }
    isMouseDown.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    const sensMultiplier = sensitivityValue / 50;

    if (modeRef.current === "walkthrough") {
      // Natural look direction:
      // Sliding left turns camera LEFT.
      // Sliding right turns camera RIGHT.
      // Sliding up looks UP.
      // Sliding down looks DOWN.
      const multX = (invertedLook ? -0.0022 : 0.0022) * sensMultiplier;
      const multY = (invertedLook ? 0.0018 : -0.0018) * sensMultiplier;

      targetYaw.current = Math.max(
        -1.4,
        Math.min(1.4, targetYaw.current + deltaX * multX)
      );
      targetPitch.current = Math.max(
        -0.7,
        Math.min(0.7, targetPitch.current + deltaY * multY)
      );
    } else {
      // Steady orbit rotation around the building
      orbitAngles.current.theta += deltaX * 0.003 * sensMultiplier;
      orbitAngles.current.phi = Math.max(
        0.18,
        Math.min(Math.PI / 2.05, orbitAngles.current.phi - deltaY * 0.003 * sensMultiplier)
      );

      const { theta, phi, radius } = orbitAngles.current;
      cameraTargetPos.current.set(
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );
    }
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
  };

  /**
   * Jump directly to a room / waypoint in walkthrough
   */
  const jumpToWaypoint = (index: number) => {
    const waypoints = activeFloor.waypoints;
    if (!waypoints || waypoints.length <= 1) return;
    const progress = index / (waypoints.length - 1);
    targetProgressRef.current = progress;
    scrollProgressRef.current = progress;
    setScrollProgress(progress);
    lookYaw.current = 0;
    lookPitch.current = 0;
    targetYaw.current = 0;
    targetPitch.current = 0;
  };

  return (
    <div
      ref={containerRef}
      className="three-canvas-container"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas ref={canvasRef} className="three-canvas" />

      {/* Mode Status Pill Overlay */}
      <div className="canvas-mode-indicator">
        <span className="live-dot" />
        <span className="mode-label">
          {mode === "walkthrough"
            ? "FIRST-PERSON ARCHITECTURAL 3D WALKTHROUGH"
            : mode === "exploded"
              ? "EXPLODED AXONOMETRIC 3D MODEL"
              : mode === "selected"
                ? `${activeFloor.name} ISOLATED LEVEL`
                : "ASSEMBLED 3D BUILDING MODEL"}
        </span>
      </div>

      {/* WALKTHROUGH HUD OVERLAY */}
      {mode === "walkthrough" && (
        <div className="walkthrough-hud animate-fade-in">
          {/* Top HUD: Current Room & Floor */}
          <div className="hud-top">
            <div className="hud-room-badge">
              <div className="hud-floor-rolldown-row">
                <span className="hud-floor-label">ACTIVE LEVEL:</span>
                {projectConfig.floors.length > 1 ? (
                  <select
                    className="hud-floor-rolldown-select font-mono"
                    value={activeFloor.id}
                    onChange={(e) => onSelectFloor(e.target.value)}
                    title="Switch floor level during walkthrough"
                  >
                    {projectConfig.floors.map((fl) => (
                      <option key={fl.id} value={fl.id}>
                        {fl.name} ({fl.level === 0 ? "±0.00m" : `+${fl.elevationAssembled.toFixed(2)}m`})
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="hud-floor-name-single font-mono">
                    {activeFloor.name} (GROUND ONLY)
                  </span>
                )}
              </div>
              <h3 className="hud-room-title">
                {activeWaypoint?.title || "ARCHITECTURAL INTERIOR"}
              </h3>
              <p className="hud-room-desc">
                {activeWaypoint?.description ||
                  "Move through doorways, inspect materials, and observe calibrated daylighting."}
              </p>
            </div>

            <div className="hud-top-actions">
              {/* Interactive Sensitivity Adjuster with Live Slider */}
              <div className="hud-sensitivity-selector" title="Scroll & Mouse Speed Adjuster">
                <span className="sens-tag font-mono">SPEED: {sensitivityValue}%</span>
                <input
                  type="range"
                  min="20"
                  max="140"
                  step="5"
                  value={sensitivityValue}
                  onChange={(e) => setSensitivityValue(Number(e.target.value))}
                  className="sens-slider"
                  title="Drag slider to adjust scroll and mouse speed"
                />
                <button
                  type="button"
                  className={`sens-toggle-btn ${sensitivityValue <= 45 ? "is-selected" : ""}`}
                  onClick={() => setSensitivityValue(35)}
                  title="Slow & calm pace"
                >
                  SLOW
                </button>
                <button
                  type="button"
                  className={`sens-toggle-btn ${
                    sensitivityValue > 45 && sensitivityValue <= 85 ? "is-selected" : ""
                  }`}
                  onClick={() => setSensitivityValue(65)}
                  title="Medium steady pace (Default)"
                >
                  MEDIUM
                </button>
                <button
                  type="button"
                  className={`sens-toggle-btn ${sensitivityValue > 85 ? "is-selected" : ""}`}
                  onClick={() => setSensitivityValue(110)}
                  title="Fast responsive pace"
                >
                  FAST
                </button>
              </div>

              {/* Pan Mode Invert Toggle */}
              <button
                type="button"
                className="fpp-pan-toggle"
                onClick={() => setInvertedLook((prev) => !prev)}
                title="Toggle between natural look and direct drag"
              >
                LOOK: {invertedLook ? "DIRECT DRAG" : "NATURAL LOOK"}
              </button>

              <button
                type="button"
                className="hud-action-btn hud-action-btn--exit"
                onClick={onExitWalkthrough}
              >
                RETURN TO OVERVIEW <span>✕</span>
              </button>
            </div>
          </div>

          {/* Middle Navigation Hints */}
          <div className="hud-scroll-cue">
            <div className="mouse-wheel-icon">
              <span className="wheel-notch" />
            </div>
            <span>
              SCROLL GENTLY TO GLIDE THROUGH SPACES • DRAG TO LOOK AROUND
            </span>
          </div>

          {/* Bottom HUD: Progress Bar & Room Timeline Dots */}
          <div className="hud-bottom">
            <div className="hud-scrubber-track">
              <div
                className="hud-scrubber-fill"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
              {activeFloor.waypoints.map((wp, idx) => {
                const totalWp = Math.max(1, activeFloor.waypoints.length - 1);
                const stepPos = (idx / totalWp) * 100;
                const isPassed = scrollProgress * 100 >= stepPos - 2;
                return (
                  <button
                    key={wp.id}
                    type="button"
                    className={`hud-waypoint-dot ${
                      isPassed ? "is-passed" : ""
                    }`}
                    style={{ left: `${stepPos}%` }}
                    onClick={() => jumpToWaypoint(idx)}
                    title={`Jump to: ${wp.title}`}
                  >
                    <span className="dot-tooltip">{wp.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="hud-bottom-controls">
              <button
                type="button"
                className="hud-nav-btn"
                onClick={() => {
                  targetProgressRef.current = Math.max(0, targetProgressRef.current - 0.10);
                }}
                disabled={scrollProgress <= 0.01}
              >
                ← Previous Space
              </button>

              <span className="hud-progress-digits font-mono">
                {Math.round(scrollProgress * 100)}% TRAVERSED
              </span>

              <button
                type="button"
                className="hud-nav-btn"
                onClick={() => {
                  targetProgressRef.current = Math.min(1.0, targetProgressRef.current + 0.10);
                }}
                disabled={scrollProgress >= 0.99}
              >
                Next Space →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
