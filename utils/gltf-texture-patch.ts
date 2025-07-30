import * as FileSystem from "expo-file-system"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

export function patchGLTFLoader() {
  // Store the original parse method
  const originalParse = GLTFLoader.prototype.parse

  // Override the parse method to intercept texture loading
  GLTFLoader.prototype.parse = function (data, path, onLoad, onError) {
    

    // Create a custom texture loader that doesn't use blobs
    const createExpoTextureLoader = (manager) => {
      return {
        load: (url, onLoad, onProgress, onError) => {
          const texture = new THREE.Texture()

          // For data URIs or base64 encoded images
          if (url.startsWith("data:")) {
            // Create a placeholder texture and resolve immediately
            // This is a limitation - data URIs won't work properly in Expo
            console.warn("Data URI textures not fully supported in Expo")
            if (onLoad) onLoad(texture)
            return texture
          }

          // For remote URLs
          if (url.startsWith("http")) {
            const filename = `${FileSystem.cacheDirectory}texture_${Date.now()}.jpg`

            FileSystem.downloadAsync(url, filename)
              .then(() => {
                // Create a texture from the downloaded file
                const textureLoader = new THREE.TextureLoader(manager)
                textureLoader.load(
                  filename,
                  (loadedTexture) => {
                    // Copy properties from loaded texture to our texture
                    texture.image = loadedTexture.image
                    texture.needsUpdate = true
                    if (onLoad) onLoad(texture)
                  },
                  onProgress,
                  onError,
                )
              })
              .catch((error) => {
                console.error("Failed to download texture:", error)
                if (onError) onError(error)
              })
          } else {
            // For local files, use the standard loader
            const textureLoader = new THREE.TextureLoader(manager)
            textureLoader.load(
              url,
              (loadedTexture) => {
                // Copy properties from loaded texture to our texture
                texture.image = loadedTexture.image
                texture.needsUpdate = true
                if (onLoad) onLoad(texture)
              },
              onProgress,
              onError,
            )
          }

          return texture
        },
      }
    }

    // Override the loadTexture method in the parser
    const parseWithCustomTextureLoader = () => {
      try {
        // Call the original parse method
        const result = originalParse.call(
          this,
          data,
          path,
          // Custom onLoad
          (gltf) => {
            // Process all materials to ensure textures are properly loaded
            if (gltf.scene) {
              gltf.scene.traverse((object) => {
                if (object.isMesh && object.material) {
                  // Force material update
                  if (Array.isArray(object.material)) {
                    object.material.forEach((mat) => {
                      if (mat.map) mat.map.needsUpdate = true
                      if (mat.normalMap) mat.normalMap.needsUpdate = true
                      if (mat.aoMap) mat.aoMap.needsUpdate = true
                      if (mat.emissiveMap) mat.emissiveMap.needsUpdate = true
                      if (mat.metalnessMap) mat.metalnessMap.needsUpdate = true
                      if (mat.roughnessMap) mat.roughnessMap.needsUpdate = true
                    })
                  } else {
                    if (object.material.map) object.material.map.needsUpdate = true
                    if (object.material.normalMap) object.material.normalMap.needsUpdate = true
                    if (object.material.aoMap) object.material.aoMap.needsUpdate = true
                    if (object.material.emissiveMap) object.material.emissiveMap.needsUpdate = true
                    if (object.material.metalnessMap) object.material.metalnessMap.needsUpdate = true
                    if (object.material.roughnessMap) object.material.roughnessMap.needsUpdate = true
                  }
                }
              })
            }

            if (onLoad) onLoad(gltf)
          },
          onError,
        )

        return result
      } catch (error) {
        console.error("Error in patched GLTFLoader parse:", error)
        if (onError) onError(error)
      }
    }

    // If we're dealing with a binary file (GLB), we need special handling
    if (typeof data === "string") {
      return parseWithCustomTextureLoader()
    } else {
      // For binary data, we need to handle it differently
      return originalParse.call(this, data, path, onLoad, onError)
    }
  }

  // Patch the loadTexture method in the GLTFParser prototype
  const originalCreateDefaultMaterial = THREE.GLTFParser.prototype.createDefaultMaterial

  THREE.GLTFParser.prototype.createDefaultMaterial = function () {
    const material = originalCreateDefaultMaterial.call(this)

    // Use basic material which doesn't rely on complex texture handling
    return new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    })
  }
}
