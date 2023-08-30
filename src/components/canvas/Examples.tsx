'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useState } from 'react'
import { useCursor, MeshDistortMaterial } from '@react-three/drei'
import { useRouter } from 'next/navigation'

export const Blob = ({ route = '/posts', ...props }) => {
  const router = useRouter()
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  return (
    <mesh
      onClick={() => router.push(route)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      {...props}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial roughness={5} color={'#1fb2f5'} />
    </mesh>
  )
}

function cropBase64Image(base64: string, vp: ViewportCoords, saveImage: (image: string) => void) {
  const img = new Image()
  img.src = base64.startsWith('data:image') ? base64 : `data:image/png;base64,${base64}`
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = vp.width
    canvas.height = vp.height
    canvas.getContext('2d')?.drawImage(img, vp.x, vp.y, vp.width, vp.height, 0, 0, vp.width, vp.height)
    saveImage(canvas.toDataURL())
  }
}

export function Animal({ animal, captureRef, saveImage, viewport, ...props }: AnimalProps) {
  useFrame(({ gl, scene, camera }) => {
    gl.render(scene, camera)
    if (!captureRef.current || !viewport) return
    captureRef.current = false
    cropBase64Image(gl.domElement.toDataURL(), viewport, saveImage)
  }, 1)

  const { scene: dog } = useGLTF('/dog.glb')
  const { scene: duck } = useGLTF('/duck.glb')
  return <primitive object={animal === 'dog' ? dog : duck} {...props} />
}

export type ViewportCoords = {
  x: number
  y: number
  width: number
  height: number
}

export type AnimalProps = {
  animal: 'dog' | 'duck'
  captureRef: React.MutableRefObject<boolean>
  saveImage: (image: string) => void
  viewport?: ViewportCoords
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}
