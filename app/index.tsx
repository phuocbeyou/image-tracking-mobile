import { login } from "@/store/api/loginApi"
import { setAuthData } from "@/store/slice/authSlice"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import * as Updates from 'expo-updates'
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Dimensions, Pressable, StyleSheet, Text, View } from "react-native"
import { useDispatch } from "react-redux"

const { width, height } = Dimensions.get("window")

export default function HomePage() {

    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        setIsLoading(true)
        try {
            const result = await login()
            dispatch(setAuthData(result))
            handleStart()
        } catch (err) {
            console.error("Login failed", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStart = () => {
        router.replace("/(tabs)/scan-qr-demo")
    }

    useEffect(() => {
        async function checkForUpdate() {
            try {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    await Updates.fetchUpdateAsync();

                    Alert.alert(
                        'Có bản cập nhật mới',
                        'Bạn có muốn tải bản cập nhật và khởi động lại app?',
                        [
                            {
                                text: 'Không',
                                style: 'cancel',
                            },
                            {
                                text: 'Có',
                                onPress: async () => {
                                    await Updates.reloadAsync();
                                },
                            },
                        ],
                    );
                }
            } catch (e) {
                console.log('Lỗi kiểm tra cập nhật:', e);
            }
        }

        checkForUpdate();
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient colors={["#FFFFFF", "#F8FFFE", "#FFFFFF"]} style={styles.overlay}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <LinearGradient colors={["#008B8B", "#20B2AA"]} style={styles.iconGradient}>
                            <Text style={styles.icon}>🏛️</Text>
                        </LinearGradient>
                        <View style={styles.iconGlow} />
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>DI SẢN QUỐC GIA</Text>
                        <View style={styles.titleUnderline} />
                        <Text style={styles.subtitle}>Bảo tồn di sản văn hóa Việt Nam</Text>
                        <Text style={styles.subtitleEn}>Vietnamese Cultural Heritage</Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.description}>
                            Ghi lại, lưu trữ và chia sẻ{"\n"}
                            những giá trị văn hóa quý báu
                        </Text>
                        <View style={styles.lotus}>
                            <Text style={styles.lotusIcon}>🪷</Text>
                        </View>
                    </View>

                    <View style={styles.features}>
                        <View style={styles.feature}>
                            <View style={styles.featureIconContainer}>
                                <LinearGradient colors={["#008B8B", "#20B2AA"]} style={styles.featureIconGradient}>
                                    <Text style={styles.featureIcon}>📜</Text>
                                </LinearGradient>
                            </View>
                            <Text style={styles.featureText}>Hiện vật</Text>
                            <Text style={styles.featureSubtext}>Artifacts</Text>
                        </View>
                        <View style={styles.feature}>
                            <View style={styles.featureIconContainer}>
                                <LinearGradient colors={["#008B8B", "#20B2AA"]} style={styles.featureIconGradient}>
                                    <Text style={styles.featureIcon}>📸</Text>
                                </LinearGradient>
                            </View>
                            <Text style={styles.featureText}>Ghi lại</Text>
                            <Text style={styles.featureSubtext}>Capture</Text>
                        </View>
                        <View style={styles.feature}>
                            <View style={styles.featureIconContainer}>
                                <LinearGradient colors={["#008B8B", "#20B2AA"]} style={styles.featureIconGradient}>
                                    <Text style={styles.featureIcon}>🔍</Text>
                                </LinearGradient>
                            </View>
                            <Text style={styles.featureText}>Khám phá</Text>
                            <Text style={styles.featureSubtext}>Explore</Text>
                        </View>
                    </View>
                </View>

                {/* CTA */}
                <View style={styles.bottom}>
                    <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={handleLogin}>
                        <LinearGradient
                            colors={["#008B8B", "#20B2AA", "#5F9EA0"]}
                            style={styles.buttonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.buttonText}>BẮT ĐẦU HÀNH TRÌNH</Text>
                            <Text style={styles.buttonSubtext}>Begin Your Journey</Text>
                        </LinearGradient>
                    </Pressable>
                </View>
            </LinearGradient>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#008B8B" />
                </View>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
        backgroundColor: "#FFFFFF",
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },

    overlay: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 30,
    },
    header: {
        flex: 1.2,
        justifyContent: "center",
        alignItems: "center",
    },
    iconContainer: {
        marginBottom: 24,
        position: "relative",
    },
    iconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#20B2AA",
        shadowColor: "#20B2AA",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    iconGlow: {
        position: "absolute",
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "rgba(32, 178, 170, 0.05)",
        top: -5,
        left: -5,
        zIndex: -1,
    },
    icon: {
        fontSize: 32,
    },
    titleContainer: {
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1A1A1A",
        marginBottom: 8,
        textAlign: "center",
        letterSpacing: 2,
    },
    titleUnderline: {
        width: 80,
        height: 2,
        backgroundColor: "#20B2AA",
        marginBottom: 12,
        borderRadius: 1,
        shadowColor: "#20B2AA",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    subtitle: {
        fontSize: 14,
        color: "#4A4A4A",
        textAlign: "center",
        lineHeight: 20,
        fontWeight: "500",
        marginBottom: 4,
    },
    subtitleEn: {
        fontSize: 11,
        color: "#6B6B6B",
        textAlign: "center",
        fontStyle: "italic",
        opacity: 0.8,
        fontWeight: "300",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    descriptionContainer: {
        alignItems: "center",
        marginBottom: 40,
        paddingHorizontal: 16,
    },
    description: {
        fontSize: 16,
        color: "#2A2A2A",
        textAlign: "center",
        lineHeight: 24,
        fontWeight: "400",
        marginBottom: 12,
    },
    lotus: {
        marginTop: 6,
    },
    lotusIcon: {
        fontSize: 20,
        opacity: 0.7,
    },
    features: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: 280,
        paddingHorizontal: 8,
    },
    feature: {
        alignItems: "center",
        flex: 1,
        marginHorizontal: 4,
    },
    featureIconContainer: {
        marginBottom: 10,
    },
    featureIconGradient: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "rgba(32, 178, 170, 0.3)",
        shadowColor: "#20B2AA",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    featureIcon: {
        fontSize: 20,
    },
    featureText: {
        fontSize: 12,
        color: "#20B2AA",
        fontWeight: "600",
        marginBottom: 2,
        textAlign: "center",
    },
    featureSubtext: {
        fontSize: 9,
        color: "#6B6B6B",
        fontStyle: "italic",
        opacity: 0.7,
        fontWeight: "300",
    },
    bottom: {
        alignItems: "center",
        paddingTop: 16,
    },
    button: {
        borderRadius: 30,
        minWidth: 240,
        shadowColor: "#20B2AA",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonPressed: {
        transform: [{ scale: 0.97 }],
    },
    buttonGradient: {
        paddingHorizontal: 36,
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#20B2AA",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 1,
        marginBottom: 2,
    },
    buttonSubtext: {
        color: "#E0FFFF",
        fontSize: 10,
        fontStyle: "italic",
        opacity: 0.9,
        fontWeight: "400",
    },
})
