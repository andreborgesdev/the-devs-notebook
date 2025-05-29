import { OptimizedImage } from "./optimized-image";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

export function SmartImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw",
}: SmartImageProps) {
  // Function to get optimized image paths
  const getOptimizedSources = (originalSrc: string) => {
    const isLocal = originalSrc.startsWith("/images/");
    if (!isLocal) return null;

    const pathParts = originalSrc.split("/");
    const filename = pathParts[pathParts.length - 1];
    const baseName = filename.split(".")[0];

    return {
      avif: `/images/optimized/${baseName}.avif`,
      webp: `/images/optimized/${baseName}.webp`,
      original: originalSrc,
    };
  };

  const optimizedSources = getOptimizedSources(src);

  // If no optimized versions available, use regular OptimizedImage
  if (!optimizedSources) {
    return (
      <OptimizedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <picture className={className}>
      {/* AVIF - Best compression */}
      <source srcSet={optimizedSources.avif} type="image/avif" sizes={sizes} />

      {/* WebP - Good compression with wide support */}
      <source srcSet={optimizedSources.webp} type="image/webp" sizes={sizes} />

      {/* Fallback to optimized image component */}
      <OptimizedImage
        src={optimizedSources.original}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={className}
      />
    </picture>
  );
}
