import { useEffect, useRef, useState, useCallback } from "react";
import type { Project, WalkthroughRoom, RoomHotspot } from "../data/projects";

type PhotographicWalkthroughProps = {
  project: Project;
  floorId: string;
  onExit: () => void;
  onOpenCaseStudy: () => void;
};

export default function PhotographicWalkthrough({
  project,
  floorId,
  onExit,
  onOpenCaseStudy,
}: PhotographicWalkthroughProps) {
  // Filter rooms belonging to current floor, or fallback to all rooms in project
  const floorName = floorId === "first" ? "FIRST FLOOR" : "GROUND FLOOR";
  const floorRooms = project.walkthroughRooms.filter((r) =>
    r.floor.toUpperCase().includes(floorName)
  );
  const activeRooms = floorRooms.length > 0 ? floorRooms : project.walkthroughRooms;

  // Smooth scroll interpolation state
  const targetProgressRef = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Active room index based on interpolated progress
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  // Active inspected hotspot
  const [selectedHotspot, setSelectedHotspot] = useState<RoomHotspot | null>(null);

  // Pan inversion preference (defaults to natural: sliding left looks left)
  const [invertedPan, setInvertedPan] = useState(false);

  // Natural mouse panning state
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  /**
   * Lengthier, Slow & Steady Scroll Inertia Engine:
   * Uses ultra-gentle damping (0.028 coefficient) and velocity-clamped increments
   * so even vigorous or high-sensitivity mouse wheel spins glide smoothly and steadily.
   */
  useEffect(() => {
    let current = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Architectural damping for steady, responsive cinematic glide
      const diff = targetProgressRef.current - current;
      current += diff * 0.055;
      setDisplayProgress(current);

      // Compute which room is active
      const totalSteps = activeRooms.length - 1;
      if (totalSteps > 0) {
        const roomIdx = Math.round(current * totalSteps);
        setActiveRoomIndex(Math.max(0, Math.min(totalSteps, roomIdx)));
      }
    };
    animate();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [activeRooms.length]);

  /**
   * Responsive Mouse Wheel Handler:
   * Smooth, responsive progression through spaces while filtering out extreme wheel spikes.
   */
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const clampedDelta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 100);
    const step = clampedDelta * 0.00085;

    targetProgressRef.current = Math.max(0, Math.min(1.0, targetProgressRef.current + step));
  }, []);

  /**
   * Natural (Non-Inverted) Mouse Panning:
   * When user slides mouse left (deltaX < 0), they want the view to look LEFT.
   * Looking left requires shifting the background image to the RIGHT (+X), bringing
   * the left side of the room into view!
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    // If clicking a button or hotspot, don't start dragging
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest(".hotspot-pin")
    ) {
      return;
    }
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    // In natural mode:
    // Sliding left (deltaX < 0) shifts canvas right (+X) to reveal the left side of the space.
    // In inverted mode:
    // Follows hand directly.
    const multiplier = invertedPan ? 0.18 : -0.18;
    const verticalMult = invertedPan ? 0.14 : -0.14;

    setPanOffset((prev) => ({
      x: Math.max(-80, Math.min(80, prev.x + deltaX * multiplier)),
      y: Math.max(-45, Math.min(45, prev.y + deltaY * verticalMult)),
    }));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  /**
   * Keyboard Navigation
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedHotspot) {
          setSelectedHotspot(null);
        } else {
          onExit();
        }
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        targetProgressRef.current = Math.min(1.0, targetProgressRef.current + 0.1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        targetProgressRef.current = Math.max(0, targetProgressRef.current - 0.1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedHotspot, onExit]);

  const jumpToRoom = (index: number) => {
    const totalSteps = activeRooms.length - 1;
    if (totalSteps <= 0) return;
    targetProgressRef.current = index / totalSteps;
    setSelectedHotspot(null);
  };

  const handleStepRoom = (direction: -1 | 1) => {
    const nextIdx = Math.max(0, Math.min(activeRooms.length - 1, activeRoomIndex + direction));
    jumpToRoom(nextIdx);
  };

  const currentRoom = activeRooms[activeRoomIndex] || activeRooms[0];

  // Calculate transition crossfade between adjacent rooms
  const totalSteps = Math.max(1, activeRooms.length - 1);
  const continuousIndex = displayProgress * totalSteps;

  return (
    <div
      className="fpp-walkthrough-viewport"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      role="region"
      aria-label="First-Person Architectural Photographic Walkthrough"
    >
      {/* Background Curated Architectural Room Imagery with Parallax Pan */}
      <div
        className="fpp-scene-canvas"
        style={{
          transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0)`,
        }}
      >
        {activeRooms.map((room, idx) => {
          // Calculate opacity and scale for smooth cinematic crossfade
          const distance = Math.abs(idx - continuousIndex);
          const opacity = Math.max(0, 1 - distance * 1.15);
          const scale = 1.02 + (1 - Math.min(1, distance)) * 0.04;

          if (distance > 1.3) return null;

          return (
            <div
              key={room.id}
              className="fpp-room-layer"
              style={{
                opacity,
                transform: `scale(${scale})`,
                zIndex: idx === activeRoomIndex ? 5 : 2,
              }}
            >
              <img
                src={room.image}
                alt={room.name}
                className="fpp-room-img"
                draggable={false}
              />
              <div className="fpp-room-vignette" />
              <div className="fpp-room-grain-overlay" />

              {/* Interactive Architectural Hotspots in this room */}
              {idx === activeRoomIndex &&
                room.hotspots &&
                room.hotspots.map((hs) => (
                  <div
                    key={hs.id}
                    className="hotspot-pin"
                    style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                  >
                    <button
                      type="button"
                      className="hotspot-trigger"
                      onClick={() => setSelectedHotspot(hs)}
                      aria-label={`Inspect ${hs.label}`}
                    >
                      <span className="hotspot-ring" />
                      <span className="hotspot-core">+</span>
                    </button>
                    <span className="hotspot-label-pill">{hs.label}</span>
                  </div>
                ))}
            </div>
          );
        })}
      </div>

      {/* Top HUD: Room Badge & Description */}
      <header className="fpp-hud-top animate-fade-in">
        <div className="fpp-room-dossier">
          <div className="dossier-meta">
            <span className="dossier-num">
              0{activeRoomIndex + 1} / 0{activeRooms.length}
            </span>
            <span className="dossier-floor">{currentRoom.floor}</span>
            {currentRoom.subtitle && (
              <span className="dossier-sub">• {currentRoom.subtitle}</span>
            )}
          </div>
          <h2 className="dossier-title">{currentRoom.name}</h2>
          <p className="dossier-desc">{currentRoom.description}</p>
        </div>

        <div className="fpp-top-actions">
          {/* Mouse Pan Invert Toggle */}
          <button
            type="button"
            className="fpp-pan-toggle"
            onClick={() => setInvertedPan((prev) => !prev)}
            title="Toggle between natural camera pan and direct drag pan"
          >
            PAN: {invertedPan ? "DIRECT DRAG" : "NATURAL LOOK"}
          </button>

          <button
            type="button"
            className="fpp-btn fpp-btn--dossier"
            onClick={onOpenCaseStudy}
          >
            Case Study Specs ↗
          </button>
          <button
            type="button"
            className="fpp-btn fpp-btn--exit"
            onClick={onExit}
          >
            EXIT WALKTHROUGH <span>✕</span>
          </button>
        </div>
      </header>

      {/* Architectural Telemetry & Minimap Compass in Top-Right */}
      <aside className="fpp-telemetry-widget" aria-hidden="true">
        <div className="telemetry-item">
          <span className="telem-label">ELEVATION</span>
          <span className="telem-val font-mono">
            {floorId === "first" ? "+3.20m" : "+0.00m"}
          </span>
        </div>
        <div className="telemetry-item">
          <span className="telem-label">FIELD OF VIEW</span>
          <span className="telem-val font-mono">78° LEICA</span>
        </div>
        <div className="telemetry-item">
          <span className="telem-label">SPATIAL INDEX</span>
          <span className="telem-val font-mono">ROOM 0{activeRoomIndex + 1}</span>
        </div>
      </aside>

      {/* Center Subtle Scroll & Drag Cue */}
      <div className="fpp-center-cue">
        <div className="mouse-wheel-glyph">
          <span className="wheel-pulse" />
        </div>
        <span>SCROLL STEADILY TO GLIDE THROUGH SPACES • DRAG TO LOOK AROUND</span>
      </div>

      {/* Prev / Next Room Screen Edge Steppers */}
      <div className="fpp-step-controls">
        <button
          type="button"
          className="fpp-stepper fpp-stepper--prev"
          onClick={() => handleStepRoom(-1)}
          disabled={activeRoomIndex === 0}
          title="Previous Space"
          aria-label="Previous Space"
        >
          <span>←</span>
          <span className="stepper-label">PREV SPACE</span>
        </button>
        <button
          type="button"
          className="fpp-stepper fpp-stepper--next"
          onClick={() => handleStepRoom(1)}
          disabled={activeRoomIndex === activeRooms.length - 1}
          title="Next Space"
          aria-label="Next Space"
        >
          <span className="stepper-label">NEXT SPACE</span>
          <span>→</span>
        </button>
      </div>

      {/* Interactive Hotspot Detail Modal / Drawer */}
      {selectedHotspot && (
        <aside className="fpp-hotspot-drawer animate-fade-in">
          <div className="drawer-header">
            <span className="eyebrow">ARCHITECTURAL TECTONIC DETAIL</span>
            <button
              type="button"
              className="drawer-close"
              onClick={() => setSelectedHotspot(null)}
              aria-label="Close detail"
            >
              ✕
            </button>
          </div>
          <h4>{selectedHotspot.label}</h4>
          <p>{selectedHotspot.detail}</p>
          <div className="drawer-footer">
            <span>NOUFAL ARCHITECTS • MATERIAL SPECIFICATION</span>
          </div>
        </aside>
      )}

      {/* Bottom HUD: Timeline Scrubber & Room Dots */}
      <footer className="fpp-hud-bottom">
        <div className="fpp-timeline-bar">
          <div
            className="fpp-timeline-progress"
            style={{ width: `${Math.round(displayProgress * 100)}%` }}
          />

          {/* Clickable Room Waypoint Markers */}
          {activeRooms.map((rm, idx) => {
            const stepPos = (idx / totalSteps) * 100;
            const isPassed = displayProgress * 100 >= stepPos - 2;
            const isActive = idx === activeRoomIndex;

            return (
              <button
                key={rm.id}
                type="button"
                className={`fpp-timeline-marker ${isPassed ? "is-passed" : ""} ${
                  isActive ? "is-active" : ""
                }`}
                style={{ left: `${stepPos}%` }}
                onClick={() => jumpToRoom(idx)}
                aria-label={`Jump to ${rm.name}`}
              >
                <span className="marker-dot" />
                <span className="marker-tooltip">{rm.name}</span>
              </button>
            );
          })}
        </div>

        <div className="fpp-bottom-meta">
          <div className="fpp-progress-counter font-mono">
            {Math.round(displayProgress * 100)}% WALKTHROUGH TRAVERSED
          </div>
          <div className="fpp-instruction font-mono">
            [↑/↓] KEYS OR SCROLL TO WALK • [DRAG] TO PAN • [ESC] TO EXIT
          </div>
        </div>
      </footer>
    </div>
  );
}
