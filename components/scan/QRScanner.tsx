"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Dimensions, StyleSheet, Text, View } from "react-native"
import { CameraView } from "expo-camera"
import { Ionicons } from "@expo/vector-icons"
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated"

export interface QRScannerProps {
    onScan: (data: string) => void
    flashEnabled: boolean
}

const { width } = Dimensions.get("window")
const SCAN_AREA_SIZE = width * 0.7

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, flashEnabled }) => {
    const [hasScanned, setHasScanned] = useState(false)
    const scanLinePosition = useSharedValue(0)

    useEffect(() => {
        scanLinePosition.value = withRepeat(withTiming(SCAN_AREA_SIZE - 2, { duration: 2000 }), -1, true)
    }, [])

    const scanLineStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scanLinePosition.value }],
    }))

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (!hasScanned) {
            setHasScanned(true)
            onScan(data)
            setTimeout(() => setHasScanned(false), 2000)
        }
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={handleBarCodeScanned}
                enableTorch={flashEnabled}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            />

            {/* Overlay with transparent hole */}
            <View style={styles.overlay}>
                <View style={styles.topOverlay} />
                <View style={styles.middleRow}>
                    <View style={styles.sideOverlay} />
                    <View style={styles.scanBox}>
                        {/* Corner borders */}
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />

                        {/* Animated scan line */}
                        <Animated.View style={[styles.scanLine, scanLineStyle]} />
                    </View>
                    <View style={styles.sideOverlay} />
                </View>
                <View style={styles.bottomOverlay}>
                    <View style={styles.instructionContainer}>
                        <Ionicons name="qr-code" size={28} color="#fff" />
                        <Text style={styles.instructionText}>Đặt mã QR vào khung để quét</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "space-between",
    },
    topOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    bottomOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 20,
    },
    middleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    sideOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        height: SCAN_AREA_SIZE,
    },
    scanBox: {
        width: SCAN_AREA_SIZE,
        height: SCAN_AREA_SIZE,
        borderColor: "#fff",
        position: "relative",
    },
    corner: {
        position: "absolute",
        width: 24,
        height: 24,
        borderColor: "#00C2FF",
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
    },
    scanLine: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: "#00C2FF",
    },
    instructionContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    instructionText: {
        color: "#fff",
        fontSize: 16,
        marginTop: 8,
        fontWeight: "500",
    },
})
