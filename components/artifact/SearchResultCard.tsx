"use client"

import React, { useCallback } from "react"
import { View, Text, StyleSheet, Pressable, Image } from "react-native"
import type { ArtifactItem } from "@/types/artifact"

interface SearchResultCardProps {
    artifact: ArtifactItem & { albumId: string; albumTitle: string }
    onPress: (artifact: ArtifactItem) => void
}

export const SearchResultCard: React.FC<SearchResultCardProps> = React.memo(({ artifact, onPress }) => {
    const handlePress = useCallback(() => {
        onPress(artifact)
    }, [artifact, onPress])

    return (
        <Pressable style={styles.card} onPress={handlePress}>
            <Image source={{ uri: artifact.anh }} style={styles.thumbnail} />
            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                    {artifact.tenHienVat3D}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                    {artifact.gioiThieu}
                </Text>
                <Text style={styles.albumInfo}>Từ bộ sưu tập: {artifact.albumTitle}</Text>
            </View>
        </Pressable>
    )
})

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginVertical: 4,
        borderRadius: 8,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 6,
        backgroundColor: "#f0f0f0",
    },
    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "space-between",
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: "#666",
        lineHeight: 18,
        marginBottom: 4,
    },
    albumInfo: {
        fontSize: 12,
        color: "#999",
        fontStyle: "italic",
    },
})
