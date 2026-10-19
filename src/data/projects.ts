export type ProjectCategory = "residential" | "commercial" | "pavilion" | "interiors"

export type ProjectDrawing = {
  id: string
  title: string
  type: "Ground Plan" | "Section" | "Axonometric" | "Detail"
  image: string
  caption: string
}

export type MaterialItem = {
  name: string
  tag: string
  description: string
  color: string
}

export type RoomHotspot = {
  id: string
  label: string
  detail: string
  x: number
  y: number
}

export type WalkthroughRoom = {
  id: string
  name: string
  floor: string
  subtitle?: string
  image: string
  description: string
  hotspots?: RoomHotspot[]
}

export type Project = {
  id: string
  number: string
  title: string
  subtitle: string
  category: ProjectCategory
  categoryLabel: string
  type: string
  location: string
  year: string
  status: "Completed" | "Under Construction" | "Concept Study"
  area: string
  siteArea: string
  floors: string
  image: string
  leadArchitect: string
  conceptStatement: string
  narrative: string[]
  keyFeatures: string[]
  specs: {
    builtArea: string
    siteArea: string
    structuralSystem: string
    primaryMaterials: string[]
    sustainability: string
    completionYear: string
    collaborators?: string
  }
  materials: MaterialItem[]
  drawings: ProjectDrawing[]
  gallery: string[]
  walkthroughRooms: WalkthroughRoom[]
}

export const projectsData: Project[] = [
  {
    id: "courtyard-house",
    number: "01",
    title: "The Courtyard House",
    subtitle: "A quiet sequence of stone, garden, and light.",
    category: "residential",
    categoryLabel: "Residential",
    type: "Single Family Residence",
    location: "Mornington Peninsula, Victoria",
    year: "2024",
    status: "Completed",
    area: "520 m²",
    siteArea: "1,850 m²",
    floors: "2 Levels + Sub-terranean Cellar",
    image:
      "https://images.unsplash.com/photo-1699965583636-4c9ee0aa317a?auto=format&fit=crop&w=1800&q=85",
    leadArchitect: "Noufal, Principal",
    conceptStatement:
      "A subterranean and ground-level choreography of monolithic limestone walls framing an open-sky central cloister.",
    narrative: [
      "Conceived as an inward-looking sanctuary within the wind-swept coastal topography of the Mornington Peninsula, The Courtyard House organizes domestic life around a sunken central garden cloister.",
      "Thick perimeter walls of locally quarried Mount Gambier limestone provide thermal mass and acoustic serenity, sheltering private sleeping quarters while expansive operable glazed screens connect the living pavilion directly with native coastal vegetation.",
      "The spatial sequence begins at a compressed stone threshold before opening dramatically into a double-height volume washed in low winter daylight from high-level clerestory apertures.",
    ],
    keyFeatures: [
      "Inward-focused microclimate central atrium and Japanese maple reflection pool",
      "Off-form board-marked concrete lintels and hand-tooled limestone walling",
      "Passive thermal massing with cross-ventilating louver bays",
      "Deeply recessed shadowlines and integrated blackened steel joinery",
    ],
    specs: {
      builtArea: "520 m² (5,600 sq ft)",
      siteArea: "1,850 m²",
      structuralSystem: "Reinforced concrete frame with mass masonry envelope",
      primaryMaterials: [
        "Honed Mount Gambier Limestone",
        "Cast-in-place Concrete",
        "Blackened Steel",
        "European White Oak",
      ],
      sustainability:
        "Geothermal heat loop, 45,000L rainwater retention, 9.2-star NatHERS passive performance",
      completionYear: "2024",
      collaborators:
        "Eckersley Garden Architecture (Landscape), Atelier Ten (Environmental)",
    },
    materials: [
      {
        name: "Limestone",
        tag: "Masonry",
        description: "Smooth honed local stone with warm fossil inclusions",
        color: "#dcd6c8",
      },
      {
        name: "Board Concrete",
        tag: "Structure",
        description: "Off-form rough sawn Oregon timber grain finish",
        color: "#8d8e87",
      },
      {
        name: "Charred Ash",
        tag: "Cladding",
        description: "Deep black yakisugi surface for external shading fins",
        color: "#2b2b29",
      },
      {
        name: "Raw Brass",
        tag: "Details",
        description: "Unlacquered brass developing a living coastal patina",
        color: "#bfa36c",
      },
    ],
    drawings: [
      {
        id: "ch-01",
        title: "Ground Floor Spatial Plan",
        type: "Ground Plan",
        image:
          "https://images.unsplash.com/photo-1721244654195-943615c56ac4?auto=format&fit=crop&w=1600&q=82",
        caption:
          "1:100 Scale schematic floorplan highlighting inward courtyard orientation and public/private zones.",
      },
      {
        id: "ch-02",
        title: "Longitudinal Cross-Section A-A",
        type: "Section",
        image:
          "https://images.unsplash.com/photo-1603901622056-0a5bee231395?auto=format&fit=crop&w=1600&q=82",
        caption:
          "Sectional diagram demonstrating natural solar penetration and subterranean earth-sheltered cellar.",
      },
      {
        id: "ch-03",
        title: "Axonometric Massing & Assembly",
        type: "Axonometric",
        image:
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=82",
        caption:
          "Exploded volumetric study showing interlocking roof canopy, living pavilion, and stone foundation.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1699965583636-4c9ee0aa317a?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1682184805271-11671b7ecf4c?auto=format&fit=crop&w=1800&q=88",
      "https://images.unsplash.com/photo-1708111776235-990d08c84658?auto=format&fit=crop&w=1800&q=88",
      "https://images.unsplash.com/photo-1749374848423-e63d5a2374d1?auto=format&fit=crop&w=1800&q=88",
    ],
    walkthroughRooms: [
      {
        id: "entry",
        name: "ENTRANCE THRESHOLD",
        subtitle: "AXIAL LIMESTONE PORTAL",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=88",
        description: "A compressed stone entrance framing an immediate axial vista into the central garden courtyard.",
        hotspots: [
          { id: "h1", label: "Mount Gambier Limestone", detail: "Locally quarried stone blocks with hand-tooled chamfered shadowlines.", x: 28, y: 48 },
          { id: "h2", label: "Axial View Corridor", detail: "Direct visual alignment linking the front entry portal to the inner cloister.", x: 55, y: 35 },
          { id: "h3", label: "Recessed Floor Uplighting", detail: "Low-voltage architectural wash lights concealed in perimeter stone reveals.", x: 74, y: 82 },
        ],
      },
      {
        id: "courtyard",
        name: "CENTRAL CLOISTER",
        subtitle: "SUNKEN RAINWATER BASIN",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1749374848423-e63d5a2374d1?auto=format&fit=crop&w=2400&q=88",
        description: "Open sky meditation cloister with crushed basalt pathways and native fern understory.",
        hotspots: [
          { id: "h4", label: "Reflecting Basin", detail: "100mm deep rainwater retention pool providing evaporative microclimate cooling.", x: 48, y: 72 },
          { id: "h5", label: "Low-Iron Glass Curtain", detail: "Frameless structural glass panels offering 360-degree transparency.", x: 80, y: 45 },
        ],
      },
      {
        id: "living",
        name: "LIVING PAVILION",
        subtitle: "SUNKEN LOUNGE & HEARTH",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1682184805271-11671b7ecf4c?auto=format&fit=crop&w=2400&q=88",
        description: "Sunken seating lounge framing horizontal vistas into the enclosed central courtyard and garden.",
        hotspots: [
          { id: "h6", label: "Custom Oak Joinery", detail: "Full-height European white oak wall paneling with acoustic felt backing.", x: 32, y: 40 },
          { id: "h7", label: "Monolithic Stone Hearth", detail: "Suspended blackened steel firebox anchored to cast concrete hearth.", x: 68, y: 56 },
        ],
      },
      {
        id: "kitchen",
        name: "MINIMALIST KITCHEN",
        subtitle: "QUARTZ WATERFALL ISLAND",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1708111776235-990d08c84658?auto=format&fit=crop&w=2400&q=88",
        description: "Monolithic stone kitchen block with integrated bronze extraction hood and concealed back-of-house scullery.",
        hotspots: [
          { id: "h8", label: "Seamless Quartz Island", detail: "3.2m continuous honed quartz slab with integrated flush induction surface.", x: 50, y: 65 },
          { id: "h9", label: "Concealed Scullery", detail: "Flush pivot doors leading to high-capacity refrigeration and preparation pantry.", x: 82, y: 38 },
        ],
      },
      {
        id: "dining",
        name: "FORMAL DINING SUITE",
        subtitle: "SOLID TIMBER TRESTLE",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=2400&q=88",
        description: "Intimate dining space anchored beneath sculptural bronze pendant lights facing the western garden.",
        hotspots: [
          { id: "h10", label: "Solid Timber Trestle", detail: "2.4m crafted white oak dining table with hand-rubbed Danish oil finish.", x: 52, y: 62 },
        ],
      },
      {
        id: "bedroom",
        name: "MASTER BEDROOM SUITE",
        subtitle: "CUSHIONED SANCTUARY",
        floor: "FIRST FLOOR",
        image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=2400&q=88",
        description: "Quiet first-floor master suite with custom bed frame, wool carpet, and framed coastal horizon views.",
        hotspots: [
          { id: "h11", label: "Integrated Platform Bed", detail: "Floating oak plinth with concealed LED nightline illumination.", x: 45, y: 58 },
          { id: "h12", label: "Linen Wall Finishes", detail: "Acoustic woven Belgian linen wall coverings for supreme auditory comfort.", x: 22, y: 35 },
        ],
      },
      {
        id: "bathroom",
        name: "ENSUITE SPA BATHROOM",
        subtitle: "HONED TRAVERTINE SUITE",
        floor: "FIRST FLOOR",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=2400&q=88",
        description: "Minimalist bath retreat featuring a freestanding carved stone tub and walk-in rain shower.",
        hotspots: [
          { id: "h13", label: "Carved Stone Basin", detail: "Monolithic hollowed travertine block with wall-mounted brushed brass fixtures.", x: 54, y: 64 },
          { id: "h14", label: "Clerestory Skylight", detail: "Narrow high-level light slot bathing wet zones in non-glare zenith light.", x: 85, y: 22 },
        ],
      },
    ],
  },
  {
    id: "stone-residence",
    number: "02",
    title: "The Stone Residence",
    subtitle: "Monolithic forms anchored into the coastal terrain.",
    category: "residential",
    categoryLabel: "Residential",
    type: "Cliffside Residence",
    location: "Flinders Coastal Escarpment",
    year: "2024",
    status: "Completed",
    area: "640 m²",
    siteArea: "2,400 m²",
    floors: "3 Terraced Tiers",
    image:
      "https://images.unsplash.com/photo-1608619769165-25647672335f?auto=format&fit=crop&w=1800&q=85",
    leadArchitect: "Noufal",
    conceptStatement:
      "A stepped geological intervention that mimics the stratified basalt cliffs of the Southern Ocean.",
    narrative: [
      "Perched on a dramatic escarpment overlooking Bass Strait, The Stone Residence was designed to feel as though it was cleaved directly from the basalt bedrock.",
      "Divided into three descending terraces following the natural gradient of the site, each pavilion opens toward the ocean while shielding occupants from harsh south-westerly maritime winds.",
      "Extensive dry-stacked basalt stonework was executed by master stonemasons over twenty-two months, creating an indestructible outer skin balanced by warm cedar-lined interiors.",
    ],
    keyFeatures: [
      "Cantilevered viewing platform extending 6 meters over the cliff edge",
      "Thermal mass basalt walls stabilizing year-round ambient interior temperatures",
      "Integrated seawater heat recovery system",
      "Subterranean wine sanctuary carved directly into bedrock",
    ],
    specs: {
      builtArea: "640 m² (6,890 sq ft)",
      siteArea: "2,400 m²",
      structuralSystem:
        "Post-tensioned concrete slabs with cyclopean stone masonry",
      primaryMaterials: [
        "Victorian Basalt Stone",
        "Structural Glulam Cedar",
        "Low-iron Marine Glazing",
      ],
      sustainability:
        "Net-zero operational emissions with 24kW solar canopy and microgrid storage",
      completionYear: "2024",
    },
    materials: [
      {
        name: "Basalt Stone",
        tag: "Wall",
        description: "Hand-chiseled dark volcanic rock from regional quarries",
        color: "#484945",
      },
      {
        name: "Western Cedar",
        tag: "Ceiling",
        description: "Acoustic micro-slatted timber lining boards",
        color: "#a47954",
      },
      {
        name: "Dark Bronze",
        tag: "Frames",
        description: "Thermally broken structural curtainwall frames",
        color: "#2f2b26",
      },
      {
        name: "Microcement",
        tag: "Floors",
        description: "Seamless mineral floor finish with satin natural wax",
        color: "#bfbbb2",
      },
    ],
    drawings: [
      {
        id: "sr-01",
        title: "Topographic Site & Level 01 Plan",
        type: "Ground Plan",
        image:
          "https://images.unsplash.com/photo-1721244654195-943615c56ac4?auto=format&fit=crop&w=1600&q=82",
        caption:
          "Contour mapping and structural tie-back anchors into cliff bedrock.",
      },
      {
        id: "sr-02",
        title: "Cantilever Structural Section",
        type: "Section",
        image:
          "https://images.unsplash.com/photo-1603901622056-0a5bee231395?auto=format&fit=crop&w=1600&q=82",
        caption:
          "Detailing the post-tensioned tendon anchor points and wind deflection baffles.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1608619769165-25647672335f?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85",
    ],
    walkthroughRooms: [
      {
        id: "sr-entry",
        name: "BEDROCK ENTRANCE VAULT",
        subtitle: "CHISELED BASALT PORTAL",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=88",
        description: "Monolithic stone entry tunnel cut directly into coastal basalt bedrock with soft perimeter downlights.",
        hotspots: [
          { id: "srh1", label: "Cyclopean Basalt Wall", detail: "Dry-stacked dark volcanic stone providing structural containment and acoustic silence.", x: 30, y: 55 },
          { id: "srh2", label: "Ocean View Axis", detail: "Narrow horizontal viewing slit framing the breaking waves at the cliff base.", x: 72, y: 40 },
        ],
      },
      {
        id: "sr-living",
        name: "OCEAN LIVING SALON",
        subtitle: "CANTILEVERED GLASS PAVILION",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=88",
        description: "Triple-aspect panoramic living room suspended 6 meters over the coastal escarpment.",
        hotspots: [
          { id: "srh3", label: "Glulam Cedar Roof Trusses", detail: "Deep cantilever beams engineered to withstand offshore gale winds.", x: 50, y: 22 },
          { id: "srh4", label: "Microcement Floor Plane", detail: "Continuous seamless mineral floor with radiant hydronic heating.", x: 45, y: 70 },
        ],
      },
      {
        id: "sr-terrace",
        name: "SHELTERED CLIFF TERRACE",
        subtitle: "RECESSED HEARTH & DECK",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1608619769165-25647672335f?auto=format&fit=crop&w=2400&q=88",
        description: "An outdoor stone alcove protected from south-westerly winds by projecting wing walls.",
        hotspots: [
          { id: "srh5", label: "Basalt Fire Pit", detail: "Integrated stone hearth fed by bioethanol for evening gatherings overlooking the strait.", x: 60, y: 65 },
        ],
      },
      {
        id: "sr-master",
        name: "CLIFFSIDE MASTER SUITE",
        subtitle: "SUSPENDED HORIZON BEDROOM",
        floor: "FIRST FLOOR",
        image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=2400&q=88",
        description: "Upper level private retreat commanding unobstructed 180-degree ocean horizon panoramas.",
        hotspots: [
          { id: "srh6", label: "Acoustic Slatted Cedar", detail: "Micro-perforated western red cedar lining boards that soften room resonance.", x: 35, y: 38 },
          { id: "srh7", label: "Frameless Horizon Glazing", detail: "Structural low-iron glass panels spanning floor-to-ceiling.", x: 80, y: 50 },
        ],
      },
      {
        id: "sr-bath",
        name: "MONOLITHIC STONE SPA",
        subtitle: "SOAKING TUB & SKYLIGHT",
        floor: "FIRST FLOOR",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=2400&q=88",
        description: "Sculptural bath hollowed from solid granite slab facing a private cliffside moss garden.",
        hotspots: [
          { id: "srh8", label: "Granite Soaking Tub", detail: "Single block of polished dark granite with continuous concealed infinity overflow.", x: 50, y: 60 },
        ],
      },
    ],
  },
  {
    id: "atrium-villa",
    number: "03",
    title: "The Atrium Villa",
    subtitle: "Living spaces gathered around a central light well.",
    category: "residential",
    categoryLabel: "Residential",
    type: "Subtropical Villa",
    location: "Byron Hinterland, NSW",
    year: "2025",
    status: "Completed",
    area: "430 m²",
    siteArea: "3,100 m²",
    floors: "Single Level Sprawling",
    image:
      "https://images.unsplash.com/photo-1762811054947-605b20298615?auto=format&fit=crop&w=1800&q=85",
    leadArchitect: "Noufal",
    conceptStatement:
      "An expansive single-storey pavilion embracing subtropical breezes through perimeter verandahs.",
    narrative: [
      "Located in the rolling hills behind Byron Bay, The Atrium Villa reimagines the traditional Queenslander verandah through an austere modern lens.",
      "The layout allows rain, breeze, and dappled sunlight to penetrate the deep floorplate through a central oculus and internal garden filled with native rainforest species.",
      "Deep timber eaves protect interiors from intense midday sun while facilitating year-round outdoor living without requiring artificial climate control.",
    ],
    keyFeatures: [
      "Central circular oculus casting animated sunbeams across polished screed",
      "Operable timber louvers permitting continuous passive cross-ventilation",
      "Zero boundary between indoor terrazzo and outdoor reflecting pond",
      "Timber harvested exclusively from certified sustainable silviculture",
    ],
    specs: {
      builtArea: "430 m² (4,620 sq ft)",
      siteArea: "3,100 m²",
      structuralSystem:
        "Spotted Gum post-and-beam system on suspended concrete slab",
      primaryMaterials: [
        "Spotted Gum Hardwood",
        "Honed Terrazzo",
        "Raw Lime Render",
      ],
      sustainability:
        "100% off-grid power and water; biophilic indoor air purification",
      completionYear: "2025",
    },
    materials: [
      {
        name: "Spotted Gum",
        tag: "Timber",
        description:
          "Durable Australian hardwood with varied honey-amber tones",
        color: "#9c704a",
      },
      {
        name: "White Terrazzo",
        tag: "Floor",
        description:
          "River pebble aggregate polished to a soft low-sheen finish",
        color: "#e4ded4",
      },
      {
        name: "Lime Plaster",
        tag: "Walls",
        description:
          "Breathable natural mineral plaster with subtle tonal drift",
        color: "#f1ede6",
      },
    ],
    drawings: [
      {
        id: "av-01",
        title: "Plan Showing Breeze Corridors",
        type: "Ground Plan",
        image:
          "https://images.unsplash.com/photo-1721244654195-943615c56ac4?auto=format&fit=crop&w=1600&q=82",
        caption:
          "Cross-ventilation diagram mapping prevailing trade winds through the central court.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1762811054947-605b20298615?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85",
    ],
    walkthroughRooms: [
      {
        id: "av-oculus",
        name: "CIRCULAR OCULUS ATRIUM",
        subtitle: "ZENITH LIGHT & REFLECTION POOL",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=88",
        description: "A 4-meter diameter circular sky oculus bathing polished river-pebble terrazzo in animated sunbeams.",
        hotspots: [
          { id: "avh1", label: "Sky Oculus Ring", detail: "Knife-edge cast concrete aperture funneling celestial light and summer rainfall.", x: 50, y: 30 },
          { id: "avh2", label: "River Pebble Terrazzo", detail: "Ground and honed mineral screed cool underfoot in subtropical humidity.", x: 48, y: 75 },
        ],
      },
      {
        id: "av-verandah",
        name: "DEEP VERANDAH SALON",
        subtitle: "OPERABLE SPOTTED GUM LOUVERS",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1762811054947-605b20298615?auto=format&fit=crop&w=2400&q=88",
        description: "Continuous shaded perimeter breezeway capturing prevailing trade winds from the coastal hills.",
        hotspots: [
          { id: "avh3", label: "Spotted Gum Columns", detail: "Class 1 durability native hardwood posts with concealed stainless steel base shoes.", x: 25, y: 50 },
        ],
      },
      {
        id: "av-treehouse",
        name: "CANOPY SLEEPING PAVILION",
        subtitle: "ELEVATED RAINFOREST SUITE",
        floor: "FIRST FLOOR",
        image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=2400&q=88",
        description: "Upper level suite surrounded by native palm crowns and filtered morning light.",
        hotspots: [
          { id: "avh4", label: "Screened Timber Finishes", detail: "Insect-proof fine brass mesh behind operable hardwood ventilation shutters.", x: 75, y: 45 },
        ],
      },
    ],
  },
  {
    id: "urban-residence",
    number: "04",
    title: "The Urban Residence",
    subtitle: "A compact sanctuary within the dense city grain.",
    category: "residential",
    categoryLabel: "Residential",
    type: "Urban Townhouse & Gallery",
    location: "Fitzroy, Melbourne",
    year: "2024",
    status: "Completed",
    area: "340 m²",
    siteArea: "280 m²",
    floors: "3 Levels + Rooftop",
    image:
      "https://images.unsplash.com/photo-1553700477-0ff02310c76f?auto=format&fit=crop&w=1800&q=85",
    leadArchitect: "Noufal",
    conceptStatement:
      "A vertical sanctuary that carves daylight through three levels of off-form concrete and blackened steel.",
    narrative: [
      "Designed for a narrow inner-urban parcel in Fitzroy, The Urban Residence achieves spatial generosity through vertical volume and calibrated light cannons.",
      "An acoustic concrete envelope shields the private living spaces from street sounds, creating an oasis of quiet domesticity within the city grain.",
      "A suspended blackened steel staircase links the ground-level gallery living room with upper sleeping suites and a landscaped rooftop sanctuary.",
    ],
    keyFeatures: [
      "Acoustically isolated board-formed concrete perimeter walls",
      "Triple-height lightwell illuminating all three vertical levels",
      "Cantilevered steel and timber library mezzanine",
      "Rooftop entertaining deck overlooking the city skyline",
    ],
    specs: {
      builtArea: "340 m² (3,660 sq ft)",
      siteArea: "280 m²",
      structuralSystem:
        "Cast-in-place board-formed concrete with structural steel framing",
      primaryMaterials: [
        "Board-formed Concrete",
        "Blackened Steel",
        "Honed Terrazzo",
        "Smoked Oak",
      ],
      sustainability:
        "High-performance thermal envelope, rainwater harvesting, passive solar stack effect",
      completionYear: "2024",
    },
    materials: [
      {
        name: "Raw Concrete",
        tag: "Structure",
        description: "Off-form rough sawn timber board finish",
        color: "#a8a9a4",
      },
      {
        name: "Blackened Steel",
        tag: "Stairs",
        description: "Hot-rolled steel with natural mill scale wax finish",
        color: "#222320",
      },
      {
        name: "Smoked Oak",
        tag: "Joinery",
        description: "Fumed European oak architectural millwork",
        color: "#45382b",
      },
    ],
    drawings: [
      {
        id: "ur-01",
        title: "Vertical Stack Section",
        type: "Section",
        image:
          "https://images.unsplash.com/photo-1603901622056-0a5bee231395?auto=format&fit=crop&w=1600&q=82",
        caption:
          "Section showing lightwell distribution across all three levels.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1553700477-0ff02310c76f?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=85",
    ],
    walkthroughRooms: [
      {
        id: "ur-living",
        name: "GALLERY LIVING SPACE",
        subtitle: "DOUBLE-HEIGHT CONCRETE VOLUME",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2400&q=88",
        description: "Double-height living pavilion with off-form board-marked concrete walls and polished aggregate floor.",
        hotspots: [
          { id: "urh1", label: "Board-Marked Concrete", detail: "Rough-sawn Oregon timber board imprint on exposed internal load-bearing walls.", x: 28, y: 44 },
          { id: "urh2", label: "Blackened Steel Stringer", detail: "Laser-cut 12mm structural steel plate staircase leading to mezzanine library.", x: 78, y: 52 },
        ],
      },
      {
        id: "ur-dining",
        name: "KITCHEN & COURTYARD ALCOVE",
        subtitle: "SMOKED OAK & STAINLESS STEEL",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1553700477-0ff02310c76f?auto=format&fit=crop&w=2400&q=88",
        description: "Linear kitchen island connecting directly to an acoustic landscaped lightwell courtyard.",
        hotspots: [
          { id: "urh3", label: "Smoked Oak Joinery", detail: "Fumed European oak cabinets with integrated push-latches and concealed appliances.", x: 40, y: 62 },
        ],
      },
      {
        id: "ur-mezzanine",
        name: "SUSPENDED MEZZANINE LIBRARY",
        subtitle: "CANTILEVERED STEEL BRIDGE",
        floor: "FIRST FLOOR",
        image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=2400&q=88",
        description: "Quiet reading bridge hovering over the gallery living space with framed skyline views.",
        hotspots: [
          { id: "urh4", label: "Acoustic Slat Ceiling", detail: "Micro-perforated acoustic timber battens dampening urban resonance.", x: 50, y: 25 },
        ],
      },
    ],
  },
  {
    id: "garden-house",
    number: "05",
    title: "The Garden House",
    subtitle: "Rooms dissolve into a cultivated landscape.",
    category: "residential",
    categoryLabel: "Residential",
    type: "Landscape Residence",
    location: "Yarra Valley Foothills",
    year: "2024",
    status: "Completed",
    area: "410 m²",
    siteArea: "3,800 m²",
    floors: "Single Level Cascading",
    image:
      "https://images.unsplash.com/photo-1630756487896-264697a38f2a?auto=format&fit=crop&w=1600&q=85",
    leadArchitect: "Noufal",
    conceptStatement:
      "A series of low-slung timber pavilions framing garden courtyards and native flora.",
    narrative: [
      "Set within productive orchards in the Yarra Valley, The Garden House is organized as an archipelago of glazed pavilions linked by covered breezeways.",
      "Oversized sliding glass panels retract into concealed pocket walls, allowing interior living rooms to merge seamlessly with outdoor stone terraces and water gardens.",
      "The architecture celebrates seasonal changes in daylight, shadow, and foliage, grounding its inhabitants in the natural cycles of the valley.",
    ],
    keyFeatures: [
      "Pocketing glass sliding panels creating unobstructed 12m garden openings",
      "Sustainably harvested spotted gum post-and-beam frame",
      "Integrated rainwater retention ponds providing microclimatic cooling",
      "Radiant heated limestone slab flooring",
    ],
    specs: {
      builtArea: "410 m² (4,410 sq ft)",
      siteArea: "3,800 m²",
      structuralSystem:
        "Engineered timber glulam frame on suspended concrete foundation",
      primaryMaterials: [
        "Spotted Gum Glulam",
        "Honed Travertine",
        "Low-iron Glazing",
      ],
      sustainability:
        "100% off-grid solar with Tesla Powerwall battery bank and orchard greywater recycling",
      completionYear: "2024",
    },
    materials: [
      {
        name: "Glulam Timber",
        tag: "Structure",
        description: "Locally sourced architectural eucalyptus glulam",
        color: "#a88158",
      },
      {
        name: "Travertine",
        tag: "Floors",
        description: "Warm unfilled cross-cut travertine slabs",
        color: "#dfd6c5",
      },
    ],
    drawings: [
      {
        id: "gh-01",
        title: "Landscape Integration Plan",
        type: "Ground Plan",
        image:
          "https://images.unsplash.com/photo-1721244654195-943615c56ac4?auto=format&fit=crop&w=1600&q=82",
        caption:
          "Site plan mapping pavilion arrangement around central orchard courtyard.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1630756487896-264697a38f2a?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1800&q=85",
    ],
    walkthroughRooms: [
      {
        id: "gh-lounge",
        name: "PERGOLA LIVING SALON",
        subtitle: "RETRACTABLE GLASS WALLS",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=2400&q=88",
        description: "Living space opening directly into lush garden surroundings via 12-meter pocketing glass doors.",
        hotspots: [
          { id: "ghh1", label: "Spotted Gum Glulam Beams", detail: "Exposed roof rafters forming a rhythmic timber pergola.", x: 45, y: 28 },
          { id: "ghh2", label: "Unfilled Travertine", detail: "Cross-cut porous travertine pavers with natural textural grip.", x: 55, y: 72 },
        ],
      },
      {
        id: "gh-court",
        name: "ORCHARD CLOISTER",
        subtitle: "WATER BASIN & GRAPE ARBOR",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1630756487896-264697a38f2a?auto=format&fit=crop&w=2400&q=88",
        description: "Intimate central courtyard linking guest and primary living wings.",
        hotspots: [
          { id: "ghh3", label: "Basalt Rill Pool", detail: "Narrow linear water rill trickling through the orchard floor.", x: 50, y: 65 },
        ],
      },
      {
        id: "gh-canopy",
        name: "UPPER MEADOW SUITE",
        subtitle: "CANTILEVERED TIMBER SLEEPER",
        floor: "FIRST FLOOR",
        image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=2400&q=88",
        description: "Upper level bedroom suite hovering above the orchard tree crowns.",
        hotspots: [
          { id: "ghh4", label: "Framed Valley View", detail: "Low-iron double glazing framing the Yarra Ranges at sunrise.", x: 75, y: 40 },
        ],
      },
    ],
  },
  {
    id: "hillside-retreat",
    number: "06",
    title: "The Hillside Retreat",
    subtitle: "Split levels trace the natural fall of the land.",
    category: "residential",
    categoryLabel: "Residential",
    type: "Stepped Hillside Villa",
    location: "Great Ocean Road",
    year: "2024",
    status: "Completed",
    area: "480 m²",
    siteArea: "2,900 m²",
    floors: "3 Cascading Tiers",
    image:
      "https://images.unsplash.com/photo-1751346874267-ace7c47ba9b5?auto=format&fit=crop&w=1600&q=85",
    leadArchitect: "Noufal",
    conceptStatement:
      "A stepped architectural intervention anchored into steep coastal topography.",
    narrative: [
      "Tracing a 35-degree coastal hillside, this residence steps down the slope in three discrete terraced volumes, minimizing cut and fill excavation.",
      "Each tier offers a distinct experiential condition: the lower floor is nestled into the cool earth, the middle tier opens to sea views, and the upper level hovers within the forest canopy.",
      "Massive board-marked concrete buttresses provide lateral stabilization against seismic and wind loads while anchoring cantilevered viewing decks.",
    ],
    keyFeatures: [
      "Stepped three-level floorplate honoring existing topography",
      "Cantilevered timber viewing platforms extending into eucalyptus canopy",
      "Earth-sheltered lower bedroom suites with passive geothermal cooling",
      "Integrated inclined funicular access",
    ],
    specs: {
      builtArea: "480 m² (5,160 sq ft)",
      siteArea: "2,900 m²",
      structuralSystem:
        "Reinforced concrete buttress walls with steel cantilever trusses",
      primaryMaterials: [
        "Board-marked Concrete",
        "Charred Ironbark",
        "Stainless Steel Mesh",
      ],
      sustainability:
        "Extreme fire-rated BAL-FZ construction with dedicated bushfire bunker and spray zone",
      completionYear: "2024",
    },
    materials: [
      {
        name: "Charred Ironbark",
        tag: "Cladding",
        description: "Class 1 fire-resistant charred native timber",
        color: "#2d2c29",
      },
      {
        name: "Board Concrete",
        tag: "Walls",
        description: "Rough sawn formwork imprint with mineral sealer",
        color: "#92938e",
      },
    ],
    drawings: [
      {
        id: "hr-01",
        title: "Stepped Slope Section",
        type: "Section",
        image:
          "https://images.unsplash.com/photo-1603901622056-0a5bee231395?auto=format&fit=crop&w=1600&q=82",
        caption:
          "Sectional study showing cascading tiers following the natural slope.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1751346874267-ace7c47ba9b5?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1800&q=85",
    ],
    walkthroughRooms: [
      {
        id: "hr-earth",
        name: "EARTH-SHELTERED HEARTH",
        subtitle: "MASSIVE CONCRETE BUTTRESS",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1751346874267-ace7c47ba9b5?auto=format&fit=crop&w=2400&q=88",
        description: "Lower tier living retreat nestled into the hillside bedrock with passive geothermal stability.",
        hotspots: [
          { id: "hrh1", label: "Board Concrete Buttress", detail: "Structural shear wall anchoring the house against 100km/h coastal gales.", x: 30, y: 50 },
        ],
      },
      {
        id: "hr-canopy",
        name: "CANOPY OBSERVATION LOUNGE",
        subtitle: "FOREST CANTILEVER DECK",
        floor: "FIRST FLOOR",
        image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2400&q=88",
        description: "Viewing lounge hovering out into the coastal eucalyptus canopy overlooking the Southern Ocean.",
        hotspots: [
          { id: "hrh2", label: "Charred Ironbark Deck", detail: "Class 1 fire-rated Australian hardwood with flush stainless fixings.", x: 55, y: 68 },
        ],
      },
    ],
  },
  {
    id: "light-house",
    number: "07",
    title: "The Light House",
    subtitle: "A study in daylight, shadow, and spatial continuity.",
    category: "residential",
    categoryLabel: "Residential",
    type: "Coastal Light Pavilion",
    location: "Sorrento Coastline",
    year: "2025",
    status: "Completed",
    area: "390 m²",
    siteArea: "1,650 m²",
    floors: "2 Levels Interlocking",
    image:
      "https://images.unsplash.com/photo-1629774631755-0a7faf26a3f9?auto=format&fit=crop&w=1800&q=85",
    leadArchitect: "Noufal",
    conceptStatement:
      "An optical instrument of white limestone and light wells that sculpt natural sunlight across the day.",
    narrative: [
      "The Light House was conceived as an architectural solar dial. Precise geometric apertures capture low winter sun while deflecting harsh summer glare.",
      "White honed limestone walls and bleached timber floors bounce diffuse natural light into every corner of the deep floorplate, eliminating the need for daytime electric lighting.",
      "At night, subtle warm architectural uplighting transforms the residence into a soft sculptural beacon on the Sorrento sand dunes.",
    ],
    keyFeatures: [
      "Sculptural light wells creating animated shadow patterns throughout the day",
      "Zero-threshold sliding glazed walls facing the ocean dunes",
      "Honed white limestone and bleached oak materiality",
      "Passive ventilation stack effect venting warm air through clerestory windows",
    ],
    specs: {
      builtArea: "390 m² (4,200 sq ft)",
      siteArea: "1,650 m²",
      structuralSystem:
        "Load-bearing limestone masonry with lightweight steel roof canopy",
      primaryMaterials: [
        "Honed White Limestone",
        "Bleached White Oak",
        "Low-iron Solar Glass",
      ],
      sustainability:
        "9.4-star thermal rating; net-positive solar generation with 18kW array",
      completionYear: "2025",
    },
    materials: [
      {
        name: "White Limestone",
        tag: "Masonry",
        description: "Fine-grained honed limestone with soft fossil veining",
        color: "#ece7dc",
      },
      {
        name: "Bleached Oak",
        tag: "Floors",
        description: "Lye-treated European oak with matte natural soap finish",
        color: "#d5cbba",
      },
    ],
    drawings: [
      {
        id: "lh-01",
        title: "Daylighting & Solar Angle Plan",
        type: "Ground Plan",
        image:
          "https://images.unsplash.com/photo-1721244654195-943615c56ac4?auto=format&fit=crop&w=1600&q=82",
        caption:
          "Solar angle diagrams showing daylight ingress across solstices.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1629774631755-0a7faf26a3f9?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1800&q=85",
    ],
    walkthroughRooms: [
      {
        id: "lh-atrium",
        name: "SOLAR ATRIUM LIVING",
        subtitle: "DOUBLE-HEIGHT LIGHT CANNON",
        floor: "GROUND FLOOR",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=88",
        description: "Central living space illuminated by calibrated high clerestory lightwells sculpting solar shadows.",
        hotspots: [
          { id: "lhh1", label: "Honed White Limestone", detail: "Velvety white stone reflecting diffuse ambient light without glare.", x: 35, y: 55 },
          { id: "lhh2", label: "Solar Light Cannon", detail: "South-angled aperture admitting pure northern daylight deep into the ground plane.", x: 65, y: 25 },
        ],
      },
      {
        id: "lh-dunes",
        name: "HORIZON DUNE SUITE",
        subtitle: "CANTILEVERED OCEAN DECK",
        floor: "FIRST FLOOR",
        image: "https://images.unsplash.com/photo-1629774631755-0a7faf26a3f9?auto=format&fit=crop&w=2400&q=88",
        description: "Upper level master sanctuary looking out over the sand dunes and coastal tea-tree canopy.",
        hotspots: [
          { id: "lhh3", label: "Bleached Oak Flooring", detail: "Lye-treated wide European oak planks echoing beach sand tones.", x: 45, y: 72 },
        ],
      },
    ],
  },
]
