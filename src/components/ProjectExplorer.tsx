import React, { Component, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import type { Project } from "../data/projects";
import { projectsData } from "../data/projects";
import ArchitecturalCanvas from "../three/ArchitecturalCanvas";
import { getProject3DConfig } from "../three/architecturalScenes";

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ThreeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Three.js Architectural Canvas Error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            background: "#131412",
            color: "#f3f0e9",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <span style={{ color: "#c8a663", fontSize: "11px", letterSpacing: "0.2em", marginBottom: "10px" }}>
            ARCHITECTURAL 3D ENGINE
          </span>
          <h3 style={{ fontSize: "22px", marginBottom: "12px", fontWeight: 400 }}>
            Unable to display 3D building model
          </h3>
          <p style={{ color: "rgba(243,240,233,0.7)", maxWidth: "420px", fontSize: "13px", lineHeight: "1.6", marginBottom: "24px" }}>
            {this.state.error?.message || "An issue occurred while initializing WebGL. Click below to reload the 3D scene."}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              background: "#c8a663",
              color: "#131412",
              border: "none",
              padding: "11px 26px",
              fontSize: "11px",
              letterSpacing: "0.15em",
              fontWeight: 600,
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Reload 3D Engine
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

type ProjectExplorerProps = {
  project: Project;
  onClose: () => void;
  onOpenCaseStudy: (project: Project) => void;
  onSwitchProject?: (project: Project) => void;
};

export default function ProjectExplorer({
  project,
  onClose,
  onOpenCaseStudy,
  onSwitchProject,
}: ProjectExplorerProps) {
  const [mode, setMode] = useState<"assembled" | "exploded" | "selected" | "walkthrough">("assembled");
  const [floorId, setFloorId] = useState<string>("ground");

  // Get Three.js architectural config for current project
  const projectConfig = getProject3DConfig(project.id);

  // Prevent background scrolling while 3D explorer is mounted
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard shortcut: Esc to return / exit
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mode === "walkthrough") {
          setMode("selected");
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mode, onClose]);

  // Project navigation helpers
  const currentIndex = projectsData.findIndex((p) => p.id === project.id);
  const handlePrevProject = () => {
    if (!onSwitchProject) return;
    const prevIdx = (currentIndex + projectsData.length - 1) % projectsData.length;
    onSwitchProject(projectsData[prevIdx]);
    setFloorId("ground");
  };

  const handleNextProject = () => {
    if (!onSwitchProject) return;
    const nextIdx = (currentIndex + 1) % projectsData.length;
    onSwitchProject(projectsData[nextIdx]);
    setFloorId("ground");
  };

  const handleFloorSelect = (id: string) => {
    setFloorId(id);
    if (mode !== "walkthrough") {
      setMode("selected");
    }
  };

  const handleEnterWalkthrough = () => {
    setMode("walkthrough");
  };

  // Spaces on selected floor
  const activeFloorDef =
    projectConfig.floors.find((f) => f.id === floorId) || projectConfig.floors[0];

  return (
    <div
      className="explorer-fullscreen-container"
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Architectural 3D Experience"
    >
      {/* Top Application Bar */}
      <header className="explorer-app-bar">
        <div className="explorer-app-bar__left">
          <div className="project-switcher-controls">
            <button
              type="button"
              className="proj-nav-arrow"
              onClick={handlePrevProject}
              title="Previous Project"
              aria-label="Previous Project"
            >
              ←
            </button>
            <span className="proj-counter font-mono">
              {project.number} / 0{projectsData.length}
            </span>
            <button
              type="button"
              className="proj-nav-arrow"
              onClick={handleNextProject}
              title="Next Project"
              aria-label="Next Project"
            >
              →
            </button>
          </div>

          <div className="explorer-titles">
            <span className="explorer-eyebrow">
              {project.categoryLabel} • {project.location}
            </span>
            <h2 className="explorer-main-title">{project.title}</h2>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="explorer-view-modes">
          <button
            type="button"
            className={`mode-tab-btn ${mode === "assembled" ? "is-active" : ""}`}
            onClick={() => setMode("assembled")}
          >
            00 Assembled 3D
          </button>
          <button
            type="button"
            className={`mode-tab-btn ${mode === "exploded" ? "is-active" : ""}`}
            onClick={() => setMode("exploded")}
          >
            01 Exploded Axon
          </button>

          {/* Dynamic Floor Selection Rolldown: Scales cleanly from single-floor to multi-story apartments */}
          <div className={`floor-rolldown-wrapper ${mode === "selected" ? "is-active" : ""}`}>
            <span className="rolldown-prefix font-mono">LEVEL:</span>
            <select
              className="floor-rolldown-select"
              value={floorId}
              onChange={(e) => handleFloorSelect(e.target.value)}
              title="Select building level"
            >
              {projectConfig.floors.map((floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.name} ({floor.level === 0 ? "±0.00m" : `+${floor.elevationAssembled.toFixed(2)}m`})
                </option>
              ))}
            </select>
            <span className="rolldown-chevron" aria-hidden="true">▾</span>
          </div>

          <button
            type="button"
            className={`mode-tab-btn mode-tab-btn--walkthrough ${
              mode === "walkthrough" ? "is-active" : ""
            }`}
            onClick={handleEnterWalkthrough}
          >
            <span className="walk-icon">🚶</span> FPP Walkthrough
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="explorer-app-bar__right">
          <button
            type="button"
            className="explorer-dossier-link"
            onClick={() => {
              onClose();
              onOpenCaseStudy(project);
            }}
          >
            Case Study Specs ↗
          </button>

          <button
            type="button"
            className="explorer-exit-x"
            onClick={onClose}
            aria-label="Close Explorer"
          >
            <span>CLOSE</span>
            <span className="close-x">✕</span>
          </button>
        </div>
      </header>

      {/* Main Viewport: Pure Three.js 3D Architectural WebGL Canvas */}
      <div className="explorer-viewport">
        <ThreeErrorBoundary>
          <ArchitecturalCanvas
            projectConfig={projectConfig}
            mode={mode}
            selectedFloorId={floorId}
            onSelectFloor={handleFloorSelect}
            onEnterWalkthrough={handleEnterWalkthrough}
            onExitWalkthrough={() => setMode("selected")}
          />
        </ThreeErrorBoundary>

        {/* Selected Floor BIM Architectural Inspector Card (When in Assembled, Exploded, or Selected Mode) */}
        {mode !== "walkthrough" && (
          <aside className="floor-inspector-card animate-fade-in">
            <div className="inspector-header">
              <div>
                <span className="eyebrow">{project.title.toUpperCase()}</span>
                <h3>{floorId === "first" ? "FIRST FLOOR LEVEL" : "GROUND FLOOR LEVEL"}</h3>
              </div>
              <span className="inspector-badge font-mono">
                {floorId === "first" ? "01 / +3.20m" : "GF / +0.00m"}
              </span>
            </div>

            <p style={{ color: "rgba(243, 240, 233, 0.7)", fontSize: "13px", lineHeight: "1.5", margin: "0 0 16px" }}>
              {mode === "exploded"
                ? "Exploded structural axonometric view. Building floors elevated in 3D space."
                : mode === "selected"
                  ? "Floor isolated with open ceiling. Fully furnished interior spaces with active lighting."
                  : "Complete monolithic 3D building model. Click and drag to orbit, scroll to zoom."}
            </p>

            {/* Spaces On This Level */}
            <div className="inspector-spaces">
              <span className="spaces-label">FURNISHED 3D SPACES ON THIS LEVEL:</span>
              <div className="spaces-pills-wrap">
                {activeFloorDef.waypoints.map((wp, i) => (
                  <span key={wp.id} className="space-pill">
                    {wp.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Enter 3D Walkthrough Button */}
            <div className="inspector-actions" style={{ marginTop: "16px" }}>
              <button
                type="button"
                className="inspector-walkthrough-btn"
                onClick={handleEnterWalkthrough}
                title="Enter the real 3D Three.js building in first-person at eye level"
              >
                <span>🚶 ENTER 3D FPP WALKTHROUGH</span>
                <span className="arrow">→</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
