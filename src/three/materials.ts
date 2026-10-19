import * as THREE from "three"

/**
 * Creates high-quality architectural procedural PBR materials
 * optimized for real-time WebGL performance and realistic lighting.
 */
export function createArchitecturalMaterials(
  theme: "warm-limestone" | "dark-basalt" | "coastal-cedar" | "urban-concrete" = "warm-limestone",
) {
  // Color presets based on architectural project themes
  const wallColor =
    theme === "dark-basalt"
      ? 0x2e302d
      : theme === "coastal-cedar"
        ? 0xeeebe3
        : theme === "urban-concrete"
          ? 0xd8d6cf
          : 0xf4f0e8

  const floorColor =
    theme === "dark-basalt"
      ? 0x3d3e3a
      : theme === "coastal-cedar"
        ? 0xb38e64
        : theme === "urban-concrete"
          ? 0x8a8b86
          : 0xd9d3c5

  const woodColor =
    theme === "dark-basalt"
      ? 0x262320
      : theme === "coastal-cedar"
        ? 0xa67c52
        : 0x8c6d48

  return {
    wall: new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.88,
      metalness: 0.05,
    }),
    wallAccent: new THREE.MeshStandardMaterial({
      color: 0x222421,
      roughness: 0.8,
      metalness: 0.1,
    }),
    floor: new THREE.MeshStandardMaterial({
      color: floorColor,
      roughness: 0.65,
      metalness: 0.08,
    }),
    ceiling: new THREE.MeshStandardMaterial({
      color: 0xfbf9f5,
      roughness: 0.95,
      metalness: 0.0,
    }),
    wood: new THREE.MeshStandardMaterial({
      color: woodColor,
      roughness: 0.55,
      metalness: 0.05,
    }),
    darkWood: new THREE.MeshStandardMaterial({
      color: 0x2b2521,
      roughness: 0.6,
      metalness: 0.05,
    }),
    fabric: new THREE.MeshStandardMaterial({
      color: 0xd6d0c4,
      roughness: 0.95,
      metalness: 0.0,
    }),
    fabricDark: new THREE.MeshStandardMaterial({
      color: 0x383935,
      roughness: 0.95,
      metalness: 0.0,
    }),
    leather: new THREE.MeshStandardMaterial({
      color: 0x5a3f2a,
      roughness: 0.5,
      metalness: 0.1,
    }),
    quartz: new THREE.MeshStandardMaterial({
      color: 0xf3f2ee,
      roughness: 0.25,
      metalness: 0.05,
    }),
    darkQuartz: new THREE.MeshStandardMaterial({
      color: 0x1f201e,
      roughness: 0.3,
      metalness: 0.1,
    }),
    metalBlack: new THREE.MeshStandardMaterial({
      color: 0x181917,
      roughness: 0.35,
      metalness: 0.85,
    }),
    metalBrass: new THREE.MeshStandardMaterial({
      color: 0xc8a663,
      roughness: 0.3,
      metalness: 0.8,
    }),
    metalChrome: new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      roughness: 0.15,
      metalness: 0.95,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      roughness: 0.05,
      transmission: 0.9,
      ior: 1.5,
      thickness: 0.5,
    }),
    tvScreen: new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.1,
      metalness: 0.9,
    }),
    plantPot: new THREE.MeshStandardMaterial({
      color: 0x363833,
      roughness: 0.8,
      metalness: 0.05,
    }),
    plantFoliage: new THREE.MeshStandardMaterial({
      color: 0x3b5438,
      roughness: 0.7,
      metalness: 0.0,
    }),
    rug: new THREE.MeshStandardMaterial({
      color: 0xcfc8ba,
      roughness: 0.98,
      metalness: 0.0,
    }),
    mirror: new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      roughness: 0.02,
      metalness: 0.98,
    }),
    water: new THREE.MeshStandardMaterial({
      color: 0x1b282c,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    }),
  }
}

export type ArchitecturalMaterials = ReturnType<typeof createArchitecturalMaterials>
