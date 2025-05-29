"use client";

import { useEffect } from "react";

export function useImageOptimization() {
  useEffect(() => {
    // Register service worker for image caching
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw-images.js')
        .then((registration) => {
          console.log('Image SW registered:', registration);
        })
        .catch((error) => {
          console.log('Image SW registration failed:', error);
        });
    }

    // Preload critical images
    const preloadCriticalImages = () => {
      const criticalImages = [
        '/images/logo.png',
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    preloadCriticalImages();

    // Add intersection observer for lazy loading images
    const observeImages = () => {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
              }
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );

      // Observe all images with data-src
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    };

    // Run after DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeImages);
    } else {
      observeImages();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', observeImages);
    };
  }, []);

  return null;
}
