'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { useSpring } from 'framer-motion'

export function use3DCard(maxRotation = 8) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHoverCapable, setIsHoverCapable] = useState(false)

  const rotateX = useSpring(0, { stiffness: 300, damping: 30 })
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 })
  const translateZ = useSpring(0, { stiffness: 300, damping: 30 })

  useEffect(() => {
    // Only enable 3D on devices with hover capability (non-touch)
    const hasHover = window.matchMedia('(hover: hover)').matches
    setIsHoverCapable(hasHover)
  }, [])

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current || !isHoverCapable) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      const rotX = (mouseY / (rect.height / 2)) * -maxRotation
      const rotY = (mouseX / (rect.width / 2)) * maxRotation

      rotateX.set(rotX)
      rotateY.set(rotY)
      translateZ.set(20)
    },
    [maxRotation, rotateX, rotateY, translateZ, isHoverCapable],
  )

  const onMouseLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
    translateZ.set(0)
  }, [rotateX, rotateY, translateZ])

  return { ref, rotateX, rotateY, translateZ, onMouseMove, onMouseLeave, isHoverCapable }
}

export function useHeroMouseTilt(maxRotation = 5) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHoverCapable, setIsHoverCapable] = useState(false)

  const rotateX = useSpring(0, { stiffness: 150, damping: 20 })
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 })

  useEffect(() => {
    const hasHover = window.matchMedia('(hover: hover)').matches
    setIsHoverCapable(hasHover)
  }, [])

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current || !isHoverCapable) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      const rotX = (mouseY / (rect.height / 2)) * -maxRotation
      const rotY = (mouseX / (rect.width / 2)) * maxRotation

      rotateX.set(rotX)
      rotateY.set(rotY)
    },
    [maxRotation, rotateX, rotateY, isHoverCapable],
  )

  const onMouseLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY])

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave, isHoverCapable }
}
