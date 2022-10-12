# TDD

## **What Are The Some Clarifications About Tdd?**

- TDD is neither about Testing nor about Design.
- TDD does not mean write some of the tests, then build a system that passes the tests.
- TDD does not mean do lots of Testing.

Test-Driven development is a process of developing and running automated test before actual development of the application. Hence, TDD sometimes also called as Test First Development.

## **What Is Test Driven Development (tdd)?**

Test-Driven Development starts with designing and developing tests for every small functionality of an application. In TDD approach, first the test is developed which specifies and validates what the code will do.

In normal Testing process, we first generate the code and then test [To know more about software testing refer Software Testing help]. Tests might fail since tests are developed even before the development. In order to pass the test, the development team has to develop and refactors the code. Refactoring a code means changing some code without affecting its behavior.

**Test Driven Development (TDD):** Learn with Example

The simple concept of TDD is to write and correct the failed tests before writing new code (before development). This helps to avoid duplication of code as we write a small amount of code at a time in order to pass tests. (Tests are nothing but requirement conditions that we need to test to fulfill them).

**TDD cycle defines:**

- Write a test
- Make it run.
- Change code to make it right i.e. Refactor.
- Repeat process.

## **Should There Be Specific Tests For Logging In My Application?**

That depends on your business requirements. If there are specific, measurable business requirements for logging in your application, then yes, it should be tested. If not, as in the case of most applications, logging should probably be used simply for what it is, a diagnostic tool. I use logging to help me build my tests by redirecting my logging to the Test Context using a TestContext Logging Provider that I wrote, and which can be seen in the sample code for my .NET TDD Kickstart session. This allows me to use my logging to help develop the system, gives me insight into how the logging will look when I actually use the system, and doesn't require me to make-up any fake "requirements" for logging. By the way, if anyone knows of any specific, testable requirements for logging other than, "...the system must log something…",

## **Do All Unit Test Libraries Have To Be In Every Solution?**

I don't believe so. I only bring the unit-test library for a project into a solution if I am modifying that project. Many times I am reusing existing libraries, such as a logging library, without modifying it. In that case, there is no need to include the unit-tests for the logging library in the solution. Since we should never be modifying any code without first creating a test for it, there should be no risk of ever accidentally modifying code for which we have not included the test library in the solution.

## **What Is The Primary Goal/benefit Of Unit Testing?**

Having solid unit tests allows the developers to refactor without fear. That is, they can much more easily maintain and extend the application. Since the majority of an application’s cost is in maintenance and extension, helping to reduce those costs can significantly impact the total cost of ownership (TCO) of an application.

## **What Are The Difference Between Tdd Vs. Traditional Testing?**

TDD approach is primarily a specification technique. It ensures that your source code is thoroughly tested at confirmatory level.

- With traditional testing, a successful test finds one or more defects. It is same with TDD. When a test fails, you have made progress because you know that you need to resolve the problem.
- TDD ensures that your system actually meets requirements defined for it. It helps to build your confidence about your system.
- In TDD more focus is on production code that verifies whether testing will work properly. In traditional testing, more focus is on test case design. Whether the test will show proper/improper execution of the application in order to fulfill requirements.
- In TDD, you achieve 100% coverage test. Every single line of code is tested unlike traditional testing.
- The combination of both traditional testing and TDD leads to the importance of testing the system rather than perfection of the system.
- **In Agile Modeling (AM), you should "test with purpose". You should know why you are testing something and what level its need to be tested.**

I can think of five main advantages to doing test-driven development over “test-later”. Please let me know if you come up with others:

**To make sure the tests get done –** It is very easy to forget important business rules when building tests after the code has been written. TDD helps to guarantee that all of the important features have valid tests written for them.

**To help define the problem before solving it –** Stopping before building and defining the problem in terms of a test is very helpful for gaining insight into the problem. Often, I have eliminated what would have likely been some significant rework by building my tests first.

T**o force “design for testability” –** One of the worst things about writing tests is having to go back and change working code because it isn’t testable. By doing the tests up-front, we guarantee that our code is testable before we even write it. In addition, since testable code is generally decoupled code, TDD helps to enforce a good standard that also helps reduce TCO.

**To help validate your tests –** When you follow the results of tests through from throwing a NotImplementedException to returning invalid results, to returning correct results, you have the most confidence that your test is doing what it is supposed to do.

**To help prevent scope creep –** It is often easy to creep the scope of a development effort by including features that are not currently required, because they seem easy when doing the development. If, however, you require yourself to build tests for each feature first, you are more likely to reconsider adding features that are not currently necessary.

## **Should Unit-tests Touch The Database Or Anything Out-of-process?**

In my opinion, yes. I realize that there are many who disagree with me on this point, but the fact remains that you cannot test an object which has a primary function of loading data from (or saving data to) a database without checking if it in fact, loads (or saves) said data correctly. The most important boundary not to cross in our unit tests is the one between application layers. Don't test the database logic with the business logic; each of these layers should be tested in isolation. For a more detailed explanation, see Unit Testing the Data Tier that I wrote more than 4 years ago. While some of the technologies described have changed since that article, the fundamental idea has not.

## **What Are The Benefits Of Tdd?**

**Early bug notification:**

Developers tests their code but in the database world, this often consists of manual tests or one-off scripts. Using TDD you build up, over time, a suite of automated tests that you and any other developer can rerun at will.

**Better Designed, cleaner and more extensible code:**

- It helps to understand how the code will be used and how it interacts with other modules.
- It results in better design decision and more maintainable code.
- TDD allows writing smaller code having single responsibility rather than monolithic procedures with multiple responsibilities. This makes the code simpler to understand.
- TDD also forces to write only production code to pass tests based on user requirements.

**Confidence to Refactor:**

- If you refactor code, there can be possibilities of breaks in the code. So having a set of automated tests you can fix those breaks before release. Proper warning will be given if breaks found when automated tests are used.
- Using TDD, should results in faster, more extensible code with fewer bugs that can be updated with minimal risks.

**Good for teamwork:**

In the absence of any team member, other team member can easily pick up and work on the code. It also aids knowledge sharing, thereby making the team more effective overall.

**Good for Developers:**

Though developers have to spend more time in writing TDD test cases, it takes a lot less time for debugging and developing new features. You will write cleaner, less complicated code.

## **What Are Some Of The Common Pitfalls Of Tdd/unit Testing?**

Some of the pitfalls I have discovered over the years are listed below along with some suggestions for avoiding or overcoming them:

**Brittle tests –** It is easy to create tests that break when later functionality is added. Newer versions of mocking frameworks have helped with this problem by introducing mock types that demand that stated expectations are met on mocked dependencies, but don’t fail when additional interactions with those dependencies occur. As an example, in Rhino Mocks, you should use a DynamicMock object when it makes sense, rather than a StrictMock because the tests created with a DynamicMock are less brittle.

**Missed features –** I highly recommend creating a specific test for each feature, even if the test is an exact duplicate of another test. The reason for this is that, in the future, those features may evolve independently, and it is likely that the one test shared by both will be modified to fit the first feature that changes, leaving the second untested.

**DateTimes don’t validate well –** When comparing DateTime types, it is often difficult to get accurate results due to the rapid change in the current time and the varying degrees of precision of different time types. I have found it best to use a tolerance wherever possible in my DateTime testing. For example, I have created a custom Constraint for Rhino Mocks called a DateTimeConstraint that allows me to specify the tolerance that I will allow in my tests. That tolerance could be to the millisecond, the second, the minute, or whatever makes sense for that test.

**Type specific values don’t compare well –** An Int32 with a value of 12345 is not the same as an Int64 with the same value. Be careful when comparing data types, even if the value in those types should be the same. It is often best to cast or convert the value with the lesser precision, to the other type.

**Testing using shared resources is difficult –** While there is much discussion about what you call a test that touches the database, or another external resource such as a message queue, there is no doubt that interactions with those types of resources must still be tested. If the database or queue you are using is shared, it is possible that data can be manipulated during your tests, making these tests imprecise at best. Whenever possible, you should isolate these tests by using local resources if possible, or by creating the resources specifically for the test. That is, if in your test you create a message queue using a GUID defined in your test as the name of the queue, then use that for your tests and destroy the queue at the end of the test, you can be reasonably confident that no other user will be manipulating the data in that queue during the test.

## **How To Perform Tdd Test?**

**Following steps define how to perform TDD test,**

- Add a test.
- Run all tests and see if any new test fails.
- Write some code.
- Run tests and Refactor code.
- Repeat.

## On interview:

There are several things observed and scored:

- Do you write tests first? After code? Never?
- Do you use tests to think about the design?
- Do you name things clearly?
- Do you favour OOP, procedural programming - or just one enormous function?
- Do you interact well with the pair? Or even at all?
- Do you explain your thinking as you go along, and invite the pair to contribute? Or sit in silence?
- Do you use standard facilities in Java, like Collections? If not, what do you do?
- Do you use the IDE (which is of your choice) well?
- Do you split the problem up well? Poorly? Not at all?