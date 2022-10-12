# Distributed Systems

A distributed system is **a computing environment in which various components are spread across multiple computers (or other computing devices) on a network**. These devices split up the work, coordinating their efforts to complete the job more efficiently than if a single device had been responsible for the task. All the complexity should be hidden from the user. 

Keep it simple. We shouldn't use DS if we don't need them. FB, Google, etc. didn't implement it for fun, they needed it. Always keep the design of our apps as simple as possible and only change things once that's required.

## Fallacies of Distributed Systems

- Network is reliable
- Latency is zero
- Bandwidth is infinite
- Topology doesn't change
- Network is secure
- Only one administrator
- Transport cost is zero

## Distributed Systems Characteristics

- No shared clock
- No shared memory
- Shared resources
- Concurrency and consistency

## Distributed Systems Communication

- Different parts of a DS need to be able to talk
- Requires agreed upon format or protocol
- Lots of thing can go wrong, need to handle them somehow
    - Client can't find server
    - Server crashes mid-request
    - Server response is lost
    - Client crashes

## Benefits

- More reliable, fault tolerant
- Scalability (we can scale horizontally to scale)
- Lower latency, increased performance
- Cost effective