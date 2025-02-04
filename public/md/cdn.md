# CDN

[https://blog.tryexponent.com/cdns-content-delivery-networks/](https://blog.tryexponent.com/cdns-content-delivery-networks/)

CDNs (Content Distribution/Delivery Networks) are a modern and popular solution for minimizing request latency when fetching static assets from a server. An ideal CDN is composed of a group of servers that are spread out globally, such that no matter how far away a user is from your server (also called an origin server), they’ll always be close to a CDN server. Then, instead of having to fetch static assets (images, videos, HTML/CSS/Javascript) from the origin server, users can fetch cached copies of these files from the CDN more quickly.

**Note**: Static assets can be pretty large in size (think of an HD wallpaper image), so by fetching that file from a nearby CDN server, we actually end up saving a lot of network bandwidth too.\

They take some resources needs from the app server

**Problem Background**

When a client sends a request to an external server, that request often has to hop through many different routers before it can finally reach its destination (and then the response has to hop through many routers back). The number of these hops typically increases with the geographic distance between the client and the server, as well as the latency of the request. If a company hosting a website on a server, in an AWS datacenter in California (us-west-1), it may take ~100 ms to load for users in the US, but take 3-4 seconds to load for users in China. The good thing is that there are strategies to minimize this request latency for geographically far away users, and we should think about them when designing/building systems on a global scale.

**Note**: Static assets can be pretty large in size (think of an HD wallpaper image), so by fetching that file from a nearby CDN server, we actually end up saving a lot of network bandwidth too.

**When** *not* **to use CDNs?**

CDNs are generally a good service to add your system for reducing request latency (note, this is only for static files and not most API requests). 

However, there are some situations where you do not want to use CDNs:

- If your service’s target users are in a specific region, then there won’t be any benefit of using a CDN, as you can just host your origin servers there instead.
- CDNs are also not a good idea if the assets being served are dynamic and sensitive. You don’t want to serve stale data for sensitive situations, such as when working with financial/government services.