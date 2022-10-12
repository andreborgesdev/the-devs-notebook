# System design

## Performance metrics

- Scalability
    - Ability of a system to grow and manage increased traffic
    - Increased volume of data or requests
- Reliability
    - Probability a system will fail during a period of time
    - Slightly harder to define than hardware reliability
    - A common way to measure it is to use the mean time between failures
        
        ![mean-time-between-failures](./images/mean-time-between-failures.png)
        
- Availability
    - Amount of time a system is operational during a period of time
    - Poorly designed software requiring downtime for updates is less available
        
        ![availability-calculation](./images/availability-calculation.png)
        
        ![availability-vs-downtime](./images/availability-vs-downtime.png)
        
- Reliable vs Available System
    - Reliable system is always an available system
    - Availability can be maintained by redundancy, but system may not be reliable
    - Reliable software will be more profitable because providing the same service requires less backup resources
    - Requirements will depend on function of the software
    - A real world example with a plane where one needs to go to have maintenance and we get another to substitute it (availability), the most important factor is that this substitute works well and is reliable.
- Efficiency
    - How well the system performs
    - Latency and throughput often used as metrics
- Manageability
    - Speed and difficulty involved with with maintaining system
    - Observability, how hard to track bugs
    - Difficult to develop updates
    - Want to abstract away infrastructure so product engineers don't have to worry about it, they just have to write the code
    - F.e. if we have the fastest car in the world but it is impossible to drive it without crashing. It's useless of how performance it is if we cannot work with it.

![keep-data-near](./images/keep-data-near.png)

We want to, whenever possible, keep the data we need close-by to our application.

## Latency key takeaways

- Avoid network calls whenever possible
- Replicate data across data centers for disaster recovery as well as performance
- Use CDNs to reduce latency
- Keep frequently accessed data in memory if possible rather than seeking from disk, caching

## MapReduce

MapReduce is a programming model and an associated implementation for processing and generating large data sets. Users specify a map function that processes a key/value pair to generate a set of intermediate key/value pairs, and a reduce function that merges all intermediate
values associated with the same intermediate key. Many real world tasks are expressible in this model.

Hadoop is based on map reduce.

## Rate limiting

Rate limiting is **generally used as a defensive mechanism in distributed systems, so that shared resources can maintain availability**. Rate limiting protects your APIs from unintended or malicious overuse by limiting the number of requests that can reach your API in a given period of time.

When we receive a lot of requests at once we can have rate limiting and it could be that some requests fail or are blocked due to the high request number at once

## Async processing

[https://www.tryexponent.com/courses/fundamentals-system-design/asynchronous-processing](https://www.tryexponent.com/courses/fundamentals-system-design/asynchronous-processing)

## Topics to explore

- Vertical partitioning
- Key-based (or hash-based) partitioning
- Directory-based partitioning

See CTCI for Considerations and steps to take

## Difference between horizontal and vertical scaling

The main difference between scaling up and scaling out is that horizontal scaling simply adds more machine resources to your existing machine infrastructure. Vertical scaling adds power to your existing machine infrastructure by increasing power from CPU or RAM to existing machines.

## Web servers

We should keep in mind that web servers have a connection limit before designing our system.

# Numbers programmer should know

![latency-numbers](./images/latency-numbers.png)

![data-conversions](./images/data-conversions.png)

## Common data types

Char → 1 byte

Integer → 4 bytes

UNIX timestamp → 4 bytes

![time-calculation](./images/time-calculation.png)

![traffic-estimates](./images/traffic-estimates.png)

![memory-calculation](./images/memory-calculation.png)

![bandwidth-calculation](./images/bandwidth-calculation.png)

![storage-calculation](./images/storage-calculation.png)

## Useful links

[http://highscalability.com/](http://highscalability.com/)

[https://github.com/donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)

[https://github.com/madd86/awesome-system-design](https://github.com/madd86/awesome-system-design)

[https://blog.pramp.com/how-to-succeed-in-a-system-design-interview-27b35de0df26](https://blog.pramp.com/how-to-succeed-in-a-system-design-interview-27b35de0df26)

[https://www.systemdesignnotes.com/](https://www.systemdesignnotes.com/)

[https://www.freecodecamp.org/news/systems-design-for-interviews/](https://www.freecodecamp.org/news/systems-design-for-interviews/)

[https://medium.com/the-andela-way/system-design-in-software-development-f360ce6fcbb9](https://medium.com/the-andela-way/system-design-in-software-development-f360ce6fcbb9)

[https://www.interviewbit.com/courses/system-design/](https://www.interviewbit.com/courses/system-design/)

[https://www.codemag.com/Article/1909071/Design-Patterns-for-Distributed-Systems](https://www.codemag.com/Article/1909071/Design-Patterns-for-Distributed-Systems)

[https://github.com/donnemartin/system-design-primer#study-guide](https://github.com/donnemartin/system-design-primer#study-guide)

[https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question](https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question)

[https://github.com/donnemartin/system-design-primer#system-design-interview-questions-with-solutions](https://github.com/donnemartin/system-design-primer#system-design-interview-questions-with-solutions)

[https://github.com/donnemartin/system-design-primer#object-oriented-design-interview-questions-with-solutions](https://github.com/donnemartin/system-design-primer#object-oriented-design-interview-questions-with-solutions)

[https://github.com/donnemartin/system-design-primer#additional-system-design-interview-questions](https://github.com/donnemartin/system-design-primer#additional-system-design-interview-questions)

[https://www.teamblind.com/post/Giving-back---how-I-cleared-L6-System-Design---Part-1-4yufM3RY](https://www.teamblind.com/post/Giving-back---how-I-cleared-L6-System-Design---Part-1-4yufM3RY)

[https://www.youtube.com/channel/UC9vLsnF6QPYuH51njmIooCQ](https://www.youtube.com/channel/UC9vLsnF6QPYuH51njmIooCQ)

[https://www.youtube.com/channel/UCn1XnDWhsLS5URXTi5wtFTA](https://www.youtube.com/channel/UCn1XnDWhsLS5URXTi5wtFTA)

[https://www.youtube.com/channel/UCRPMAqdtSgd0Ipeef7iFsKw](https://www.youtube.com/channel/UCRPMAqdtSgd0Ipeef7iFsKw)

[https://www.youtube.com/watch?v=DSGsa0pu8-k](https://www.youtube.com/watch?v=DSGsa0pu8-k)

[https://www.youtube.com/watch?v=ZgdS0EUmn70](https://www.youtube.com/watch?v=ZgdS0EUmn70)

[https://www.youtube.com/watch?v=MbjObHmDbZo&list=PLouYZxI9X31w4soyXyMjvHTTZTQAF_2nn&index=3&t=227s](https://www.youtube.com/watch?v=MbjObHmDbZo&list=PLouYZxI9X31w4soyXyMjvHTTZTQAF_2nn&index=3&t=227s)