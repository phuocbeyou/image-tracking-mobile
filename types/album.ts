export interface ArtifactItem {
  id: string
  tenHienVat3D: string
  gioiThieu: string
  anh: string
  chieuCao: string | null
  chieuDai: string | null
  chieuRong: string | null
  introductionLink: string | null
  model3dMobileGlb: string | null
  model3dPcGlb: string | null
  modelMindAR: string | null
  modelAR: string | null
  file3D: string | null
  audio: string | null
  videoDiTich: string | null
  videoHdv: string | null
  thoiGian: string | null
  kinhDo: string
  viDo: string
  caoDo: string
  thuTu: number
  stt: number
  isPublic: boolean
  created: string
  modified: string,
  model3dPcJpg: string | null
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
  message: string
  totalRecord: number
  correlationId: string | null
  traceId: string
}

export interface ArtifactCardProps {
  artifact: ArtifactItem
  onPress: (artifact: ArtifactItem) => void
}

export interface SearchState {
  query: string
  filteredArtifacts: ArtifactItem[]
  isSearching: boolean
}
