# Databases

## System design

This is one of the most important topics with System Design because for any large scale application, the database is usually gonna be where our performance bottleneck is and that's because all our application server's are essentially stateless so that we can scale them horizontally as much as we need, all those servers are going to be hitting the database.

Most apps are majority reads, around 95%+.

Eventual consistency is a problem of distributed databases in general

## Basic scaling techniques:

- Indexes
    - Index based on column
    - Speeds up read performance
    - Writes and updates become slightly slower
    - More storage required for index because we have to store it
- Denormalization
    - Add redundant data to tables to reduce joins
    - Boost read performance
    - Slows down writes
    - Risk inconsistent data across tables
    - Code is harder to write
- Connection pooling
    - Allows multiple application threads to use same DB connection
    - Saves on overhead of independent DB connections
- Caching
    - Not directly related to DB
    - Cache sits in front of DB to handle serving content
    - Can’t cache everything (like dynamic data that is frequently update is not going to work very well)
    - This is one of the most important pieces. If applicable, we should let the cache handle most of the requests
- Virtual scaling
    - Get a bigger server
    - Easiest solution when starting out

## Replication and Partitioning

## Read replicas

- Create replica servers to handle reads
- Master server dedicated only to writes
- Have to handle making sure new data reaches replicas

![master-slave](./images/master-slave.png)

# Sharding

Sharding is basically a hiearchical way to index databases.

Our read and write performance goes up because all our queries fall into one particular point

One problem is that you have to split the database somehow. What do you split on?

You only shard shards when the shard grow too big.

When shard fails you use the master/slave architecture. Writes always go to master, reads are distributed across the slaves. When the master fails one of the slaves become master.

## Horizontal partitioning

- Schema of tables stay the same, but split across multiple DBs
- Downsides:
    - Hot keys (x,y,z are not going to have as much traffic as other letters),
    - No joins across shards (it is possible but really expensive)
    - No dynamic number of shards (Fixed number of shards)
- Best practices:
    - Create index on the shards

![horizontal-partitioning](./images/horizontal-partitioning.png)

## Vertical partition

- Divide schema of databases into separate tables
- Generally divide by functionality
- Best when most data in row isn't needed for most requests
- After analysing the most access data we can split the table to separate data that is accessed the most to data that is rarely accessed

![vertical-partitioning](./images/vertical-partitioning.png)

## SQL vs NoSQL

- SQL
    - + Relationships
    - + Structured Data
    - + ACID
    - - Structured Data
    - - Difficult to scale
- NoSQL
    - + Unstructured Data
    - + Horizontal scaling
    - - Eventual consistency

After scaling a SQL DB a lot we tend to make a lot of sacrifices and cut on good practices.

We chose it because we know exactly what we are going to sacrifice with SQL.

[https://blog.tryexponent.com/sql-vs-nosql](https://blog.tryexponent.com/sql-vs-nosql/#:~:text=Since%20columns%20and%20tables%20have,where%20the%20format%20is%20unknown)

[https://blog.tryexponent.com/cap-theorem/](https://blog.tryexponent.com/cap-theorem/)

## CAP Theorem

CAP stands for “Consistency”, “Availability”, and “Partition tolerance”. A **network partition**
 is a (temporary) network failure between nodes. Partition tolerance means being able to keep the nodes in a distributed database running even when there are network partitions. The theorem states that, in a distributed database, you can only ensure consistency or availability in the case of a network partition.

**Consistency**

Consistency is the property that after a write is sent to a database, all read requests sent to any node should return that updated data. In the example scenario where there is a network partition, both Node A and Node B would reject any write requests sent to them. This would ensure that the state of the data on the two nodes are the same. Or else, only Node A would have the updated data, and Node B would have stale data.

**Availability**

In a database that prioritizes availability, it’s OK to have inconsistent data across the nodes, where one node may contain stale data and another has the most updated data. Availability means that we prioritize nodes to successfully complete requests sent to them. Available databases also tend to have **eventual consistency,** which means that after some undetermined amount of time when the network partition is resolved, *eventually* , all nodes will sync with each other to have the same, updated data.In this case, Node A will receive the update first, and after some time, Node B will be updated as well.

**When should Consistency or Availability be prioritized?**

If you’re working with data that you know needs to be up-to-date, then it may be better to store it in a database that prioritizes consistency over availability. On the other hand, if it’s fine that the queried data can be slightly out-of-date, then storing it in an available database may be the better choice.

**Read Requests**

Notice that only write requests were discussed above. This is because read requests don’t affect the state of the data, and don’t require re-syncing between nodes. Read requests are typically fine during network partitions for both consistent and available databases.

**SQL Databases**

SQL databases like MySQL, PostgreSQL, Microsoft SQL Server, Oracle, etc, usually prioritize consistency. [Master-slave replication](https://en.wikipedia.org/wiki/Replication_(computing)#DATABASE) is a common distributed architecture in SQL databases, and in the event of a master becoming unavailable, the role of master would failover to one of the replica nodes. During this failover process and electing a new master node, the database cannot be written to, so that consistency is preserved.

![https://blog.tryexponent.com/content/images/pmlesson/2021/04/image.png](https://blog.tryexponent.com/content/images/pmlesson/2021/04/image.png)

**Does Consistency in CAP mean Strong Consistency?**

In a strongly consistent database, if data is written and then immediately read after, it should always return the updated data. The problem is that in a distributed system, network communication doesn’t happen instantly, since nodes/servers are physically separated from each other and transferring data takes >0 time. This is why it’s not possible to have a perfectly, strongly consistent distributed database. In the real world, when we talk about databases that prioritize consistency, we usually refer to databases that are eventually consistent, with a very short, unnoticeable lag time between nodes.

[https://blog.tryexponent.com/cap-theorem/](https://blog.tryexponent.com/cap-theorem/)

## Create a good database index

[https://www.dbta.com/Columns/DBA-Corner/Top-10-Steps-to-Building-Useful-Database-Indexes-100498.aspx](https://www.dbta.com/Columns/DBA-Corner/Top-10-Steps-to-Building-Useful-Database-Indexes-100498.aspx)

**1. Index by workload, not by table**

**2. Build indexes based on predicates**

****3. Index most-heavily used queries****

**4. Index important queries**

**5. Index to avoid sorting (GROUP BY, ORDER BY)**

**6. Create indexes for uniqueness (PK, U)**

**7. Create indexes for foreign keys**

**8. Consider adding columns for index only access**

**9. Don’t arbitrarily limit number of indexes**

**10. Be aware of data modification implications**