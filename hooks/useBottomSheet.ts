"use client"

import { useRef } from "react"
import { Animated } from "react-native"

export const useBottomSheet = () => {
  const animatedValue = useRef(new Animated.Value(0)).current

  const show = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start()
  }

  const hide = () => {
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start()
  }

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  })

  return {
    show,
    hide,
    translateY,
    animatedValue,
  }
}
