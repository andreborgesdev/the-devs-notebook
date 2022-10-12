# Clean Architecture

Uncle Bob, the well known author of Clean Code, is coming back to us with a new book called Clean Architecture which wants to take a larger view on how to create software.

Even if Clean Code is one of the major book around OOP and code design (mainly by presenting the SOLID principles), I was not totally impressed by the book.

Clean Architecture leaves me with the same feeling, even if it's pushing the development world to do better, has some good stories and present robust principles to build software.

The book is build around 34 chapters organised in chapters.

## Programming paradigm

After some introduction, there is an overview of three paradigm of programming:
- structured programming which imposes discipline on direct transfer of control
- object oriented programming which imposes discipline on indirect transfer of control
- functional programming which imposes discipline upon assignment

Uncle Bob tells us that each of these paradigm remove something from us (goto statement, function pointers and assignment) and especially tells us what not to do, not what to do. For OOP, he insists on polymorphism which brings us to [dependancy inversion](https://mikhail.io/2016/05/dependency-inversion-implies-interfaces-are-owned-by-high-level-modules/). DI allows the source code dependancy (the inheritance relationship) to points in the invert direction compared to the flow of control. 
![Dependancy Inversion](https://mikhail.io/2016/05/dependency-inversion-implies-interfaces-are-owned-by-high-level-modules//uml-dependency-inversion-with-dependency-injection.png "Dependency Inversion")



## Design Principles

This chapter present us the SOLID principles, yes the ones from Clean Code. The most important one is the dependancy inversion principle which is the pillar of the clean architecture. It will become the Dependancy Rule. The second one is Single Responsibility Principle which will become the Common Closure Principle at architectural level. Interesting thing about SRP, Uncle Bob redefines it as : "A module should be responsible to one, and only one, actor".

## Component Principles

We start to gain height. The book begins to talk about component which are the units of deployment like jar files, DLLs or even services and introduce three new principles for component cohesion :
- the Reuse / Release Equivalence Principle (RRP) : the granularity of reuse is the granularity of release
- the Common Closure Principle (CCP) : gather into components those classes that change for the same reasons and at the same times (related to SRP)
- the Common Reuse Principle (CRP) : don't force users of a component to depend on things they don't need (related to ISP)
We see that these higher principles are very similar to the SOLID ones. Finally if you understand well the SOLID principles, there are nothing really new.

However there is a very interesting thing called the [tension diagram](https://www.codingblocks.net/podcast/clean-architecture-components-and-component-cohesion/), a triangle formed by these 3 principles.. This diagram shows that these three principles interact with each other and the difficulty is to place your component inside this triangle.
The REP and CCP are inclusive principles : both tend to make component larger. The CRP is an exclusive principle, driving components to be smaller.
![Tension Diagram](https://www.codingblocks.net/wp-content/uploads/2017/12/CohesionPrinciplesTensionDiagram.jpg "Tension Diagram")

Uncle Bob advises us to focus on CCP than REP on early stage of development because develop-ability is more important than reuse.

The next three principles deal with the coupling between components:
- the Acyclic Dependancies Principles. As soon as you begin using component, you should allow no  cycles in the dependancy graph. It's always possible to break a cycle with Dependancy Inversion Principles. Important note : the component structure cannot be designed from the top down, it evolves as the system grows. Component dependancy diagrams are a map to the build-ability and maintainability of the application.
- the Stable Dependencies Principle. Some components are designed to be volatile. We expect them to change. Any of these should not depend on a component that is difficult to change. We should depend in the direction of stability. Again employing the DIP can help us to apply this principle breaking dependency on a stable component. 
- the Stable Abstractions Principle. A component should be as abstract as it is stable. The software should encapsulates the high level policies (business rules) of the system into stable component. Those policies will become difficult to change. So how to make them flexible enough to withstand change ? By using Open Closed Principle and Abstract classes (personal note : I am not convinced by this advice of abstract classes ...). 
So the SDP says that dependencies should run in the direction of stability and the SAP says that stability implies abstraction. So dependencies should run in the direction of abstraction.

Some links:
- http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod
- http://slideplayer.com/slide/10805390/
- https://www.slideshare.net/blue9frog1/ood-principles-and-patterns

## Architecture

Uncle Bob views on architecture is somewhat different of the typical architect. For him, an architect continues to be a programmer. They may not write as much code but they continue to engage in programming tasks. They do this because they cannot do their jobs if they are not experiencing the problems that they are creating for the rest of the programmer.

The architecture of a software system is the shape given it by those who build it. The purpose of that shape is to facilitate development, deployment, operation and maintenance. The main strategy is to leave as many options as possible, for as long as possible. We should carefully separate policy from the details at the point that policy has no knowledge of the details. In more pragmatic words, the business rules should not depend on the technical details of implementation. 

This leads us to draw boundary lines between components. Some of the components are core business rules, other are plugins that contains technical implementations. The DIP and SAP principles arrange dependency to point from lower-level details to higher-level abstractions (toward the core business).

The architecture chapters leads us to the [Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html) which is clearly the main advice of the book.  Clean Architecture push us to separate stable business rules (higher-level abstractions) from volatile technical details (lower-level details), defining clear boundaries. The main building block is the Dependency Rule : source code dependencies must point only inward, toward higher-level policies.

It should have the following characteristics:
- Testable
- Independent of frameworks
- Independent of the UI
- Independent of the database
- Independent of any external agency

This proposal is in fact build on the same ideas than [Hexagonal Architecture](http://alistair.cockburn.us/Hexagonal+architecture) which proposed by Alistair Cockburn in 2005 and is more and more well known. Maybe because I am accustomed to it, Hexagonal Architecture proposition is more lean and straight to the point for me. 

Some links to discover Hexagonal Architecture
- http://fideloper.com/hexagonal-architecture
- http://tpierrain.blogspot.fr/2016/04/hexagonal-layers.html
- http://alistair.cockburn.us/Hexagonal+Architecture+Live+in+Paris+with+Thomas+Pierrain (broken link due to site reconstruction :( )

Interesting note from Uncle Bob, implementing many boundaries could be costly to implement (with all their abstractions and dependency inversions). So it's a real design decision. You don't simply decide at the start which boundaries to implement and which to ignore. It takes a watchful eye to monitor the system and introduce needed boundaries.

## Details

In the last part and associated chapters, Uncle bob talks about technical details like Database, the Web or Frameworks and insists their are only details on which decisions should be delayed as far as possible.

There is also a case study and a chapter by Simon Brown which compare different code organisation : package by layer, feature or component. Ideas can be found here:
http://www.codingthearchitecture.com/2015/03/08/package_by_component_and_architecturally_aligned_testing.html

# Conclusion

I am a bit disappointed by Clean architecture. Of course, it presents must known principles (SOLID) and build from them to present the "component" principles for software architecture (CCP, RRP, CRP, ADP, SAP, SDP). it also push strong opinions which I totally agree (like Software Architects should keep coding) and a Clean Architecture software structure which is very good structure. 
However why not keep the hexagonal architecture proposal and propose improvements if necessary ?

My main feeling is that the book could easily summarised in a hundred of pages (the book is more than 350 pages). I think it could be made clearer and more straightforward. The design of the book leaves also an "old school" impression (what are these horrible chapter images ?). It also comes from the many old stories that want to bring some historical context on the subjet (but it could interest some people and brings some "old wisdom").