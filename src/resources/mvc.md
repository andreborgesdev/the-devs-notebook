# MVC

# **Everything you need to know about MVC architecture**

## A general explanation of how MVC works.

MVC is known as an architectural pattern, which embodies three parts Model, View and Controller, or to be more exact it divides the application into three logical parts: the model part, the view and the controller. It was used for desktop graphical user interfaces but nowadays is used in designing mobile apps and web apps.

## **History**

Trygve Reenskaug invented MVC. The first reports on MVC were written when he was visiting a scientist at Xerox Palo Alto Research Laboratory (PARC) in 1978/79. At first, MVC was called “Thing Model View Editor” but rapidly changed it to “ Model View Controller”.

The goal of Tygrve was to solve the problem of users controlling a large and complex data set. The practice of MVC has changed over the years. Since the MVC pattern was invented before web browsers, initially was used as an architectural pattern for graphical user interfaces(GUI).

![https://miro.medium.com/max/1400/1*vV3FsUOnElKL8lHmovAkVQ.png](https://miro.medium.com/max/1400/1*vV3FsUOnElKL8lHmovAkVQ.png)

The original MVC

Currently MVC it’s used for designing web applications. Some web frameworks that use MVC concept: Ruby on Rails, Laravel, Zend framework, CherryPy, Symphony, etc

# **MVC Architecture**

MVC is an architectural pattern which means it rules the whole architecture of the applications. Even though often it is known as design pattern but we may be wrong if we refer it only as a design pattern because design patterns are used to solve a specific technical problem, whereas architecture pattern is used for solving architectural problems, so it affects the entire architecture of our application.

It has three main components:-Model-View-Controllerand each of them has specific responsibilities

![https://miro.medium.com/max/1400/1*yrAnC64Mq_7DuhRQWkbUmQ.png](https://miro.medium.com/max/1400/1*yrAnC64Mq_7DuhRQWkbUmQ.png)

MVC Architecture

The main reasons why MVC is used are: First, it doesn't allow us to repeat ourselves and second, it helps to create a solid structure of our web applications.

## **Model**

It is known as the lowest level which means it is responsible for maintaining data. Handle data logically so it basically deals with data. The model is actually connected to the database so anything you do with data. Adding or retrieving data is done in the model component. It responds to the controller requests because the controller never talks to the database by itself. The model talks to the database back and forth and then it gives the needed data to the controller. Note: the model never communicated with the view directly.

## **View**

Data representation is done by the view component. It actually generates UI or user interface for the user. So at web applications when you think of the view component just think the Html/CSS part. Views are created by the data which is collected by the model component but these data aren’t taken directly but through the controller, so the view only speaks to the controller.

## **Controller**

It’s known as the main man because the controller is the component that enables the interconnection between the views and the model so it acts as an intermediary. The controller doesn’t have to worry about handling data logic, it just tells the model what to do. After receiving data from the model it processes it and then it takes all that information it sends it to the view and explains how to represent to the user. Note: Views and models can not talk directly.

## **Advantages of MVC**

- MVC architecture will separate the user interface from business logic and business logicComponents are reusable.Easy o maintain.Different components of the application in MVC can be independently deployed and maintained.This architecture helpt to test components independently.

## **Disadvantages of MVC**

- The complexity is high.Not suitable for small applications.The inefficiency of data access in view.

## **Conclusion**

So MVC is not that easy to understand, it’s really hard actually, but not impossible to learn and every developer needs to keep it in mind when developing an application. Just keep in mind that MVC is an architecture that divides your software into smaller components. The model deals with data and the logic of your system. The view only displays data and the controller maintains the connection between the model and the view. This ‘division’ enables readability and modularity as well it easier the testing part.

Just keep in mind these key points:-MVC is an architectural pattern consisting of three parts: Model, View, Controller.Model: Handles data logic.View: It displays the information from the model to the user.Controller: It controls the data flow into a model object and updates the view whenever data changes.-It is invented by Trygve Reenskau.- Even though it’s very popular and it does have some disadvantages, the main one is complexity.