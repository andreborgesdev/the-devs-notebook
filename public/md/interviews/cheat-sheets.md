# Powers of 2 and Data Size Conversions

Although data volume can become enormous when dealing with distributed systems, calculation all boils down to the basics. To obtain correct calculations, it is critical to know the data volume unit using the power of 2. A byte is a sequence of 8 bits. An ASCII character uses one byte of memory (8 bits). Below is a table explaining the data volume unit.

| Power of 2 | Exact Value (X)       | Approx. Value | X Bytes into MB, GB, etc. |
| ---------- | --------------------- | ------------- | ------------------------- |
| 7          | 128                   |               |                           |
| 8          | 256                   |               |                           |
| 10         | 1024                  | 1 thousand    | 1 KB                      |
| 16         | 65,536                |               | 64 KB                     |
| 20         | 1,048,576             | 1 million     | 1 MB                      |
| 30         | 1,073,741,824         | 1 billion     | 1 GB                      |
| 32         | 4,294,967,296         |               | 4 GB                      |
| 40         | 1,099,511,627,776     | 1 trillion    | 1 TB                      |
| 50         | 1,125,899,906,842,624 | 1 quadrillion | 1 PB                      |

# Latency numbers every programmer should know

Some numbers are outdated as comuters become faster and more powerful. However, those numbers should still be able to give us an idea of the fastness or slowness of different computing operations.

| Operation                                        | Time (ms)               |
| ------------------------------------------------ | ----------------------- |
| L1 cache reference                               | 0.5 ns                  |
| Branch mispredict                                | 5 ns                    |
| L2 cache reference                               | 7 ns                    |
| Mutex lock/unlock                                | 100 ns                  |
| Main memory reference                            | 100 ns                  |
| Compress 1K bytes with Zippy                     | 10,000 ns = 10 µs       |
| Send 2K bytes over 1 Gbps network                | 20,000 ns = 20 µs       |
| Read 1 MB sequentially from memory               | 250,000 ns = 250 µs     |
| Round trip within same datacenter                | 500,000 ns = 500 µs     |
| Disk seek                                        | 10,000,000 ns = 10 ms   |
| Read 1 MB sequentially from network              | 10,000,000 ns = 10 ms   |
| Read 1 MB sequentially from disk                 | 30,000,000 ns = 30 ms   |
| Send packet CA (California) -> Netherlands -> CA | 150,000,000 ns = 150 ms |

Notes:

- ns = nanoseconds
- µs = microseconds
- ms = milliseconds
- 1 ns = 10^-9 seconds
- 1 µs = 10^-6 seconds = 1,000 ns
- 1 ms = 10^-3 seconds = 1,000 µs = 1,000,000 ns

<!-- [![Lantency Numbers]('../../images/latency-numbers.png')](https://www.digitalocean.com/products/app-platform) -->

We get the following conclusions:

- Memory is fast but the disk is slow.
- Avoid disk seeks if possible.
- Simple compression algorithms are fast.
- Compress data before sending it over the internet if possible.
- Data centers are usually in different regions, and it takes time to send data between them.

# Availability numbers

High availability is the ability of a system to be continuously operational for a desirably long period of time. High availability is measured as a percentage, with 100% means a service that has 0 downtime. Most services fall between 99% and 100%.

A service level agreement (SLA) is a commonly used term for service providers. This is an agreement between you (the service provider) and your customer, and this agreement formally defines the level of uptime your service will deliver. Cloud providers Amazon, Google, and Microsoft set their SLAs at 99.9% or above. Uptime is traditionally measured in nines. The more the nines, the better. As shown in Table 3, the number of nines correlate to the expected system downtime.

| Availability | Downtime per day  | Downtime per year |
| ------------ | ----------------- | ----------------- |
| 99%          | 14.4 minutes      | 3.65 days         |
| 99.9%        | 1.44 minutes      | 8.77 hours        |
| 99.99%       | 8.64 seconds      | 52.60 minutes     |
| 99.999%      | 864 milliseconds  | 5.26 minutes      |
| 99.9999%     | 86.4 milliseconds | 31.56 seconds     |
