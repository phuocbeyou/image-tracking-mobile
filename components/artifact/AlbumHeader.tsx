import { View, Text, StyleSheet, Pressable, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface AlbumHeaderProps {
  title?: string
  subtitle?: string
  onBackPress?: () => void
  onMenuPress?: () => void
  showBackButton?: boolean
  showMenuButton?: boolean
}

export default function AlbumHeader({
  title = "Di Sản",
  subtitle = "Bộ sưu tập hiện vật quốc gia",
  onBackPress,
  onMenuPress,
  showBackButton = true,
  showMenuButton = true,
}: AlbumHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Header Content */}
      <View style={styles.header}>
        {/* Left Side - Back Button */}
        {showBackButton && onBackPress && (
          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
            onPress={onBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </Pressable>
        )}

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Right Side - Menu Button */}
        {showMenuButton && onMenuPress && (
          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
            onPress={onMenuPress}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="#333333" />
          </Pressable>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingTop: Platform.OS === "ios" ? 40 : 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  iconButtonPressed: {
    opacity: 0.6,
  },
  titleSection: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "400",
    textAlign: "left",
  },
})
