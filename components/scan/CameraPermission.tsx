import type React from "react"
import { View, Text, StyleSheet, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export interface CameraPermissionProps {
    onRequestPermission: () => void
    permissionStatus: "denied" | "undetermined" | "pending"
}

export const CameraPermission: React.FC<CameraPermissionProps> = ({ onRequestPermission, permissionStatus }) => {
    return (
        <View style={styles.container}>
            <Ionicons name="camera-outline" size={64} color="#666" />
            <Text style={styles.title}>Cần quyền truy cập camera</Text>
            <Text style={styles.description}>
                {permissionStatus === "denied"
                    ? "Ứng dụng cần quyền truy cập camera để quét mã QR. Vui lòng cấp quyền trong cài đặt thiết bị."
                    : "Ứng dụng cần quyền truy cập camera để quét mã QR."}
            </Text>
            <Pressable style={styles.button} onPress={onRequestPermission}>
                <Text style={styles.buttonText}>{permissionStatus === "denied" ? "Mở cài đặt" : "Cấp quyền truy cập"}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
        color: "#333",
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        color: "#666",
        marginBottom: 30,
        lineHeight: 22,
    },
    button: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
})
