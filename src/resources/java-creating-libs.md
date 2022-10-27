# Creating Libs

When using spring to create a lib we can just delete the application class and we should use beans instead of services. Using services can cause problems when trying to import the lib’s classes to the project that wants to use it because the lib could be exposing directly the application main.

# **Transitive Dependency**

**There are two types of dependencies in Maven: direct and transitive.**

Direct dependencies are the ones that we explicitly include in the project.

These can be included using *<dependency>* tags:

```
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
</dependency>
```

**On the other hand, transitive dependencies are required by direct dependencies.** Maven automatically includes required transitive dependencies in our project.

We can list all dependencies including transitive dependencies in the project using *mvn dependency:tree* command.

Use one of these because of transitive dependencies.

[https://www.baeldung.com/maven-optional-dependency](https://www.baeldung.com/maven-optional-dependency)

[https://www.baeldung.com/maven-dependency-scopes](https://www.baeldung.com/maven-dependency-scopes)