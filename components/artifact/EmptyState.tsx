import { View, Text, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

interface EmptyStateProps {
    message?: string
}

export default function EmptyState({ message = "Không tìm thấy" }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="image-off-outline" size={64} color="#AAAAAA" style={styles.icon} />
                </View>
                <Text style={styles.message}>{message}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 24,
    },
    content: {
        alignItems: "center",
        maxWidth: 280,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    icon: {
        opacity: 0.8,
    },
    message: {
        fontSize: 16,
        color: "#666666",
        textAlign: "center",
        lineHeight: 24,
        fontWeight: "400",
    },
})
