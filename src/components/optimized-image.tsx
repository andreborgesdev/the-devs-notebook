"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = "empty",
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (imgRef.current && !priority) {
      observer.observe(imgRef.current);
    } else if (priority) {
      setIsInView(true);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Handle relative paths for local images
  const optimizedSrc =
    src.startsWith("../") || src.startsWith("./")
      ? src.replace(/^\.\.\//, "/").replace(/^\.\//, "/")
      : src;

  // Generate blur placeholder for better UX
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  const defaultBlurDataURL =
    blurDataURL ||
    (width && height ? generateBlurDataURL(width, height) : undefined);

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 dark:bg-gray-800 border rounded-lg",
          "min-h-[200px] text-gray-500 dark:text-gray-400",
          className
        )}
      >
        <div className="text-center">
          <div className="text-sm">Failed to load image</div>
          <div className="text-xs mt-1 opacity-70">{alt}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800",
        "transition-all duration-300",
        isLoading && "animate-pulse",
        className
      )}
    >
      {isInView && (
        <Image
          src={optimizedSrc}
          alt={alt}
          width={width || 800}
          height={height || 600}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={defaultBlurDataURL}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      )}

      {/* Loading placeholder */}
      {(!isInView || isLoading) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            {!isInView && (
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {!isInView ? "Loading image..." : "Processing..."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
