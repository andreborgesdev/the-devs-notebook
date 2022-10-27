# Exceptions

# **What Is an Exception?**

An exception is an abnormal event that occurs during the execution of a program and disrupts the normal flow of the program's instructions.

# **What Is the Purpose of the Throw and Throws Keywords?**

The *throws* keyword is used to specify that a method may raise an exception during its execution. It enforces explicit exception handling when calling a method:

```
publicvoidsimpleMethod()throws Exception {
    // ...
}
```

The *throw* keyword allows us to throw an exception object to interrupt the normal flow of the program. This is most commonly used when a program fails to satisfy a given condition:

```
if (task.isTooComplicated()) {
thrownew TooComplicatedException("The task is too complicated");
}
```

# **How Can You Handle an Exception?**

By using a *try-catch-finally* statement:

```
try {
    // ...
}catch (ExceptionType1 ex) {
    // ...
}catch (ExceptionType2 ex) {
    // ...
}finally {
    // ...
}
```

The block of code in which an exception may occur is enclosed in a *try* block. This block is also called “protected” or “guarded” code.

If an exception occurs, the *catch* block that matches the exception being thrown is executed, if not, all *catch* blocks are ignored.

The *finally* block is always executed after the *try* block exits, whether an exception was thrown or not inside it.

# **How Can You Catch Multiple Exceptions?**

There are three ways of handling multiple exceptions in a block of code.

The first is to use a *catch* block that can handle all exception types being thrown:

```
try {
    // ...
}catch (Exception ex) {
    // ...
}
```

You should keep in mind that the recommended practice is to use exception handlers that are as accurate as possible.

Exception handlers that are too broad can make your code more error-prone, catch exceptions that weren't anticipated, and cause unexpected behavior in your program.

The second way is implementing multiple catch blocks:

```
try {
    // ...
}catch (FileNotFoundException ex) {
    // ...
}catch (EOFException ex) {
    // ...
}
```

Note that, if the exceptions have an inheritance relationship; the child type must come first and the parent type later. If we fail to do this, it will result in a compilation error.

The third is to use a multi-catch block:

```
try {
    // ...
}catch (FileNotFoundException | EOFException ex) {
    // ...
}
```

This feature, first introduced in Java 7; reduces code duplication and makes it easier to maintain.

# **What Is the Difference Between a Checked and an Unchecked Exception?**

A checked exception must be handled within a *try-catch* block or declared in a *throws* clause; whereas an unchecked exception is not required to be handled nor declared.

Checked and unchecked exceptions are also known as compile-time and runtime exceptions respectively.

All exceptions are checked exceptions, except those indicated by *Error*, *RuntimeException*, and their subclasses.

# **What Is the Difference Between an Exception and Error?**

An exception is an event that represents a condition from which is possible to recover, whereas error represents an external situation usually impossible to recover from.

All errors thrown by the JVM are instances of *Error* or one of its subclasses, the more common ones include but are not limited to:

- *OutOfMemoryError* – thrown when the JVM cannot allocate more objects because it is out memory, and the garbage collector was unable to make more available
- *StackOverflowError* – occurs when the stack space for a thread has run out, typically because an application recurses too deeply
- *ExceptionInInitializerError* – signals that an unexpected exception occurred during the evaluation of a static initializer
- *NoClassDefFoundError* – is thrown when the classloader tries to load the definition of a class and couldn't find it, usually because the required *class* files were not found in the classpath
- *UnsupportedClassVersionError* – occurs when the JVM attempts to read a *class* file and determines that the version in the file is not supported, normally because the file was generated with a newer version of Java

Although an error can be handled with a *try* statement, this is not a recommended practice since there is no guarantee that the program will be able to do anything reliably after the error was thrown.

# **What Exception Will Be Thrown Executing the Following Code Block?**

```
Integer[][] ints = { { 1, 2, 3 }, {null }, { 7, 8, 9 } };
System.out.println("value = " + ints[1][1].intValue());
```

It throws an *ArrayIndexOutOfBoundsException* since we're trying to access a position greater than the length of the array.

# **What Is Exception Chaining?**

Occurs when an exception is thrown in response to another exception. This allows us to discover the complete history of our raised problem:

```
try {
    task.readConfigFile();
}catch (FileNotFoundException ex) {
thrownew TaskException("Could not perform task", ex);
}
```

# **What Is a Stacktrace and How Does It Relate to an Exception?**

A stack trace provides the names of the classes and methods that were called, from the start of the application to the point an exception occurred.

It's a very useful debugging tool since it enables us to determine exactly where the exception was thrown in the application and the original causes that led to it.

# **Why Would You Want to Subclass an Exception?**

If the exception type isn't represented by those that already exist in the Java platform, or if you need to provide more information to client code to treat it in a more precise manner, then you should create a custom exception.

Deciding whether a custom exception should be checked or unchecked depends entirely on the business case. However, as a rule of thumb; if the code using your exception can be expected to recover from it, then create a checked exception otherwise make it unchecked.

Also, you should inherit from the most specific *Exception* subclass that closely relates to the one you want to throw. If there is no such class, then choose *Exception* as the parent.

# **What Are Some Advantages of Exceptions?**

Traditional error detection and handling techniques often lead to spaghetti code hard to maintain and difficult to read. However, exceptions enable us to separate the core logic of our application from the details of what to do when something unexpected happens.

Also, since the JVM searches backward through the call stack to find any methods interested in handling a particular exception; we gain the ability to propagate an error up in the call stack without writing additional code.

Also, because all exceptions thrown in a program are objects, they can be grouped or categorized based on its class hierarchy. This allows us to catch a group of exceptions in a single exception handler by specifying the exception's superclass in the *catch* block.

# **Can You Throw Any Exception Inside a Lambda Expression's Body?**

When using a standard functional interface already provided by Java, you can only throw unchecked exceptions because standard functional interfaces do not have a “throws” clause in method signatures:

```
List<Integer> integers = Arrays.asList(3, 9, 7, 0, 10, 20);
integers.forEach(i -> {
if (i == 0) {
thrownew IllegalArgumentException("Zero not allowed");
    }
    System.out.println(Math.PI / i);
});
```

However, if you are using a custom functional interface, throwing checked exceptions is possible:

```
@FunctionalInterface
publicstaticinterfaceCheckedFunction<T> {
voidapply(T t)throws Exception;
}
```

```
publicvoidprocessTasks(
  List<Task> taks, CheckedFunction<Task> checkedFunction) {
for (Task task : taks) {
try {
            checkedFunction.apply(task);
        }catch (Exception e) {
            // ...
        }
    }
}

processTasks(taskList, t -> {
    // ...
thrownew Exception("Something happened");
});
```

# **What Are the Rules We Need to Follow When Overriding a Method That Throws an Exception?**

Several rules dictate how exceptions must be declared in the context of inheritance.

When the parent class method doesn't throw any exceptions, the child class method can't throw any checked exception, but it may throw any unchecked.

Here's an example code to demonstrate this:

```
classParent {
voiddoSomething() {
        // ...
    }
}

classChildextendsParent {
voiddoSomething()throws IllegalArgumentException {
        // ...
    }
}
```

The next example will fail to compile since the overriding method throws a checked exception not declared in the overridden method:

```
classParent {
voiddoSomething() {
        // ...
    }
}

classChildextendsParent {
voiddoSomething()throws IOException {
        // Compilation error
    }
}
```

When the parent class method throws one or more checked exceptions, the child class method can throw any unchecked exception; all, none or a subset of the declared checked exceptions, and even a greater number of these as long as they have the same scope or narrower.

Here's an example code that successfully follows the previous rule:

```
classParent {
voiddoSomething()throws IOException, ParseException {
        // ...
    }

voiddoSomethingElse()throws IOException {
        // ...
    }
}

classChildextendsParent {
voiddoSomething()throws IOException {
        // ...
    }

voiddoSomethingElse()throws FileNotFoundException, EOFException {
        // ...
    }
}
```

Note that both methods respect the rule. The first throws fewer exceptions than the overridden method, and the second, even though it throws more; they're narrower in scope.

However, if we try to throw a checked exception that the parent class method doesn't declare or we throw one with a broader scope; we'll get a compilation error:

```
classParent {
voiddoSomething()throws FileNotFoundException {
        // ...
    }
}

classChildextendsParent {
voiddoSomething()throws IOException {
        // Compilation error
    }
}
```

When the parent class method has a throws clause with an unchecked exception, the child class method can throw none or any number of unchecked exceptions, even though they are not related.

Here's an example that honors the rule:

```
classParent {
voiddoSomething()throws IllegalArgumentException {
        // ...
    }
}

classChildextendsParent {
voiddoSomething()
throws ArithmeticException, BufferOverflowException {
        // ...
    }
}
```

# **Will the Following Code Compile?**

```
voiddoSomething() {
    // ...
throw new RuntimeException(new Exception("Chained Exception"));
}
```

Yes. When chaining exceptions, the compiler only cares about the first one in the chain and, because it detects an unchecked exception, we don't need to add a throws clause.

# **Is There Any Way of Throwing a Checked Exception from a Method That Does Not Have a Throws Clause?**

Yes. We can take advantage of the type erasure performed by the compiler and make it think we are throwing an unchecked exception, when, in fact; we're throwing a checked exception:

```
public <T extends Throwable> TsneakyThrow(Throwable ex)throws T {
throw (T) ex;
}

publicvoidmethodWithoutThrows() {
this.<RuntimeException>sneakyThrow(new Exception("Checked Exception"));
}
```

# **When to Use Checked Exceptions and Unchecked Exceptions**

It's a good practice to use exceptions in Java so that we can separate error-handling code from regular code. However, we need to decide which type of exception to throw. The [Oracle Java Documentation](https://docs.oracle.com/javase/tutorial/essential/exceptions/runtime.html) provides guidance on when to use checked exceptions and unchecked exceptions:

“If a client can reasonably be expected to recover from an exception, make it a checked exception. If a client cannot do anything to recover from the exception, make it an unchecked exception.”

For example, before we open a file, we can first validate the input file name. If the user input file name is invalid, we can throw a custom checked exception:

```
if (!isCorrectFileName(fileName)) {
thrownewIncorrectFileNameException("Incorrect filename : " + fileName );
}

```

In this way, we can recover the system by accepting another user input file name.

However, if the input file name is a null pointer or it is an empty string, it means that we have some errors in the code. In this case, we should throw an unchecked exception:

```
if (fileName == null || fileName.isEmpty())  {
thrownewNullOrEmptyException("The filename is null or empty.");
}

```

In general, checked exceptions represent errors outside the control of the program. For example, the constructor of *[FileInputStream](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/FileInputStream.html#%3Cinit%3E(java.io.File))* throws *FileNotFoundException* if the input file does not exist.

**Java verifies checked exceptions at compile-time.**

Therefore, we should use the *[throws](https://www.baeldung.com/java-throw-throws)* keyword to declare a checked exception. We can also use a *try-catch* block to handle a checked exception.

The *[Exception](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/Exception.html)* class is the superclass of checked exceptions, so we can [create a custom checked exception](https://www.baeldung.com/java-new-custom-exception) by extending *Exception*

**Java does not verify unchecked exceptions at compile-time.** Furthermore, we don't have to declare unchecked exceptions in a method with the *throws* keyword. And although the above code does not have any errors during compile-time, it will throw *ArithmeticException* at runtime.

The *[RuntimeException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/RuntimeException.html)* class is the superclass of all unchecked exceptions, so we can [create a custom unchecked exception](https://www.baeldung.com/java-new-custom-exception) by extending *RuntimeException.*

[https://www.baeldung.com/java-checked-unchecked-exceptions](https://www.baeldung.com/java-checked-unchecked-exceptions)