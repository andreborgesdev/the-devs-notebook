# Java Generics - Complete Guide

## Introduction to Generics

### What are Generics?

Generics provide type safety at compile time and eliminate the need for type casting. They were introduced in Java 5 to make code more readable and safer.

```java
// Before generics (Java 1.4 and earlier)
List list = new ArrayList();
list.add("Hello");
list.add(123); // No compile-time error
String str = (String) list.get(0); // Explicit casting required
String str2 = (String) list.get(1); // Runtime ClassCastException

// With generics (Java 5+)
List<String> stringList = new ArrayList<String>();
stringList.add("Hello");
// stringList.add(123); // Compile-time error
String str = stringList.get(0); // No casting needed
```

### Generic Classes

```java
// Generic class with single type parameter
public class Box<T> {
    private T content;

    public Box(T content) {
        this.content = content;
    }

    public T getContent() {
        return content;
    }

    public void setContent(T content) {
        this.content = content;
    }

    // Generic method in generic class
    public <U> void inspect(U item) {
        System.out.println("T: " + content.getClass().getSimpleName());
        System.out.println("U: " + item.getClass().getSimpleName());
    }
}

// Usage
Box<String> stringBox = new Box<>("Hello");
Box<Integer> intBox = new Box<>(42);
Box<List<String>> listBox = new Box<>(Arrays.asList("a", "b", "c"));

// Multiple type parameters
public class Pair<T, U> {
    private T first;
    private U second;

    public Pair(T first, U second) {
        this.first = first;
        this.second = second;
    }

    public T getFirst() { return first; }
    public U getSecond() { return second; }

    // Generic method with different type parameter
    public <V> V process(Function<Pair<T, U>, V> processor) {
        return processor.apply(this);
    }
}

// Usage
Pair<String, Integer> nameAge = new Pair<>("John", 25);
Pair<Double, Boolean> scorePass = new Pair<>(85.5, true);
```

### Generic Interfaces

```java
// Generic interface
public interface Repository<T, ID> {
    void save(T entity);
    T findById(ID id);
    List<T> findAll();
    void delete(T entity);

    // Default method with generics
    default Optional<T> findOptionalById(ID id) {
        T entity = findById(id);
        return Optional.ofNullable(entity);
    }
}

// Implementation
public class UserRepository implements Repository<User, Long> {
    private Map<Long, User> users = new HashMap<>();

    @Override
    public void save(User user) {
        users.put(user.getId(), user);
    }

    @Override
    public User findById(Long id) {
        return users.get(id);
    }

    @Override
    public List<User> findAll() {
        return new ArrayList<>(users.values());
    }

    @Override
    public void delete(User user) {
        users.remove(user.getId());
    }
}

// Generic interface with multiple bounds
public interface Comparable<T> {
    int compareTo(T other);
}

public interface Serializable {
    // Marker interface
}

public interface AdvancedRepository<T extends Comparable<T> & Serializable, ID>
    extends Repository<T, ID> {

    List<T> findSorted();
    byte[] serialize(T entity);
}
```

## Generic Methods

### Basic Generic Methods

```java
public class GenericMethods {

    // Generic method in non-generic class
    public static <T> void swap(T[] array, int i, int j) {
        T temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    // Multiple type parameters
    public static <T, U> Pair<T, U> makePair(T first, U second) {
        return new Pair<>(first, second);
    }

    // Generic method with bounds
    public static <T extends Comparable<T>> T findMax(List<T> list) {
        if (list.isEmpty()) {
            throw new IllegalArgumentException("List cannot be empty");
        }

        T max = list.get(0);
        for (T item : list) {
            if (item.compareTo(max) > 0) {
                max = item;
            }
        }
        return max;
    }

    // Generic method with wildcard
    public static double sumNumbers(List<? extends Number> numbers) {
        double sum = 0.0;
        for (Number num : numbers) {
            sum += num.doubleValue();
        }
        return sum;
    }

    // Generic method returning generic type
    public static <T> List<T> filter(List<T> list, Predicate<T> predicate) {
        return list.stream()
                  .filter(predicate)
                  .collect(Collectors.toList());
    }
}

// Usage examples
String[] names = {"Alice", "Bob", "Charlie"};
GenericMethods.swap(names, 0, 2); // Charlie, Bob, Alice

Pair<String, Integer> pair = GenericMethods.makePair("Score", 100);

List<Integer> numbers = Arrays.asList(3, 1, 4, 1, 5, 9);
Integer max = GenericMethods.findMax(numbers); // 9

List<Double> doubles = Arrays.asList(1.1, 2.2, 3.3);
double sum = GenericMethods.sumNumbers(doubles); // 6.6
```

### Advanced Generic Methods

```java
public class AdvancedGenericMethods {

    // Method with multiple bounds
    public static <T extends Number & Comparable<T>> T min(T a, T b) {
        return a.compareTo(b) <= 0 ? a : b;
    }

    // Generic method with exception
    public static <T, E extends Exception> T executeWithException(
            Supplier<T> supplier,
            Function<RuntimeException, E> exceptionMapper) throws E {
        try {
            return supplier.get();
        } catch (RuntimeException e) {
            throw exceptionMapper.apply(e);
        }
    }

    // Generic method with type inference
    public static <T> Optional<T> safeCast(Object obj, Class<T> clazz) {
        if (clazz.isInstance(obj)) {
            return Optional.of(clazz.cast(obj));
        }
        return Optional.empty();
    }

    // Recursive generic method
    public static <T> List<T> flatten(List<List<T>> nestedList) {
        return nestedList.stream()
                        .flatMap(List::stream)
                        .collect(Collectors.toList());
    }

    // Generic method with builder pattern
    public static <T> Builder<T> builder() {
        return new Builder<T>();
    }

    public static class Builder<T> {
        private List<T> items = new ArrayList<>();

        public Builder<T> add(T item) {
            items.add(item);
            return this;
        }

        public Builder<T> addAll(Collection<? extends T> items) {
            this.items.addAll(items);
            return this;
        }

        public List<T> build() {
            return new ArrayList<>(items);
        }
    }
}

// Usage
Integer minimum = AdvancedGenericMethods.min(5, 3); // 3

Optional<String> stringOpt = AdvancedGenericMethods.safeCast("Hello", String.class);
Optional<String> failedCast = AdvancedGenericMethods.safeCast(123, String.class);

List<String> result = AdvancedGenericMethods.<String>builder()
    .add("Hello")
    .add("World")
    .build();
```

## Wildcards

### Upper Bounded Wildcards (? extends)

```java
public class UpperBoundedWildcards {

    // Read-only operations with upper bounds
    public static double calculateTotal(List<? extends Number> numbers) {
        double total = 0.0;
        for (Number num : numbers) {
            total += num.doubleValue(); // Can read as Number
        }
        return total;
    }

    // Copying from source to destination
    public static void copy(List<? extends Number> source, List<? super Number> dest) {
        for (Number num : source) {
            dest.add(num); // Can read from source, write to dest
        }
    }

    // Method accepting any list of Number or its subtypes
    public static Number findLargest(List<? extends Number> numbers) {
        if (numbers.isEmpty()) return null;

        double max = Double.NEGATIVE_INFINITY;
        Number result = null;

        for (Number num : numbers) {
            if (num.doubleValue() > max) {
                max = num.doubleValue();
                result = num;
            }
        }
        return result;
    }
}

// Usage
List<Integer> integers = Arrays.asList(1, 2, 3, 4, 5);
List<Double> doubles = Arrays.asList(1.1, 2.2, 3.3);
List<Float> floats = Arrays.asList(1.0f, 2.0f, 3.0f);

double total1 = UpperBoundedWildcards.calculateTotal(integers); // 15.0
double total2 = UpperBoundedWildcards.calculateTotal(doubles);  // 6.6
double total3 = UpperBoundedWildcards.calculateTotal(floats);   // 6.0

Number largest = UpperBoundedWildcards.findLargest(integers); // 5
```

### Lower Bounded Wildcards (? super)

```java
public class LowerBoundedWildcards {

    // Write operations with lower bounds
    public static void addNumbers(List<? super Integer> list) {
        list.add(1);
        list.add(2);
        list.add(3);
        // Can write Integer or its subtypes
    }

    // Generic method with lower bound
    public static <T> void fill(List<? super T> list, T value, int count) {
        for (int i = 0; i < count; i++) {
            list.add(value);
        }
    }

    // Comparator with lower bound
    public static void sort(List<Integer> list, Comparator<? super Integer> comparator) {
        list.sort(comparator);
    }

    // Consumer pattern with lower bound
    public static <T> void processItems(List<T> items, Consumer<? super T> processor) {
        items.forEach(processor);
    }
}

// Usage
List<Number> numbers = new ArrayList<>();
List<Object> objects = new ArrayList<>();

LowerBoundedWildcards.addNumbers(numbers); // OK - Number is super of Integer
LowerBoundedWildcards.addNumbers(objects); // OK - Object is super of Integer

LowerBoundedWildcards.fill(numbers, 42, 3); // Adds three 42s to numbers

List<Integer> intList = Arrays.asList(3, 1, 4, 1, 5);
LowerBoundedWildcards.sort(intList, Comparator.naturalOrder());

Consumer<Object> printer = System.out::println;
LowerBoundedWildcards.processItems(intList, printer); // OK - Object is super of Integer
```

### Unbounded Wildcards (?)

```java
public class UnboundedWildcards {

    // When you only need Object methods
    public static int getSize(List<?> list) {
        return list.size(); // Object methods are always available
    }

    // When actual type doesn't matter
    public static boolean isEmpty(Collection<?> collection) {
        return collection.isEmpty();
    }

    // Print any list
    public static void printList(List<?> list) {
        for (Object item : list) {
            System.out.println(item); // Treated as Object
        }
    }

    // Check if two lists have same size
    public static boolean sameSizeAnyType(List<?> list1, List<?> list2) {
        return list1.size() == list2.size();
    }

    // Clear any list
    public static void clearAnyList(List<?> list) {
        list.clear(); // Destructive operations are allowed
    }

    // Get class information
    public static Class<?> getElementType(List<?> list) {
        if (!list.isEmpty()) {
            return list.get(0).getClass();
        }
        return null;
    }
}

// Usage
List<String> strings = Arrays.asList("a", "b", "c");
List<Integer> integers = Arrays.asList(1, 2, 3);
List<Double> doubles = Arrays.asList(1.1, 2.2);

int size1 = UnboundedWildcards.getSize(strings);  // 3
int size2 = UnboundedWildcards.getSize(integers); // 3

boolean sameSize = UnboundedWildcards.sameSizeAnyType(strings, integers); // true

UnboundedWildcards.printList(strings);  // Prints: a, b, c
UnboundedWildcards.printList(integers); // Prints: 1, 2, 3
```

## Bounded Type Parameters

### Single Bounds

```java
// Upper bound with extends
public class NumberContainer<T extends Number> {
    private T value;

    public NumberContainer(T value) {
        this.value = value;
    }

    public double getDoubleValue() {
        return value.doubleValue(); // Can call Number methods
    }

    public T getValue() {
        return value;
    }

    // Method with additional bound
    public <U extends Number & Comparable<U>> int compare(U other) {
        return Double.compare(value.doubleValue(), other.doubleValue());
    }
}

// Usage
NumberContainer<Integer> intContainer = new NumberContainer<>(42);
NumberContainer<Double> doubleContainer = new NumberContainer<>(3.14);
// NumberContainer<String> stringContainer = new NumberContainer<>("Hello"); // Compile error

// Interface bound
public interface Drawable {
    void draw();
}

public class Shape implements Drawable {
    @Override
    public void draw() {
        System.out.println("Drawing shape");
    }
}

public class Canvas<T extends Drawable> {
    private List<T> shapes = new ArrayList<>();

    public void add(T shape) {
        shapes.add(shape);
    }

    public void drawAll() {
        for (T shape : shapes) {
            shape.draw(); // Can call Drawable methods
        }
    }
}
```

### Multiple Bounds

```java
// Multiple bounds with class and interfaces
public interface Serializable {
    // Marker interface
}

public interface Cloneable {
    // Marker interface
}

// Class must be first, then interfaces
public class DataProcessor<T extends Number & Serializable & Cloneable> {

    public T processData(T data) {
        try {
            // Can use Number methods
            double value = data.doubleValue();

            // Can serialize (Serializable)
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(baos);
            oos.writeObject(data);

            // Can clone (Cloneable)
            Object cloned = ((Cloneable) data);

            return data;
        } catch (Exception e) {
            throw new RuntimeException("Processing failed", e);
        }
    }
}

// Recursive bounds
public class ComparableContainer<T extends Comparable<T>> {
    private T value;

    public ComparableContainer(T value) {
        this.value = value;
    }

    public boolean isGreaterThan(T other) {
        return value.compareTo(other) > 0;
    }

    public T max(T other) {
        return value.compareTo(other) > 0 ? value : other;
    }
}

// Usage
ComparableContainer<String> stringContainer = new ComparableContainer<>("Hello");
boolean isGreater = stringContainer.isGreaterThan("World"); // false

ComparableContainer<Integer> intContainer = new ComparableContainer<>(10);
Integer max = intContainer.max(5); // 10
```

## Type Erasure

### Understanding Type Erasure

```java
public class TypeErasureExamples {

    // At compile time: List<String>
    // At runtime: List (raw type)
    public static void demonstrateErasure() {
        List<String> stringList = new ArrayList<String>();
        List<Integer> intList = new ArrayList<Integer>();

        // Both have same class at runtime
        System.out.println(stringList.getClass() == intList.getClass()); // true
        System.out.println(stringList.getClass()); // class java.util.ArrayList
    }

    // Generic method erasure
    public static <T> T identity(T input) {
        return input;
    }

    // After erasure becomes:
    // public static Object identity(Object input) {
    //     return input;
    // }

    // Bounded type parameter erasure
    public static <T extends Number> double sum(T a, T b) {
        return a.doubleValue() + b.doubleValue();
    }

    // After erasure becomes:
    // public static double sum(Number a, Number b) {
    //     return a.doubleValue() + b.doubleValue();
    // }
}

// Bridge methods
class Parent<T> {
    public T getValue() {
        return null;
    }
}

class Child extends Parent<String> {
    @Override
    public String getValue() { // This method
        return "Hello";
    }

    // Compiler generates bridge method:
    // public Object getValue() {
    //     return getValue(); // calls the String version
    // }
}
```

### Type Erasure Limitations

```java
public class TypeErasureLimitations {

    // Cannot create instance of type parameter
    public class Container<T> {
        private T value;

        public Container() {
            // this.value = new T(); // Compile error
        }

        // Workaround: use factory
        public static <T> Container<T> create(Supplier<T> factory) {
            Container<T> container = new Container<>();
            container.value = factory.get();
            return container;
        }
    }

    // Cannot create array of parameterized type
    public static void arrayLimitations() {
        // List<String>[] array = new List<String>[10]; // Compile error

        // Workaround: use raw type and suppress warnings
        @SuppressWarnings("unchecked")
        List<String>[] array = new List[10];

        // Or use List instead
        List<List<String>> listOfLists = new ArrayList<>();
    }

    // Cannot use instanceof with parameterized types
    public static void instanceofLimitations(Object obj) {
        // if (obj instanceof List<String>) { // Compile error

        // Can only check raw type
        if (obj instanceof List) {
            @SuppressWarnings("unchecked")
            List<String> stringList = (List<String>) obj;
        }
    }

    // Cannot catch or throw parameterized exception types
    // class CustomException<T> extends Exception { } // Compile error

    // Static context limitations
    public class StaticLimitations<T> {
        // private static T staticField; // Compile error
        // private static void staticMethod(T param) { } // Compile error

        // Static methods can have their own type parameters
        public static <U> void validStaticMethod(U param) {
            // This is OK
        }
    }
}
```

### Reflection with Generics

```java
public class GenericReflection {

    public static void analyzeGenericType() throws Exception {
        // Get generic type information
        Field field = GenericClass.class.getDeclaredField("list");
        Type genericType = field.getGenericType();

        if (genericType instanceof ParameterizedType) {
            ParameterizedType paramType = (ParameterizedType) genericType;
            Type[] actualTypes = paramType.getActualTypeArguments();

            System.out.println("Raw type: " + paramType.getRawType());
            System.out.println("Actual type arguments: " + Arrays.toString(actualTypes));
        }

        // Method analysis
        Method method = GenericClass.class.getMethod("process", List.class);
        Type[] paramTypes = method.getGenericParameterTypes();
        Type returnType = method.getGenericReturnType();

        System.out.println("Parameter types: " + Arrays.toString(paramTypes));
        System.out.println("Return type: " + returnType);
    }

    // Helper method to get actual type argument
    @SuppressWarnings("unchecked")
    public static <T> Class<T> getActualTypeArgument(Object obj, int index) {
        Type superclass = obj.getClass().getGenericSuperclass();
        if (superclass instanceof ParameterizedType) {
            ParameterizedType paramType = (ParameterizedType) superclass;
            return (Class<T>) paramType.getActualTypeArguments()[index];
        }
        throw new IllegalArgumentException("Not a parameterized type");
    }

    static class GenericClass {
        private List<String> list;

        public List<Integer> process(List<Double> input) {
            return null;
        }
    }
}
```

## Generic Design Patterns

### Factory Pattern with Generics

```java
public interface Factory<T> {
    T create();
}

public class UserFactory implements Factory<User> {
    @Override
    public User create() {
        return new User();
    }
}

// Generic factory
public class GenericFactory<T> {
    private final Supplier<T> constructor;

    public GenericFactory(Supplier<T> constructor) {
        this.constructor = constructor;
    }

    public T create() {
        return constructor.get();
    }

    public List<T> createList(int count) {
        return IntStream.range(0, count)
                       .mapToObj(i -> create())
                       .collect(Collectors.toList());
    }
}

// Usage
GenericFactory<User> userFactory = new GenericFactory<>(User::new);
GenericFactory<Order> orderFactory = new GenericFactory<>(Order::new);

User user = userFactory.create();
List<Order> orders = orderFactory.createList(5);
```

### Builder Pattern with Generics

```java
public class GenericBuilder<T> {
    private final Class<T> clazz;
    private final Map<String, Object> properties = new HashMap<>();

    public GenericBuilder(Class<T> clazz) {
        this.clazz = clazz;
    }

    public GenericBuilder<T> set(String property, Object value) {
        properties.put(property, value);
        return this;
    }

    public T build() {
        try {
            T instance = clazz.getDeclaredConstructor().newInstance();

            for (Map.Entry<String, Object> entry : properties.entrySet()) {
                Field field = clazz.getDeclaredField(entry.getKey());
                field.setAccessible(true);
                field.set(instance, entry.getValue());
            }

            return instance;
        } catch (Exception e) {
            throw new RuntimeException("Failed to build instance", e);
        }
    }

    public static <T> GenericBuilder<T> of(Class<T> clazz) {
        return new GenericBuilder<>(clazz);
    }
}

// Usage
User user = GenericBuilder.of(User.class)
    .set("name", "John Doe")
    .set("age", 30)
    .set("email", "john@example.com")
    .build();
```

### Repository Pattern with Generics

```java
public abstract class BaseRepository<T, ID> {
    protected final Class<T> entityClass;
    protected final Map<ID, T> storage = new HashMap<>();

    @SuppressWarnings("unchecked")
    public BaseRepository() {
        Type superClass = getClass().getGenericSuperclass();
        ParameterizedType paramType = (ParameterizedType) superClass;
        this.entityClass = (Class<T>) paramType.getActualTypeArguments()[0];
    }

    public void save(T entity) {
        ID id = extractId(entity);
        storage.put(id, entity);
    }

    public Optional<T> findById(ID id) {
        return Optional.ofNullable(storage.get(id));
    }

    public List<T> findAll() {
        return new ArrayList<>(storage.values());
    }

    public void delete(ID id) {
        storage.remove(id);
    }

    protected abstract ID extractId(T entity);

    public Class<T> getEntityClass() {
        return entityClass;
    }
}

// Concrete implementation
public class UserRepository extends BaseRepository<User, Long> {
    @Override
    protected Long extractId(User user) {
        return user.getId();
    }

    public List<User> findByAge(int age) {
        return storage.values().stream()
                     .filter(user -> user.getAge() == age)
                     .collect(Collectors.toList());
    }
}
```

## Best Practices

### Generic Design Guidelines

```java
public class GenericBestPractices {

    // Use meaningful type parameter names
    // Good
    public interface Map<Key, Value> { }
    public class Repository<Entity, ID> { }

    // Avoid single letters except for simple cases
    // Acceptable for simple generics
    public class Optional<T> { }
    public interface Comparable<T> { }

    // Favor wildcards over concrete types in APIs
    // Good
    public void processNumbers(List<? extends Number> numbers) { }

    // Less flexible
    public void processNumbers(List<Number> numbers) { }

    // Use bounded wildcards for flexibility
    public static void copy(List<? extends T> src, List<? super T> dest) {
        for (T item : src) {
            dest.add(item);
        }
    }

    // Prefer generic methods over wildcards when possible
    // Good - more readable
    public static <T> void swap(T[] array, int i, int j) {
        T temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    // Less clear
    public static void swap(Object[] array, int i, int j) {
        Object temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    // Use generics for type safety, not just to avoid casting
    // Good - provides compile-time safety
    public class EventHandler<T extends Event> {
        public void handle(T event) {
            // Type-safe operations on event
        }
    }

    // Avoid raw types
    // Bad
    List list = new ArrayList();

    // Good
    List<String> list = new ArrayList<>(); // Diamond operator (Java 7+)
}
```

### Common Pitfalls and Solutions

```java
public class GenericPitfalls {

    // Pitfall: Assuming type parameters are reified
    public class WrongApproach<T> {
        // Won't work - type erasure
        // public boolean isInstance(Object obj) {
        //     return obj instanceof T;
        // }

        // Solution: pass Class<T>
        private final Class<T> type;

        public WrongApproach(Class<T> type) {
            this.type = type;
        }

        public boolean isInstance(Object obj) {
            return type.isInstance(obj);
        }
    }

    // Pitfall: Mixing raw types and generics
    public static void mixingTypes() {
        List<String> stringList = new ArrayList<>();
        List rawList = stringList; // Raw type assignment
        rawList.add(123); // No compile error, but wrong!

        // ClassCastException at runtime
        // String str = stringList.get(1);
    }

    // Pitfall: Incorrect wildcard usage
    public static void wildcardMisuse() {
        List<? extends Number> numbers = new ArrayList<Integer>();
        // numbers.add(new Integer(1)); // Compile error - can't add to ? extends

        List<? super Integer> integers = new ArrayList<Number>();
        integers.add(42); // OK - can add Integer to ? super Integer
        // Integer num = integers.get(0); // Compile error - returns Object
    }

    // Solution: Understand PECS (Producer Extends, Consumer Super)
    public static void correctWildcardUsage() {
        // Producer - use extends (you read from it)
        List<? extends Number> producer = Arrays.asList(1, 2.0, 3f);
        Number num = producer.get(0); // OK - reading

        // Consumer - use super (you write to it)
        List<? super Integer> consumer = new ArrayList<Number>();
        consumer.add(42); // OK - writing

        // Copy from producer to consumer
        for (Number n : producer) {
            if (n instanceof Integer) {
                consumer.add((Integer) n);
            }
        }
    }
}
```

## Common Interview Questions

### Basic Generics

**Q: What are the benefits of using generics?**
A: Type safety at compile time, elimination of type casting, enabling generic algorithms, and improved code readability.

**Q: What is type erasure?**
A: The process by which generic type information is removed at runtime. Generic types are replaced with their bounds or Object.

### Wildcards

**Q: Explain the difference between `? extends T` and `? super T`?**
A: `? extends T` (upper bound) is used for reading - the wildcard represents T or any of its subtypes. `? super T` (lower bound) is used for writing - the wildcard represents T or any of its supertypes.

**Q: What is PECS principle?**
A: Producer Extends, Consumer Super. Use `? extends T` when you only read from the collection (producer), and `? super T` when you only write to it (consumer).

### Advanced Concepts

**Q: Can you create an array of generic types?**
A: No, you cannot create arrays of parameterized types due to type erasure. For example, `new List<String>[10]` is not allowed.

**Q: What are the limitations of type erasure?**
A: Cannot create instances of type parameters, cannot create arrays of parameterized types, cannot use instanceof with parameterized types, cannot have static members with type parameters, and cannot catch/throw parameterized exception types.

**Q: How do you get runtime type information for generics?**
A: Use reflection with `Type`, `ParameterizedType`, and related classes. The type information is preserved in method signatures, field declarations, and class definitions.

### Practical Applications

**Q: When would you use bounded type parameters?**
A: When you need to call specific methods on the type parameter or restrict the types that can be used. For example, `<T extends Number>` allows calling Number methods.

**Q: How do generic methods differ from methods in generic classes?**
A: Generic methods have their own type parameters independent of the class type parameters. They can be static and can be used in non-generic classes.
