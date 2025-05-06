# Content Delivery Network (CDN)

# CDN (Content Delivery Network)

## Overview

A **Content Delivery Network (CDN)** is a geographically distributed network of servers designed to deliver static assets (e.g., images, CSS, JavaScript, videos) to users with high availability and low latency. Instead of all user requests going to a central origin server, CDN servers cache and serve content from locations closer to the end-user.

**Key purpose:**
Minimize latency, reduce load on origin servers, and improve content delivery speed.

## Problem Background

When a client sends a request to an external server:

- The request hops through many routers.
- More hops = higher latency.
- Geographic distance increases both hop count and latency.

Example:

- US users accessing a US-based server (AWS us-west-1): \~100ms.
- Users from China accessing the same server: 3-4 seconds.

**Solution:** Distribute content globally with a CDN to reduce latency and improve speed.

## How CDNs Work

A CDN consists of a **global network of cache servers**.

When a user requests an asset:

- If the CDN **has** the asset → it returns the cached asset.
- If the CDN **does not have** the asset → it fetches the asset from the origin server, caches it, and returns it to the user.

**Benefits:**

- Faster load times by serving from geographically close servers.
- Reduces bandwidth and load on origin servers.
- Improves reliability and availability.

## Cache Population Strategies

| Type         | Description                                                                               |
| ------------ | ----------------------------------------------------------------------------------------- |
| **Push CDN** | Engineers push new/updated files to the CDN manually. CDN never requests from the origin. |
| **Pull CDN** | CDN lazily fetches files from the origin server if missing and caches them automatically. |

**Pull CDNs are more popular** due to ease of use, despite potential for stale content on cache.

## Popular CDNs

- **Cloudflare CDN**
- **AWS CloudFront**
- **GCP Cloud CDN**
- **Azure CDN**
- **Oracle CDN**

## Cache Freshness

CDNs use various strategies to manage cached content:

- **Time-based expiry** (e.g., 24-hour default TTL).
- **Cache-Control headers** to control caching duration.
- **Cache busting** with hashed URLs or etags for updated assets.

## Benefits

- **Performance:** Reduced latency and faster page loads.
- **Scalability:** Offloads traffic from origin servers.
- **Cost Efficiency:** Saves bandwidth and infrastructure costs.
- **Global Reach:** Consistent user experience worldwide.
- **Reliability:** Handles traffic spikes and DDoS protection in some CDNs.

## Limitations / When Not to Use

- **Regional User Base:** If users are all in one region, hosting servers locally might be sufficient.
- **Dynamic/Sensitive Content:** CDNs are unsuitable for frequently changing or sensitive data (e.g., financial data), due to potential cache staleness.

## Key Considerations

- Use CDNs primarily for **static assets**.
- Design caching policies thoughtfully to balance performance and data freshness.
- Leverage **Cache-Control** and cache busting to avoid stale content issues.

## Example Use Case

**Scenario:**
You are building Amazon’s product listing service which serves product metadata and images to browsers.

**Where would a CDN fit?**

- Serve **static assets** like product images, CSS, and JavaScript through the CDN.
- Keep dynamic metadata (pricing, stock levels) served directly from application servers or APIs to avoid stale information.
