export interface ImageInfo {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  isLocal: boolean;
  isOptimized: boolean;
}

export function parseImageSrc(src: string): ImageInfo {
  const isLocal =
    src.startsWith("./") || src.startsWith("../") || src.startsWith("/images/");
  const isHttps = src.startsWith("https://") || src.startsWith("http://");

  return {
    src,
    alt: "",
    isLocal,
    isOptimized: isLocal || isHttps,
  };
}

export function optimizeImagePath(src: string): string {
  // Convert relative paths to absolute paths
  if (src.startsWith("./images/")) {
    return src.replace("./images/", "/images/");
  }

  if (src.startsWith("../images/")) {
    return src.replace("../images/", "/images/");
  }

  // For paths that start with ../../images/, resolve them
  if (src.startsWith("../../images/")) {
    return src.replace("../../images/", "/images/");
  }

  return src;
}

export function shouldPreloadImage(src: string, index: number): boolean {
  // Preload the first few images on the page
  const isLocal = src.startsWith("/images/");
  return isLocal && index < 2; // Preload first 2 local images
}

export function getImageDimensions(src: string): {
  width?: number;
  height?: number;
} {
  // You could implement logic to extract dimensions from filename patterns
  // or maintain a mapping of known image dimensions

  // Default responsive dimensions
  return {
    width: 800,
    height: 600,
  };
}

export async function preloadCriticalImages(): Promise<void> {
  // Preload hero images or critical above-the-fold images
  const criticalImages = [
    "/images/logo.png",
    "/images/hero-bg.jpg",
    // Add other critical images here
  ];

  const preloadPromises = criticalImages.map((src) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = src;
    });
  });

  try {
    await Promise.allSettled(preloadPromises);
  } catch (error) {
    console.warn("Some critical images failed to preload:", error);
  }
}
