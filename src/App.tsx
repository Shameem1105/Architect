import { useState, useEffect } from "react"
import { projectsData, type Project } from "./data/projects"
import WorkSection from "./components/WorkSection"
import ProjectCaseStudyModal from "./components/ProjectCaseStudyModal"
import ProjectExplorer from "./components/ProjectExplorer"

function Arrow({
  direction = "right",
}: {
  direction?: "right" | "left" | "down"
}) {
  return (
    <span aria-hidden="true" className={`arrow arrow--${direction}`}>
      {direction === "left" ? "←" : direction === "down" ? "↓" : "→"}
    </span>
  )
}

function TextLink({
  children,
  onClick,
  inverse = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  inverse?: boolean
}) {
  return (
    <button
      className={`text-link ${inverse ? "text-link--inverse" : ""}`}
      onClick={onClick}
    >
      <span>{children}</span>
      <Arrow />
    </button>
  )
}

function Header({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean
  setMenuOpen: (v: boolean) => void
}) {
  return (
    <>
      <header className="site-header">
        <a
          className="wordmark"
          href="#top"
          aria-label="Noufal Architects home"
        >
          NOUFAL <span className="wordmark-sub">ARCHITECTS</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#work">Selected Works</a>
          <a href="#approach">3D Spatial Model</a>
          <a href="#studio">The Studio</a>
          <a href="#process">Process & Drawings</a>
          <a className="nav-contact" href="#contact">
            Commission a Project <Arrow />
          </a>
        </nav>
        <button
          className="menu-button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span>{menuOpen ? "CLOSE" : "MENU"}</span>
          <i className={menuOpen ? "menu-icon is-open" : "menu-icon"} />
        </button>
      </header>
      <div className={menuOpen ? "mobile-menu is-open" : "mobile-menu"}>
        <nav>
          {[
            { label: "Selected Works", href: "#work" },
            { label: "3D Spatial Model", href: "#approach" },
            { label: "The Studio", href: "#studio" },
            { label: "Process & Drawings", href: "#process" },
            { label: "Contact", href: "#contact" },
          ].map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              <span>0{index + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <p>NOUFAL ARCHITECTS • MELBOURNE</p>
      </div>
    </>
  )
}

function Hero({ onExploreHero: _ }: { onExploreHero?: () => void }) {
  return (
    <section className="hero" id="top">
      {/* Full-Segment Architectural Background Image */}
      <img
        className="hero__image"
        src="/images/masjid.jpg"
        alt="Monumental Masjid Architecture"
        loading="eager"
      />
      <div className="hero__veil" />

      {/* Hero Typography & Content */}
      <div className="hero__content">
        <p className="eyebrow hero__project">
          01 / TECTONICS OF LIGHT &amp; SACRED SPACE
        </p>
        <h1>
          Architecture
          <br />
          that <em>unfolds.</em>
        </h1>
        <div className="hero__bottom">
          <p>
            Quietly monumental spaces, shaped by daylight, tectonic clarity, and
            deep reverence for the natural landscape.
          </p>
        </div>
      </div>
    </section>
  )
}

function Manifesto() {
  return (
    <section className="manifesto" id="manifesto">
      <p className="eyebrow">AN ARCHITECTURE OF EXPERIENCE</p>
      <h2>
        Every space tells a story.
        <br />
        Every transition reveals
        <br />a <em>new perspective.</em>
      </h2>
      <div className="manifesto__media">
        <figure className="manifesto__large">
          <img
            src="https://images.unsplash.com/photo-1682184805271-11671b7ecf4c?auto=format&fit=crop&w=1600&q=88"
            alt="Warm contemporary interior with balanced daylight"
          />
          <figcaption>
            Natural light choreographs the rhythm of daily rituals
          </figcaption>
        </figure>
        <div className="manifesto__copy">
          <span className="section-count">01 — 04</span>
          <p>
            We sculpt structures as sensory sequences of discovery—where framed
            apertures, calibrated thresholds, and honest, tactile materials
            cultivate an enduring sense of calm and permanence.
          </p>
          <a className="inline-link" href="#approach">
            Explore 3D spatial layers <Arrow />
          </a>
        </div>
        <figure className="manifesto__small">
          <img
            src="https://images.unsplash.com/photo-1656952213963-83a4acc8a7fd?auto=format&fit=crop&w=900&q=88"
            alt="Tactile textured stone wall and bespoke seating"
          />
        </figure>
      </div>
    </section>
  )
}

function ExplorerPreview({
  onExplore,
}: {
  onExplore: (project: Project) => void
}) {
  const featured = projectsData[0]
  return (
    <section className="explorer-preview" id="approach">
      <div className="explorer-preview__top">
        <div>
          <p className="eyebrow">SIGNATURE INTERACTIVE METHODOLOGY</p>
          <h2>
            Understand the
            <br />
            architecture, <em>layer by layer.</em>
          </h2>
        </div>
        <p>
          Move beyond the finished image. Deconstruct structural mass, explore
          floor-by-floor programmatic relationships, and step inside interior
          spaces with our real-time axonometric engine.
        </p>
      </div>
      <div className="model-stage">
        <div className="model-stage__labels">
          <p>01 / {featured.title.toUpperCase()}</p>
          <p>EXPLODED AXONOMETRIC / BIM CONCEPT STUDY</p>
        </div>
        <div
          className="architecture-model"
          aria-label="Stylized exploded architectural model"
        >
          <div className="model-part model-part--roof">
            <span />
          </div>
          <div className="model-part model-part--upper">
            <span className="window" />
            <span className="window window--wide" />
          </div>
          <div className="model-guide model-guide--one" />
          <div className="model-part model-part--ground">
            <span className="window window--wide" />
            <span className="window" />
          </div>
          <div className="model-guide model-guide--two" />
          <div className="model-part model-part--base" />
        </div>
        <div className="floor-legend">
          <span>RF</span>
          <span>01</span>
          <span>GF</span>
          <span>ST</span>
        </div>
        <div className="model-stage__action">
          <p>Inspect structural floors, framing, and interior sightlines.</p>
          <TextLink inverse onClick={() => onExplore(featured)}>
            Launch interactive 3D explorer
          </TextLink>
        </div>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="process" id="process">
      <div className="process__heading">
        <p className="eyebrow">DRAWING / TECTONICS / REFINEMENT</p>
        <h2>
          Designed from
          <br />
          the <em>inside out.</em>
        </h2>
        <p>
          From the hand-drafted sectional diagram to full-scale material
          mockups, each design decision is calibrated to heighten how the
          building feels, sounds, and breathes.
        </p>
      </div>
      <div className="drawings">
        <figure className="drawing drawing--main">
          <img
            src="https://images.unsplash.com/photo-1721244654195-943615c56ac4?auto=format&fit=crop&w=1400&q=82"
            alt="Architectural drafting drawing and spatial planning study"
          />
          <figcaption>
            <span>01</span>
            <span>
              Spatial Choreography & Environmental Passivhaus Planning
            </span>
          </figcaption>
        </figure>
        <figure className="drawing drawing--side">
          <img
            src="https://images.unsplash.com/photo-1603901622056-0a5bee231395?auto=format&fit=crop&w=1100&q=82"
            alt="Architectural detail studies and materiality tests"
          />
          <figcaption>
            <span>02</span>
            <span>Tectonic Detailing & Thermal Envelope Studies</span>
          </figcaption>
        </figure>
      </div>
      <p className="drawing-note">
        All technical drawings are developed by Noufal Architects in
        compliance with rigorous environmental and passive design standards.
      </p>
    </section>
  )
}

function Studio() {
  return (
    <section className="studio" id="studio">
      <div className="studio__image">
        <img
          src="https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&w=1400&q=88"
          alt="Architectural studio workspace with quiet natural daylight"
        />
        <p>NOUFAL ARCHITECTS • PRACTICE</p>
      </div>
      <div className="studio__content">
        <p className="eyebrow">THE STUDIO PHILOSOPHY</p>
        <h2>
          Architecture begins
          <br />
          with <em>listening.</em>
        </h2>
        <div className="studio__columns">
          <p>
            Noufal Architects is a design-led architectural practice
            centered on a fundamental conviction: the most resonating spaces
            arise from rigorous attention to human rituals, site geology, and
            the emotive qualities of natural light.
          </p>
          <p>
            Guided by principal architect Noufal, the studio privileges
            tectonic honesty over novelty. We create sculptural buildings that
            sit quietly within their landscape, growing more noble and textured
            with the passage of decades.
          </p>
        </div>
        <div className="services">
          <p className="eyebrow">AREAS OF COMMISSION & EXPERTISE</p>
          {[
            "Bespoke Residential Architecture & Estates",
            "Cultural Institutions, Galleries & Pavilions",
            "Adaptive Reuse & Heritage Preservation",
            "Interior Spatial Architecture & Custom Joinery",
            "Environmental Feasibility & Masterplanning",
          ].map((service, i) => (
            <div key={service}>
              <span>0{i + 1}</span>
              <p>{service}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  return (
    <section className="contact" id="contact">
      <div className="contact__title">
        <p className="eyebrow">START A DIALOGUE</p>
        <h2>
          Let&apos;s talk about
          <br />
          your <em>next commission.</em>
        </h2>
        <div className="contact__details">
          <div>
            <span>DIRECT INQUIRIES</span>
            <a href="mailto:studio@noufal.com">studio@noufal.com</a>
          </div>
          <div>
            <span>STUDIO LOCATION</span>
            <p>Melbourne • Flinders Escarpment • Australia</p>
          </div>
        </div>
      </div>
      {submitted ? (
        <div className="form-success">
          <p className="eyebrow">ENQUIRY REGISTERED</p>
          <h3>Thank you for initiating a conversation.</h3>
          <p>
            Principal architect Noufal and the team will review your
            project brief, site parameters, and schedule before arranging an
            introductory consultation.
          </p>
          <TextLink onClick={() => setSubmitted(false)}>
            Send another consultation brief
          </TextLink>
        </div>
      ) : (
        <form
          className="enquiry-form"
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitted(true)
          }}
        >
          <label>
            <span>01 / YOUR NAME OR CLIENT REPRESENTATIVE</span>
            <input
              required
              name="name"
              placeholder="Full name or organization"
            />
          </label>
          <label>
            <span>02 / EMAIL ADDRESS</span>
            <input
              required
              type="email"
              name="email"
              placeholder="name@domain.com"
            />
          </label>
          <div className="form-row">
            <label>
              <span>03 / COMMISSION TYPOLOGY</span>
              <select name="type" defaultValue="">
                <option value="" disabled>
                  Select Typology
                </option>
                <option>New Private Residence</option>
                <option>Cultural / Gallery / Pavilion</option>
                <option>Heritage / Adaptive Reuse</option>
                <option>Interior Architecture</option>
                <option>Feasibility & Concept Study</option>
              </select>
            </label>
            <label>
              <span>04 / SITE LOCATION & JURISDICTION</span>
              <input
                name="location"
                placeholder="Subregion, city, or country"
              />
            </label>
          </div>
          <label>
            <span>05 / PROJECT VISION, TIMELINE & PROGRAM</span>
            <textarea
              name="description"
              rows={3}
              placeholder="Provide a summary of the site, anticipated scale, lifestyle aspirations, or target timeline..."
            />
          </label>
          <button className="submit-button" type="submit">
            Submit Commission Brief <Arrow />
          </button>
        </form>
      )}
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <div className="footer__main">
        <p className="footer__studio-title">NOUFAL ARCHITECTS</p>
        <p className="footer__credo">
          SPACE / MATERIALITY / LIGHT / ATMOSPHERE
        </p>
      </div>
      <div className="footer__links">
        <a href="#work">Selected Works</a>
        <a href="#approach">3D Methodology</a>
        <a href="#studio">Studio Bio</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="footer__bottom">
        <p>
          © {new Date().getFullYear()} Noufal Architects. All rights
          reserved.
        </p>
        <p>Architectural Portfolio & Interactive Monograph</p>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCaseStudy, setActiveCaseStudy] = useState<Project | null>(null)
  const [activeExplorer, setActiveExplorer] = useState<Project | null>(null)

  const handleOpenCaseStudy = (project: Project) => {
    setActiveCaseStudy(project)
    setActiveExplorer(null)
  }

  const handleOpenExplorer = (project: Project) => {
    setActiveExplorer(project)
    setActiveCaseStudy(null)
  }

  return (
    <main>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Hero onExploreHero={() => handleOpenExplorer(projectsData[0])} />
      <Manifesto />

      {/* Upgraded Works Section with filters, list/grid toggle, search, and case studies */}
      <WorkSection
        projects={projectsData}
        onOpenCaseStudy={handleOpenCaseStudy}
        onOpenExplorer={handleOpenExplorer}
      />

      <ExplorerPreview onExplore={handleOpenExplorer} />
      <Process />
      <Studio />
      <Contact />
      <Footer />

      {/* Comprehensive Architectural Project Case Study Sheet Modal */}
      {activeCaseStudy && (
        <ProjectCaseStudyModal
          project={activeCaseStudy}
          onClose={() => setActiveCaseStudy(null)}
          onLaunch3DExplorer={handleOpenExplorer}
        />
      )}

      {/* Interactive 3D Axonometric Floor Explorer */}
      {activeExplorer && (
        <ProjectExplorer
          project={activeExplorer}
          onClose={() => setActiveExplorer(null)}
          onOpenCaseStudy={handleOpenCaseStudy}
          onSwitchProject={setActiveExplorer}
        />
      )}
    </main>
  )
}
