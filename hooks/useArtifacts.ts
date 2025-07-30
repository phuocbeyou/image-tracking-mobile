"use client"

import { useState, useEffect } from "react"
import type { ArtifactItem } from "@/types/artifact"
import { artifactService } from "@/services/artifactService"

export const useArtifacts = () => {
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [artifactsData] = await Promise.all([
        artifactService.getArtifacts(),
      ])
      setArtifacts(artifactsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = async () => {
    await fetchData()
  }

  return { artifacts, loading, error, refetch }
}
