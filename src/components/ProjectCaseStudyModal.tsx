import { useEffect, useState } from "react"
import type { Project, ProjectDrawing } from "../data/projects"

type ProjectCaseStudyModalProps = {
  project: Project
  onClose: () => void
  onLaunch3DExplorer: (project: Project) => void
}

export default function ProjectCaseStudyModal({
  project,
  onClose,
  onLaunch3DExplorer,
}: ProjectCaseStudyModalProps) {
  const [activeTab, setActiveTab] =
    useState<"overview" | "specs" | "drawings" | "materials" | "gallery">(
      "overview",
    )
  const [selectedDrawing, setSelectedDrawing] = useState<ProjectDrawing>(
    project.drawings[0] || null,
  )
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => {
    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxImage) {
          setLightboxImage(null)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [lightboxImage, onClose])

  // Keep drawing selected if project changes
  useEffect(() => {
    if (project.drawings && project.drawings.length > 0) {
      setSelectedDrawing(project.drawings[0])
    }
  }, [project])

  return (
    <div
      className="case-study-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
    >
      <div className="case-study-dialog">
        {/* Top Sticky Header */}
        <header className="case-study-header">
          <div className="case-study-header__left">
            <span className="case-study-header__num">{project.number}</span>
            <div className="case-study-header__titles">
              <span className="case-study-header__tag">
                {project.categoryLabel} / {project.status}
              </span>
              <h2 id="case-study-title" className="case-study-header__heading">
                {project.title}
              </h2>
            </div>
          </div>

          <div className="case-study-header__actions">
            <button
              type="button"
              className="case-study-3d-btn"
              onClick={() => {
                onClose()
                onLaunch3DExplorer(project)
              }}
              title="Launch 3D Axonometric Floor Explorer"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <span>3D Model Explorer</span>
            </button>

            <button
              type="button"
              className="case-study-close-btn"
              onClick={onClose}
              aria-label="Close Case Study"
            >
              <span>CLOSE</span>
              <span className="close-x">✕</span>
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="case-study-nav" aria-label="Case study sections">
          <button
            type="button"
            className={`case-study-nav__tab ${
              activeTab === "overview" ? "is-active" : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            01 Overview & Concept
          </button>
          <button
            type="button"
            className={`case-study-nav__tab ${
              activeTab === "specs" ? "is-active" : ""
            }`}
            onClick={() => setActiveTab("specs")}
          >
            02 Specifications
          </button>
          <button
            type="button"
            className={`case-study-nav__tab ${
              activeTab === "drawings" ? "is-active" : ""
            }`}
            onClick={() => setActiveTab("drawings")}
          >
            03 Technical Drawings ({project.drawings.length})
          </button>
          <button
            type="button"
            className={`case-study-nav__tab ${
              activeTab === "materials" ? "is-active" : ""
            }`}
            onClick={() => setActiveTab("materials")}
          >
            04 Material Palette ({project.materials.length})
          </button>
          <button
            type="button"
            className={`case-study-nav__tab ${
              activeTab === "gallery" ? "is-active" : ""
            }`}
            onClick={() => setActiveTab("gallery")}
          >
            05 Photography ({project.gallery.length})
          </button>
        </nav>

        {/* Scrollable Content Body */}
        <div className="case-study-body">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="case-study-section case-study-overview animate-fade-in">
              <div className="case-study-hero-banner">
                <img
                  src={project.image}
                  alt={project.title}
                  className="case-study-hero-banner__img"
                />
                <div className="case-study-hero-banner__gradient" />
                <div className="case-study-hero-banner__caption">
                  <p className="case-study-hero-banner__location">
                    <span>{project.location}</span>
                    <span className="dot-sep">•</span>
                    <span>{project.area}</span>
                    <span className="dot-sep">•</span>
                    <span>{project.year}</span>
                  </p>
                  <blockquote className="case-study-hero-banner__quote">
                    "{project.conceptStatement}"
                  </blockquote>
                </div>
              </div>

              {/* Key Highlights Metrics */}
              <div className="case-study-metrics">
                <div className="metric-box">
                  <span className="metric-box__label">GROSS FLOOR AREA</span>
                  <span className="metric-box__val">{project.area}</span>
                  <span className="metric-box__sub">{project.floors}</span>
                </div>
                <div className="metric-box">
                  <span className="metric-box__label">SITE TOPOGRAPHY</span>
                  <span className="metric-box__val">{project.siteArea}</span>
                  <span className="metric-box__sub">{project.location}</span>
                </div>
                <div className="metric-box">
                  <span className="metric-box__label">LEAD ARCHITECT</span>
                  <span className="metric-box__val">Noufal</span>
                  <span className="metric-box__sub">Studio Principal</span>
                </div>
                <div className="metric-box">
                  <span className="metric-box__label">PROJECT STATUS</span>
                  <span className="metric-box__val">{project.status}</span>
                  <span className="metric-box__sub">
                    {project.specs.completionYear}
                  </span>
                </div>
              </div>

              {/* Architectural Concept Narrative */}
              <div className="case-study-grid-2col">
                <div>
                  <h3 className="case-study-subheading">
                    ARCHITECTURAL CONCEPT & INTENT
                  </h3>
                  <div className="case-study-prose">
                    {project.narrative.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="case-study-subheading">
                    SPATIAL CHOREOGRAPHY & KEY ATTRIBUTES
                  </h3>
                  <ul className="case-study-feature-list">
                    {project.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="case-study-feature-item">
                        <span className="feature-num">0{idx + 1}</span>
                        <p>{feature}</p>
                      </li>
                    ))}
                  </ul>

                  {/* 3D Model Explorer promo card */}
                  <div className="case-study-promo-card">
                    <div className="promo-text">
                      <h4>Explore in Axonometric 3D</h4>
                      <p>
                        View this project's structural floors, exploded
                        axonometry, and step into high-resolution interior
                        spaces.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="promo-btn"
                      onClick={() => {
                        onClose()
                        onLaunch3DExplorer(project)
                      }}
                    >
                      Open 3D Model →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPECIFICATIONS */}
          {activeTab === "specs" && (
            <div className="case-study-section case-study-specs animate-fade-in">
              <h3 className="case-study-subheading">
                PROJECT SCHEDULE & TECHNICAL SPECIFICATIONS
              </h3>
              <p className="case-study-desc">
                Comprehensive architectural data, engineering structural
                typology, material specifications, and environmental ratings.
              </p>

              <div className="specs-table-container">
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <th scope="row">Official Project Name</th>
                      <td>{project.title}</td>
                    </tr>
                    <tr>
                      <th scope="row">Project Number / Code</th>
                      <td>NA-ARC-{project.number}</td>
                    </tr>
                    <tr>
                      <th scope="row">Typology & Program</th>
                      <td>
                        {project.type} ({project.categoryLabel})
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Location</th>
                      <td>{project.location}</td>
                    </tr>
                    <tr>
                      <th scope="row">Built Area (GFA)</th>
                      <td>{project.specs.builtArea}</td>
                    </tr>
                    <tr>
                      <th scope="row">Site / Parcel Area</th>
                      <td>{project.specs.siteArea}</td>
                    </tr>
                    <tr>
                      <th scope="row">Vertical Levels</th>
                      <td>{project.floors}</td>
                    </tr>
                    <tr>
                      <th scope="row">Structural System</th>
                      <td>{project.specs.structuralSystem}</td>
                    </tr>
                    <tr>
                      <th scope="row">Primary Materiality</th>
                      <td>
                        <div className="specs-tag-list">
                          {project.specs.primaryMaterials.map((mat) => (
                            <span key={mat} className="specs-tag">
                              {mat}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Climate & Sustainability</th>
                      <td>{project.specs.sustainability}</td>
                    </tr>
                    <tr>
                      <th scope="row">Architectural Leadership</th>
                      <td>{project.leadArchitect} — Noufal Architects</td>
                    </tr>
                    {project.specs.collaborators && (
                      <tr>
                        <th scope="row">Consultant Collaborators</th>
                        <td>{project.specs.collaborators}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DRAWINGS */}
          {activeTab === "drawings" && (
            <div className="case-study-section case-study-drawings animate-fade-in">
              <div className="drawings-viewer-layout">
                {/* Drawing Selector Sidebar */}
                <div className="drawings-sidebar">
                  <h3 className="case-study-subheading">
                    ARCHITECTURAL SHEETS
                  </h3>
                  <div className="drawings-list">
                    {project.drawings.map((dwg) => (
                      <button
                        key={dwg.id}
                        type="button"
                        className={`drawing-thumb-btn ${
                          selectedDrawing?.id === dwg.id ? "is-selected" : ""
                        }`}
                        onClick={() => setSelectedDrawing(dwg)}
                      >
                        <span className="drawing-type-badge">{dwg.type}</span>
                        <span className="drawing-thumb-title">{dwg.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Drawing Stage */}
                <div className="drawings-stage">
                  {selectedDrawing ? (
                    <div className="drawing-sheet">
                      <div className="drawing-sheet__frame">
                        <img
                          src={selectedDrawing.image}
                          alt={selectedDrawing.title}
                          className="drawing-sheet__img"
                          onClick={() =>
                            setLightboxImage(selectedDrawing.image)
                          }
                          title="Click to expand drawing"
                        />
                        <button
                          type="button"
                          className="drawing-zoom-btn"
                          onClick={() =>
                            setLightboxImage(selectedDrawing.image)
                          }
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="11" y1="8" x2="11" y2="14" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                          </svg>
                          Expand Sheet
                        </button>
                      </div>
                      <div className="drawing-sheet__meta">
                        <div>
                          <h4>{selectedDrawing.title}</h4>
                          <p>{selectedDrawing.caption}</p>
                        </div>
                        <div className="drawing-sheet__stamp">
                          <span>NOUFAL ARCHITECTS</span>
                          <span>SCHEMATIC STAGE</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="no-data-msg">
                      Select a drawing to view details.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MATERIALS */}
          {activeTab === "materials" && (
            <div className="case-study-section case-study-materials animate-fade-in">
              <h3 className="case-study-subheading">
                MATERIALITY & TACTILE PALETTE
              </h3>
              <p className="case-study-desc">
                Every project by Noufal Architects is grounded in a
                rigorous dialogue with raw, honest materials that age gracefully
                over time.
              </p>

              <div className="materials-grid">
                {project.materials.map((mat) => (
                  <div key={mat.name} className="material-card">
                    <div
                      className="material-card__swatch"
                      style={{ backgroundColor: mat.color }}
                    >
                      <span className="material-card__tag">{mat.tag}</span>
                    </div>
                    <div className="material-card__info">
                      <h4>{mat.name}</h4>
                      <p>{mat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GALLERY */}
          {activeTab === "gallery" && (
            <div className="case-study-section case-study-gallery animate-fade-in">
              <h3 className="case-study-subheading">
                PROJECT PHOTOGRAPHY & SPATIAL VIEWS
              </h3>
              <p className="case-study-desc">
                High-resolution study of light, texture, and framed vistas
                across the site. Click any photograph to view in full
                resolution.
              </p>

              <div className="gallery-masonry">
                {project.gallery.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="gallery-item-btn"
                    onClick={() => setLightboxImage(imgSrc)}
                  >
                    <img
                      src={imgSrc}
                      alt={`${project.title} architectural view ${idx + 1}`}
                      loading="lazy"
                    />
                    <span className="gallery-item-overlay">
                      <span>Enlarge View</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lightbox Overlay */}
        {lightboxImage && (
          <div
            className="lightbox-backdrop"
            onClick={() => setLightboxImage(null)}
          >
            <div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightboxImage} alt="Expanded architectural view" />
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setLightboxImage(null)}
                aria-label="Close Lightbox"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
