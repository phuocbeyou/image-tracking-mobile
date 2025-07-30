import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    Alert,
    ActivityIndicator,
    Text,
    BackHandler
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useGetArtifactsQuery } from '@/store/api/artifactApi';
import { ArtifactItem } from '@/types/artifact'
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface WebViewMessage {
    type: string;
    data?: any;
    fileMindUrl: string;
    timestamp?: number;
}
const MindARWebView = () => {
    const webviewRef = useRef<WebView>(null);
    const { data: artifacts = [], isLoading, error, refetch } = useGetArtifactsQuery();
    const fileMind = useSelector((state: RootState) => state.mind.files)
    const fileMindUrl = fileMind[0]?.fileUrl

    const [webViewReady, setWebViewReady] = useState(false);
    const [dataSent, setDataSent] = useState(false);
    const [webViewError, setWebViewError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    // Request camera permission
    useEffect(() => {
        const requestCameraPermission = async () => {
            if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                            title: 'Camera Permission Required',
                            message: 'This app needs camera access to display AR content',
                            buttonPositive: 'Grant',
                            buttonNegative: 'Deny',
                        }
                    );

                    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                        Alert.alert(
                            'Camera Permission Denied',
                            'AR features will not work without camera permission. Please enable it in settings.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Open Settings', onPress: () => {
                                        // You can add navigation to settings here
                                    }
                                }
                            ]
                        );
                    }
                } catch (err) {
                    console.error('Error requesting camera permission:', err);
                }
            }
        };

        requestCameraPermission();
    }, []);

    // Handle back button on Android
    useEffect(() => {
        const backAction = () => {
            if (webviewRef.current) {
                webviewRef.current.goBack();
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

    // Validate and filter artifacts
    const getValidArtifacts = useCallback((artifactList: ArtifactItem[]) => {
        const seenModels = new Set<string>();

        return artifactList.filter((artifact) => {
            const rawModelKey = artifact.model3dPcJpg;
            const modelKey = rawModelKey?.trim();

            // Nếu modelKey là falsy (null, undefined, '', ' ') => vẫn giữ lại
            if (!modelKey) {
                return true;
            }

            // Nếu đã thấy model hợp lệ trùng rồi => loại
            if (seenModels.has(modelKey)) {
                return false;
            }

            // Nếu model hợp lệ và chưa có => thêm vào set và giữ lại
            seenModels.add(modelKey);
            return true;
        });
    }, []);



    // Send artifacts to WebView with retry mechanism
    const sendArtifactsToWebView = useCallback(async (artifactData: ArtifactItem[][], attempt = 1) => {
        if (!webviewRef.current || !webViewReady) {
            console.log('WebView not ready, skipping data send');
            return false;
        }

        try {
            const validArtifacts = getValidArtifacts(artifactData);

            if (validArtifacts.length === 0) {
                console.warn('No valid artifacts to send');
                setWebViewError('No valid 3D artifacts found');
                return false;
            }

            // Method 1: Using postMessage (primary method)
            const message: WebViewMessage = {
                type: 'ARTIFACT_DATA',
                data: validArtifacts,
                fileMindUrl: fileMindUrl,
                timestamp: Date.now()
            };

            webviewRef.current.postMessage(JSON.stringify(message));
            console.log(`Sent ${validArtifacts.length} artifacts to WebView (attempt ${attempt})`);

            // Method 2: Using injectedJavaScript (backup method)
            const injectedJS = `
                try {
                    if (window.receiveDataFromReactNative) {
                        window.receiveDataFromReactNative(${JSON.stringify(validArtifacts)});
                        console.log('Data sent via injected JS');
                    }
                } catch (error) {
                    console.error('Error in injected JS:', error);
                }
                true;
            `;

            setTimeout(() => {
                webviewRef.current?.injectJavaScript(injectedJS);
            }, 1000);

            setDataSent(true);
            setWebViewError(null);
            setRetryCount(0);
            return true;

        } catch (error) {
            console.error(`Error sending data to WebView (attempt ${attempt}):`, error);

            if (attempt < maxRetries) {
                console.log(`Retrying in 2 seconds... (${attempt}/${maxRetries})`);
                setTimeout(() => {
                    sendArtifactsToWebView(artifactData, attempt + 1);
                }, 2000);
                setRetryCount(attempt);
            } else {
                setWebViewError('Failed to send data to WebView after multiple attempts');
            }
            return false;
        }
    }, [webViewReady, getValidArtifacts, maxRetries, fileMindUrl]);

    // Send data when artifacts are loaded and WebView is ready
    useEffect(() => {
        if (artifacts.length > 0 && !isLoading && webViewReady && !dataSent) {
            console.log('Conditions met, sending artifacts to WebView');
            sendArtifactsToWebView(artifacts);
        }
    }, [artifacts, isLoading, webViewReady, dataSent, sendArtifactsToWebView]);

    // Handle messages from WebView
    const handleWebViewMessage = useCallback((event: any) => {
        try {
            const message: WebViewMessage = JSON.parse(event.nativeEvent.data);
            console.log('Message from WebView:', message);

            switch (message.type) {
                case 'WEBVIEW_READY':
                    console.log('WebView is ready');
                    setWebViewReady(true);
                    setWebViewError(null);

                    // Send data immediately if we have artifacts
                    if (artifacts.length > 0 && !isLoading) {
                        setTimeout(() => {
                            sendArtifactsToWebView(artifacts);
                        }, 1000);
                    }
                    break;

                case 'DATA_RECEIVED':
                    console.log('WebView confirmed data reception:', message.data);
                    setDataSent(true);
                    setWebViewError(null);
                    break;

                case 'AR_INITIALIZED':
                    console.log('AR system initialized successfully');
                    break;

                case 'MODEL_LOADED':
                    console.log('3D model loaded:', message.data?.name);
                    break;

                case 'TARGET_FOUND':
                    console.log('AR target found:', message.data);
                    break;

                case 'TARGET_LOST':
                    console.log('AR target lost');
                    break;

                case 'AUDIO_PLAYING':
                    console.log('Audio started playing:', message.data?.title);
                    break;

                case 'AUDIO_STOPPED':
                    console.log('Audio stopped');
                    break;

                case 'ERROR':
                    console.error('WebView error:', message.data);
                    setWebViewError(message.data?.message || 'Unknown WebView error');

                    if (message.data?.type === 'CAMERA_ERROR') {
                        Alert.alert(
                            'Camera Error',
                            'Unable to access camera. Please check permissions.',
                            [
                                {
                                    text: 'Retry', onPress: () => {
                                        webviewRef.current?.reload();
                                    }
                                },
                                { text: 'Cancel', style: 'cancel' }
                            ]
                        );
                    }
                    break;

                case 'REQUEST_DATA':
                    console.log('WebView requesting data');
                    if (artifacts.length > 0) {
                        sendArtifactsToWebView(artifacts);
                    }
                    break;

                default:
                    console.log('Unknown message type from WebView:', message.type);
            }
        } catch (error) {
            console.error('Error parsing WebView message:', error);
        }
    }, [artifacts, isLoading, sendArtifactsToWebView]);

    // Handle WebView errors
    const handleWebViewError = useCallback((syntheticEvent: any) => {
        const { nativeEvent } = syntheticEvent;
        console.error('WebView error:', nativeEvent);
        setWebViewError('Failed to load WebView');

        Alert.alert(
            'WebView Error',
            'Failed to load AR viewer. Please check your internet connection.',
            [
                {
                    text: 'Retry', onPress: () => {
                        setWebViewError(null);
                        setWebViewReady(false);
                        setDataSent(false);
                        webviewRef.current?.reload();
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    }, []);

    // Handle WebView load
    const handleWebViewLoad = useCallback(() => {
        console.log('WebView loaded successfully');
        setWebViewError(null);

        // Send a ping to check if WebView is responsive
        setTimeout(() => {
            const pingMessage = {
                type: 'PING',
                timestamp: Date.now()
            };
            webviewRef.current?.postMessage(JSON.stringify(pingMessage));
        }, 1000);
    }, []);

    // Retry function
    const handleRetry = useCallback(() => {
        setWebViewError(null);
        setWebViewReady(false);
        setDataSent(false);
        setRetryCount(0);

        if (error) {
            refetch();
        } else {
            webviewRef.current?.reload();
        }
    }, [error, refetch]);

    // Render loading state
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading artifacts...</Text>
            </View>
        );
    }

    // Render error state
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Failed to load artifacts</Text>
                <Text style={styles.errorText}>
                    {error.toString()}
                </Text>
                <Text style={styles.retryButton} onPress={handleRetry}>
                    Tap to retry
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Status indicators */}
            {!webViewReady && (
                <View style={styles.statusContainer}>
                    <ActivityIndicator size="small" color="#FFC107" />
                    <Text style={styles.statusText}>Initializing AR...</Text>
                </View>
            )}

            {webViewReady && !dataSent && artifacts.length > 0 && (
                <View style={styles.statusContainer}>
                    <ActivityIndicator size="small" color="#2196F3" />
                    <Text style={styles.statusText}>Sending data...</Text>
                </View>
            )}

            {retryCount > 0 && (
                <View style={styles.statusContainer}>
                    <Text style={styles.retryText}>
                        Retry {retryCount}/{maxRetries}
                    </Text>
                </View>
            )}

            {webViewError && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{webViewError}</Text>
                    <Text style={styles.retryButton} onPress={handleRetry}>
                        Retry
                    </Text>
                </View>
            )}

            <WebView
                ref={webviewRef}
                source={{ uri: 'https://image-tracking-three.vercel.app/' }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                mediaPlaybackRequiresUserAction={false}
                allowsInlineMediaPlayback={true}
                originWhitelist={['*']}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                allowsFullscreenVideo={true}
                geolocationEnabled={true}
                onMessage={handleWebViewMessage}
                onError={handleWebViewError}
                onLoad={handleWebViewLoad}
                onLoadStart={() => console.log('WebView load started')}
                onLoadEnd={() => console.log('WebView load ended')}
                cacheEnabled={false} // Disable cache for development
                androidLayerType="hardware"
                style={styles.webview}
                startInLoadingState={true}
                renderLoading={() => (
                    <View style={styles.webviewLoadingContainer}>
                        <ActivityIndicator size="large" color="#4CAF50" />
                        <Text style={styles.webviewLoadingText}>Loading AR Viewer...</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default MindARWebView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    loadingText: {
        color: '#fff',
        marginTop: 16,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 20,
    },
    errorTitle: {
        color: '#f44336',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    errorText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        opacity: 0.8,
    },
    retryButton: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    statusContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        zIndex: 10,
    },
    statusText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 14,
    },
    retryText: {
        color: '#FFC107',
        fontSize: 14,
        fontWeight: 'bold',
    },
    errorBanner: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(244, 67, 54, 0.9)',
        padding: 12,
        borderRadius: 8,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    errorBannerText: {
        color: '#fff',
        fontSize: 14,
        flex: 1,
    },
    webviewLoadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    webviewLoadingText: {
        color: '#fff',
        marginTop: 16,
        fontSize: 16,
    },
});