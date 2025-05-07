"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string
}

export default function OptimizedImage({ src, alt, fallbackSrc = "/placeholder.svg", ...props }: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setImgSrc(typeof src === "string" ? src : fallbackSrc)
  }, [src, fallbackSrc])

  return (
    <>
      {isLoading && <div className="absolute inset-0 bg-muted/30 animate-pulse-subtle" aria-hidden="true" />}
      {imgSrc && (
        <Image
          {...props}
          src={imgSrc || "/placeholder.svg"}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImgSrc(fallbackSrc)
            setIsLoading(false)
          }}
        />
      )}
    </>
  )
}
