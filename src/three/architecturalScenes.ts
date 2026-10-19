import * as THREE from "three"
import {
  createArchitecturalMaterials,
  type ArchitecturalMaterials,
} from "./materials"
import { FurnitureFactory } from "./furnitureFactory"

export type Waypoint = {
  id: string
  title: string
  subtitle: string
  description: string
  position: [number, number, number]
  lookAt: [number, number, number]
}

export type FloorDefinition = {
  id: string
  name: string
  level: number
  elevationAssembled: number
  elevationExploded: number
  waypoints: Waypoint[]
  buildMeshGroup: (
    materials: ArchitecturalMaterials,
    factory: FurnitureFactory,
  ) => THREE.Group
}

export type Project3DConfig = {
  id: string
  title: string
  theme: "warm-limestone" | "dark-basalt" | "coastal-cedar" | "urban-concrete"
  floors: FloorDefinition[]
  createRoof: (materials: ArchitecturalMaterials) => THREE.Group
  createSiteBase: (materials: ArchitecturalMaterials) => THREE.Group
}

/**
 * Helper to build an architectural wall segment with shadow properties
 */
function createWall(
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  mat: THREE.Material,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  mesh.position.set(x, y + h / 2, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

/**
 * PROJECT 01: THE COURTYARD HOUSE
 * Ground floor with Inward Courtyard, Living Pavilion, Kitchen, Dining, and Powder Room.
 * First floor with Master Suite, Wardrobe, Terrace, and Ensuite.
 */
function createCourtyardHouseGround(
  materials: ArchitecturalMaterials,
  factory: FurnitureFactory,
): THREE.Group {
  const floorGroup = new THREE.Group()

  // Floor Slab (14m x 12m)
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(14, 0.2, 12),
    materials.floor,
  )
  slab.position.set(0, -0.1, 0)
  slab.receiveShadow = true
  floorGroup.add(slab)

  // Exterior Perimeter Walls (Height = 3.0m, leaving front doorway open at [0, 0, 6])
  const wallMat = materials.wall
  const H = 3.0

  // North wall (back)
  floorGroup.add(createWall(14, H, 0.3, 0, 0, -6, wallMat))
  // West wall (left)
  floorGroup.add(createWall(0.3, H, 12, -7, 0, 0, wallMat))
  // East wall (right)
  floorGroup.add(createWall(0.3, H, 12, 7, 0, 0, wallMat))
  // South wall left segment (leaving 1.6m open doorway at center x=0)
  floorGroup.add(createWall(6.0, H, 0.3, -3.9, 0, 6, wallMat))
  // South wall right segment
  floorGroup.add(createWall(6.0, H, 0.3, 3.9, 0, 6, wallMat))
  // Door lintel above the entrance doorway (from y=2.4 to 3.0)
  const lintel = createWall(1.8, 0.6, 0.3, 0, 2.4, 6, wallMat)
  floorGroup.add(lintel)

  // Central Courtyard Glass Enclosure (4m x 4m at center)
  const glassMat = materials.glass
  const cZ = 0
  // Glass walls around courtyard
  floorGroup.add(createWall(4, H, 0.08, 0, 0, -2, glassMat))
  floorGroup.add(createWall(4, H, 0.08, 0, 0, 2, glassMat))
  floorGroup.add(createWall(0.08, H, 4, -2, 0, 0, glassMat))
  floorGroup.add(createWall(0.08, H, 4, 2, 0, 0, glassMat))

  // Courtyard Japanese Maple / Olive tree + water reflection basin
  const waterPool = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.05, 2.6),
    materials.water,
  )
  waterPool.position.set(0, 0.02, 0)
  floorGroup.add(waterPool)

  const courtyardPlant = factory.createPlant()
  courtyardPlant.position.set(0, 0, 0)
  floorGroup.add(courtyardPlant)

  // WEST WING: Living Pavilion, TV Lounge & Fireplace
  const sofa = factory.createSofa()
  sofa.position.set(-4.5, 0, 0.8)
  floorGroup.add(sofa)

  const coffeeTable = factory.createCoffeeTable()
  coffeeTable.position.set(-4.5, 0, 2.3)
  floorGroup.add(coffeeTable)

  const rug = factory.createRug(3.4, 2.4)
  rug.position.set(-4.5, 0.01, 1.8)
  floorGroup.add(rug)

  const tvConsole = factory.createTvConsole()
  tvConsole.position.set(-4.5, 0, 4.8)
  floorGroup.add(tvConsole)

  const livingPlant = factory.createPlant()
  livingPlant.position.set(-6.2, 0, 4.8)
  floorGroup.add(livingPlant)

  // Monolithic Stone Fireplace on west perimeter wall
  const fireplace = factory.createFireplace()
  fireplace.position.set(-6.75, 0, 0.8)
  fireplace.rotation.y = Math.PI / 2
  floorGroup.add(fireplace)

  // Minimalist Wall Artwork in Living Room
  const livingArt = factory.createArtwork(2.2, 1.3)
  livingArt.position.set(-4.5, 2.0, 5.82)
  livingArt.rotation.y = Math.PI
  floorGroup.add(livingArt)

  // SOUTH: Entrance Foyer Console & Runner Rug
  const consoleTable = factory.createConsoleTable()
  consoleTable.position.set(2.4, 0, 5.4)
  floorGroup.add(consoleTable)

  const entryRunner = factory.createRug(1.2, 3.2)
  entryRunner.position.set(0, 0.01, 4.2)
  floorGroup.add(entryRunner)

  // NORTH-WEST: Dining Area & Feature Artwork
  const dining = factory.createDiningSet()
  dining.position.set(-4.5, 0, -3.8)
  floorGroup.add(dining)

  const diningArt = factory.createArtwork(2.4, 1.4)
  diningArt.position.set(-4.5, 1.8, -5.82)
  floorGroup.add(diningArt)

  // EAST WING: Gourmet Kitchen & Island with Barstools
  const kitchen = factory.createKitchen()
  kitchen.position.set(4.5, 0, -2.5)
  floorGroup.add(kitchen)

  ;[-0.6, 0, 0.6].forEach((bx) => {
    const stool = factory.createBarstool()
    stool.position.set(4.5 + bx, 0, -1.8)
    floorGroup.add(stool)
  })

  // Partition wall separating kitchen and powder room with doorway
  floorGroup.add(createWall(3.5, H, 0.2, 5.0, 0, 1.5, wallMat))

  // SOUTH-EAST: Guest / Powder Bathroom
  const bath = factory.createBathroom()
  bath.position.set(4.8, 0, 3.8)
  floorGroup.add(bath)

  return floorGroup
}

function createCourtyardHouseFirst(
  materials: ArchitecturalMaterials,
  factory: FurnitureFactory,
): THREE.Group {
  const floorGroup = new THREE.Group()

  // Floor Slab (14m x 10m)
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(14, 0.2, 10),
    materials.floor,
  )
  slab.position.set(0, -0.1, -1)
  slab.receiveShadow = true
  floorGroup.add(slab)

  const wallMat = materials.wall
  const H = 2.8

  // Exterior Perimeter
  floorGroup.add(createWall(14, H, 0.3, 0, 0, -6, wallMat))
  floorGroup.add(createWall(0.3, H, 10, -7, 0, -1, wallMat))
  floorGroup.add(createWall(0.3, H, 10, 7, 0, -1, wallMat))
  // South exterior wall with terrace opening
  floorGroup.add(createWall(8, H, 0.3, -3, 0, 4, wallMat))
  floorGroup.add(createWall(2, H, 0.3, 6, 0, 4, wallMat))

  // Central corridor dividing master suite from guest suites
  floorGroup.add(createWall(0.2, H, 6, 0, 0, -2, wallMat))

  // MASTER BEDROOM SUITE (West wing)
  const bed = factory.createBed()
  bed.position.set(-4.2, 0, -3.5)
  floorGroup.add(bed)

  const bedRug = factory.createRug(3.0, 2.6)
  bedRug.position.set(-4.2, 0.01, -3.2)
  floorGroup.add(bedRug)

  const bedArt = factory.createArtwork(2.0, 1.0)
  bedArt.position.set(-4.2, 1.8, -5.82)
  floorGroup.add(bedArt)

  const wardrobe = factory.createWardrobe(2.8, 2.6)
  wardrobe.position.set(-4.2, 0, 1.5)
  floorGroup.add(wardrobe)

  // Ensuite Bathroom
  const ensuite = factory.createBathroom()
  ensuite.position.set(-5.5, 0, -1.0)
  ensuite.rotation.y = Math.PI / 2
  floorGroup.add(ensuite)

  // Outdoor viewing terrace glass railing & seating
  const terraceRail = new THREE.Mesh(
    new THREE.BoxGeometry(4.0, 1.1, 0.05),
    materials.glass,
  )
  terraceRail.position.set(3, 0.55, 4)
  floorGroup.add(terraceRail)

  const terraceChair = factory.createChair()
  terraceChair.position.set(2.5, 0, 2.8)
  floorGroup.add(terraceChair)

  const terracePlant = factory.createPlant()
  terracePlant.position.set(4.5, 0, 3.5)
  floorGroup.add(terracePlant)

  return floorGroup
}

/**
 * 7 INDEPENDENT ARCHITECTURAL PROJECT CONFIGURATIONS
 */
export const architecturalProjects3D: Project3DConfig[] = [
  // 01: The Courtyard House
  {
    id: "courtyard-house",
    title: "The Courtyard House",
    theme: "warm-limestone",
    floors: [
      {
        id: "ground",
        name: "GROUND FLOOR",
        level: 0,
        elevationAssembled: 0,
        elevationExploded: 0,
        waypoints: [
          {
            id: "entry",
            title: "01 / ENTRANCE THRESHOLD",
            subtitle: "GROUND FLOOR • AXIAL ENTRY",
            description:
              "Step across the limestone threshold into the framed view of the central garden cloister.",
            position: [0, 1.6, 5.5],
            lookAt: [0, 1.5, 0],
          },
          {
            id: "courtyard",
            title: "02 / CENTRAL CLOISTER",
            subtitle: "SUNKEN RAINWATER POOL",
            description:
              "The interior circulation pivots around a quiet microclimate atrium open to coastal daylight.",
            position: [-1.2, 1.6, 2.2],
            lookAt: [0, 1.2, 0],
          },
          {
            id: "living",
            title: "03 / LIVING PAVILION",
            subtitle: "RECESSED LOUNGE & FIREPLACE",
            description:
              "Modular seating arranged around monolithic stone joinery with framed courtyard reflections.",
            position: [-4.2, 1.6, 1.8],
            lookAt: [-4.5, 1.4, 4.5],
          },
          {
            id: "dining",
            title: "04 / FORMAL DINING SUITE",
            subtitle: "SOLID TIMBER TRESTLE",
            description:
              "Six-seat cantilevered dining area anchored beneath sculptural brass pendant lighting.",
            position: [-4.2, 1.6, -1.8],
            lookAt: [-4.5, 1.3, -3.8],
          },
          {
            id: "kitchen",
            title: "05 / MINIMALIST KITCHEN",
            subtitle: "QUARTZ ISLAND & CONCEALED CABINETRY",
            description:
              "Waterfall quartz counter with undermount sink, induction cooktop, and integrated refrigeration.",
            position: [2.2, 1.6, -2.5],
            lookAt: [4.5, 1.4, -2.5],
          },
          {
            id: "powder",
            title: "06 / POWDER ROOM & RETREAT",
            subtitle: "FLOATING STONE VANITY",
            description:
              "Tactile travertine surfaces paired with frameless illuminated glass mirrors.",
            position: [3.8, 1.6, 2.5],
            lookAt: [4.8, 1.4, 3.8],
          },
        ],
        buildMeshGroup: createCourtyardHouseGround,
      },
      {
        id: "first",
        name: "FIRST FLOOR",
        level: 1,
        elevationAssembled: 3.2,
        elevationExploded: 4.8,
        waypoints: [
          {
            id: "f1-hall",
            title: "01 / MEZZANINE LANDING",
            subtitle: "FIRST FLOOR • OBSERVATION GALLERY",
            description:
              "Upper walkway overlooking the double-height void and courtyard canopy.",
            position: [0, 4.8, 2.0],
            lookAt: [-3.5, 4.5, -2.0],
          },
          {
            id: "f1-master",
            title: "02 / MASTER BEDROOM SUITE",
            subtitle: "PLATFORM BED & OAK JOINERY",
            description:
              "Quiet sleeping sanctuary with integrated bedside nightstands and floor-to-ceiling wardrobe.",
            position: [-3.0, 4.8, -1.5],
            lookAt: [-4.2, 4.5, -3.5],
          },
          {
            id: "f1-ensuite",
            title: "03 / ENSUITE SPA BATHROOM",
            subtitle: "FRAMELESS SHOWER ENCLOSURE",
            description:
              "Private ensuite illuminated by high clerestory slots and finished in honed mineral plaster.",
            position: [-4.0, 4.8, -0.5],
            lookAt: [-5.5, 4.5, -1.0],
          },
          {
            id: "f1-terrace",
            title: "04 / CANTILEVERED TERRACE",
            subtitle: "COASTAL OBSERVATION DECK",
            description:
              "Seamless transition to an outdoor terrace framing panoramic horizon vistas.",
            position: [2.5, 4.8, 2.5],
            lookAt: [3.0, 4.6, 4.5],
          },
        ],
        buildMeshGroup: createCourtyardHouseFirst,
      },
    ],
    createRoof: (materials) => {
      const roof = new THREE.Group()
      // Cantilevered Roof Slab with central oculus cutout
      const slabL = createWall(5.0, 0.25, 12, -4.5, 0, 0, materials.ceiling)
      const slabR = createWall(5.0, 0.25, 12, 4.5, 0, 0, materials.ceiling)
      const slabF = createWall(4.0, 0.25, 4.0, 0, 0, 4.0, materials.ceiling)
      const slabB = createWall(4.0, 0.25, 4.0, 0, 0, -4.0, materials.ceiling)
      roof.add(slabL, slabR, slabF, slabB)
      return roof
    },
    createSiteBase: (materials) => {
      const base = new THREE.Group()
      const podium = new THREE.Mesh(
        new THREE.BoxGeometry(22, 0.4, 20),
        materials.wallAccent,
      )
      podium.position.set(0, -0.3, 0)
      podium.receiveShadow = true
      base.add(podium)
      return base
    },
  },

  // 02: The Stone Residence
  {
    id: "stone-residence",
    title: "The Stone Residence",
    theme: "dark-basalt",
    floors: [
      {
        id: "ground",
        name: "GROUND FLOOR",
        level: 0,
        elevationAssembled: 0,
        elevationExploded: 0,
        waypoints: [
          {
            id: "sr-entry",
            title: "01 / CLIFFSIDE ENTRY",
            subtitle: "GROUND FLOOR • HEAVY STONE PORTAL",
            description:
              "Chiseled basalt walls shelter the threshold from offshore oceanic winds.",
            position: [0, 1.6, 5.5],
            lookAt: [-3.5, 1.5, 1.0],
          },
          {
            id: "sr-hearth",
            title: "02 / SUNKEN HEARTH LOUNGE",
            subtitle: "MONOLITHIC BASALT FIREPLACE",
            description:
              "Deep leather seating gathered around an off-form stone hearth overlooking Bass Strait.",
            position: [-4.0, 1.6, 1.5],
            lookAt: [-4.5, 1.4, 4.5],
          },
          {
            id: "sr-kitchen",
            title: "03 / CATERING KITCHEN & CELLAR",
            subtitle: "DARK QUARTZ & SMOKED OAK",
            description:
              "Architectural culinary block seamlessly integrated into the rear bedrock face.",
            position: [3.5, 1.6, -2.0],
            lookAt: [4.5, 1.4, -2.5],
          },
        ],
        buildMeshGroup: createCourtyardHouseGround,
      },
      {
        id: "first",
        name: "FIRST FLOOR",
        level: 1,
        elevationAssembled: 3.2,
        elevationExploded: 4.8,
        waypoints: [
          {
            id: "sr-suite",
            title: "01 / CLIFF MASTER SUITE",
            subtitle: "CANTILEVERED HORIZON VIEW",
            description:
              "Full-width low-iron glazing capturing crashing waves against the headland.",
            position: [-3.5, 4.8, -1.0],
            lookAt: [-4.0, 4.6, 3.5],
          },
        ],
        buildMeshGroup: createCourtyardHouseFirst,
      },
    ],
    createRoof: (materials) => {
      const roof = new THREE.Group()
      roof.add(createWall(15, 0.3, 13, 0, 0, 0, materials.darkWood))
      return roof
    },
    createSiteBase: (materials) => {
      const base = new THREE.Group()
      base.add(createWall(24, 0.6, 22, 0, -0.6, 0, materials.wallAccent))
      return base
    },
  },

  // 03: The Atrium Villa
  {
    id: "atrium-villa",
    title: "The Atrium Villa",
    theme: "coastal-cedar",
    floors: [
      {
        id: "ground",
        name: "GROUND FLOOR",
        level: 0,
        elevationAssembled: 0,
        elevationExploded: 0,
        waypoints: [
          {
            id: "av-oculus",
            title: "01 / OCULUS FOYER",
            subtitle: "CIRCULAR SKYLIGHT ENTRANCE",
            description:
              "Rain and dappled sunlight filter into a polished white terrazzo floorplate.",
            position: [0, 1.6, 5.2],
            lookAt: [0, 1.5, 0],
          },
          {
            id: "av-living",
            title: "02 / SUBTROPICAL LIVING SALON",
            subtitle: "LOUVERED BREEZE CORRIDOR",
            description:
              "Deep timber eaves and continuous cross-ventilation replace artificial climate controls.",
            position: [-4.2, 1.6, 1.5],
            lookAt: [-4.5, 1.4, 4.2],
          },
          {
            id: "av-dining",
            title: "03 / VERANDAH DINING",
            subtitle: "HONEY TIMBER & TECTONIC JOINERY",
            description:
              "Dining space dissolving directly onto reflective landscape ponds.",
            position: [3.8, 1.6, -1.5],
            lookAt: [4.5, 1.4, -2.5],
          },
        ],
        buildMeshGroup: createCourtyardHouseGround,
      },
    ],
    createRoof: (materials) => {
      const roof = new THREE.Group()
      roof.add(createWall(16, 0.25, 14, 0, 0, 0, materials.wood))
      return roof
    },
    createSiteBase: (materials) => {
      const base = new THREE.Group()
      base.add(createWall(22, 0.3, 20, 0, -0.3, 0, materials.floor))
      return base
    },
  },

  // 04: The Urban Residence
  {
    id: "urban-residence",
    title: "The Urban Residence",
    theme: "urban-concrete",
    floors: [
      {
        id: "ground",
        name: "GROUND FLOOR",
        level: 0,
        elevationAssembled: 0,
        elevationExploded: 0,
        waypoints: [
          {
            id: "ur-entry",
            title: "01 / URBAN THRESHOLD",
            subtitle: "ACOUSTIC CONCRETE ENVELOPE",
            description:
              "A compressed concrete portico isolates the interior from the bustling city grain.",
            position: [0, 1.6, 5.5],
            lookAt: [-3.8, 1.5, 1.5],
          },
          {
            id: "ur-lounge",
            title: "02 / DOUBLE-HEIGHT GALLERY LIVING",
            subtitle: "BOARD-FORMED ARCHITECTURE",
            description:
              "Dramatic 6-meter vertical volume flooded with soft northern daylight.",
            position: [-4.2, 1.6, 1.8],
            lookAt: [-4.5, 1.4, 4.8],
          },
        ],
        buildMeshGroup: createCourtyardHouseGround,
      },
      {
        id: "first",
        name: "FIRST FLOOR",
        level: 1,
        elevationAssembled: 3.2,
        elevationExploded: 4.8,
        waypoints: [
          {
            id: "ur-studio",
            title: "01 / MEZZANINE WORKSPACE & SUITE",
            subtitle: "SUSPENDED STEEL BRIDGE",
            description:
              "Quiet cantilevered study overlooking the living gallery below.",
            position: [-3.2, 4.8, -1.0],
            lookAt: [-4.2, 4.5, -3.5],
          },
        ],
        buildMeshGroup: createCourtyardHouseFirst,
      },
    ],
    createRoof: (materials) => {
      const roof = new THREE.Group()
      roof.add(createWall(14, 0.3, 12, 0, 0, 0, materials.wallAccent))
      return roof
    },
    createSiteBase: (materials) => {
      const base = new THREE.Group()
      base.add(createWall(20, 0.4, 18, 0, -0.4, 0, materials.wall))
      return base
    },
  },

  // 05: The Garden House
  {
    id: "garden-house",
    title: "The Garden House",
    theme: "warm-limestone",
    floors: [
      {
        id: "ground",
        name: "GROUND FLOOR",
        level: 0,
        elevationAssembled: 0,
        elevationExploded: 0,
        waypoints: [
          {
            id: "gh-path",
            title: "01 / BOTANICAL ENTRYWAY",
            subtitle: "GARDEN ENTRANCE",
            description:
              "Rooms dissolve into a cultivated landscape of native ferns and stone rills.",
            position: [0, 1.6, 5.5],
            lookAt: [0, 1.5, 0],
          },
          {
            id: "gh-living",
            title: "02 / PERGOLA LIVING SPACE",
            subtitle: "SLIDING TIMBER SCREENS",
            description:
              "Floor-to-ceiling glass sliding completely into pocket walls for total open-air living.",
            position: [-4.2, 1.6, 1.8],
            lookAt: [-4.5, 1.4, 4.5],
          },
        ],
        buildMeshGroup: createCourtyardHouseGround,
      },
    ],
    createRoof: (materials) => {
      const roof = new THREE.Group()
      roof.add(createWall(15, 0.2, 13, 0, 0, 0, materials.ceiling))
      return roof
    },
    createSiteBase: (materials) => {
      const base = new THREE.Group()
      base.add(createWall(22, 0.3, 20, 0, -0.3, 0, materials.wallAccent))
      return base
    },
  },

  // 06: The Hillside Retreat
  {
    id: "hillside-retreat",
    title: "The Hillside Retreat",
    theme: "coastal-cedar",
    floors: [
      {
        id: "ground",
        name: "GROUND FLOOR",
        level: 0,
        elevationAssembled: 0,
        elevationExploded: 0,
        waypoints: [
          {
            id: "hr-tier1",
            title: "01 / LOWER HILLSIDE SALON",
            subtitle: "STEPPED ROCK FOUNDATION",
            description:
              "Split-level living spaces stepping down the natural slope of the ridge.",
            position: [0, 1.6, 5.5],
            lookAt: [-4.0, 1.4, 1.5],
          },
        ],
        buildMeshGroup: createCourtyardHouseGround,
      },
      {
        id: "first",
        name: "FIRST FLOOR",
        level: 1,
        elevationAssembled: 3.2,
        elevationExploded: 4.8,
        waypoints: [
          {
            id: "hr-tier2",
            title: "01 / RIDGEVIEW BEDROOM SUITE",
            subtitle: "ELEVATED CANOPY VISTA",
            description:
              "Hovering high above the ground on slender concrete pilotis.",
            position: [-3.5, 4.8, -1.0],
            lookAt: [-4.0, 4.5, -3.5],
          },
        ],
        buildMeshGroup: createCourtyardHouseFirst,
      },
    ],
    createRoof: (materials) => {
      const roof = new THREE.Group()
      roof.add(createWall(15, 0.25, 13, 0, 0, 0, materials.wood))
      return roof
    },
    createSiteBase: (materials) => {
      const base = new THREE.Group()
      base.add(createWall(22, 0.5, 20, 0, -0.5, 0, materials.wallAccent))
      return base
    },
  },

  // 07: The Light House
  {
    id: "light-house",
    title: "The Light House",
    theme: "warm-limestone",
    floors: [
      {
        id: "ground",
        name: "GROUND FLOOR",
        level: 0,
        elevationAssembled: 0,
        elevationExploded: 0,
        waypoints: [
          {
            id: "lh-lightwell",
            title: "01 / LIGHTWELL FOYER",
            subtitle: "STUDY IN LIGHT & SHADOW",
            description:
              "High-angle skylights casting geometric patterns across monolithic limestone walls.",
            position: [0, 1.6, 5.5],
            lookAt: [0, 1.5, 0],
          },
          {
            id: "lh-hall",
            title: "02 / CONTINUOUS LIVING GALLERY",
            subtitle: "CLERESTORY DAYLIGHTING",
            description:
              "Every room receives natural illumination from dual opposing aspects.",
            position: [-4.2, 1.6, 1.8],
            lookAt: [-4.5, 1.4, 4.5],
          },
        ],
        buildMeshGroup: createCourtyardHouseGround,
      },
    ],
    createRoof: (materials) => {
      const roof = new THREE.Group()
      roof.add(createWall(15, 0.25, 13, 0, 0, 0, materials.ceiling))
      return roof
    },
    createSiteBase: (materials) => {
      const base = new THREE.Group()
      base.add(createWall(22, 0.3, 20, 0, -0.3, 0, materials.floor))
      return base
    },
  },
]

export function getProject3DConfig(projectId: string): Project3DConfig {
  const found = architecturalProjects3D.find((p) => p.id === projectId)
  return found || architecturalProjects3D[0]
}
