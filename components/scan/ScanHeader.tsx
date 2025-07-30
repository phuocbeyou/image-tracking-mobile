import type React from "react"
import { View, Text, StyleSheet, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export interface ScanHeaderProps {
    onToggleFlash: () => void
    flashEnabled: boolean
}

export const ScanHeader: React.FC<ScanHeaderProps> = ({ onToggleFlash, flashEnabled }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Quét mã QR</Text>
            <Pressable style={styles.flashButton} onPress={onToggleFlash}>
                <Ionicons name={flashEnabled ? "flash" : "flash-off"} size={24} color="#fff" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    flashButton: {
        padding: 8,
    },
})
