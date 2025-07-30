"use client"

import type React from "react"
import { useCallback, useEffect } from "react"
import { View, TextInput, StyleSheet, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { setSearchQuery, clearSearch, filterArtifacts } from "@/store/slice/searchSlice"
import { useGetArtifactsQuery } from "@/store/api/artifactApi"

interface SearchBarProps {
    placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Tìm kiếm hiện vật..." }) => {
    const dispatch = useAppDispatch()
    const { query } = useAppSelector((state) => state.search)
    const { data: artifacts = [] } = useGetArtifactsQuery()

    const handleChangeText = useCallback(
        (text: string) => {
            dispatch(setSearchQuery(text))
            dispatch(filterArtifacts({ artifacts, query: text }))
        },
        [dispatch, artifacts],
    )

    const handleClear = useCallback(() => {
        dispatch(clearSearch())
    }, [dispatch])

    // Update filtered artifacts when artifacts data changes
    useEffect(() => {
        if (query.trim()) {
            dispatch(filterArtifacts({ artifacts, query }))
        }
    }, [artifacts, query, dispatch])

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    value={query}
                    onChangeText={handleChangeText}
                    returnKeyType="search"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {query.length > 0 && (
                    <Pressable onPress={handleClear} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color="#666" />
                    </Pressable>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#fff",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#000",
    },
    clearButton: {
        padding: 4,
    },
})
