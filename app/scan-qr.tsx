"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { View, StyleSheet, Alert, Linking } from "react-native"
import { useFocusEffect, useRouter } from "expo-router"
import { Camera } from "expo-camera"

import { QRScanner } from "@/components/scan/QRScanner"
import { CameraPermission } from "@/components/scan/CameraPermission"
import { ScanHeader } from "@/components/scan/ScanHeader"
import { useDispatch } from "react-redux"
import { artifactApi } from "@/store/api/artifactApi"

export default function ScanScreen() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [hasPermission, setHasPermission] = useState<boolean | null>(null)
    const [permissionStatus, setPermissionStatus] = useState<"denied" | "undetermined" | "pending">("undetermined")
    const [flashEnabled, setFlashEnabled] = useState(false)
    const [scannedId, setScannedId] = useState<string | null>(null)
    const [isScreenFocused, setIsScreenFocused] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false) // Thêm state để tránh scan liên tục

    const [triggerFilter, { data: filteredArtifacts, isLoading }] = artifactApi.useLazyFilterArtifactsQuery()
    // Get resulting artifact from filtered artifacts
    const artifact = useMemo(() => filteredArtifacts?.[0], [filteredArtifacts])

    // Request camera permission
    const requestCameraPermission = async () => {
        setPermissionStatus("pending")
        const { status } = await Camera.requestCameraPermissionsAsync()

        if (status === "granted") {
            setHasPermission(true)
            setPermissionStatus("undetermined")
        } else {
            setHasPermission(false)
            setPermissionStatus("denied")

            // If permission denied, offer to open settings
            if (status === "denied") {
                Alert.alert(
                    "Cần quyền truy cập camera",
                    "Để quét mã QR, ứng dụng cần quyền truy cập camera. Vui lòng cấp quyền trong cài đặt thiết bị.",
                    [
                        { text: "Hủy", style: "cancel" },
                        { text: "Mở cài đặt", onPress: () => Linking.openSettings() },
                    ],
                )
            }
        }
    }

    // Focus effect to handle screen focus state
    useFocusEffect(
        useCallback(() => {
            setIsScreenFocused(true)
            // Reset cache khi quay lại màn hình scan
            dispatch(artifactApi.util.resetApiState())

            return () => {
                setIsScreenFocused(false)
                setScannedId(null)
                setIsProcessing(false) // Reset processing state khi rời khỏi screen
            }
        }, [dispatch]),
    )

    // Check permission on mount
    useEffect(() => {
        ; (async () => {
            const { status } = await Camera.getCameraPermissionsAsync()
            setHasPermission(status === "granted")
            if (status === "denied") {
                setPermissionStatus("denied")
            }
        })()
    }, [])

    // Handle QR code scan
    const handleScan = useCallback(
        (data: string) => {
            if (!isScreenFocused || isProcessing) return // Thêm check isProcessing

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
            let extractedId = null

            if (uuidRegex.test(data)) {
                extractedId = data
            } else {
                try {
                    const url = new URL(data)
                    const potentialId = url.pathname.split("/").pop() || ""
                    if (uuidRegex.test(potentialId)) {
                        extractedId = potentialId
                    } else {
                        Alert.alert("Mã QR không hợp lệ", "Mã QR không chứa thông tin hiện vật.")
                        return
                    }
                } catch (error) {
                    Alert.alert("Mã QR không hợp lệ", "Mã QR không chứa thông tin hiện vật.")
                    return
                }
            }

            if (extractedId) {
                setIsProcessing(true) // Set processing state

                // Invalidate cache trước khi gọi API mới
                dispatch(artifactApi.util.invalidateTags(["Artifact"]))

                // Luôn trigger API call, không phụ thuộc vào scannedId cũ
                triggerFilter({
                    filters: [
                        {
                            valueIsField: false,
                            filters: [],
                            stringCompareOption: 0,
                            field: "id",
                            operator: "eq",
                            value: `"${extractedId}"`,
                        },
                    ],
                    sorts: [{ field: "thuTu", dir: 1 }],
                    includes: [],
                    pageInfo: {
                        page: 1,
                        pageSize: 1,
                    },
                })
                setScannedId(extractedId)
            }
        },
        [isScreenFocused, isProcessing, triggerFilter, dispatch],
    )

    // Navigate to detail when artifact is loaded
    useEffect(() => {
        if (artifact && !isLoading && scannedId && isProcessing) {
            router.push({
                pathname: "/detail",
                params: {
                    id: artifact.id,
                    tenHienVat3D: artifact.tenHienVat3D,
                    gioiThieu: artifact.gioiThieu,
                    anh: artifact.anh,
                    chieuCao: artifact.chieuCao || "",
                    chieuDai: artifact.chieuDai || "",
                    chieuRong: artifact.chieuRong || "",
                    introductionLink: artifact.introductionLink || "",
                    model3dPcJpg: artifact.model3dPcJpg || "",
                    model3dMobileGlb: artifact.model3dMobileGlb || "",
                    stt: artifact.stt?.toString() || "",
                    thuTu: artifact.thuTu?.toString() || "",
                },
            })

            // Reset states sau khi navigate
            setScannedId(null)
            setIsProcessing(false)
        }
    }, [artifact, isLoading, router, scannedId, isProcessing])

    // Handle loading error - reset processing state nếu có lỗi
    useEffect(() => {
        if (!isLoading && !artifact && scannedId && isProcessing) {
            // Nếu không tìm thấy artifact, reset processing state sau 2 giây
            const timeout = setTimeout(() => {
                setIsProcessing(false)
                Alert.alert("Không tìm thấy", "Không tìm thấy thông tin hiện vật.")
            }, 2000)

            return () => clearTimeout(timeout)
        }
    }, [isLoading, artifact, scannedId, isProcessing])

    // Toggle flash
    const handleToggleFlash = () => {
        setFlashEnabled((prev) => !prev)
    }

    // If permission not granted, show permission request
    if (hasPermission === null || hasPermission === false) {
        return <CameraPermission onRequestPermission={requestCameraPermission} permissionStatus={permissionStatus} />
    }

    return (
        <View style={styles.container}>
            {isScreenFocused && hasPermission && <QRScanner onScan={handleScan} flashEnabled={flashEnabled} />}
            <ScanHeader onToggleFlash={handleToggleFlash} flashEnabled={flashEnabled} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
})
