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

export function Duck(props) {
  const { scene } = useGLTF('/duck.glb')

  useFrame((delta) => (scene.rotation.y += delta))

  return <primitive object={scene} {...props} />
}

function cropBase64Image(base64, x, y, width, height, saveImage) {
  const img = new Image()
  img.src = base64.startsWith('data:image') ? base64 : `data:image/png;base64,${base64}`
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').drawImage(img, x, y, width, height, 0, 0, width, height)
    saveImage(canvas.toDataURL())
  }
}

export function Dog({ doCapture, saveImage, viewport, ...props }) {
  useFrame(({ gl, scene, camera }) => {
    gl.render(scene, camera)
    if (!doCapture) return
    cropBase64Image(gl.domElement.toDataURL(), viewport.x, viewport.y, viewport.width, viewport.height, saveImage)
  }, 1)

  const { scene } = useGLTF('/dog.glb')
  return <primitive object={scene} {...props} />
}
