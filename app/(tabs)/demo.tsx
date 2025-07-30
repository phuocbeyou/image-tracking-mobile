import { useFocusEffect } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import WebView from 'react-native-webview';

const Demo = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [key, setKey] = useState(0); // Key để force re-render WebView
    const webviewRef = useRef<WebView>(null);
    const [isWebViewReady, setIsWebViewReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reload WebView khi tab được focus
    useFocusEffect(
        React.useCallback(() => {
            // Reset states khi tab được focus
            setIsLoading(true);
            setError(null);
            setIsWebViewReady(false);

            // Force re-render WebView bằng cách thay đổi key
            setKey(prev => prev + 1);

            // Reload WebView nếu đã được mount
            if (webviewRef.current) {
                webviewRef.current.reload();
            }
        }, [])
    );

    const handleWebViewLoad = () => {
        console.log("WebView loaded");
        setIsLoading(false);
        setTimeout(() => {
            setIsWebViewReady(true);
        }, 1000);
    };

    const handleWebViewError = (error: any) => {
        console.error("WebView error:", error);
        setIsLoading(false);
        setError("Không thể tải WebView");
        Alert.alert("Lỗi", "Không thể tải trình xem 3D");
    };

    const handleWebViewLoadEnd = () => {
        setIsLoading(false);
    };

    return (
        <View style={styles.webviewContainer}>
            <WebView
                key={key} // Thêm key để force re-render
                ref={webviewRef}
                source={{ uri: "https://card-visit-3d.vercel.app?type=MIND-001" }}
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
                onLoad={handleWebViewLoad}
                onLoadEnd={handleWebViewLoadEnd}
                onError={handleWebViewError}
                onLoadStart={() => setIsLoading(true)}
                startInLoadingState={false}
                cacheEnabled={true} // Disable cache để tránh conflict
                incognito={false} // Chạy ở chế độ incognito
                renderLoading={() => (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default Demo

const styles = StyleSheet.create({
    webviewContainer: {
        flex: 1,
        position: "relative",
    },
    webview: {
        paddingTop: 40,
        flex: 1,
        paddingBottom: 70
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
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: "#333",
        textAlign: "center",
    },
})