# DDD

# **What is Domain Driven Design (DDD)?**

DDD is kind of a set of guidelines of how to use existing techniques and design patterns and to design and organize models to solve real world problems in different domains.

It is a design pattern where the main focus is on the core domain logic. Complex designs are detected based on the domain’s model. The characteristics of DDD include:

- DDD focuses mostly on domain logic and the domain itself.
- Complex designs are completely based on the domain’s model.
- To improve the design of the model and fix any emerging issues, DDD constantly works in collaboration with domain experts.
- You will have to write more code, but it will be less error prone, and well designed

## How can I use Domain Driven Design with Test Driven Development?

DDD is a way of how you design a system (models), TDD is a way of how you develop a system. In the other word, after you apply DDD design a system, when you implement the system, you can practice TDD to make you code testable and solid. Personally, I never think TDD can help you design a system in an abstract level over a real world problem.

## How can I plug in Domain Driven Design into our agile development process?

There are three major parts introduced by DDD, ubiquities language, domain modelling and bounded context. Ubiquities language helps developers, domain expert and users to build up a common and comprehensible model based language. Domain modelling provides developers the ability to analyze a domain problem, and design a system for that problem at an abstract level — developers can have a deeper understanding to that problem, and quickly getting started to have further discussions with domain expert or users. Sometimes, to solve a domain problem, we need to deal with large models (multiple core models) and teams. Bounded context helps us to draw a map to have an explicit picture of how the large models will be divided and their interrelationships.

## What is domain model?

Short answer, domain model shows you how a domain problem should be solved. Longer answer, domain model depicts the relationships and interactions between domain entities and value objects based on domain knowledges described by domain expert or users.

## How do I design domain model?

There are basically six building blocks available for you to design a domain model: Entity, Value Object, Aggregate, Repository, Factory and Service. The basic steps of getting started are: 1) Figuring out what entities and value objects are; 2) Defining an aggregate to represent a group of related entities and value objects; 3) Choosing an entity to be the root entity of the aggregate; 4) Defining behaviours of these entities based on domain knowledge (ubiquities language); 5) Adding APIs in the root entity to ensure all child entities life cycle are managed via root entity. 6) Designing factory and repository for the root entity to manage the life cycle of the aggregate. 7) You will find that some business behaviours are belong to more than one entity, then, this is a time you need to create a service to coordinate these entities to fulfill the business behaviour.