import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ArtifactItem, SearchState } from "@/types/album"

const initialState: SearchState = {
  query: "",
  filteredArtifacts: [],
  isSearching: false,
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload
      state.isSearching = action.payload.trim().length > 0
    },
    setFilteredArtifacts: (state, action: PayloadAction<ArtifactItem[]>) => {
      state.filteredArtifacts = action.payload
    },
    clearSearch: (state) => {
      state.query = ""
      state.filteredArtifacts = []
      state.isSearching = false
    },
    filterArtifacts: (state, action: PayloadAction<{ artifacts: ArtifactItem[]; query: string }>) => {
      const { artifacts, query } = action.payload
      if (!query.trim()) {
        state.filteredArtifacts = []
        state.isSearching = false
        return
      }

      const lowercaseQuery = query.toLowerCase().trim()
      state.filteredArtifacts = artifacts.filter(
        (artifact) =>
          artifact.tenHienVat3D.toLowerCase().includes(lowercaseQuery) ||
          artifact.gioiThieu.toLowerCase().includes(lowercaseQuery),
      )
      state.isSearching = true
    },
  },
})

export const { setSearchQuery, setFilteredArtifacts, clearSearch, filterArtifacts } = searchSlice.actions
export default searchSlice.reducer
