# Flow Control

# **Describe the *if-then* and *if-then-else* Statements. What Types of Expressions Can Be Used as Conditions?**

Both statements tell our program to execute the code inside of them only if a particular condition evaluates to *true*. However, the *if-then-else* statement provides a secondary path of execution in case the if clause evaluates to *false*:

```
if (age >= 21) {
    // ...
}else {
    // ...
}
```

Unlike other programming languages, Java only supports *boolean* expressions as conditions. If we try to use a different type of expression, we'll get a compilation error.

# **Describe the *switch* Statement. What Object Types Can Be Used in the *switch* Clause?**

Switch allows the selection of several execution paths based on a variables' value.

Each path is labeled with *case* or *default*, the *switch* statement evaluates each *case* expression for a match and executes all statements that follow the matching label until a *break* statement is found. If it can't find a match, the *default* block will be executed instead:

```
switch (yearsOfJavaExperience) {
case 0:
        System.out.println("Student");
break;
case 1:
        System.out.println("Junior");
break;
case 2:
        System.out.println("Middle");
break;
default:
        System.out.println("Senior");
}
```

We can use *byte*, *short*, *char*, *int*, their wrapped versions, *enum*s and *String*s as *switch* values.

# **What Happens When We Forget to Put a *break* Statement in a *case* Clause of a *switch*?**

The *switch* statement falls-trough. This means that it will continue the execution of all *case* labels until if finds a *break* statement, even though those labels don't match the expression's value.

Here's an example to demonstrate this:

```
int operation = 2;
int number = 10;

switch (operation) {
case 1:
        number = number + 10;
break;
case 2:
        number = number - 4;
case 3:
        number = number / 3;
case 4:
        number = number * 10;
break;
}
```

After running the code, *number* holds the value 20, instead of 6. This can be useful in situations when we want to associate the same action with multiple cases.

# **When Is It Preferable to Use a S*witch* Over an I*f-Then-Else* Statement and Vice Versa?**

A *switch* statement is better suited when testing a single variable against many single values or when several values will execute the same code:

```
switch (month) {
case 1:
case 3:
case 5:
case 7:
case 8:
case 10:
case 12:
        days = 31;
break;
case 2:
    days = 28;
break;
default:
    days = 30;
}
```

An *if-then-else* statement is preferable when we need to check ranges of values or multiple conditions:

```
if (aPassword ==null || aPassword.isEmpty()) {
    // empty password
}elseif (aPassword.length() < 8 || aPassword.equals("12345678")) {
    // weak password
}else {
    // good password
}
```

# **What Types of Loops Does Java Support?**

Java offers three different types of loops: *for*, *while*, and *do-while*.

A *for* loop provides a way to iterate over a range of values. It's most useful when we know in advance how many times a task is going to be repeated:

```
for (int i = 0; i < 10; i++) {
     // ...
}
```

A *while* loop can execute a block of statements while a particular condition is *true*:

```
while (iterator.hasNext()) {
    // ...
}
```

A *do-while* is a variation of a *while* statement in which the evaluation of the *boolean* expression is at the bottom of the loop. This guarantees that the code will execute at least once:

```
do {
    // ...
}while (choice != -1);
```

# **What Is an *enhanced for* Loop?**

Is another syntax of the *for* statement designed to iterate through all the elements of a collection, array, enum or any object implementing the *Iterable* interface:

```
for (String aString : arrayOfStrings) {
    // ...
}
```

# **How Can You Exit Anticipatedly From a Loop?**

Using the *break* statement, we can terminate the execution of a loop immediately:

```
for (int i = 0; ; i++) {
if (i > 10) {
break;
    }
}
```

# **What Is the Difference Between an Unlabeled and a Labeled *break* Statement?**

An unlabeled *break* statement terminates the innermost *switch*, *for*, *while* or *do-while* statement, whereas a labeled *break* ends the execution of an outer statement.

Let's create an example to demonstrate this:

```
int[][] table = { { 1, 2, 3 }, { 25, 37, 49 }, { 55, 68, 93 } };
boolean found =false;
int loopCycles = 0;

outer:for (int[] rows : table) {
for (int row : rows) {
        loopCycles++;
if (row == 37) {
            found =true;
break outer;
        }
    }
}
```

When the number 37 is found, the labeled *break* statement terminates the outermost *for* loop, and no more cycles are executed. Thus, *loopCycles* ends with the value of 5.

However, the unlabeled *break* only ends the innermost statement, returning the flow of control to the outermost *for* that continues the loop to the next *row* in the *table* variable, making the *loopCycles* end with a value of 8.

# **What Is the Difference Between an Unlabeled and a Labeled *continue* Statement?**

An unlabeled *continue* statement skips to the end of the current iteration in the innermost *for*, *while*, or *do-while* loop, whereas a labeled *continue* skips to an outer loop marked with the given label.

Here's an example that demonstrates this:

```
int[][] table = { { 1, 15, 3 }, { 25, 15, 49 }, { 15, 68, 93 } };
int loopCycles = 0;

outer:for (int[] rows : table) {
for (int row : rows) {
        loopCycles++;
if (row == 15) {
continue outer;
        }
    }
}
```

The reasoning is the same as in the previous question. The labeled *continue* statement terminates the outermost *for* loop.

Thus, *loopCycles* ends holding the value 5, whereas the unlabeled version only terminates the innermost statement, making the *loopCycles* end with a value of 9.

# **Describe the Execution Flow Inside a *try-catch-finally* Construct.**

When a program has entered the *try* block, and an exception is thrown inside it, the execution of the *try* block is interrupted, and the flow of control continues with a *catch* block that can handle the exception being thrown.

If no such block exists then the current method execution stops, and the exception is thrown to the previous method on the call stack. Alternatively, if no exception occurs, all *catch* blocks are ignored, and program execution continues normally.

A *finally* block is always executed whether an exception was thrown or not inside the body of the *try* block.

# **In Which Situations the *finally* Block May Not Be Executed?**

When the JVM is terminated while executing the *try* or *catch* blocks, for instance, by calling *System.exit(),* or when the executing thread is interrupted or killed, then the finally block is not executed.

# **What Is the Result of Executing the Following Code?**

```
publicstaticintassignment() {
int number = 1;
try {
        number = 3;
if (true) {
thrownew Exception("Test Exception");
        }
        number = 2;
    }catch (Exception ex) {
return number;
    }finally {
        number = 4;
    }
return number;
}

System.out.println(assignment());
```

The code outputs the number 3. Even though the *finally* block is always executed, this happens only after the *try* block exits.

In the example, the *return* statement is executed before the *try-catch* block ends. Thus, the assignment to *number* in the *finally* block makes no effect, since the variable is already returned to the calling code of the a*ssignment* method.

# **In Which Situations *try-finally* Block Might Be Used Even When Exceptions Might Not Be Thrown?**

This block is useful when we want to ensure we don't accidentally bypass the clean up of resources used in the code by encountering a *break*, *continue* or *return* statement:

```
HeavyProcess heavyProcess =new HeavyProcess();
try {
    // ...
return heavyProcess.heavyTask();
}finally {
    heavyProcess.doCleanUp();
}
```

Also, we may face situations in which we can't locally handle the exception being thrown, or we want the current method to throw the exception still while allowing us to free up resources:

```
publicvoiddoDangerousTask(Task task)throws ComplicatedException {
try {
        // ...
        task.gatherResources();
if (task.isComplicated()) {
thrownew ComplicatedException("Too difficult");
        }
        // ...
    }finally {
        task.freeResources();
    }
}
```

# **How Does *try-with-resources* Work?**

The *try-with-resources* statement declares and initializes one or more resources before executing the *try* block and closes them automatically at the end of the statement regardless of whether the block completed normally or abruptly. Any object implementing *AutoCloseable* or *Closeable* interfaces can be used as a resource:

```
try (StringWriter writer =new StringWriter()) {
    writer.write("Hello world!");
}
```