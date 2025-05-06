# Interview Questions

A Systems Design interview is not about building a working system. It is about measuring our aptitude.

# Steps to take on a interview:

- Define requirements
- Make estimates
- High level design
- Specific components

Requirements are critical! If they give us small requirements they are testing to see if we have common sense and we have to make sure that we are not over-designing somethings, f.e. we'll probably not need load balancers, duplicate databases, etc.

## Questions to make

1. who are the users?
2. how are they going to use it?
3. what use cases are there?
4. what are the inputs and outputs?
5. how much data do we expect to handle?
6. how many requests per second do we expect?

## Tips

1. Avoid detailing early. First ask for requirements and what we should do.
2. Avoid silver bullets. Don’t have a set architecture in mind. There’s no single architecture that’ll fit everywhere.
3. K. I. S. S. Keep it simple and stupid. The more details you get into one component, the narrower your view is. Take a step back and take a look at the entire architecture.
4. Form your thoughts. Avoid speaking without thinking the point through. Have justifications for the points you make. Don't use buzz words or half hearted thoughts in your design.
5. Be tech aware. Be aware of the current solutions and tech practices. A lot of solutions can be purchased off the shelf which simplify implementation. You should be able to argue for a custom implementation with it's pros and cons.
6. Don't have a set introduction
7. Don't do capacity estimation without any reason
8. Focus on network protocols (learn about them)
9. Lack of "internals" knowledge of systems instead of knowing what to use where. How a DB like Cassandra works, f.e.
10. Think of trade-offs while designing a system
11. Stay with the problem that you're trying to solve. Stay close to the core problem and as we expand outwards, have the previous points in mind.

Here are three major points evaluated during the interview:

1. Clarity of Thought

a. Express your thoughts in a clear manner.

b. Justify your decisions. Critical reasoning and argument are key to a successful software design.

c. When faced with a problem, use standard approaches to mitigate it. For example, say you are faced with an availability problem. State that replication and partitioning help increase availability in general, and move on to offer a solution.

d. Don’t make points without thinking them through. Half-hearted attempts at solving problems are frowned upon heavily.

1. Know about existing solutions

a. Stay up to date with the current solutions in the market. This includes products and design practices. If NoSQL is being adopted left right and center, you need to be aware of it.

b. Know when to pick a solution vs. building something custom. If you name a product, you should be (generally) aware of the features it provides.

c. Design practices enable you to meet custom requirements. Examples are decoupling systems, load balancing, sticky sessions, etc…

1. Flexibility

a. Switch your targets as the requirements shift. If the interviewer wants to know about one particular part of the system, do it first.

b. Never have a set architecture in mind. We all try to fit requirements to a system, but only after it has been shaped by the initial ones. A rigid attitude creates a brittle architecture. It will break before you do.

c. Take a step back at times to make adjustments to the general architecture. Being focused on one part can narrow our vision and bloat those areas. There will be components which can be extracted out and extended to the rest of the system.

# General Notes

- SOLID are 5 out of 20+ principles, they're good but they're just the beginning
- TDD protects an average team from doing big design mistakes and a great team from making a great design
- the various architectural styles can be combined very harmoniously: DDD, onion/layered, hexagonal, n-Tier
- include static analysis in your code review process
- the various principles can be applied with a different strictness to the various layers, the domain layer is where you should apply almost all principles all the time
- tools=programming languages, operating systems, libraries, frameworks, devops tools, CLI tools, vendors of databases, clouds, etc
- minimize the number of tools while maximizing the number of problems solved; prefer writing some glue code to introducing a new tool
- defer the choice and the introduction of tools
- isolate tools and protect against vendor lock-in
- the most important architectural traits are: convergence, non-rigidity, robustness to failure
- when doing architecture, always think about systems, their inputs and outputs, the algorithms running in each of them and the decision variables from the input required to get the desired output
- microservices is first and foremost an organizatorial pattern, introduce them when you have multiple teams; a LB pair, a bunch of worker servers and a DB master-slave replica can accomplish A LOT
- invest properly in getting the support infrastructure in place: tooling for the development so that developers get instant feedback for their changes, the ability to test without committing, and a testing environment identical to production which can run all tests quickly
- software architecture and software design go hand in hand; architecture dictates from above, but design always win or if they don't, they create havoc. For this reason:
- no ivory tower architects. Good architects code

If we want high availability of the system, we need to have multiple replicas of the service running in the system, so that if a few services die down, the system still remains available and running. Redundancy, removes the single point of failure in the system and provides a backup or spare functionality if needed in a crisis.

If only one instance of a service is required to run at any point, we can run a redundant secondary copy of the service that is not serving any traffic, but it can take control after the failover when primary has a problem.
