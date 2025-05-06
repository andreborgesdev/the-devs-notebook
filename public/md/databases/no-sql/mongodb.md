# MongoDB

**MongoDB** is a popular, open-source **NoSQL document database** designed for flexibility, scalability, and ease of development. Unlike traditional relational databases, MongoDB stores data in flexible, JSON-like documents, making it well-suited for applications dealing with semi-structured or rapidly changing data.

## Key Features

- **Document-Oriented**: Data is stored as documents in BSON format (binary JSON), allowing complex, hierarchical data structures.
- **Schema Flexibility**: Collections do not enforce a rigid schema, making it easy to evolve the data model over time.
- **Horizontal Scalability**: Supports automatic sharding for distributing data across multiple servers.
- **High Availability**: Replica sets provide redundancy and failover.
- **Rich Query Language**: Supports a powerful and expressive query syntax.
- **Indexing**: Supports single-field, compound, geospatial, text, and hashed indexes.

## Core Concepts

### Document

A document is a set of key-value pairs. MongoDB documents are similar to JSON objects.

```json
{
    "_id": ObjectId("507f191e810c19729de860ea"),
    "name": "Alice",
    "email": "alice@example.com",
    "age": 29,
    "interests": ["reading", "traveling", "coding"]
}
```

### Collection

A collection is a group of MongoDB documents. It is analogous to a table in relational databases.

```plaintext
users, orders, products
```

### Database

A container for collections. A MongoDB server can host multiple databases.

## CRUD Operations

### Create

```javascript
db.users.insertOne({
  name: "Alice",
  email: "alice@example.com",
  age: 29,
});
```

### Read

```javascript
db.users.find({ age: { $gte: 25 } });
```

### Update

```javascript
db.users.updateOne({ name: "Alice" }, { $set: { age: 30 } });
```

### Delete

```javascript
db.users.deleteOne({ name: "Alice" });
```

## Indexing

Indexes improve the performance of search queries.

```javascript
db.users.createIndex({ email: 1 }); // Ascending index on email
```

## Aggregation Framework

The aggregation framework is used for advanced data processing and transformation.

```javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
]);
```

## Sharding

Sharding distributes data across multiple servers to handle large datasets and high throughput operations.

```plaintext
- Choose a shard key
- MongoDB automatically routes queries to the appropriate shard
```

## Replication

Replication provides data redundancy and high availability through replica sets.

```plaintext
- Primary node: Accepts writes
- Secondary nodes: Replicate data, can serve read requests
- Automatic failover if the primary node fails
```

## Transactions

MongoDB supports **multi-document ACID transactions** starting from version 4.0.

```javascript
const session = db.getMongo().startSession();
session.startTransaction();
try {
  db.users.updateOne({ name: "Alice" }, { $inc: { balance: -100 } });
  db.orders.insertOne({ item: "Book", price: 100, user: "Alice" });
  session.commitTransaction();
} catch (error) {
  session.abortTransaction();
}
```

## Use Cases

- Content management systems (CMS)
- Real-time analytics
- Catalogs and inventory management
- IoT applications
- Personalization engines

## Strengths and Trade-offs

| Strengths                              | Trade-offs                                               |
| -------------------------------------- | -------------------------------------------------------- |
| Schema flexibility                     | Lack of rigid schema can lead to inconsistencies         |
| Easy horizontal scaling (sharding)     | Manual shard key selection can be complex                |
| Rich query and aggregation support     | Joins across collections are less performant than in SQL |
| Strong consistency (with replica sets) | Requires careful schema design for large datasets        |

## When to Use MongoDB

- When the data model requires **flexibility and frequent schema changes**.
- When **horizontal scalability** is essential.
- When dealing with **semi-structured** or **hierarchical data**.
- For applications requiring **rapid development** and **iteration**.

## When Not to Use

- When strong, complex **transactional integrity across multiple records** is critical.
- When strict **relational data modeling** and **complex joins** are needed.

## Query Example with Projection and Sort

```javascript
db.users
  .find({ age: { $gte: 25 } }, { name: 1, email: 1, _id: 0 })
  .sort({ name: 1 });
```

## Query Example with Pagination

```javascript
db.users.find().skip(10).limit(5);
```
