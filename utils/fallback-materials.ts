import * as THREE from "three"

// Create fallback materials for different model types
export function createFallbackMaterial(type = "default") {
  switch (type) {
    case "duck":
      return new THREE.MeshPhongMaterial({
        color: 0xffff00, // Yellow
        shininess: 30,
        specular: 0x111111,
      })

    case "metal":
      return new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.2,
      })

    case "plastic":
      return new THREE.MeshPhongMaterial({
        color: 0x156289,
        shininess: 30,
        specular: 0x111111,
      })

    default:
      return new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      })
  }
}

// Apply fallback materials to a loaded model
export function applyFallbackMaterials(model: THREE.Object3D, type = "default") {
  const material = createFallbackMaterial(type)

  model.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      // Store original material for possible restoration
      if (!object.userData.originalMaterial) {
        object.userData.originalMaterial = object.material
      }

      // Apply new material
      object.material = material
    }
  })

  return model
}

// Restore original materials if they exist
export function restoreOriginalMaterials(model: THREE.Object3D) {
  model.traverse((object) => {
    if (object instanceof THREE.Mesh && object.userData.originalMaterial) {
      object.material = object.userData.originalMaterial
    }
  })

  return model
}
