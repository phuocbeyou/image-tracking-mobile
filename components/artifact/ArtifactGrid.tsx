"use client"

import type React from "react"
import { useCallback } from "react"
import { FlatList, StyleSheet } from "react-native"
import { ArtifactCard } from "./ArtifactCard"
import type { ArtifactItem } from "@/types/artifact"

interface ArtifactGridProps {
    artifacts: ArtifactItem[]
    onArtifactPress: (artifact: ArtifactItem) => void
    numColumns?: number
}

export const ArtifactGrid: React.FC<ArtifactGridProps> = ({ artifacts, onArtifactPress, numColumns = 2 }) => {
    const renderArtifactItem = useCallback(
        ({ item }: { item: ArtifactItem }) => (
            <ArtifactCard artifact={item} onPress={onArtifactPress} numColumns={numColumns} />
        ),
        [onArtifactPress, numColumns],
    )

    const keyExtractor = useCallback((item: ArtifactItem) => item.id, [])

    return (
        <FlatList
            data={artifacts}
            renderItem={renderArtifactItem}
            keyExtractor={keyExtractor}
            numColumns={numColumns}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        />
    )
}

const styles = StyleSheet.create({
    grid: {
        padding: 16,
        paddingBottom: 100,
    },
    row: {
        justifyContent: "space-between",
    },
})
