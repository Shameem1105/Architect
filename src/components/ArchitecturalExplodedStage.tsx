import { useState, useRef } from "react";
import type { Project } from "../data/projects";

type ArchitecturalExplodedStageProps = {
  project: Project;
  mode: "assembled" | "exploded" | "selected";
  selectedFloorId: string;
  onSelectFloor: (floorId: string) => void;
  onEnterWalkthrough: () => void;
};

export default function ArchitecturalExplodedStage({
  project,
  mode,
  selectedFloorId,
  onSelectFloor,
  onEnterWalkthrough,
}: ArchitecturalExplodedStageProps) {
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);

  // Natural 3D Axonometric Orbit Drag State
  const [rotation, setRotation] = useState<{ x: number; z: number }>({ x: 60, z: -40 });
  const isOrbiting = useRef(false);
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filter rooms for preview on selected floor
  const floorRooms = project.walkthroughRooms.filter((r) =>
    r.floor.toUpperCase().includes(selectedFloorId === "first" ? "FIRST" : "GROUND")
  );
  const previewRooms = floorRooms.length > 0 ? floorRooms : project.walkthroughRooms.slice(0, 3);
  const primaryPreview = previewRooms[0] || project.walkthroughRooms[0];

  const handleStageMouseDown = (e: React.MouseEvent) => {
    // If clicking an inspector card or button, ignore orbit
    if (
      (e.target as HTMLElement).closest(".floor-inspector-card") ||
      (e.target as HTMLElement).closest("button")
    ) {
      return;
    }
    isOrbiting.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleStageMouseMove = (e: React.MouseEvent) => {
    if (!isOrbiting.current) return;
    const deltaX = e.clientX - lastMouse.current.x;
    const deltaY = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };

    // Natural orbit: dragging right rotates Z clockwise, dragging down tilts more from top
    setRotation((prev) => ({
      x: Math.max(38, Math.min(78, prev.x + deltaY * 0.18)),
      z: Math.max(-100, Math.min(20, prev.z + deltaX * 0.22)),
    }));
  };

  const handleStageMouseUp = () => {
    isOrbiting.current = false;
  };

  const resetOrbit = () => {
    setRotation({ x: 60, z: -40 });
  };

  return (
    <div
      className={`exploded-stage-container mode-${mode}`}
      onMouseDown={handleStageMouseDown}
      onMouseMove={handleStageMouseMove}
      onMouseUp={handleStageMouseUp}
      onMouseLeave={handleStageMouseUp}
    >
      {/* Background Architectural Blueprint Grid & Compass */}
      <div className="blueprint-grid-overlay" />
      <div className="architectural-compass">
        <span>N</span>
        <span className="compass-arrow">↑</span>
        <span className="compass-coord">38°21'S • 145°01'E</span>
      </div>

      {/* Axonometric Orbit Cue & Reset */}
      <div className="axon-orbit-hud">
        <span className="orbit-hint">DRAG TO ORBIT AXONOMETRIC MODEL</span>
        <button
          type="button"
          className="orbit-reset-btn"
          onClick={resetOrbit}
          title="Reset to canonical 30°/60° axonometric view"
        >
          RESET ANGLE ↺
        </button>
      </div>

      {/* Main Isometric Model Stage with dynamic orbit transform */}
      <div
        className="isometric-stage"
        style={{
          transform: `translate(-50%, -50%) rotateX(${rotation.x}deg) rotateZ(${rotation.z}deg)`,
        }}
      >
        {/* Vertical Architectural Alignment Tie-Lines */}
        <div className="vertical-guidelines" aria-hidden="true">
          <span className="guide-line guide-line--nw" />
          <span className="guide-line guide-line--ne" />
          <span className="guide-line guide-line--sw" />
          <span className="guide-line guide-line--se" />
        </div>

        {/* LAYER 04: ROOF PLANE */}
        <div
          className={`iso-layer layer-roof ${
            mode === "selected" && selectedFloorId !== "roof" ? "is-dimmed" : ""
          }`}
        >
          <div className="iso-plate plate-roof">
            <div className="roof-aperture" title="Zenith Skylight Aperture" />
            <div className="roof-solar-pattern" />
          </div>
          <div className="layer-callout callout-roof">
            <span className="callout-elev font-mono">+6.20m</span>
            <span className="callout-title">RF / ROOF CANOPY & SOLAR APERTURE</span>
          </div>
        </div>

        {/* LAYER 03: FIRST FLOOR */}
        <div
          className={`iso-layer layer-first ${
            selectedFloorId === "first" ? "is-selected" : ""
          } ${hoveredFloor === "first" ? "is-hovered" : ""} ${
            mode === "selected" && selectedFloorId !== "first" ? "is-dimmed" : ""
          }`}
          onClick={() => onSelectFloor("first")}
          onMouseEnter={() => setHoveredFloor("first")}
          onMouseLeave={() => setHoveredFloor(null)}
        >
          <div className="iso-plate plate-first">
            {/* Interior Spatial Layout Linework */}
            <div className="room-layout room-suite" title="Master Bedroom Suite">
              <span className="room-tag">MASTER SUITE</span>
            </div>
            <div className="room-layout room-ensuite" title="Spa Ensuite">
              <span className="room-tag">ENSUITE</span>
            </div>
            <div className="room-layout room-terrace" title="Cantilevered Terrace">
              <span className="room-tag">TERRACE</span>
            </div>
            <div className="room-door-opening door-first" />
          </div>

          <div className="layer-callout callout-first">
            <span className="callout-elev font-mono">+3.20m</span>
            <span className="callout-title">01 / FIRST FLOOR • SLEEPING SUITES & TERRACE</span>
            <span className="callout-sub">Area: 180 m² • 2 Suites • Horizon Terrace</span>
          </div>
        </div>

        {/* LAYER 02: GROUND FLOOR */}
        <div
          className={`iso-layer layer-ground ${
            selectedFloorId === "ground" ? "is-selected" : ""
          } ${hoveredFloor === "ground" ? "is-hovered" : ""} ${
            mode === "selected" && selectedFloorId !== "ground" ? "is-dimmed" : ""
          }`}
          onClick={() => onSelectFloor("ground")}
          onMouseEnter={() => setHoveredFloor("ground")}
          onMouseLeave={() => setHoveredFloor(null)}
        >
          <div className="iso-plate plate-ground">
            {/* Interior Spatial Layout Linework */}
            <div className="room-layout room-living" title="Living Pavilion">
              <span className="room-tag">LIVING SALON</span>
            </div>
            <div className="room-layout room-atrium" title="Central Cloister Atrium">
              <span className="room-tag">CENTRAL CLOISTER</span>
              <div className="atrium-pool-inner" />
            </div>
            <div className="room-layout room-kitchen" title="Kitchen & Dining">
              <span className="room-tag">KITCHEN & DINING</span>
            </div>
            {/* Open Doorway Indicator */}
            <div className="room-door-opening door-entry">
              <span className="entry-arrow">→ MAIN ENTRY</span>
            </div>
          </div>

          <div className="layer-callout callout-ground">
            <span className="callout-elev font-mono">+0.00m</span>
            <span className="callout-title">GF / GROUND FLOOR • LIVING & CENTRAL CLOISTER</span>
            <span className="callout-sub">Area: 340 m² • Axial Entrance • Sunken Hearth</span>
          </div>
        </div>

        {/* LAYER 01: SITE BASE / PODIUM */}
        <div
          className={`iso-layer layer-site ${mode === "selected" ? "is-dimmed" : ""}`}
        >
          <div className="iso-plate plate-site">
            <div className="topo-contours" />
          </div>
          <div className="layer-callout callout-site">
            <span className="callout-elev font-mono">-0.60m</span>
            <span className="callout-title">ST / FOUNDATION PODIUM & BEDROCK ANCHORS</span>
          </div>
        </div>
      </div>

      {/* Selected Floor Real Photographic Preview Card */}
      <aside className="floor-inspector-card animate-fade-in">
        <div className="inspector-header">
          <div>
            <span className="eyebrow">{project.title.toUpperCase()}</span>
            <h3>{selectedFloorId === "first" ? "FIRST FLOOR LEVEL" : "GROUND FLOOR LEVEL"}</h3>
          </div>
          <span className="inspector-badge font-mono">
            {selectedFloorId === "first" ? "01 / +3.20m" : "GF / +0.00m"}
          </span>
        </div>

        {/* Real Architectural Photograph of this floor */}
        <div className="inspector-image-wrapper">
          <img
            src={primaryPreview.image}
            alt={primaryPreview.name}
            className="inspector-photo"
          />
          <div className="inspector-photo-gradient" />
          <div className="inspector-photo-tag">
            <span>KEY SPACE: {primaryPreview.name}</span>
          </div>
        </div>

        {/* Spaces On This Level List */}
        <div className="inspector-spaces">
          <span className="spaces-label">CONNECTED SPACES ON THIS LEVEL:</span>
          <div className="spaces-pills-wrap">
            {previewRooms.map((rm, i) => (
              <span key={rm.id} className="space-pill">
                0{i + 1} {rm.name}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button: Launch Photographic Walkthrough */}
        <div className="inspector-actions">
          <button
            type="button"
            className="inspector-walkthrough-btn"
            onClick={onEnterWalkthrough}
          >
            <span>ENTER FIRST-PERSON WALKTHROUGH</span>
            <span className="arrow">→</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
