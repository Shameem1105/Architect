import * as THREE from "three"
import type { ArchitecturalMaterials } from "./materials"

/**
 * Reusable Modular Architectural 3D Furniture & Appliance Factory
 * Produces clean, realistic, lightweight Three.js objects with shadows.
 */
export class FurnitureFactory {
  private materials: ArchitecturalMaterials

  constructor(materials: ArchitecturalMaterials) {
    this.materials = materials
  }

  private applyShadows(object: THREE.Object3D) {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return object
  }

  /**
   * Modern Modular L-Sectional Sofa with plinth, cushions and throw pillows
   */
  createSofa(): THREE.Group {
    const group = new THREE.Group()

    // Wood base plinth
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.12, 1.8),
      this.materials.darkWood,
    )
    plinth.position.set(0, 0.06, 0.4)
    group.add(plinth)

    // Main seat cushion
    const mainSeat = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.35, 0.9),
      this.materials.fabric,
    )
    mainSeat.position.set(-0.5, 0.28, 0)
    group.add(mainSeat)

    // Chaise lounge cushion (L-extension)
    const chaise = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.35, 1.7),
      this.materials.fabric,
    )
    chaise.position.set(1.0, 0.28, 0.4)
    group.add(chaise)

    // Backrest main
    const backrestMain = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 0.45, 0.22),
      this.materials.fabricDark,
    )
    backrestMain.position.set(0, 0.55, -0.45)
    group.add(backrestMain)

    // Left armrest
    const leftArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.4, 1.0),
      this.materials.fabricDark,
    )
    leftArm.position.set(-1.48, 0.42, 0)
    group.add(leftArm)

    // Throw pillows
    const pillow1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.45, 0.15),
      this.materials.fabric,
    )
    pillow1.position.set(-1.1, 0.55, -0.25)
    pillow1.rotation.y = 0.25
    group.add(pillow1)

    const pillow2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.45, 0.15),
      this.materials.leather,
    )
    pillow2.position.set(0.8, 0.55, -0.25)
    pillow2.rotation.y = -0.2
    group.add(pillow2)

    this.applyShadows(group)
    return group
  }

  /**
   * Minimalist Low Oak Coffee Table with books
   */
  createCoffeeTable(): THREE.Group {
    const group = new THREE.Group()

    // Table top
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.06, 0.7),
      this.materials.wood,
    )
    top.position.set(0, 0.32, 0)
    group.add(top)

    // Slender metal legs
    const legGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.32, 12)
    const legPositions = [
      [-0.58, 0.16, -0.28],
      [0.58, 0.16, -0.28],
      [-0.58, 0.16, 0.28],
      [0.58, 0.16, 0.28],
    ]
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, this.materials.metalBlack)
      leg.position.set(x, y, z)
      group.add(leg)
    })

    // Architecture monographs / magazine stack
    const book1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.02, 0.32),
      this.materials.fabricDark,
    )
    book1.position.set(-0.2, 0.36, 0.05)
    book1.rotation.y = 0.15
    group.add(book1)

    const book2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.02, 0.28),
      this.materials.quartz,
    )
    book2.position.set(-0.2, 0.38, 0.05)
    book2.rotation.y = 0.05
    group.add(book2)

    // Ceramic decorative bowl
    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.05, 0.06, 16),
      this.materials.quartz,
    )
    bowl.position.set(0.3, 0.37, -0.05)
    group.add(bowl)

    this.applyShadows(group)
    return group
  }

  /**
   * Wall-Mounted / Floor TV Media Console with ultra-thin OLED TV
   */
  createTvConsole(): THREE.Group {
    const group = new THREE.Group()

    // Media Credenza unit
    const consoleBox = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.4, 0.45),
      this.materials.darkWood,
    )
    consoleBox.position.set(0, 0.35, 0)
    group.add(consoleBox)

    // Subtle cabinet door division lines
    const line1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.01, 0.38, 0.46),
      this.materials.metalBlack,
    )
    line1.position.set(-0.4, 0.35, 0)
    group.add(line1)

    const line2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.01, 0.38, 0.46),
      this.materials.metalBlack,
    )
    line2.position.set(0.4, 0.35, 0)
    group.add(line2)

    // TV Screen Frame (65" display)
    const tvFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.88, 0.04),
      this.materials.metalBlack,
    )
    tvFrame.position.set(0, 1.25, -0.08)
    group.add(tvFrame)

    // TV Display Glass
    const tvScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.44, 0.82),
      this.materials.tvScreen,
    )
    tvScreen.position.set(0, 1.25, -0.055)
    group.add(tvScreen)

    // TV Soundbar
    const soundbar = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.06, 0.08),
      this.materials.fabricDark,
    )
    soundbar.position.set(0, 0.58, -0.02)
    group.add(soundbar)

    this.applyShadows(group)
    return group
  }

  /**
   * Woven Area Rug
   */
  createRug(width = 3.6, length = 2.6): THREE.Mesh {
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.015, length),
      this.materials.rug,
    )
    rug.receiveShadow = true
    return rug
  }

  /**
   * Architectural Kitchen Suite: Base cabinets, Island, Quartz top, Sink, Faucet, Cooktop & Fridge
   */
  createKitchen(): THREE.Group {
    const group = new THREE.Group()

    // 1. Kitchen Island Counter
    const islandBase = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.86, 1.0),
      this.materials.darkWood,
    )
    islandBase.position.set(0, 0.43, 0)
    group.add(islandBase)

    // Island Quartz Waterfall Top
    const islandTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.7, 0.06, 1.05),
      this.materials.quartz,
    )
    islandTop.position.set(0, 0.89, 0)
    group.add(islandTop)

    // Inset Sink
    const sink = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.02, 0.45),
      this.materials.metalChrome,
    )
    sink.position.set(-0.6, 0.91, 0)
    group.add(sink)

    // Gooseneck Faucet
    const faucetStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.35, 12),
      this.materials.metalBlack,
    )
    faucetStem.position.set(-0.6, 1.08, -0.22)
    group.add(faucetStem)

    const faucetSpout = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.02, 0.18),
      this.materials.metalBlack,
    )
    faucetSpout.position.set(-0.6, 1.25, -0.13)
    group.add(faucetSpout)

    // Induction Cooktop on island
    const cooktop = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.01, 0.5),
      this.materials.tvScreen,
    )
    cooktop.position.set(0.6, 0.92, 0)
    group.add(cooktop)

    // Ceiling Extraction Hood
    const hood = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.08, 0.5),
      this.materials.metalBlack,
    )
    hood.position.set(0.6, 2.3, 0)
    group.add(hood)

    const hoodDuct = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.7, 16),
      this.materials.metalBlack,
    )
    hoodDuct.position.set(0.6, 2.7, 0)
    group.add(hoodDuct)

    // 2. Rear Kitchen Wall Cabinets
    const backCabinet = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 2.4, 0.65),
      this.materials.wallAccent,
    )
    backCabinet.position.set(0, 1.2, -1.8)
    group.add(backCabinet)

    // Integrated Double Door Refrigerator
    const fridge = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 2.0, 0.7),
      this.materials.metalChrome,
    )
    fridge.position.set(1.1, 1.0, -1.75)
    group.add(fridge)

    // Built-in Oven stack
    const oven = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.65, 0.02),
      this.materials.tvScreen,
    )
    oven.position.set(-0.4, 1.2, -1.46)
    group.add(oven)

    this.applyShadows(group)
    return group
  }

  /**
   * Dining Table with Cantilever Chairs and Suspended Brass Pendant Lights
   */
  createDiningSet(): THREE.Group {
    const group = new THREE.Group()

    // Solid Oak Dining Table Top
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.06, 1.0),
      this.materials.wood,
    )
    tableTop.position.set(0, 0.74, 0)
    group.add(tableTop)

    // Heavy Trestle Legs
    const leg1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.71, 0.8),
      this.materials.wood,
    )
    leg1.position.set(-0.85, 0.355, 0)
    group.add(leg1)

    const leg2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.71, 0.8),
      this.materials.wood,
    )
    leg2.position.set(0.85, 0.355, 0)
    group.add(leg2)

    // 4 Dining Chairs
    const chairPositions: [number, number, number][] = [
      [-0.6, 0, 0.65],
      [0.6, 0, 0.65],
      [-0.6, 0, -0.65],
      [0.6, 0, -0.65],
    ]

    chairPositions.forEach(([x, y, z], idx) => {
      const chair = new THREE.Group()
      // Seat
      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(0.44, 0.04, 0.44),
        this.materials.fabricDark,
      )
      seat.position.set(0, 0.45, 0)
      chair.add(seat)

      // Backrest
      const back = new THREE.Mesh(
        new THREE.BoxGeometry(0.44, 0.35, 0.04),
        this.materials.fabricDark,
      )
      back.position.set(0, 0.68, idx < 2 ? 0.2 : -0.2)
      chair.add(back)

      // Metal legs
      const chairLegGeo = new THREE.CylinderGeometry(0.015, 0.01, 0.45, 8)
      ;[
        [-0.18, 0.225, -0.18],
        [0.18, 0.225, -0.18],
        [-0.18, 0.225, 0.18],
        [0.18, 0.225, 0.18],
      ].forEach(([lx, ly, lz]) => {
        const cLeg = new THREE.Mesh(chairLegGeo, this.materials.metalBlack)
        cLeg.position.set(lx, ly, lz)
        chair.add(cLeg)
      })

      chair.position.set(x, y, z)
      group.add(chair)
    })

    // Overhead Sculptural Brass Pendant Lights
    ;[-0.5, 0.5].forEach((px) => {
      const pendantCord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 1.2, 8),
        this.materials.metalBlack,
      )
      pendantCord.position.set(px, 1.9, 0)
      group.add(pendantCord)

      const pendantCone = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.22, 16),
        this.materials.metalBrass,
      )
      pendantCone.position.set(px, 1.35, 0)
      group.add(pendantCone)
    })

    this.applyShadows(group)
    return group
  }

  /**
   * Master Bedroom Suite: Platform Bed, Cushioned Headboard, Folded Duvet, Pillows & Nightstands
   */
  createBed(): THREE.Group {
    const group = new THREE.Group()

    // Wood platform frame
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.22, 2.2),
      this.materials.wood,
    )
    frame.position.set(0, 0.11, 0)
    group.add(frame)

    // Upholstered Headboard
    const headboard = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.9, 0.14),
      this.materials.fabricDark,
    )
    headboard.position.set(0, 0.65, -1.05)
    group.add(headboard)

    // Mattress
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.28, 2.0),
      this.materials.quartz,
    )
    mattress.position.set(0, 0.35, -0.05)
    group.add(mattress)

    // Duvet / Bedspread
    const duvet = new THREE.Mesh(
      new THREE.BoxGeometry(1.92, 0.14, 1.4),
      this.materials.fabric,
    )
    duvet.position.set(0, 0.43, 0.25)
    group.add(duvet)

    // Pillows (2 pairs)
    ;[-0.5, 0.5].forEach((px) => {
      const pillow = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.14, 0.4),
        this.materials.quartz,
      )
      pillow.position.set(px, 0.52, -0.7)
      pillow.rotation.x = 0.2
      group.add(pillow)
    })

    // Dual Floating Nightstands
    ;[-1.35, 1.35].forEach((nx) => {
      const stand = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.25, 0.4),
        this.materials.wood,
      )
      stand.position.set(nx, 0.35, -0.9)
      group.add(stand)

      // Nightstand Lamp
      const lampBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.08, 0.03, 16),
        this.materials.metalBrass,
      )
      lampBase.position.set(nx, 0.49, -0.9)
      group.add(lampBase)

      const lampShade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.14, 0.2, 16),
        this.materials.fabric,
      )
      lampShade.position.set(nx, 0.64, -0.9)
      group.add(lampShade)
    })

    this.applyShadows(group)
    return group
  }

  /**
   * Built-in Floor-to-Ceiling Wardrobe
   */
  createWardrobe(width = 2.4, height = 2.6): THREE.Group {
    const group = new THREE.Group()

    const wardrobe = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, 0.6),
      this.materials.darkWood,
    )
    wardrobe.position.set(0, height / 2, 0)
    group.add(wardrobe)

    // Recessed brass handles
    ;[-0.3, 0.3].forEach((hx) => {
      const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.45, 0.02),
        this.materials.metalBrass,
      )
      handle.position.set(hx, height / 2, 0.31)
      group.add(handle)
    })

    this.applyShadows(group)
    return group
  }

  /**
   * Minimalist Bathroom Suite: Vanity, Vessel Basin, Mirror, Glass Shower & Toilet
   */
  createBathroom(): THREE.Group {
    const group = new THREE.Group()

    // Floating Stone Vanity
    const vanity = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.35, 0.5),
      this.materials.darkQuartz,
    )
    vanity.position.set(0, 0.65, 0)
    group.add(vanity)

    // Undermount/Vessel Basin
    const basin = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.1, 0.35),
      this.materials.quartz,
    )
    basin.position.set(0, 0.86, 0)
    group.add(basin)

    // Faucet
    const faucet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.25, 12),
      this.materials.metalBlack,
    )
    faucet.position.set(0, 0.98, -0.12)
    group.add(faucet)

    // Frameless Mirror
    const mirror = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 1.0, 0.02),
      this.materials.mirror,
    )
    mirror.position.set(0, 1.55, -0.22)
    group.add(mirror)

    // Glass Shower Screen
    const showerScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 2.1, 0.9),
      this.materials.glass,
    )
    showerScreen.position.set(1.2, 1.05, 0)
    group.add(showerScreen)

    // Shower Column
    const showerPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 1.4, 8),
      this.materials.metalChrome,
    )
    showerPipe.position.set(1.6, 1.4, -0.2)
    group.add(showerPipe)

    // Wall-hung Toilet
    const toilet = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.38, 0.55),
      this.materials.quartz,
    )
    toilet.position.set(-1.1, 0.38, -0.1)
    group.add(toilet)

    this.applyShadows(group)
    return group
  }

  /**
   * Potted Architectural Plant (Fiddle Leaf / Olive)
   */
  createPlant(): THREE.Group {
    const group = new THREE.Group()

    // Fluted ceramic pot
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.16, 0.45, 16),
      this.materials.plantPot,
    )
    pot.position.set(0, 0.225, 0)
    group.add(pot)

    // Main Stem
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.025, 1.1, 8),
      this.materials.wood,
    )
    stem.position.set(0, 0.8, 0)
    group.add(stem)

    // Leaves clusters
    const leafGeo = new THREE.SphereGeometry(0.28, 8, 8)
    leafGeo.scale(1, 0.35, 1)
    ;[
      [0.05, 1.0, 0.05],
      [-0.12, 1.25, 0.08],
      [0.15, 1.35, -0.1],
      [0, 1.5, 0],
    ].forEach(([lx, ly, lz]) => {
      const leaf = new THREE.Mesh(leafGeo, this.materials.plantFoliage)
      leaf.position.set(lx, ly, lz)
      group.add(leaf)
    })

    this.applyShadows(group)
    return group
  }

  /**
   * Monolithic Stone Fireplace with glowing hearth & warm light
   */
  createFireplace(): THREE.Group {
    const group = new THREE.Group()
    const surround = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 2.9, 0.4),
      this.materials.wallAccent,
    )
    surround.position.set(0, 1.45, 0)
    group.add(surround)

    const firebox = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.65, 0.35),
      this.materials.metalBlack,
    )
    firebox.position.set(0, 0.65, 0.05)
    group.add(firebox)

    const embers = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.08, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xff6622 }),
    )
    embers.position.set(0, 0.38, 0.08)
    group.add(embers)

    const fireLight = new THREE.PointLight(0xff7722, 1.8, 6.5, 1.5)
    fireLight.position.set(0, 0.7, 0.35)
    group.add(fireLight)

    this.applyShadows(group)
    return group
  }

  /**
   * Framed Minimalist Architectural Artwork Canvas
   */
  createArtwork(width = 1.8, height = 1.2): THREE.Group {
    const group = new THREE.Group()
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.06, height + 0.06, 0.03),
      this.materials.metalBlack,
    )
    group.add(frame)

    const canvas = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, 0.032),
      this.materials.quartz,
    )
    group.add(canvas)

    const artShape = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.65, height * 0.65, 0.034),
      this.materials.wallAccent,
    )
    artShape.position.set(width * 0.1, 0, 0)
    group.add(artShape)

    return group
  }

  /**
   * Minimalist Entryway Console Table with brass legs
   */
  createConsoleTable(): THREE.Group {
    const group = new THREE.Group()
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.05, 0.4),
      this.materials.quartz,
    )
    top.position.set(0, 0.8, 0)
    group.add(top)

    ;[-0.7, 0.7].forEach((lx) => {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.78, 0.36),
        this.materials.metalBrass,
      )
      leg.position.set(lx, 0.39, 0)
      group.add(leg)
    })

    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.04, 0.05, 16),
      this.materials.metalBrass,
    )
    bowl.position.set(0.3, 0.85, 0)
    group.add(bowl)

    this.applyShadows(group)
    return group
  }

  /**
   * Modern High Kitchen Barstool
   */
  createBarstool(): THREE.Group {
    const group = new THREE.Group()
    const seat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.19, 0.06, 16),
      this.materials.leather,
    )
    seat.position.set(0, 0.68, 0)
    group.add(seat)

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.65, 12),
      this.materials.metalBrass,
    )
    pole.position.set(0, 0.33, 0)
    group.add(pole)

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.02, 16),
      this.materials.metalBrass,
    )
    base.position.set(0, 0.01, 0)
    group.add(base)

    this.applyShadows(group)
    return group
  }

  /**
   * Modern Architectural Lounge Chair / Terrace Chair
   */
  createChair(): THREE.Group {
    const group = new THREE.Group()

    // Seat cushion
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.12, 0.7),
      this.materials.fabric,
    )
    seat.position.set(0, 0.42, 0)
    group.add(seat)

    // Backrest cushion (slightly reclined)
    const back = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.55, 0.1),
      this.materials.fabricDark,
    )
    back.position.set(0, 0.72, -0.32)
    back.rotation.x = -0.15
    group.add(back)

    // Slender blackened steel frame
    const legGeo = new THREE.CylinderGeometry(0.018, 0.015, 0.42, 8)
    ;[
      [-0.32, 0.21, -0.3],
      [0.32, 0.21, -0.3],
      [-0.32, 0.21, 0.3],
      [0.32, 0.21, 0.3],
    ].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, this.materials.metalBlack)
      leg.position.set(lx, ly, lz)
      group.add(leg)
    })

    this.applyShadows(group)
    return group
  }
}
