"use client"

import type { Metadata } from "next"
import dynamic from 'next/dynamic'



const HireMeSection = dynamic(() => import('@/components/hire-me-section'), {
  ssr: false,
  loading: () => <p>Loading...</p>
})

export default function HireMePage() {
  return <HireMeSection />
}