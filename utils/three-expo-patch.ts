import * as FileSystem from "expo-file-system"
import { Texture, TextureLoader } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

// Patch for loading textures in Expo environment
export async function patchThreeJSForExpo() {
  // Override the original loadTexture method
  const originalLoadTexture = TextureLoader.prototype.load

  TextureLoader.prototype.load = function (url, onLoad, onProgress, onError) {
    // For remote URLs, try to download first
    if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) {
      const filename = url.split("/").pop() || `texture_${Date.now()}.jpg`
      const localUri = `${FileSystem.cacheDirectory}${filename}`

      FileSystem.downloadAsync(url, localUri)
        .then(() => {
          return originalLoadTexture.call(this, localUri, onLoad, onProgress, onError)
        })
        .catch((error) => {
          console.warn("Failed to download texture, trying original URL:", error)
          // Fallback to original method if download fails
          return originalLoadTexture.call(this, url, onLoad, onProgress, onError)
        })

      // Return an empty texture that will be populated later
      return new Texture()
    }

    // Default behavior for other cases
    return originalLoadTexture.call(this, url, onLoad, onProgress, onError)
  }

  // Patch GLTFLoader to handle binary files in Expo
  const originalGLTFLoad = GLTFLoader.prototype.load

  GLTFLoader.prototype.load = function (url, onLoad, onProgress, onError) {
    if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) {
      const filename = url.split("/").pop() || `model_${Date.now()}.glb`
      const localUri = `${FileSystem.cacheDirectory}${filename}`

      // Check if file already exists
      FileSystem.getInfoAsync(localUri)
        .then((fileInfo) => {
          if (fileInfo.exists) {
            // File exists, load it directly
            return originalGLTFLoad.call(this, localUri, onLoad, onProgress, onError)
          } else {
            // Download the file first
            return FileSystem.downloadAsync(url, localUri).then(() => {
              return originalGLTFLoad.call(this, localUri, onLoad, onProgress, onError)
            })
          }
        })
        .catch((error) => {
          console.warn("Failed to download GLTF, trying original URL:", error)
          // Fallback to original method if download fails
          return originalGLTFLoad.call(this, url, onLoad, onProgress, onError)
        })
    } else {
      return originalGLTFLoad.call(this, url, onLoad, onProgress, onError)
    }
  }
}
