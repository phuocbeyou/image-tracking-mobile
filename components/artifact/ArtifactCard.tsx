"use client"

import React, { useCallback } from "react"
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from "react-native"
import type { ArtifactCardProps } from "@/types/artifact"

interface ExtendedArtifactCardProps extends ArtifactCardProps {
    numColumns?: number
}

const { width: screenWidth } = Dimensions.get("window")

export const ArtifactCard: React.FC<ExtendedArtifactCardProps> = React.memo(({ artifact, onPress, numColumns = 2 }) => {
    const handlePress = useCallback(() => {
        onPress(artifact)
    }, [artifact, onPress])

    const cardWidth = (screenWidth - 48) / numColumns

    return (
        <Pressable style={[styles.artifactCard, { width: cardWidth }]} onPress={handlePress}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: artifact.anh }} style={styles.artifactImage} />
                <View style={styles.indexBadge}>
                    <Text style={styles.indexText}>#{artifact.stt}</Text>
                </View>
            </View>
            <View style={styles.artifactInfo}>
                <Text style={styles.artifactTitle} numberOfLines={2}>
                    {artifact.tenHienVat3D}
                </Text>
                <Text style={styles.artifactDescription} numberOfLines={2}>
                    {artifact.gioiThieu}
                </Text>
                {artifact.model3dMobileGlb && (
                    <View style={styles.modelBadge}>
                        <Text style={styles.modelBadgeText}>3D</Text>
                    </View>
                )}
            </View>
        </Pressable>
    )
})

const styles = StyleSheet.create({
    artifactCard: {
        marginBottom: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        position: "relative",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: "hidden",
    },
    artifactImage: {
        width: "100%",
        aspectRatio: 1,
        backgroundColor: "#f0f0f0",
    },
    indexBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.7)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    indexText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    artifactInfo: {
        padding: 12,
    },
    artifactTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginBottom: 4,
        lineHeight: 20,
    },
    artifactDescription: {
        fontSize: 14,
        color: "#666",
        lineHeight: 18,
        marginBottom: 8,
    },
    modelBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#007AFF",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    modelBadgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
})
