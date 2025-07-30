"use client"

import { useState, useMemo } from "react"
import type { ArtifactItem } from "@/types/album"

interface ArtifactWithAlbum extends ArtifactItem {
  albumId: string
  albumTitle: string
}

export const useSearch = (albums: (ArtifactItem & { artifacts?: ArtifactItem[]; title: string })[]) => {
  const [searchQuery, setSearchQuery] = useState("")

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) return { albums, artifacts: [] }

    // Tìm trong album
    const filteredAlbums = albums.filter(
      (album) =>
        album.tenHienVat3D?.toLowerCase().includes(query) ||
        album.gioiThieu?.toLowerCase().includes(query)
    )

    // Tìm trong artifacts
    const allArtifacts: ArtifactWithAlbum[] = []

    albums.forEach((album) => {
      album.artifacts?.forEach((artifact) => {
        const name = artifact.tenHienVat3D?.toLowerCase() || ""
        const intro = artifact.gioiThieu?.toLowerCase() || ""

        if (name.includes(query) || intro.includes(query)) {
          allArtifacts.push({
            ...artifact,
            albumId: album.id,
            albumTitle: album.title,
          })
        }
      })
    })

    return { albums: filteredAlbums, artifacts: allArtifacts }
  }, [albums, searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching: searchQuery.trim().length > 0,
  }
}
