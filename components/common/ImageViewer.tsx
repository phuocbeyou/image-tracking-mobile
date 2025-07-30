"use client"

import React from "react"
import { Modal, View, StyleSheet, Pressable, Dimensions, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    useAnimatedGestureHandler,
} from "react-native-reanimated"
import { PinchGestureHandler, PanGestureHandler, TapGestureHandler, State } from "react-native-gesture-handler"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

interface ImageViewerProps {
    visible: boolean
    imageUrl: string
    onClose: () => void
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ visible, imageUrl, onClose }) => {
    const [loading, setLoading] = React.useState(true)

    // Refs for gesture handlers
    const doubleTapRef = React.useRef(null)
    const pinchRef = React.useRef(null)
    const panRef = React.useRef(null)

    // Animation values
    const scale = useSharedValue(1)
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const savedScale = useSharedValue(1)
    const savedTranslateX = useSharedValue(0)
    const savedTranslateY = useSharedValue(0)

    // Reset values when modal opens
    React.useEffect(() => {
        if (visible) {
            scale.value = 1
            translateX.value = 0
            translateY.value = 0
            savedScale.value = 1
            savedTranslateX.value = 0
            savedTranslateY.value = 0
            setLoading(true)
        }
    }, [visible])

    // Pinch gesture handler for zoom
    const pinchHandler = useAnimatedGestureHandler({
        onStart: (_, ctx: any) => {
            ctx.startScale = scale.value
        },
        onActive: (event, ctx: any) => {
            // Calculate new scale value
            const newScale = Math.max(0.5, Math.min(ctx.startScale * event.scale, 6))
            scale.value = newScale
        },
        onEnd: () => {
            // If scale is too small, reset to 1
            if (scale.value < 0.8) {
                scale.value = withTiming(1)
                translateX.value = withTiming(0)
                translateY.value = withTiming(0)
            }

            // Save current values
            savedScale.value = scale.value
            savedTranslateX.value = translateX.value
            savedTranslateY.value = translateY.value
        },
    })

    // Pan gesture handler for moving the image when zoomed
    const panHandler = useAnimatedGestureHandler({
        onStart: (_, ctx: any) => {
            ctx.startX = translateX.value
            ctx.startY = translateY.value
        },
        onActive: (event, ctx: any) => {
            // Only allow panning when zoomed in
            if (scale.value > 1) {
                // Calculate max pan distance based on current zoom
                const maxPanX = ((scale.value - 1) * SCREEN_WIDTH) / 2
                const maxPanY = ((scale.value - 1) * SCREEN_HEIGHT) / 2

                translateX.value = Math.min(maxPanX, Math.max(-maxPanX, ctx.startX + event.translationX))
                translateY.value = Math.min(maxPanY, Math.max(-maxPanY, ctx.startY + event.translationY))
            }
        },
        onEnd: () => {
            // Save current values
            savedTranslateX.value = translateX.value
            savedTranslateY.value = translateY.value
        },
    })

    // Double tap handler
    const doubleTapHandler = React.useCallback(({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            if (scale.value > 1) {
                // Reset zoom
                scale.value = withTiming(1)
                translateX.value = withTiming(0)
                translateY.value = withTiming(0)
                savedScale.value = 1
                savedTranslateX.value = 0
                savedTranslateY.value = 0
            } else {
                // Zoom to 3x
                scale.value = withTiming(3)
                savedScale.value = 3
            }
        }
    }, [])

    // Animated style for the image
    const animatedImageStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
        }
    })

    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <GestureHandlerRootView style={styles.container}>
                <View style={styles.content}>
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={28} color="#fff" />
                    </Pressable>

                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    )}

                    <TapGestureHandler
                        ref={doubleTapRef}
                        numberOfTaps={2}
                        onHandlerStateChange={doubleTapHandler}
                        waitFor={pinchRef}
                    >
                        <Animated.View style={styles.imageContainer}>
                            <PinchGestureHandler
                                ref={pinchRef}
                                onGestureEvent={pinchHandler}
                                simultaneousHandlers={[panRef, doubleTapRef]}
                            >
                                <Animated.View style={styles.imageContainer}>
                                    <PanGestureHandler
                                        ref={panRef}
                                        onGestureEvent={panHandler}
                                        simultaneousHandlers={[pinchRef, doubleTapRef]}
                                        avgTouches
                                    >
                                        <Animated.View style={styles.imageContainer}>
                                            <Animated.Image
                                                source={{ uri: imageUrl }}
                                                style={[styles.image, animatedImageStyle]}
                                                resizeMode="contain"
                                                onLoad={() => setLoading(false)}
                                            />
                                        </Animated.View>
                                    </PanGestureHandler>
                                </Animated.View>
                            </PinchGestureHandler>
                        </Animated.View>
                    </TapGestureHandler>
                </View>
            </GestureHandlerRootView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    closeButton: {
        position: "absolute",
        top: 60,
        right: 20,
        zIndex: 10,
        padding: 8,
    },
    imageContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    loadingContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
})
