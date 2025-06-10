# Interview Questions

A Systems Design interview is not about building a working system. It is about measuring our aptitude.

## Steps to take on a interview:

- Define requirements
- High level design
- Specific components
- Final review

Requirements are critical! If they give us small requirements they are testing to see if we have common sense and we have to make sure that we are not over-designing somethings, f.e. we'll probably not need load balancers, duplicate databases, etc.

## Define requirements

In a system design interview, giving out an answer quickly without thinking gives you no bonus points. Answering without a thorough understanding of the requirements is a huge red flag as the interview is not a trivia contest. There is no right answer.

So, do not jump right in to give a solution. Slow down. Think deeply and ask questions to clarify requirements and assumptions. This is extremely important.

As an engineer, we like to solve hard problems and jump into the final design; however, this approach is likely to lead you to design the wrong system. One of the most important skills as an engineer is to ask the right questions, make the proper assumptions, and gather all the information needed to build a system. So, do not be afraid to ask questions.

When you ask a question, the interviewer either answers your question directly or asks you to make your assumptions. If the latter happens, write down your assumptions on the whiteboard or paper. You might need them later.

### Questions to ask to clarify requirements

These are the main questions to ask during the interview. They will help you understand the requirements and scope of the system you are designing:

1. what specific features are we going to build?
2. who are the users?
3. how are they going to use it?
4. how many users do we expect?
5. what are the inputs and outputs?
6. how much data do we expect to handle?
7. how many requests per second do we expect?
8. how fast does the company antecipate to scale up? What are the antecipated scales in 3 months, 6 months, 1 year, 2 years?
9. what is the company's technology stack? What existing services you might leverage to simplify the design?

At the end of the page you can find a comprehensive list of questions to ask during the interview.

## High level design

In this step, we aim to develop a high-level design and reach an agreement with the interviewer on the design. It is a great idea to collaborate with the interviewer during the process.

- Come up with an initial blueprint for the design. Ask for feedback. Treat your interviewer as a teammate and work together. Many good interviewers love to talk and get involved.
- Draw box diagrams with key components on the whiteboard or paper. This might include clients (mobile/web), APIs, web servers, data stores, cache, CDN, message queue, etc.
- Do back-of-the-envelope calculations to evaluate if your blueprint fits the scale constraints. Think out loud. Communicate with your interviewer if back-of-the-envelope is necessary before diving into it.

If possible, go through a few concrete use cases. This will help you frame the high-level design. It is also likely that the use cases would help you discover edge cases you have not yet considered.

Should we include API endpoints and database schema here? This depends on the problem. For large design problems like “Design Google search engine”, this is a bit of too low level. For a problem like designing the backend for a multi-player poker game, this is a fair game. Communicate with your interviewer.

## Specific components

At this step, you and your interviewer should have already achieved the following objectives:

- Agreed on the overall goals and feature scope
- Sketched out a high-level blueprint for the overall design
- Obtained feedback from your interviewer on the high-level design
- Had some initial ideas about areas to focus on in deep dive based on her feedback

You shall work with the interviewer to identify and prioritize components in the architecture. It is worth stressing that every interview is different. Sometimes, the interviewer may give off hints that she likes focusing on high-level design. Sometimes, for a senior candidate interview, the discussion could be on the system performance characteristics, likely focusing on the bottlenecks and resource estimations. In most cases, the interviewer may want you to dig into details of some system components. For URL shortener, it is interesting to dive into the hash function design that converts a long URL to a short one. For a chat system, how to reduce latency and how to support online/offline status are two interesting topics.

Time management is essential as it is easy to get carried away with minute details that do not demonstrate your abilities. You must be armed with signals to show your interviewer. Try not to get into unnecessary details. For example, talking about the EdgeRank algorithm of Facebook feed ranking in detail is not ideal during a system design interview as this takes much precious time and does not prove your ability in designing a scalable system.

## Final review

In this final step, the interviewer might ask you a few follow-up questions or give you the freedom to discuss other additional points. Here are a few directions to follow:

- The interviewer might want you to identify the system bottlenecks and discuss potential improvements. Never say your design is perfect and nothing can be improved. There is always something to improve upon. This is a great opportunity to show your critical thinking and leave a good final impression.
- It could be useful to give the interviewer a recap of your design. This is particularly important if you suggested a few solutions. Refreshing your interviewer’s memory can be helpful after a long session.
- Error cases (server failure, network loss, etc.) are interesting to talk about.
- Operation issues are worth mentioning. How do you monitor metrics and error logs? How to roll out the system?
- How to handle the next scale curve is also an interesting topic. For example, if your current design supports 1 million users, what changes do you need to make to support 10 million users?
- Propose other refinements you need if you had more time.

## Tips

1. Avoid detailing early. First ask for requirements and what we should do. Always ask for clarification. Do not assume your assumptions are correct.
2. Understand the requirements. If you don't understand them, ask for clarification. If you don't know what to ask, ask for examples.
3. Avoid silver bullets. Don’t have a set architecture in mind. There’s no single architecture that’ll fit everywhere. A solution designed to solve problems of a young startup is different from that of an established company with millions of users. Make sure you understand the requirements and the context of the system you are designing.
4. K. I. S. S. Keep it simple and stupid. The more details you get into one component, the narrower your view is. Take a step back and take a look at the entire architecture.
5. Form your thoughts. Avoid speaking without thinking the point through. Have justifications for the points you make. Don't use buzz words or half hearted thoughts in your design.
6. Let the interviewer know what you are thinking. Communicate with your interviewer.
7. Be tech aware. Be aware of the current solutions and tech practices. A lot of solutions can be purchased off the shelf which simplify implementation. You should be able to argue for a custom implementation with it's pros and cons.
8. Don't have a set introduction
9. Don't do capacity estimation without any reason
10. Focus on network protocols (learn about them)
11. Lack of "internals" knowledge of systems instead of knowing what to use where. How a DB like Cassandra works, f.e.
12. Think of trade-offs while designing a system
13. Stay with the problem that you're trying to solve. Stay close to the core problem and as we expand outwards, have the previous points in mind.
14. Suggest multiple solutions if possible
15. Once you agree with the interviewer on the blueprint/high level design, go into details on each component. Design the most critical components first
16. Bounce ideas off the interviewer. A good interviewer works with you as a teammate
17. Never give up!

## Don'ts

1. Don't be unprepared for typical interview questions
2. Don't jump into a solution without clarifying the requirements and assumptions
3. Don’t go into too much detail on a single component in the beginning. Give the high- level design first then drills down.
4. If you get stuck, don't hesitate to ask for hints.
5. Again, communicate. Don't think in silence.
6. Don’t think your interview is done once you give the design. You are not done until your interviewer says you are done. Ask for feedback early and often.

Here are three major points evaluated during the interview:

1. Clarity of Thought

a. Express your thoughts in a clear manner.

b. Justify your decisions. Critical reasoning and argument are key to a successful software design.

c. When faced with a problem, use standard approaches to mitigate it. For example, say you are faced with an availability problem. State that replication and partitioning help increase availability in general, and move on to offer a solution.

d. Don’t make points without thinking them through. Half-hearted attempts at solving problems are frowned upon heavily.

2. Know about existing solutions

a. Stay up to date with the current solutions in the market. This includes products and design practices. If NoSQL is being adopted left right and center, you need to be aware of it.

b. Know when to pick a solution vs. building something custom. If you name a product, you should be (generally) aware of the features it provides.

c. Design practices enable you to meet custom requirements. Examples are decoupling systems, load balancing, sticky sessions, etc…

3. Flexibility

a. Switch your targets as the requirements shift. If the interviewer wants to know about one particular part of the system, do it first.

b. Never have a set architecture in mind. We all try to fit requirements to a system, but only after it has been shaped by the initial ones. A rigid attitude creates a brittle architecture. It will break before you do.

c. Take a step back at times to make adjustments to the general architecture. Being focused on one part can narrow our vision and bloat those areas. There will be components which can be extracted out and extended to the rest of the system.

## General Notes

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

## Further questions to ask to clarify requirements

- What is the goal of accessing this data? Is it for analytics, operational processes, partner APIs, or customer-facing apps?
- What data specifically is needed to be returned a certain API call? Internal users, brokers, customer portals?
- What filters, sorting, pagination, and search criteria should be supported? Full document? Summary? Just metadata by some specific fields, etc.?
- What is the expected usage volume? E.g., by customer ID, product type, status, time period?
- What are the security and privacy requirements? Is it high-throughput (e.g., real-time dashboards) or low-volume (manual queries)?
- What is the structure of the data (f.e. in a data lake)? Files (Parquet/CSV/JSON)? Stored in folders by year/product/region?
- Do we already have an engine to query it? Synapse SQL, Databricks, Delta Lake? Or should we access raw blobs?
- What’s the freshness requirement? Do they expect real-time, near real-time, or daily batch views?
- Should we expose raw or cleaned/standardized data?
- Is the data schema stable or evolving? Should we version our API or allow dynamic schemas?
- Would you like the service to also support bulk exports or just individual API queries?

## Extensive list of questions to ask during the interview

This is an extensive list of questions to ask during the interview. Feel free to pick and choose the ones that are most relevant to the discussion as, depending on the problem, not all questions will be relevant.

**🔹 1. Understand the Business Goal**

- What is the core business objective of this product/API?
  Aligns solution with business value
- Who are the primary users or consumers?
  Clarifies stakeholders and audience
- What business process or workflow will this support?
  Helps integrate into existing operations
- What problem are we solving today?
  Grounds your solution in real impact
- How is this done currently? What’s the pain point?
  Identifies legacy inefficiencies

**🔹 2. Clarify Data Requirements**

- What data is needed? Raw or summarized/aggregated?
  Determines data modeling and query logic
- What specific fields or attributes are required?
  Prevents under- or over-fetching
- What filters/search/sorting are needed (e.g., by status, date) users need?
  Drives API contract
- Should the response be paginated?
  Critical for scalability and UX
- Is the data schema stable or evolving?
  Helps plan versioning or schema flexibility
- How fresh must the data be (real-time, hourly, daily)?
  Aligns with data lake refresh schedules

**🔹 3. Investigate the Source Systems**

- Where is the data stored? (Data lake, DB, API?)
  Clarifies integration points
- What format is the data in? (Parquet, JSON, CSV?)
  Impacts parsing/serialization
- Is there a query engine in place (Synapse, Databricks, BigQuery)?
  Affects access patterns
- Are there volume, performance, or latency constraints on the source?
  Prevents overloading systems
- Do we already have access credentials?
  Identifies blockers early

**🔹 4. Define the API/Product Behavior**

- Should this be a synchronous API, async, or both?
  Shapes architectural style
- What does the ideal user interaction look like?
  Ensures proper UX integration
- Is this read-only, or will it also support create/update/delete?
  Impacts data model & validation
- Do we need bulk query support or just single record lookups?
  Affects performance and API design
- Any audit logging or compliance requirements?
  Essential for regulated industries

**🔹 5. Set Security & Access Requirements**

- Who is allowed to access this API?
  Defines auth & access rules
- Do we need row-level or field-level access control?
  Enables role-based filtering
- Should data be encrypted in transit and at rest?
  Critical for compliance (e.g. GDPR)
- What auth method is required? (OAuth2, Azure AD?)
  Clarifies security mechanism
- Should partner APIs have different rate limits?
  Helps design API gateway strategy

**🔹 6. Think About Performance & Scaling**

- What are the expected request volumes and peak usage times?
  Impacts infra planning
- What’s the acceptable response time?
  Helps define SLAs
- Do we need caching, pre-computation, or materialized views?
  Improves performance
- Will this solution need to scale across regions or globally?
  Prepares for future growth

**🔹 7. Monitoring, Logging, and Testing**

- What metrics should we capture? (latency, usage, errors)
  Ensures observability
- Are alerts or anomaly detection required?
  Aids in SRE readiness
- Do we need audit/access logs?
  Mandatory for compliance
- Should we provide test environments or sandboxes?
  Important for partner onboarding

**🔹 8. Deployment & DevOps Constraints**

- Where should this be deployed (App Service, AKS)?
  Helps plan deployment
- Do we already have CI/CD pipelines?
  Speeds up release cycles
- Do we need performance/load/stress tests?
  Supports quality assurance
- Are there SLAs/availability requirements?
  Critical for uptime guarantees

**🔹 9. Future-Proofing & Evolution**

- What’s the MVP? What can be phased in later?
  Helps phase delivery
- Do we expect schema changes soon?
  Encourages flexible design
- Should we version the API from the start?
  Prevents future breaking changes
- Is there a plan to add more data sources later?
  Allows plug-and-play expansion
- How will success of this product/API be measured?
  Ensures solution stays valuable

**🔹 Bonus: Industry-Specific (Insurance)**

- Should data be filtered by line of business (P&C, Life)?
  Important for role-based access
- Are there data retention or compliance constraints (e.g., GDPR)?
  Affects data handling logic
- Do we need to reflect policy lifecycle events (issue, renew, claim)?
  Guides data model extensibility
- Should we anonymize or mask sensitive fields?
  Protects customer data

**Pro Tip:**

Always confirm priorities. Ask:

> “If we had to launch in 2 weeks, what’s the most essential thing to deliver first?”
