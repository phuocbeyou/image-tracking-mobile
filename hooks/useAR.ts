"use client"

import { useState, useEffect } from "react"
import { Camera } from "expo-camera"

export const useARPermissions = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync()
        setHasPermission(status === "granted")
      } catch (error) {
        console.error("Permission error:", error)
        setHasPermission(false)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  return { hasPermission, isLoading }
}
