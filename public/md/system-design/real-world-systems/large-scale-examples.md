# Large-Scale System Design Examples

## Social Media Platform (Twitter-like)

### System Requirements

#### Functional Requirements

- **User Management**: Registration, authentication, profiles
- **Tweet Functionality**: Post tweets (280 characters), reply, retweet
- **Timeline**: Home timeline, user timeline, search
- **Follow System**: Follow/unfollow users, followers/following lists
- **Notifications**: Real-time notifications for interactions
- **Media Support**: Images, videos, GIFs in tweets

#### Non-Functional Requirements

- **Scale**: 300M daily active users, 500M tweets per day
- **Availability**: 99.9% uptime
- **Consistency**: Eventually consistent for timeline, strong consistency for tweets
- **Latency**: <200ms for timeline, <100ms for posting tweets
- **Durability**: No data loss for tweets

### High-Level Architecture

```
[CDN] → [Load Balancer] → [API Gateway]
                               ↓
[User Service] [Tweet Service] [Timeline Service] [Media Service]
       ↓              ↓               ↓              ↓
[User DB]    [Tweet DB]    [Timeline Cache]  [Object Storage]
                ↓               ↓
        [Search Index]  [Message Queue]
```

### Detailed Design

#### User Service

**Responsibilities:**

- User authentication and authorization
- Profile management
- Follow/unfollow relationships

**Database Schema:**

```sql
Users: user_id, username, email, profile_data, created_at
Relationships: follower_id, following_id, created_at
```

**Scale Considerations:**

- **Caching**: Redis for user sessions and profile data
- **Database**: Sharded MySQL by user_id
- **Replication**: Master-slave for read scaling

#### Tweet Service

**Responsibilities:**

- Tweet creation, deletion, editing
- Tweet metadata management
- Reply and retweet handling

**Database Schema:**

```sql
Tweets: tweet_id, user_id, content, media_urls, created_at
Replies: reply_id, tweet_id, user_id, content, created_at
Retweets: retweet_id, original_tweet_id, user_id, created_at
```

**Scale Considerations:**

- **Sharding**: Shard by tweet_id using consistent hashing
- **Caching**: Cache popular tweets in Redis
- **Async Processing**: Queue for downstream services

#### Timeline Service

**Fan-out Strategies:**

**Fan-out on Write (Push Model):**

- Pre-compute timelines for all users
- Store in Redis/Cassandra for fast access
- Suitable for users with moderate followers

**Fan-out on Read (Pull Model):**

- Compute timeline at read time
- Merge tweets from followed users
- Suitable for celebrity users with millions of followers

**Hybrid Approach:**

- Push model for regular users
- Pull model for celebrity users
- Hybrid timelines for optimal performance

#### Search Service

**Components:**

- **Elasticsearch**: Full-text search index
- **Search API**: Query processing and ranking
- **Indexing Pipeline**: Real-time tweet indexing

**Search Features:**

- **Text Search**: Search tweet content
- **Hashtag Search**: Search by hashtags
- **User Search**: Find users by username/name
- **Advanced Filters**: Date, location, media type

### Scalability Solutions

#### Caching Strategy

**Cache Layers:**

- **CDN**: Static assets (images, CSS, JS)
- **Application Cache**: User sessions, tweet data
- **Database Cache**: Query result caching

**Cache Invalidation:**

- **Time-based**: TTL for tweet caches
- **Event-based**: Invalidate on data updates
- **Manual**: Admin controls for problematic data

#### Database Scaling

**Sharding Strategy:**

- **User Data**: Shard by user_id
- **Tweet Data**: Shard by tweet_id
- **Timeline Data**: Shard by user_id for personalized timelines

**Replication:**

- **Master-Slave**: Read replicas for scaling reads
- **Cross-Region**: Geographic distribution for global users

#### Message Queues

**Use Cases:**

- **Timeline Updates**: Asynchronous timeline computation
- **Notifications**: Real-time notification delivery
- **Analytics**: Event streaming for analytics
- **Media Processing**: Async image/video processing

### Monitoring and Operations

#### Key Metrics

- **Tweets per Second**: Tweet ingestion rate
- **Timeline Latency**: Time to generate timeline
- **Search Response Time**: Search query performance
- **Cache Hit Rate**: Effectiveness of caching layers

#### Alerting

- **High Error Rates**: API error rate thresholds
- **Latency Spikes**: Response time degradation
- **Database Issues**: Connection pool exhaustion
- **Queue Backlogs**: Message processing delays

## Video Streaming Platform (YouTube-like)

### System Requirements

#### Functional Requirements

- **Video Upload**: Upload videos up to 12 hours, multiple formats
- **Video Processing**: Transcoding to multiple resolutions
- **Video Streaming**: Adaptive bitrate streaming
- **User Management**: Channels, subscriptions, playlists
- **Search and Discovery**: Video search, recommendations
- **Comments and Interactions**: Comments, likes, dislikes

#### Non-Functional Requirements

- **Scale**: 2B hours of video watched daily
- **Storage**: Petabytes of video content
- **Bandwidth**: Terabytes per second globally
- **Availability**: 99.9% uptime
- **Latency**: <2s for video start, <150ms for CDN

### High-Level Architecture

```
[CDN (Global)] → [Load Balancer] → [API Gateway]
                                        ↓
[Upload Service] [Transcoding] [Streaming] [Metadata Service]
       ↓             ↓           ↓              ↓
[Object Storage] [Processing Queue] [CDN Cache] [Metadata DB]
       ↓
[Distributed File System]
```

### Detailed Design

#### Video Upload Service

**Components:**

- **Upload API**: Handle video file uploads
- **Resumable Uploads**: Support for large file uploads
- **Pre-processing**: Initial video validation
- **Storage**: Temporary storage for processing

**Upload Flow:**

1. Client requests upload URL
2. Video uploaded to temporary storage
3. Upload service validates file
4. Video queued for transcoding
5. Client receives upload confirmation

#### Video Transcoding Service

**Processing Pipeline:**

1. **Input Validation**: Check video format and quality
2. **Transcoding**: Convert to multiple resolutions (480p, 720p, 1080p, 4K)
3. **Thumbnail Generation**: Create video thumbnails
4. **Metadata Extraction**: Extract video duration, dimensions
5. **Storage**: Store processed videos in distributed storage

**Scalability:**

- **Distributed Workers**: Multiple transcoding workers
- **Queue Management**: Priority queues for processing
- **Resource Optimization**: GPU acceleration for transcoding
- **Async Processing**: Non-blocking transcoding pipeline

#### Content Delivery Network (CDN)

**CDN Strategy:**

- **Global Distribution**: Edge servers in multiple regions
- **Caching Policy**: Cache popular videos at edge
- **Adaptive Streaming**: Serve appropriate quality based on bandwidth
- **Cache Invalidation**: Update cached content when needed

**CDN Architecture:**

```
Origin Servers → Regional CDNs → Edge CDNs → Users
```

#### Video Streaming Service

**Streaming Protocols:**

- **HLS (HTTP Live Streaming)**: Apple's streaming protocol
- **DASH**: Dynamic Adaptive Streaming over HTTP
- **WebRTC**: Real-time communication for live streaming

**Adaptive Bitrate Streaming:**

- Multiple quality versions of each video
- Client automatically selects quality based on bandwidth
- Smooth quality transitions during playback

#### Metadata Service

**Data Models:**

```sql
Videos: video_id, title, description, duration, upload_time, user_id
Users: user_id, channel_name, subscriber_count, created_at
Comments: comment_id, video_id, user_id, content, timestamp
```

**Search and Discovery:**

- **Elasticsearch**: Full-text search for videos
- **Recommendation Engine**: ML-based video recommendations
- **Trending Algorithm**: Popular video identification

### Storage Architecture

#### Video Storage

**Distributed File System:**

- **HDFS**: Hadoop Distributed File System for large files
- **Replication**: Multiple copies across data centers
- **Erasure Coding**: Efficient redundancy for cold storage
- **Tiered Storage**: Hot, warm, and cold storage tiers

**Storage Optimization:**

- **Compression**: Video compression algorithms
- **Deduplication**: Eliminate duplicate content
- **Archival**: Move old content to cheaper storage
- **Geographic Distribution**: Store content close to users

#### Metadata Storage

**Database Choices:**

- **MySQL**: Strong consistency for user data
- **Cassandra**: High write throughput for comments
- **Redis**: Caching for frequently accessed data
- **Elasticsearch**: Search and analytics

### Real-time Features

#### Live Streaming

**Components:**

- **RTMP Ingestion**: Real-time messaging protocol
- **Stream Processing**: Low-latency video processing
- **WebRTC**: Browser-based streaming
- **Chat Service**: Real-time chat during streams

#### Real-time Analytics

**Metrics Collection:**

- **View Counts**: Real-time video view tracking
- **Engagement**: Likes, comments, shares in real-time
- **Performance**: Streaming quality and buffering events
- **Revenue**: Ad impressions and click-through rates

### Recommendation System

#### Recommendation Algorithm

**Collaborative Filtering:**

- User-based: Find similar users and recommend their preferences
- Item-based: Recommend videos similar to user's history

**Content-Based Filtering:**

- Video features: Category, tags, duration
- User features: Age, location, interests
- Hybrid approach combining multiple signals

**Machine Learning Pipeline:**

1. **Data Collection**: User interactions, video metadata
2. **Feature Engineering**: Extract relevant features
3. **Model Training**: Train recommendation models
4. **A/B Testing**: Test model performance
5. **Deployment**: Serve recommendations at scale

## E-commerce Platform (Amazon-like)

### System Requirements

#### Functional Requirements

- **Product Catalog**: Browse products, search, filters
- **User Management**: Registration, authentication, profiles
- **Shopping Cart**: Add/remove items, save for later
- **Order Management**: Place orders, payment processing
- **Inventory Management**: Stock tracking, availability
- **Reviews and Ratings**: Product reviews and ratings

#### Non-Functional Requirements

- **Scale**: 300M active users, 1M transactions per day
- **Availability**: 99.99% uptime (especially during peak times)
- **Consistency**: Strong consistency for orders, eventual for catalog
- **Performance**: <100ms for search, <200ms for checkout
- **Security**: PCI DSS compliance for payments

### High-Level Architecture

```
[CDN] → [Load Balancer] → [API Gateway] → [Microservices]
                                              ↓
[User Service] [Catalog Service] [Cart Service] [Order Service]
      ↓              ↓              ↓              ↓
[User DB]    [Product DB]    [Cache]      [Order DB]
                                              ↓
                                    [Payment Service]
                                              ↓
                                    [External Payment APIs]
```

### Detailed Design

#### Product Catalog Service

**Responsibilities:**

- Product information management
- Search and filtering capabilities
- Category and recommendation management
- Price and availability updates

**Database Schema:**

```sql
Products: product_id, name, description, price, category_id, brand_id
Categories: category_id, name, parent_category_id
Inventory: product_id, quantity, reserved_quantity, warehouse_id
```

**Search Implementation:**

- **Elasticsearch**: Full-text search with filters
- **Faceted Search**: Filter by price, brand, ratings
- **Auto-complete**: Suggest search terms
- **Personalized Results**: Rank based on user preferences

#### Shopping Cart Service

**Design Considerations:**

- **Persistence**: Store cart across sessions
- **Scalability**: Handle millions of active carts
- **Consistency**: Ensure cart accuracy
- **Performance**: Fast cart operations

**Implementation Options:**

- **Database Storage**: Persistent cart in database
- **Cache Storage**: Redis for active carts
- **Hybrid Approach**: Cache for active, DB for persistence

#### Order Service

**Order Processing Flow:**

1. **Cart Validation**: Verify items and prices
2. **Inventory Check**: Confirm product availability
3. **Payment Processing**: Charge customer payment method
4. **Order Creation**: Create order record
5. **Inventory Reservation**: Reserve products for order
6. **Fulfillment**: Trigger shipping process

**ACID Transactions:**

- Use distributed transactions for critical operations
- Implement compensation patterns for failure handling
- Maintain order state consistency across services

#### Payment Service

**Payment Flow:**

1. **Payment Method Validation**: Verify card details
2. **Fraud Detection**: Check for suspicious activity
3. **Authorization**: Get payment authorization
4. **Capture**: Capture authorized payment
5. **Reconciliation**: Match payments with orders

**Security Measures:**

- **PCI Compliance**: Secure handling of card data
- **Tokenization**: Replace sensitive data with tokens
- **Encryption**: Encrypt payment data at rest and in transit
- **Fraud Detection**: ML-based fraud prevention

### Scalability Patterns

#### Database Scaling

**Sharding Strategies:**

- **User Data**: Shard by user_id
- **Product Data**: Shard by product_id or category
- **Order Data**: Shard by user_id or order_date

**Read Replicas:**

- Separate read and write workloads
- Scale read operations independently
- Use read replicas for analytics queries

#### Caching Strategy

**Multi-level Caching:**

- **CDN**: Static assets (images, CSS, JS)
- **Application Cache**: Product data, user sessions
- **Database Cache**: Query result caching
- **Search Cache**: Cache search results

**Cache Patterns:**

- **Write-through**: Update cache on writes
- **Write-behind**: Async cache updates
- **Cache-aside**: Application manages cache

#### Event-Driven Architecture

**Event Types:**

- **Order Events**: Order placed, shipped, delivered
- **Inventory Events**: Stock updates, low inventory alerts
- **User Events**: Registration, profile updates
- **Payment Events**: Payment processed, failed, refunded

**Event Processing:**

- **Event Sourcing**: Store events as source of truth
- **CQRS**: Separate read and write models
- **Saga Pattern**: Manage distributed transactions

### Peak Traffic Handling

#### Black Friday/Cyber Monday Preparation

**Traffic Patterns:**

- 10x normal traffic during peak hours
- High read-to-write ratios for browsing
- Spike in order processing

**Scaling Strategies:**

- **Auto-scaling**: Automatic resource provisioning
- **Pre-scaling**: Scale up before expected traffic
- **Queue Management**: Use queues for order processing
- **Circuit Breakers**: Prevent cascade failures

#### Rate Limiting

**Implementation:**

- **Token Bucket**: Allow burst traffic
- **Sliding Window**: Smooth rate limiting
- **User-based**: Different limits per user type
- **API-based**: Different limits per API endpoint

### Inventory Management

#### Real-time Inventory

**Challenges:**

- Multiple warehouses with different stock levels
- Reserved inventory for pending orders
- Concurrent access to inventory data

**Solutions:**

- **Event Sourcing**: Track all inventory changes
- **Optimistic Locking**: Handle concurrent updates
- **Eventual Consistency**: Accept temporary inconsistencies
- **Periodic Reconciliation**: Correct inventory discrepancies

#### Distributed Inventory

**Multi-warehouse Management:**

- **Inventory Routing**: Route orders to optimal warehouse
- **Stock Balancing**: Balance inventory across warehouses
- **Fulfillment Optimization**: Minimize shipping costs and time
- **Backorder Management**: Handle out-of-stock scenarios

### Recommendation Engine

#### Recommendation Types

**Collaborative Filtering:**

- "Users who bought this also bought"
- Based on user behavior patterns
- Effective for popular products

**Content-based Filtering:**

- Product features and attributes
- User preference profiles
- Good for new products (cold start)

**Hybrid Approaches:**

- Combine multiple recommendation techniques
- Use ensemble methods for better accuracy
- A/B testing for recommendation optimization

#### Real-time Recommendations

**Data Pipeline:**

1. **Event Collection**: User interactions (views, clicks, purchases)
2. **Stream Processing**: Real-time feature computation
3. **Model Serving**: Serve recommendations at low latency
4. **A/B Testing**: Test recommendation algorithms
5. **Performance Monitoring**: Track recommendation effectiveness

### Analytics and Business Intelligence

#### Key Metrics

**Business Metrics:**

- **Conversion Rate**: Visitors to customers ratio
- **Average Order Value**: Revenue per order
- **Customer Lifetime Value**: Long-term customer value
- **Cart Abandonment Rate**: Incomplete checkout rate

**Technical Metrics:**

- **Page Load Time**: Website performance
- **Search Response Time**: Search functionality performance
- **API Latency**: Service response times
- **Error Rates**: System reliability metrics

#### Data Pipeline

**Architecture:**

```
Application Events → Kafka → Stream Processing → Data Warehouse
                                    ↓
                            Real-time Analytics
                                    ↓
                              Dashboards/Alerts
```

**Components:**

- **Event Collection**: Application and user events
- **Stream Processing**: Real-time analytics (Kafka Streams, Flink)
- **Batch Processing**: Historical analysis (Spark, Hadoop)
- **Data Warehouse**: Structured data for BI (Redshift, BigQuery)
- **Visualization**: Dashboards and reports (Tableau, Grafana)

### Security and Compliance

#### Data Protection

- **Encryption**: Encrypt sensitive data at rest and in transit
- **Access Control**: Role-based access to data
- **Data Masking**: Protect sensitive data in non-production
- **Audit Logging**: Track data access and modifications

#### Compliance Requirements

- **PCI DSS**: Payment card industry standards
- **GDPR**: General Data Protection Regulation
- **SOX**: Sarbanes-Oxley financial reporting
- **CCPA**: California Consumer Privacy Act

#### Security Monitoring

- **Intrusion Detection**: Monitor for security threats
- **Vulnerability Scanning**: Regular security assessments
- **Fraud Detection**: Machine learning-based fraud prevention
- **Incident Response**: Procedures for security incidents
