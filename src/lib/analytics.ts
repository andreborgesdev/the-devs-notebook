declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function gtag(...args: any[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
}

export function trackPageView(url: string) {
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

export function trackEvent(action: string, category: string, label?: string, value?: number) {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

export function trackSearch(searchTerm: string) {
  gtag('event', 'search', {
    search_term: searchTerm,
  });
}

export function trackContentView(contentType: string, contentId: string) {
  gtag('event', 'page_view', {
    content_type: contentType,
    content_id: contentId,
  });
}
