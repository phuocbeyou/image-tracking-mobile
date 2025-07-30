"use client"

import { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Pressable,
    Dimensions,
    Linking,
    ActivityIndicator,
    Share,
    Platform,
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import Animated, { FadeIn } from "react-native-reanimated"
import { useGetArtifactByIdQuery } from "@/store/api/artifactApi"
import { ImageViewer } from "@/components/common/ImageViewer"
import { Modal3DViewer } from "@/components/artifact/Modal3DViewer"

const { width: screenWidth } = Dimensions.get("window")

// Số dòng mô tả hiển thị ban đầu
const INITIAL_LINES_TO_SHOW = 3

export default function DetailScreen() {
    const params = useLocalSearchParams()
    const router = useRouter()

    // State cho việc hiển thị mô tả đầy đủ
    const [showFullDescription, setShowFullDescription] = useState(false)
    // State cho việc hiển thị modal xem ảnh
    const [imageViewerVisible, setImageViewerVisible] = useState(false)
    // State cho modal 3D viewer
    const [modal3DVisible, setModal3DVisible] = useState(false)


    const artifactId = params.id as string
    const {
        data: artifact,
        isLoading,
        error,
    } = useGetArtifactByIdQuery(artifactId, {
        skip: !artifactId,
    })

    // Fallback to params data if API call fails
    const fallbackArtifact = {
        id: (params.id as string) || "",
        tenHienVat3D: (params.tenHienVat3D as string) || "",
        gioiThieu: (params.gioiThieu as string) || "",
        anh: (params.anh as string) || "",
        chieuCao: (params.chieuCao as string) || null,
        chieuDai: (params.chieuDai as string) || null,
        chieuRong: (params.chieuRong as string) || null,
        introductionLink: (params.introductionLink as string) || null,
        model3dMobileGlb: (params.model3dMobileGlb as string) || null,
        model3dPcJpg: (params.model3dPcJpg as string) || null,
        stt: Number(params.stt) || 0,
        thuTu: Number(params.thuTu) || 0,
    }

    const displayArtifact = artifact || fallbackArtifact

    const handleBack = () => {
        router.back()
    }

    const handleView3D = () => {
        if (displayArtifact.model3dMobileGlb) {
            setModal3DVisible(true)
        }
    }

    const handleOpenLink = () => {
        if (displayArtifact.introductionLink) {
            Linking.openURL(displayArtifact.introductionLink)
        }
    }

    // Xử lý chia sẻ
    const handleShare = async () => {
        try {
            const result = await Share.share({
                title: displayArtifact.tenHienVat3D,
                message: `${displayArtifact.tenHienVat3D}\n\n${displayArtifact.gioiThieu}\n\nXem thêm tại ứng dụng Di Sản Quốc Gia`,
                url: displayArtifact.introductionLink || undefined,
            })
        } catch (error) {
            console.error("Error sharing:", error)
        }
    }

    const getDimensions = () => {
        const dimensions = []
        if (displayArtifact.chieuCao) dimensions.push(`Cao: ${displayArtifact.chieuCao}cm`)
        if (displayArtifact.chieuRong) dimensions.push(`Rộng: ${displayArtifact.chieuRong}cm`)
        if (displayArtifact.chieuDai) dimensions.push(`Dài: ${displayArtifact.chieuDai}cm`)
        return dimensions.join(" × ")
    }

    function sanitizeUrl(url: string) {
        try {
            const decoded = decodeURI(url);
            const encoded = encodeURI(decoded);
            return encoded;
        } catch (e) {
            console.error("Invalid URL:", url);
            return url;
        }
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="chevron-back" size={24} color="#007AFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Chi tiết hiện vật</Text>
                    <View style={styles.headerRight} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Đang tải chi tiết...</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={handleBack}>
                    <Ionicons name="chevron-back" size={24} color="#007AFF" />
                </Pressable>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    Chi tiết hiện vật
                </Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Hero Image */}
                <Animated.View entering={FadeIn.delay(100)} style={styles.heroSection}>
                    <Pressable onPress={() => setImageViewerVisible(true)}>
                        <Image source={{ uri: displayArtifact.anh }} style={styles.heroImage} />
                        <View style={styles.viewImageOverlay}>
                            <Ionicons name="expand-outline" size={24} color="#fff" />
                            <Text style={styles.viewImageText}>Xem ảnh</Text>
                        </View>
                    </Pressable>
                    <View style={styles.indexBadge}>
                        <Text style={styles.indexText}>#{displayArtifact.stt}</Text>
                    </View>
                </Animated.View>

                {/* Content */}
                <Animated.View entering={FadeIn.delay(200)} style={styles.infoSection}>
                    <Text style={styles.artifactName}>{displayArtifact.tenHienVat3D}</Text>

                    {/* Dimensions */}
                    {getDimensions() && (
                        <View style={styles.dimensionsCard}>
                            <Text style={styles.dimensionsText}>{getDimensions()}</Text>
                        </View>
                    )}

                    {/* Description */}
                    <View style={styles.descriptionCard}>
                        <Text style={styles.sectionTitle}>Giới thiệu</Text>
                        <Text style={styles.description} numberOfLines={showFullDescription ? undefined : INITIAL_LINES_TO_SHOW}>
                            {displayArtifact.gioiThieu}
                        </Text>

                        {/* Nút xem thêm */}
                        <Pressable style={styles.readMoreButton} onPress={() => setShowFullDescription(!showFullDescription)}>
                            <Text style={styles.readMoreText}>{showFullDescription ? "Thu gọn" : "Xem thêm"}</Text>
                            <Ionicons name={showFullDescription ? "chevron-up" : "chevron-down"} size={16} color="#007AFF" />
                        </Pressable>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionSection}>
                        {displayArtifact.model3dMobileGlb && (
                            <Pressable style={styles.primaryButton} onPress={handleView3D}>
                                <Ionicons name="cube-outline" size={20} color="#fff" />
                                <Text style={styles.primaryButtonText}>Xem AR</Text>
                            </Pressable>
                        )}

                        <View style={styles.secondaryButtons}>
                            {displayArtifact.introductionLink && (
                                <Pressable style={styles.secondaryButton} onPress={handleOpenLink}>
                                    <Ionicons name="link-outline" size={20} color="#007AFF" />
                                    <Text style={styles.secondaryButtonText}>Xem thêm</Text>
                                </Pressable>
                            )}

                            <Pressable style={styles.secondaryButton} onPress={handleShare}>
                                <Ionicons name="share-outline" size={20} color="#007AFF" />
                                <Text style={styles.secondaryButtonText}>Chia sẻ</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Additional Info */}
                    <View style={styles.additionalInfo}>
                        <Text style={styles.sectionTitle}>Thông tin bổ sung</Text>

                        <View style={styles.infoRow}>
                            <Ionicons name="cube-outline" size={16} color="#666" />
                            <Text style={styles.infoLabel}>Mô hình 3D:</Text>
                            <Text style={styles.infoValue}>
                                {displayArtifact.model3dMobileGlb || displayArtifact.model3dPcJpg ? "Có sẵn" : "Chưa có"}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Ionicons name="list-outline" size={16} color="#666" />
                            <Text style={styles.infoLabel}>Thứ tự:</Text>
                            <Text style={styles.infoValue}>{displayArtifact.thuTu}</Text>
                        </View>

                        {displayArtifact.introductionLink && (
                            <View style={styles.infoRow}>
                                <Ionicons name="link-outline" size={16} color="#666" />
                                <Text style={styles.infoLabel}>Liên kết:</Text>
                                <Text style={styles.infoValue} numberOfLines={1}>
                                    Có thông tin chi tiết
                                </Text>
                            </View>
                        )}
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Image Viewer Modal */}
            <ImageViewer
                visible={imageViewerVisible}
                imageUrl={displayArtifact.anh}
                onClose={() => setImageViewerVisible(false)}
            />

            {/* 3D Model Viewer Modal */}
            <Modal3DViewer
                visible={modal3DVisible}
                onClose={() => setModal3DVisible(false)}
                modelUrl={sanitizeUrl(displayArtifact.model3dPcJpg || displayArtifact.model3dMobileGlb || '')}
                artifactName={displayArtifact.tenHienVat3D}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: Platform.OS === "ios" ? 44 : 10,
        paddingBottom: Platform.OS === "ios" ? 16 : 10,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#000",
        flex: 1,
        textAlign: "center",
        marginHorizontal: 16,
    },
    headerRight: {
        width: 32,
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
    content: {
        flex: 1,
    },
    heroSection: {
        position: "relative",
        backgroundColor: "#f8f8f8",
    },
    heroImage: {
        width: screenWidth,
        height: screenWidth * 0.8,
        resizeMode: "cover",
    },
    viewImageOverlay: {
        position: "absolute",
        bottom: 16,
        right: 16,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    viewImageText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
        marginLeft: 6,
    },
    indexBadge: {
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: "rgba(0,0,0,0.7)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    indexText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    infoSection: {
        padding: 20,
    },
    artifactName: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 16,
        lineHeight: 34,
    },
    dimensionsCard: {
        backgroundColor: "#e3f2fd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        alignItems: "center",
    },
    dimensionsText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1976d2",
    },
    descriptionCard: {
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: "#333",
        lineHeight: 22,
    },
    readMoreButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
        padding: 8,
    },
    readMoreText: {
        color: "#007AFF",
        fontSize: 14,
        fontWeight: "500",
        marginRight: 4,
    },
    actionSection: {
        marginBottom: 24,
    },
    primaryButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007AFF",
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
    secondaryButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
    secondaryButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 2,
        marginVertical: 4,
        minWidth: 100,
    },
    secondaryButtonText: {
        color: "#007AFF",
        fontSize: 14,
        fontWeight: "500",
        marginLeft: 6,
    },
    additionalInfo: {
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        padding: 16,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: "#666",
        marginLeft: 8,
        marginRight: 8,
        minWidth: 80,
    },
    infoValue: {
        fontSize: 14,
        color: "#000",
        flex: 1,
    },
})
