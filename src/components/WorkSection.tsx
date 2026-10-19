import { useState, useMemo } from "react"
import type { Project, ProjectCategory } from "../data/projects"

type WorkSectionProps = {
  projects: Project[]
  onOpenCaseStudy: (project: Project) => void
  onOpenExplorer: (project: Project) => void
}

export default function WorkSection({
  projects,
  onOpenCaseStudy,
  onOpenExplorer,
}: WorkSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { key: "all", label: "All Works" },
    { key: "residential", label: "Residential" },
    { key: "commercial", label: "Commercial & Cultural" },
    { key: "pavilion", label: "Pavilion & Landscape" },
    { key: "interiors", label: "Interiors & Heritage" },
  ]

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        activeCategory === "all" ||
        p.category === activeCategory as ProjectCategory
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.materials.some((m) => m.name.toLowerCase().includes(q))

      return matchesCategory && matchesSearch
    })
  }, [projects, activeCategory, searchQuery])

  return (
    <section className="work" id="work">
      {/* Section Header */}
      <div className="section-intro">
        <p className="eyebrow">SELECTED WORKS / NOUFAL ARCHITECTS</p>
        <h2>Spaces made for living.</h2>
        <p className="section-intro__copy">
          A monograph of built projects and research commissions exploring
          light, tectonic honesty, and the intimacy between architecture and
          terrain.
        </p>
      </div>

      {/* Control Bar: Filters, Search & View Switcher */}
      <div className="work-controls">
        {/* Category Filter Tabs */}
        <div
          className="work-filter-tabs"
          role="tablist"
          aria-label="Filter works by typology"
        >
          {categories.map((cat) => {
            const count =
              cat.key === "all"
                ? projects.length
                : projects.filter((p) => p.category === cat.key).length
            const isActive = activeCategory === cat.key
            return (
              <button
                key={cat.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`filter-pill ${isActive ? "is-active" : ""}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                <span>{cat.label}</span>
                <span className="pill-badge">{count}</span>
              </button>
            )
          })}
        </div>

        {/* Search & Layout Toggles */}
        <div className="work-controls__right">
          {/* Quick Search */}
          <div className="work-search-box">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by city, type, or material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search architectural projects"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div
            className="view-mode-toggle"
            role="group"
            aria-label="View layout switch"
          >
            <button
              type="button"
              className={`view-mode-btn ${
                viewMode === "grid" ? "is-active" : ""
              }`}
              onClick={() => setViewMode("grid")}
              title="Visual Grid View"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Grid</span>
            </button>
            <button
              type="button"
              className={`view-mode-btn ${
                viewMode === "list" ? "is-active" : ""
              }`}
              onClick={() => setViewMode("list")}
              title="Architectural Schedule Index View"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              <span>Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Feedback Bar */}
      <div className="work-results-info">
        <span>
          Showing {filteredProjects.length} of {projects.length} architectural
          projects
        </span>
        {searchQuery && (
          <span className="search-filter-tag">
            Keyword: “{searchQuery}”
            <button type="button" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          </span>
        )}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="work-empty-state">
          <p>No architectural projects match your selected filter criteria.</p>
          <button
            type="button"
            className="button button--light"
            onClick={() => {
              setActiveCategory("all")
              setSearchQuery("")
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="upgraded-project-grid">
          {filteredProjects.map((project, index) => (
            <article
              className={`upgraded-project-card upgraded-project-card--${(index % 6) + 1}`}
              key={project.id}
            >
              <div className="upgraded-project-card__media">
                <img
                  src={project.image}
                  alt={`${project.title} architectural concept`}
                  loading="lazy"
                />

                {/* Overlay pill with category and year */}
                <div className="card-floating-badge">
                  <span>{project.categoryLabel}</span>
                  <span className="dot">•</span>
                  <span>{project.year}</span>
                </div>

                {/* Hover Quick Action Buttons */}
                <div className="upgraded-project-card__actions">
                  <button
                    type="button"
                    className="card-action-btn card-action-btn--primary"
                    onClick={() => onOpenCaseStudy(project)}
                  >
                    <span>View Case Study</span>
                    <span className="arrow-icon">→</span>
                  </button>
                  <button
                    type="button"
                    className="card-action-btn card-action-btn--secondary"
                    onClick={() => onOpenExplorer(project)}
                    title="Launch 3D Floor Explorer"
                  >
                    <span>3D Model</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Card Metadata */}
              <div className="upgraded-project-card__meta">
                <div className="card-meta-top">
                  <span className="project-serial">{project.number}</span>
                  <span className="project-location">{project.location}</span>
                </div>

                <div className="card-meta-main">
                  <h3
                    className="project-card-title-clickable"
                    onClick={() => onOpenCaseStudy(project)}
                  >
                    {project.title}
                  </h3>
                  <p className="project-subtitle">{project.subtitle}</p>
                </div>

                <div className="card-specs-row">
                  <span className="spec-item">
                    <strong>GFA:</strong> {project.area}
                  </span>
                  <span className="spec-item">
                    <strong>Status:</strong> {project.status}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* ARCHITECTURAL SCHEDULE (INDEX / LIST) VIEW */
        <div className="project-schedule-container">
          <table className="project-schedule-table">
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Project Title</th>
                <th scope="col">Typology</th>
                <th scope="col">Location</th>
                <th scope="col">Area</th>
                <th scope="col">Year</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="schedule-row">
                  <td className="schedule-code font-mono">
                    NA-{project.number}
                  </td>
                  <td className="schedule-title">
                    <button
                      type="button"
                      className="schedule-title-btn"
                      onClick={() => onOpenCaseStudy(project)}
                    >
                      {project.title}
                    </button>
                    <span className="schedule-subtitle">
                      {project.subtitle}
                    </span>
                  </td>
                  <td className="schedule-type">
                    <span className="schedule-type-badge">
                      {project.categoryLabel}
                    </span>
                  </td>
                  <td className="schedule-location">{project.location}</td>
                  <td className="schedule-area font-mono">{project.area}</td>
                  <td className="schedule-year font-mono">{project.year}</td>
                  <td className="schedule-status">
                    <span
                      className={`status-pill ${
                        project.status === "Completed"
                          ? "status-completed"
                          : "status-progress"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="schedule-actions text-right">
                    <div className="schedule-btn-group">
                      <button
                        type="button"
                        className="schedule-btn schedule-btn--primary"
                        onClick={() => onOpenCaseStudy(project)}
                      >
                        Case Study
                      </button>
                      <button
                        type="button"
                        className="schedule-btn schedule-btn--secondary"
                        onClick={() => onOpenExplorer(project)}
                        title="Open in 3D Model Explorer"
                      >
                        3D View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Architectural Notation Footer Note */}
      <div className="project-footer-note">
        <p>
          Noufal Architects Portfolio Monograph • All projects represent
          original architectural works, schematic research commissions, and
          masterplanning studies.
        </p>
      </div>
    </section>
  )
}
