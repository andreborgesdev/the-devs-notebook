# Storage

# **Table of Contents**

1. Disk — RAID and Volume
2. File Storage, Block Storage, and Object Storage
3. Hadoop Distributed File System (HDFS)
4. Storage comparisons
5. Choose the right datastore
6. Storage options in the Cloud

# **1. Disk — RAID and Volume**

## **1.1 RAID**

**[RAID](https://en.wikipedia.org/wiki/RAID)** (**Redundant Array of Inexpensive Disks** or **Redundant Array of Independent Disks**) is a data [storage virtualization](https://en.wikipedia.org/wiki/Storage_virtualization) technology that combines multiple physical [disk drive](https://en.wikipedia.org/wiki/Disk_drive) components into one or more logical units for the purposes of [data redundancy](https://en.wikipedia.org/wiki/Data_redundancy), performance improvement, or both.

The standard RAID levels comprise a basic set of RAID configurations that employ the techniques of [striping](https://en.wikipedia.org/wiki/Data_striping), [mirroring](https://en.wikipedia.org/wiki/Disk_mirroring), or [parity](https://en.wikipedia.org/wiki/Parity_bit#RAID) to create large reliable data stores from multiple general-purpose computer hard disk drives (HDDs) or SSDs (Solid State Drives). A RAID system consists of two or more drives working in parallel. The following figure shows the main 5 RAID levels.

![https://miro.medium.com/max/700/1*fRhgj6yQ_xkwwv8V6U9X3g.png](https://miro.medium.com/max/700/1*fRhgj6yQ_xkwwv8V6U9X3g.png)

RAID

- **[RAID 0](https://www.prepressure.com/library/technology/raid#raid-0)** — striping. data are split up into blocks that get written across all the drives in the array.
- **[RAID 1](https://www.prepressure.com/library/technology/raid#raid-1)** — mirroring. at least two drives that contain the exact same data. If a drive fails, the others will still work.
- **[RAID 10](https://www.prepressure.com/library/technology/raid#raid-10)** — combining mirroring and striping. It consists of a minimum of four drives and combines the advantages of RAID 0 and RAID 1 in one single system. It provides security by mirroring all data on secondary drives while using striping across each set of drives to speed up data transfers. This means that RAID 10 can provide the speed of RAID 0 with the redundancy of RAID 1.
- **[RAID 5](https://www.prepressure.com/library/technology/raid#raid-5)** — striping with parity. requires the use of at least 3 drives, striping the data across multiple drives like RAID 0, but also has a **parity** distributed across the drives. In the event of a single drive failure, data is pieced together using the parity information stored on the other drives.
- **[RAID 6](https://www.prepressure.com/library/technology/raid#raid-6)** — striping with double parity. RAID 6 is like RAID 5, but the parity data are written to two drives. That means it requires at least 4 drives and can withstand 2 drives dying simultaneously.

The following table is the comparison for different types of RAID.

![https://miro.medium.com/max/700/1*oDw70Tcnq4mICKe71Yir5A.png](https://miro.medium.com/max/700/1*oDw70Tcnq4mICKe71Yir5A.png)

RAID comparison

## **1.2 Volume**

**Volume** is a fixed amount of storage on a disk or tape. The term volume is often used as a synonym for the storage itself, but it is possible for **a single disk to contain more than one volume or for a volume to span more than one disk.**

![https://miro.medium.com/max/700/1*3fC-k3gD4sEsPAMKHkYsPg.png](https://miro.medium.com/max/700/1*3fC-k3gD4sEsPAMKHkYsPg.png)

Types of Volumes

**Static Volume:** A **Static Volume** is a simple and easy-to-use volume that covers all available space on the disks and RAID array selected to create the volume. A static volume does not have a storage pool and therefore can not support advanced storage features such as snapshot and Qtier.

**Thin Volume:** It must be created inside a **Storage Pool** and ****allocates space in the storage pool as data is written into the volume. Only the size of the data in the volume is used up from the pool space, and **free space in the volume does not take up any pool space**.

**Thick Volume (Flexible):** It ****allocates the total size of the volume upon creation. No matter how much data is actually stored in the volume, the total size of the volume will always be used up in the pool. On the other hand, this space is guaranteed to be available exclusively for this volume, even if other volumes used up all remaining pool free space.

# **2. File Storage, Block Storage, and Object Storage**

Data storage is used for a multitude of reasons. If you’re developing an application, you may have users that upload documents, photos, videos, or other files. You’ll need somewhere to store user files. If you’re a developer, you may use a [content delivery network (CDN)](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/) and data storage to increase load speed, availability, and reliability. If you’re in charge of IT, your main concern may be storage and backup for disaster recovery and business continuity.

Understanding different types of storage is essential to choose the right solution for your business. The main types of storage that are used widely nowadays are **File Storage**, **Block Storage**, and **Object Storage**.

![https://miro.medium.com/max/700/1*Fx29FK7N_Uq3ecXNMUL5Ng.png](https://miro.medium.com/max/700/1*Fx29FK7N_Uq3ecXNMUL5Ng.png)

Different types of storage

## **2.1 File Storage**

File storage is a solution to **store** **data as files and present it to its final users as a hierarchical directories structure**. The main advantage is to provide **a user-friendly solution to store and retrieve files**. To locate a file in file storage, the complete path of the file is required. e.g. `/home/images/beach.jpeg`. It is economical and easily structured and is usually found on hard drives, which means that they appear exactly the same for the user and on the hard drive.

**File Storage is the oldest and most widely used data storage system for direct (DAS) and NAS systems.**

File-based storage systems must scale out by adding more systems, rather than scale up by adding more capacity.

**Summary**: File storage is used for unstructured data and is commonly deployed in [Network Attached Storage](https://stonefly.com/blog/network-attached-storage-appliance-practicality-and-usage) (NAS) systems. It uses Network File System (NFS) for Linux, and Common Internet File System (CIFS) or Server Message Block (SMB) protocols for Windows.

## **2.2 Block Storage**

Block storage chops data into blocks (chunks) and stores them as separate pieces. Each block of data is given a unique identifier, which allows a storage system to place the smaller pieces of data wherever it is most convenient. That means that some data can be stored in a Linux environment and some can be stored in a Windows unit.

Block storage is often configured to decouple the data from the user’s environment and spread it across multiple environments that can better serve the data. And then, when data is requested, the underlying storage software reassembles the blocks of data from these environments and presents them back to the user.

**Block Storage is usually deployed in a storage-area network (SAN) environment and must be tied to a functioning server.**

The most common examples of Block Storage are SAN, iSCSI, and local disks.

Block storage is the most commonly used storage type for most applications. It can be either locally or network-attached and are typically formatted with a file system like FAT32, NTFS, EXT3, and EXT4.

**Summary**: Data is stored in blocks of uniform size, it is ideal for data that needs to be accessed and modified frequently as it provides low-latency. However, it is expensive, complex, and less scalable compared with **File Storage**. It also has limited capability to handle metadata, which means it needs to be dealt with at the application or database level — adding another thing for a developer or systems administrator to worry about.

## **2.3 Object Storage**

Object storage is one of the most recent storage systems. It was created in the cloud computing industry with the requirement of **storing vast amounts of unstructured data**. It is a flat structure in which files are broken into pieces and spread out among hardware. In object storage, the data is broken into discrete units called objects and is kept in a single repository, instead of being kept as files in folders or as blocks on servers.

Object storage volumes work as modular units: each is a self-contained repository that owns:1. **the data:** images, videos, websites backups2. **a unique identifier (UID)** that allows the object to be found over a distributed system3. the **metadata** that describes the data: authors of the file, permissions set on the files, date on which it was created. **The metadata is entirely customizable**

To retrieve the data, the storage operating system uses the **metadata and identifiers**, which distributes the load better and lets administrators apply policies that perform more robust searches.

Object storage requires a simple HTTP API which is used by most clients in all languages. Object storage is cost-efficient: you only pay for what you use. It can scale easily, making it a great choice for public cloud storage. It’s a storage system well suited for static data, and its agility and flat nature means it can scale to extremely large quantities of data. The objects have enough information for an application to find the data quickly and are good at storing unstructured data.

Object storage uses erasure coding for data protection. Erasure encoding is a type of algorithm that operates at the object level, spreading data and parity across nodes in a storage cluster. It provides a similar or better level of data redundancy with far less overhead than the HDFS (we will cover it later) three-way replication standard.

**Summary**: Data is stored **as objects with unique metadata and identifiers**. Although, in general, this type of storage is less expensive, but the objects can’t be modified — you have to write the object completely at once. Object storage also doesn’t work well with traditional databases, because writing objects is a slow process and writing an app to use an object storage API isn’t as simple as using file storage.

# **3. Hadoop Distributed File System (HDFS)**

The Hadoop Distributed File System (HDFS) is a distributed file system designed to run on commodity hardware. **It has many similarities with existing distributed file systems. However, the differences from other distributed file systems are significant.** HDFS is highly fault-tolerant and is designed to be deployed on low-cost hardware. HDFS provides high throughput access to application data and is suitable for applications that have large data sets. HDFS relaxes a few POSIX requirements to enable streaming access to file system data. HDFS was originally built as infrastructure for the Apache Nutch web search engine project. HDFS is now an Apache Hadoop subproject.

HDFS is designed to reliably store very large files across machines in a large cluster. **It stores each file as a sequence of blocks; all blocks in a file except the last block are the same size. The blocks of a file are replicated for fault tolerance ([HDFS requires Block Storage](https://blogs.oracle.com/bigdata/what-is-object-storage)).** The block size and replication factor are configurable per file. An application can specify the number of replicas of a file. The replication factor can be specified at file creation time and can be changed later. Files in HDFS are write-once and have strictly one writer at any time.

![https://miro.medium.com/max/700/0*SduMgbF9w_WabakD.gif](https://miro.medium.com/max/700/0*SduMgbF9w_WabakD.gif)

HDFS

# **4. Storage Comparisons**

## **[4.1 SAN vs. NAS](https://www.netapp.com/us/info/what-is-storage-area-network.aspx)**

NAS stands for [network-attached storage](https://www.enterprisestorageforum.com/storage-networking/network-attached-storage-in-the-enterprise.html). It is a **File Storage** used by enterprises large and small, as well as in SOHO (small office, home office) environments, and by creative professionals and other enthusiasts, NAS allows users to store their files on a centralized appliance or storage array.

These devices are accessible over a network using an ethernet connection and file protocols like **NFS** (Network File System) or **SMB/CIFS** (Server Message Block/Common Internet File System). Often, they contain enterprise-grade NAS drives, hard drives built to withstand operating all-day, every-day, and provide better overall performance relative to their desktop counterparts.

Some small businesses and most enterprise-grade NAS devices ship with RAID support. Typically, the more high-end the NAS system, the more RAID configuration options are available.

**A SAN is a block-based storage,** leveraging a high-speed architecture that connects servers to their logical disk units (LUNs). A LUN is a range of blocks provisioned from a pool of shared storage and presented to the server as a logical disk.

Both SAN and NAS are methods of managing storage centrally and sharing that storage with multiple hosts (servers). However, **NAS is Ethernet-based, while SAN can use Ethernet and Fibre Channel**. In addition, while SAN focuses on high performance and low latency, NAS focuses on ease of use, manageability, scalability, and lower total cost of ownership (TCO). Unlike SAN, NAS storage controllers partition the storage and then own the file system. Effectively this makes a NAS server look like a Windows or UNIX/Linux server to the server consuming the storage.

## **[4.2 NAS vs. HDFS](https://www.quora.com/What-is-the-difference-between-HDFS-and-NAS)**

- HDFS is the primary storage system of Hadoop. HDFS designs to store very large files running on a cluster of commodity hardware. While **NAS** is a file-level computer data storage server. NAS provides data access to a heterogeneous group of clients.
- HDFS distributes blocks across all the machines in a **[Hadoop cluster](https://goo.gl/gbCxq7)**. While NAS, data stores on dedicated hardware.
- Hadoop HDFS is designed to work with **[MapReduce](http://data-flair.training/blogs/hadoop-mapreduce-introduction-tutorial-comprehensive-guide/)** Framework. In MapReduce Framework computation move to the data instead of Data to computation. NAS is not suitable for MapReduce, as it stores data separately from the computations.
- Hadoop HDFS runs on the cluster commodity hardware which is cost-effective. While a NAS is a high-end storage device that includes a high cost.

## **[4.3 Block Storage vs. Object Storage](https://cloudian.com/blog/object-storage-vs-block-storage/)**

- Object storage costs about 1/3 to 1/5 as much as block storage. The detailed comparison is as below.

![https://miro.medium.com/max/700/1*rs94HZZcWz7OEFokFanXKQ.png](https://miro.medium.com/max/700/1*rs94HZZcWz7OEFokFanXKQ.png)

# **5. Choose the right datastore**

Choosing the right datastore (storage or database) for your business is not easy. You will need to take the pricing, features, and performance into account. This section summarizes some of the common selections for different use cases.

The general idea is to store metadata in a relational database or Distributed Key-Value store like Dynamo (key-value) or Cassandra (wide-column). Since NoSQL data stores do not support ACID properties in favor of scalability and performance, we need to incorporate the support for ACID properties programmatically in the logic of our services if we choose NoSQL.

To store other contents such as photos, videos, texts, binaries, and messages, we have to choose the right storage based on our requirements.

**Photo-sharing services like Instagram, also apply to Twitter**

- Store photos in a distributed file storage like [HDFS](https://en.wikipedia.org/wiki/Apache_Hadoop) or [S3](https://en.wikipedia.org/wiki/Amazon_S3) (object storage).
- Store data about users, their uploaded photos, and people they follow in RDBMS, but it is difficult to scale. So we may also do below:1. Store the schema in a distributed key-value store to enjoy the benefits offered by NoSQL. All the metadata related to photos can go to a table where the **Key** would be the **PhotoID** and the **Value** would be an object containing **PhotoLocation, UserLocation, CreationTimestamp**, etc.2. To store relationships between users and photos and the list of people a user follows, we can use a wide-column datastore like [Cassandra](https://en.wikipedia.org/wiki/Apache_Cassandra). For the **UserPhoto** table, the **Key** would be **UserID** and the **Value** would be the list of **PhotoIDs** the user owns, stored in different columns. We will have a similar scheme for the **UserFollow** table.

**URL shortening service like TinyURL**

- Since we anticipate storing billions of rows, and we don’t need to use relationships between objects — a NoSQL store like [DynamoDB](https://en.wikipedia.org/wiki/Amazon_DynamoDB) (key-value), [Cassandra](https://en.wikipedia.org/wiki/Apache_Cassandra) (wide-column) or [Riak](https://en.wikipedia.org/wiki/Riak) (key-value) is a better choice.

**File hosting service like Dropbox, Google Drive, Onedrive**

- The metadata database can be a relational database such as MySQL, or a NoSQL database service such as DynamoDB.
- To store files, we can use Block storage in which files can be stored in small parts or chunks (say 4MB).
- Object Storage is used by Dropbox to store files.

**Instant messaging service like Facebook Messenger**

- To store messages, we need to have a database that can support a very high rate of small updates and also fetch a range of records quickly. We cannot use RDBMS like MySQL or NoSQL like MongoDB because we cannot afford to read/write a row from the database every time a user receives/sends a message. **Our requirements can be easily met with a wide-column database solution like [HBase](https://en.wikipedia.org/wiki/Apache_HBase)**. We can store multiple values against one key into multiple columns.

**Video sharing services like Youtube**

- Video metadata and user data: RDBMS
- Thumbnails: **Bigtable**, as it combines multiple files into one block to store on the disk and is very efficient in reading a small amount of data.
- Videos can be stored in a distributed file storage system like [HDFS](https://en.wikipedia.org/wiki/Apache_Hadoop#HDFS) or [GlusterFS](https://en.wikipedia.org/wiki/GlusterFS).
- Spotify uses object storage to store songs.

**Real-time suggestion ([auto-complete system](https://dzone.com/articles/how-to-design-a-autocomplete-system)) service**

- Use the **Trie data structure.** The storage can be an in-memory cache (Redis or Memcached), a database, or even a file.
- Take a snapshot of the trie periodically and store it in a file. This will enable us to rebuild a trie if the server goes down.

**Web Crawler**

- Use RDBMS to store the meta-data associated with the pages.
- Store URLs on a disk for **frontier.**

**[Google Analytics (GA) like system](https://medium.com/@abhilashkrish/google-analytics-ga-like-backend-system-architecture-7a7826d56af7)**

- **Apache Kafka** is used for building real-time streaming data pipelines that reliably get data between many independent systems or applications, it allows:1. Publishing and subscribing to streams of records;2. **Storing streams of records** in a fault-tolerant, durable way
- The ingested data is read directly from Kafka by **Apache Spark** for stream processing and creates **Timeseries Ignite RDD** (Resilient Distributed Datasets). **Apache Ignite** is a distributed memory-centric database and caching platform that is used by Apache Spark users to achieve true in-memory performance.
- Use **Apache Cassandra** (Column NoSQL based on BigTable) as storage for persistence writes from Ignite. It has **great write and read performance.**

# **6. Storage options in the Cloud**

## **File Storage**

- [Amazon Elastic File System (EFS)](https://aws.amazon.com/efs/) is ideal for use cases like large content repositories, development environments, media stores, or user home directories.
- [Azure Files](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-introduction) offers fully managed file shares in the cloud that are accessible via the industry standard [Server Message Block (SMB) protocol](https://docs.microsoft.com/en-us/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) or [Network File System (NFS) protocol](https://en.wikipedia.org/wiki/Network_File_System).
- Google Cloud [Filestore](https://cloud.google.com/filestore/docs/mounting-fileshares): High-performance file storage for Google Cloud users.

## **Block Storage**

- [Amazon Elastic Block Store (EBS)](https://aws.amazon.com/ebs/) is provisioned with each virtual server and offers the ultra-low latency required for high-performance workloads.
- Azure provides a [managed disks service](https://docs.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview) for block volumes, which you can use with Azure Virtual Machines (VMs).
- Google Cloud: [Zonal persistent disk](https://cloud.google.com/compute/docs/disks#pdspecs): Efficient, reliable block storage; [Regional persistent disk](https://cloud.google.com/compute/docs/disks#repds): Regional block storage replicated in two zones; [Local SSD](https://cloud.google.com/compute/docs/disks#localssds): High performance, transient, local block storage.

## **Object Storage**

- [Amazon Simple Storage Service (Amazon S3)](https://aws.amazon.com/s3/) is ideal for building modern applications from scratch that requires scale and flexibility, and can also be used to import existing data stores for analytics, backup, or archive.
- [Azure Blob Storage](https://cloudacademy.com/course/intro-to-azure-storage/): For users with large amounts of unstructured data to store in the cloud, Blob storage offers a cost-effective and scalable solution. Every blob is organized into a container with up to a 500 TB storage account capacity limit.
- Google [Cloud Storage buckets](https://cloud.google.com/compute/docs/disks#gcsbuckets): Affordable object storage.

# **References**

- [RAID](https://www.dataplugs.com/en/raid-level-comparison-raid-0-raid-1-raid-5-raid-6-raid-10/)
- [Different types of storage](https://blog.scaleway.com/2020/understanding-the-different-types-of-storage/)
- [File block and object storage](https://www.redhat.com/en/topics/data-storage/file-block-object-storage)
- [ubuntu — file, block and object storage](https://ubuntu.com/blog/what-are-the-different-types-of-storage-block-object-and-file)
- [S3 vs HDFS](https://databricks.com/blog/2017/05/31/top-5-reasons-for-choosing-s3-over-hdfs.html)
- [HDFS](https://hadoop.apache.org/docs/r1.2.1/hdfs_design.html)
- [File Storage](https://www.ibm.com/cloud/learn/file-storage)
- [Oracle blog-what is object storage](https://blogs.oracle.com/bigdata/what-is-object-storage)
- [What is cloud object storage](https://aws.amazon.com/what-is-cloud-object-storage/?nc1=h_ls)
- [Understanding Object Storage and Block Storage Use Cases](https://cloudacademy.com/blog/object-storage-block-storage/)
- [Google cloud storage options](https://cloud.google.com/compute/docs/disks)

# **Other Topics for System Design**

- [System Design — Load Balancing](https://medium.com/must-know-computer-science/system-design-load-balancing-1c2e7675fc27)
- [System Design — Caching](https://medium.com/must-know-computer-science/system-design-caching-acbd1b02ca01)
- [System Design — Sharding / Data Partitioning](https://medium.com/must-know-computer-science/system-design-sharding-data-partitioning-b7201596aafa)
- [System Design — Indexes](https://medium.com/must-know-computer-science/system-design-indexes-f6ad3de9925d)
- [System Design — Proxies](https://medium.com/must-know-computer-science/system-design-proxies-ef5f2c2676f2)
- [System Design — Message Queues](https://medium.com/must-know-computer-science/system-design-message-queues-245612428a22)
- [System Design — Redundancy and Replication](https://medium.com/must-know-computer-science/system-design-redundancy-and-replication-e9946aa335ba)
- [System Design — SQL vs. NoSQL](https://medium.com/must-know-computer-science/system-design-sql-vs-nosql-4cdfb9f53d69)
- [System Design — CAP Problem](https://medium.com/must-know-computer-science/system-design-cap-problem-13997ed7524c)
- [System Design — Consistent Hashing](https://medium.com/must-know-computer-science/system-design-consistent-hashing-f66fa9b75f3f)
- [System Design — Client-Server Communication](https://medium.com/must-know-computer-science/system-design-client-server-communication-674818ca448d)
- [System Design — Storage](https://medium.com/must-know-computer-science/system-desing-storage-d8ef4a8d952c)
- [System Design — Other Topics](https://medium.com/must-know-computer-science/system-design-other-topics-b93b22828608)
- [Object-Oriented Programming — Basic Design Patterns in C++](https://medium.com/must-know-computer-science/basic-design-patterns-in-c-39bd3d477a5c)