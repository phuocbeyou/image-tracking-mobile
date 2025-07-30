"use client"

import { useCallback, useEffect } from "react"
import { View, StyleSheet, Text, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"

// Components
import { ArtifactGrid } from "@/components/artifact/ArtifactGrid"
import { SearchBar } from "@/components/common/SearchBar"
import AlbumHeader from "@/components/artifact/AlbumHeader"
import EmptyState from "@/components/artifact/EmptyState"

// Redux
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useGetArtifactsQuery } from "@/store/api/artifactApi";

// Types
import type { ArtifactItem } from "@/types/artifact"
import { useGetMindFilesQuery } from "@/store/api/mindApi"
import { setFiles } from "@/store/slice/mindSlice"

export default function ArtifactsScreen() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { data: artifacts = [], isLoading, error } = useGetArtifactsQuery()
  const { data: fileMind } = useGetMindFilesQuery();
  const { filteredArtifacts, isSearching, query } = useAppSelector((state) => state.search)

  useEffect(() => {
    if (fileMind) {
      dispatch(setFiles(fileMind));
    }
  }, [fileMind, dispatch]);

  const handleArtifactPress = useCallback(
    (artifact: ArtifactItem) => {
      router.push({
        pathname: "/detail",
        params: {
          id: artifact.id,
          tenHienVat3D: artifact.tenHienVat3D,
          gioiThieu: artifact.gioiThieu,
          anh: artifact.anh,
          chieuCao: artifact.chieuCao || "",
          chieuDai: artifact.chieuDai || "",
          chieuRong: artifact.chieuRong || "",
          introductionLink: artifact.introductionLink || "",
          model3dPcJpg: artifact.model3dPcJpg || "",
          model3dMobileGlb: artifact.model3dMobileGlb || "",
          stt: artifact.stt.toString(),
          thuTu: artifact.thuTu.toString(),
        },
      })
    },
    [router],
  )

  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* <AlbumHeader /> */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải hiện vật...</Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <AlbumHeader />
        <EmptyState message="Lỗi khi tải dữ liệu. Vui lòng thử lại." />
      </View>
    )
  }

  const displayArtifacts = isSearching ? filteredArtifacts : artifacts
  const showEmptySearch = isSearching && filteredArtifacts.length === 0

  return (
    <View style={styles.container}>
      <AlbumHeader />
      <SearchBar />

      {showEmptySearch ? (
        <EmptyState message={`Không tìm thấy hiện vật nào cho "${query}"`} />
      ) : displayArtifacts.length > 0 ? (
        <>
          {isSearching && <Text style={styles.searchResultsHeader}>Tìm thấy {filteredArtifacts.length} hiện vật</Text>}
          <ArtifactGrid artifacts={displayArtifacts} onArtifactPress={handleArtifactPress} numColumns={2} />
        </>
      ) : (
        <EmptyState message="Chưa có hiện vật nào" />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  searchResultsHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
})
