"use client"

import { Ionicons } from "@expo/vector-icons"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Alert, Modal, Pressable, StatusBar, StyleSheet, Text, View } from "react-native"
import { WebView } from "react-native-webview"

interface Modal3DViewerProps {
    visible: boolean
    onClose: () => void
    modelUrl: string
    artifactName: string
}

export const Modal3DViewer: React.FC<Modal3DViewerProps> = ({ visible, onClose, modelUrl, artifactName }) => {
    const webviewRef = useRef<WebView>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isWebViewReady, setIsWebViewReady] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Reset states when modal opens
    useEffect(() => {
        if (visible) {
            setIsLoading(true)
            setIsWebViewReady(false)
            setError(null)
        }
    }, [visible])

    // Send model URL to WebView when ready
    useEffect(() => {
        if (isWebViewReady && modelUrl && visible) {
            sendModelToWebView()
        }
    }, [isWebViewReady, modelUrl, visible])

    const sendModelToWebView = () => {
        if (!webviewRef.current || !modelUrl) return

        const data = {
            type: "LOAD_MODEL",
            url: modelUrl,
            timestamp: Date.now(),
        }

        webviewRef.current.postMessage(JSON.stringify(data))
    }

    const handleWebViewMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data)
            console.log("Received from WebView:", data)

            switch (data.type) {
                case "MODEL_LOADED":
                    setIsLoading(false)
                    if (data.success) {
                        console.log("Model loaded successfully")
                    } else {
                        setError(data.error || "Không thể tải model 3D")
                        Alert.alert("Lỗi", `Không thể tải model: ${data.error}`)
                    }
                    break
                case "WEBVIEW_READY":
                    setIsWebViewReady(true)
                    console.log("WebView is ready")
                    break
                default:
                    console.log("Unknown message type:", data.type)
            }
        } catch (error) {
            console.error("Error parsing WebView message:", error)
            setError("Lỗi kết nối với WebView")
        }
    }

    const handleWebViewLoad = () => {
        console.log("WebView loaded")
        // Delay to ensure WebView is fully ready
        setTimeout(() => {
            setIsWebViewReady(true)
        }, 1000)
    }

    const handleWebViewError = (error: any) => {
        console.error("WebView error:", error)
        setIsLoading(false)
        setError("Không thể tải WebView")
        Alert.alert("Lỗi", "Không thể tải trình xem 3D")
    }

    const resetView = () => {
        if (!webviewRef.current || !isWebViewReady) return

        const data = {
            type: "RESET_VIEW",
            timestamp: Date.now(),
        }

        webviewRef.current.postMessage(JSON.stringify(data))
    }

    const reloadModel = () => {
        if (modelUrl) {
            setIsLoading(true)
            setError(null)
            sendModelToWebView()
        }
    }

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </Pressable>
                    </View>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle} numberOfLines={1}>
                            {artifactName}
                        </Text>
                        <Text style={styles.headerSubtitle}>Mô hình 3D</Text>
                    </View>

                    <View style={styles.headerRight}>
                        <Pressable style={styles.actionButton} onPress={resetView}>
                            <Ionicons name="refresh" size={20} color="#fff" />
                        </Pressable>
                    </View>
                </View>

                {/* WebView Container */}
                <View style={styles.webviewContainer}>
                    <WebView
                        ref={webviewRef}
                        source={{ uri: "https://load-model-glb.vercel.app/" }}
                        style={styles.webview}
                        javaScriptEnabled
                        domStorageEnabled
                        allowsInlineMediaPlayback
                        mediaPlaybackRequiresUserAction={false}
                        originWhitelist={["*"]}
                        allowFileAccess
                        allowUniversalAccessFromFileURLs
                        allowsFullscreenVideo
                        geolocationEnabled
                        onMessage={handleWebViewMessage}
                        onLoad={handleWebViewLoad}
                        onError={handleWebViewError}
                        onLoadStart={() => setIsLoading(true)}
                        startInLoadingState={true}
                        renderLoading={() => (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#007AFF" />
                                <Text style={styles.loadingText}>Đang tải trình xem 3D...</Text>
                            </View>
                        )}
                    />

                    {/* Error Overlay */}
                    {error && (
                        <View style={styles.errorOverlay}>
                            <View style={styles.errorContent}>
                                <Ionicons name="warning-outline" size={48} color="#ff6b6b" />
                                <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
                                <Text style={styles.errorMessage}>{error}</Text>
                                <Pressable style={styles.retryButton} onPress={reloadModel}>
                                    <Text style={styles.retryButtonText}>Thử lại</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                </View>

                {/* Bottom Controls */}
                <View style={styles.bottomControls}>
                    <View style={styles.controlsContainer}>
                        <View style={styles.controlItem}>
                            <Ionicons name="move-outline" size={16} color="#666" />
                            <Text style={styles.controlText}>Kéo để xoay</Text>
                        </View>
                        <View style={styles.controlItem}>
                            <Ionicons name="resize-outline" size={16} color="#666" />
                            <Text style={styles.controlText}>Pinch để zoom</Text>
                        </View>
                        <View style={styles.controlItem}>
                            <Ionicons name="hand-left-outline" size={16} color="#666" />
                            <Text style={styles.controlText}>2 ngón để di chuyển</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: StatusBar.currentHeight || 44,
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    headerLeft: {
        width: 40,
    },
    headerCenter: {
        flex: 1,
        alignItems: "center",
    },
    headerRight: {
        width: 40,
        alignItems: "flex-end",
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    headerSubtitle: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 12,
        marginTop: 2,
    },
    webviewContainer: {
        flex: 1,
        position: "relative",
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        alignItems: "center",
        justifyContent: "center",
    },
    loadingContent: {
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: 24,
        borderRadius: 12,
        minWidth: 200,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: "#333",
        textAlign: "center",
    },
    errorOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        alignItems: "center",
        justifyContent: "center",
    },
    errorContent: {
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 12,
        marginHorizontal: 32,
        maxWidth: 300,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginTop: 12,
        marginBottom: 8,
    },
    errorMessage: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    bottomControls: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.1)",
    },
    controlsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    controlItem: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
    },
    controlText: {
        color: "#666",
        fontSize: 12,
        marginLeft: 4,
    },
})
