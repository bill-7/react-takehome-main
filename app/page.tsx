'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Suspense, useRef, useState } from 'react'

const Blob = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Blob), { ssr: false })
const Dog = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Dog), { ssr: false })
// Use later in the task, if you'd like
const Duck = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Duck), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const [savedImages, setSavedImages] = useState<string[]>([])
  const [capture, setCapture] = useState(false)
  const [dogViewport, setDogViewport] = useState(null)

  const handleSaveImage = (imageUrl: string) => {
    setCapture(false)
    setSavedImages((prevImages) => [...prevImages, imageUrl])
  }

  return (
    <>
      <div className='bg-gray-100'>
        <div className='mx-auto flex w-full flex-col md:w-4/5 md:flex-row md:px-12'>
          <div className='mx-auto flex w-fit items-center'>
            <div className='flex w-fit flex-col items-start px-6 pt-12 text-center md:text-left'>
              <h1 className='text-5xl font-bold leading-tight'>InstaGen</h1>
              <p className='mb-2 mt-[-10px] w-full uppercase text-blue-400'>A product by Gendo</p>
              <p className='mb-8 text-2xl leading-normal'>Generate and post your own custom images.</p>
            </div>
          </div>
          <View className='top-0 flex h-72 w-full flex-col items-center justify-center'>
            <Blob />
            <Common color={null} />
          </View>
        </div>
      </div>

      <div className='mx-auto flex w-full flex-col flex-wrap items-center px-12 md:flex-row lg:w-4/5'>
        <div className='dog relative h-96 w-full py-8 sm:w-1/2'>
          <View orbit className='relative h-full sm:w-full'>
            <Suspense fallback={null}>
              <Dog
                doCapture={capture}
                viewport={dogViewport}
                saveImage={handleSaveImage}
                scale={2}
                position={[0, -1.6, 0]}
                rotation={[0.0, -0.3, 0]}
              />
              <Common color={'lightblue'} />
            </Suspense>
          </View>
        </div>
        <div className='relative h-48 w-full py-2 pl-8 sm:w-1/2 md:my-12'>
          <h2 className='mb-3 text-3xl font-bold leading-none text-gray-800'>Generate your image!</h2>
          <p className='mb-8 text-gray-600'>
            Drag, scroll, pinch, and rotate the canvas to frame your image, and then when you're happy, hit generate.
          </p>
          <div
            className='w-fit rounded-md border border-blue-400 p-2 text-blue-500 hover:cursor-pointer hover:bg-blue-50'
            onClick={() => {
              setDogViewport(document.querySelector('.dog').getBoundingClientRect())
              setCapture(true)
            }}
          >
            Generate
          </div>
        </div>
      </div>
      <div className='bg-gray-100 p-8'>
        <div className='mx-auto flex w-full flex-col flex-wrap items-center md:flex-row lg:w-4/5'>
          <div className='mx-auto grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:w-4/5 xl:grid-cols-6'>
            {[...savedImages, ...new Array(12 - savedImages.length).fill(null)].map((image, i) => (
              <div key={i} className={`h-32 w-32 rounded-md ${image ? 'relative' : 'bg-white'}`}>
                {image && <Image src={image} alt={`Generated Screenshot ${i}`} width={128} height={128} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
