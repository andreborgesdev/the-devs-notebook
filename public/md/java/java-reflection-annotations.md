# Java Reflection and Annotations - Complete Guide

## Reflection Fundamentals

### What is Reflection?

Reflection is the ability of a program to examine and modify its own structure and behavior at runtime. It allows you to inspect classes, interfaces, fields, methods, and constructors.

```java
public class ReflectionBasics {

    // Example class for reflection
    public static class Person {
        private String name;
        public int age;
        private static String species = "Homo sapiens";

        public Person() {}

        public Person(String name, int age) {
            this.name = name;
            this.age = age;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        private void privateMethod() {
            System.out.println("Private method called");
        }

        public static void staticMethod() {
            System.out.println("Static method called");
        }
    }

    public static void demonstrateClassReflection() throws Exception {
        // Get Class object
        Class<?> personClass = Person.class;
        // Alternative ways:
        // Class<?> personClass = Class.forName("ReflectionBasics$Person");
        // Class<?> personClass = new Person().getClass();

        // Basic class information
        System.out.println("Class name: " + personClass.getName());
        System.out.println("Simple name: " + personClass.getSimpleName());
        System.out.println("Package: " + personClass.getPackage().getName());
        System.out.println("Superclass: " + personClass.getSuperclass().getName());
        System.out.println("Is interface: " + personClass.isInterface());
        System.out.println("Is abstract: " + Modifier.isAbstract(personClass.getModifiers()));

        // Interfaces
        Class<?>[] interfaces = personClass.getInterfaces();
        System.out.println("Interfaces: " + Arrays.toString(interfaces));

        // Modifiers
        int modifiers = personClass.getModifiers();
        System.out.println("Is public: " + Modifier.isPublic(modifiers));
        System.out.println("Is static: " + Modifier.isStatic(modifiers));
    }

    public static void demonstrateFieldReflection() throws Exception {
        Class<?> personClass = Person.class;

        // Get all fields (public only)
        Field[] publicFields = personClass.getFields();
        System.out.println("Public fields: " + Arrays.toString(publicFields));

        // Get declared fields (all including private)
        Field[] allFields = personClass.getDeclaredFields();
        System.out.println("All declared fields: " + Arrays.toString(allFields));

        // Access specific field
        Field nameField = personClass.getDeclaredField("name");
        System.out.println("Field name: " + nameField.getName());
        System.out.println("Field type: " + nameField.getType());
        System.out.println("Is private: " + Modifier.isPrivate(nameField.getModifiers()));

        // Access private field
        Person person = new Person("John", 25);
        nameField.setAccessible(true); // Bypass access control
        String name = (String) nameField.get(person);
        System.out.println("Private field value: " + name);

        // Modify private field
        nameField.set(person, "Jane");
        System.out.println("Modified private field: " + nameField.get(person));

        // Static fields
        Field speciesField = personClass.getDeclaredField("species");
        speciesField.setAccessible(true);
        String species = (String) speciesField.get(null); // null for static
        System.out.println("Static field: " + species);
    }

    public static void demonstrateMethodReflection() throws Exception {
        Class<?> personClass = Person.class;
        Person person = new Person("John", 25);

        // Get all public methods (including inherited)
        Method[] publicMethods = personClass.getMethods();
        System.out.println("Public methods count: " + publicMethods.length);

        // Get declared methods (all including private)
        Method[] declaredMethods = personClass.getDeclaredMethods();
        for (Method method : declaredMethods) {
            System.out.println("Method: " + method.getName() +
                             ", Parameters: " + method.getParameterCount() +
                             ", Return type: " + method.getReturnType().getSimpleName());
        }

        // Invoke public method
        Method getNameMethod = personClass.getMethod("getName");
        String name = (String) getNameMethod.invoke(person);
        System.out.println("Method result: " + name);

        // Invoke private method
        Method privateMethod = personClass.getDeclaredMethod("privateMethod");
        privateMethod.setAccessible(true);
        privateMethod.invoke(person);

        // Invoke static method
        Method staticMethod = personClass.getMethod("staticMethod");
        staticMethod.invoke(null); // null for static methods

        // Method with parameters
        Method setNameMethod = personClass.getMethod("setName", String.class);
        setNameMethod.invoke(person, "Alice");
        System.out.println("After setter: " + person.getName());
    }

    public static void demonstrateConstructorReflection() throws Exception {
        Class<?> personClass = Person.class;

        // Get all constructors
        Constructor<?>[] constructors = personClass.getConstructors();
        for (Constructor<?> constructor : constructors) {
            System.out.println("Constructor: " + constructor);
            System.out.println("Parameter count: " + constructor.getParameterCount());
            System.out.println("Parameter types: " + Arrays.toString(constructor.getParameterTypes()));
        }

        // Create instance using default constructor
        Constructor<?> defaultConstructor = personClass.getConstructor();
        Object person1 = defaultConstructor.newInstance();

        // Create instance using parameterized constructor
        Constructor<?> paramConstructor = personClass.getConstructor(String.class, int.class);
        Object person2 = paramConstructor.newInstance("Bob", 30);

        System.out.println("Created instances using reflection");
    }
}
```

### Advanced Reflection Techniques

```java
public class AdvancedReflection {

    // Generic type inspection
    public static void analyzeGenericTypes() throws Exception {
        Class<?> clazz = GenericClass.class;

        // Get generic superclass
        Type genericSuperclass = clazz.getGenericSuperclass();
        if (genericSuperclass instanceof ParameterizedType) {
            ParameterizedType paramType = (ParameterizedType) genericSuperclass;
            Type[] actualTypes = paramType.getActualTypeArguments();
            System.out.println("Generic superclass types: " + Arrays.toString(actualTypes));
        }

        // Analyze generic fields
        Field listField = clazz.getDeclaredField("stringList");
        Type genericType = listField.getGenericType();
        if (genericType instanceof ParameterizedType) {
            ParameterizedType paramType = (ParameterizedType) genericType;
            System.out.println("Field generic type: " + paramType.getActualTypeArguments()[0]);
        }

        // Analyze generic methods
        Method genericMethod = clazz.getMethod("processData", List.class);
        Type[] paramTypes = genericMethod.getGenericParameterTypes();
        Type returnType = genericMethod.getGenericReturnType();
        System.out.println("Method param types: " + Arrays.toString(paramTypes));
        System.out.println("Method return type: " + returnType);
    }

    // Dynamic proxy creation
    public static void demonstrateDynamicProxy() {
        // Create proxy for interface
        UserService userService = (UserService) Proxy.newProxyInstance(
            UserService.class.getClassLoader(),
            new Class[]{UserService.class},
            new LoggingInvocationHandler(new UserServiceImpl())
        );

        // Use proxy - all method calls will be intercepted
        User user = userService.findById(1L);
        userService.save(user);
    }

    // Annotation processing
    public static void processAnnotations() throws Exception {
        Class<?> clazz = AnnotatedClass.class;

        // Class-level annotations
        if (clazz.isAnnotationPresent(Entity.class)) {
            Entity entity = clazz.getAnnotation(Entity.class);
            System.out.println("Entity name: " + entity.name());
        }

        // Field annotations
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            if (field.isAnnotationPresent(Column.class)) {
                Column column = field.getAnnotation(Column.class);
                System.out.println("Field: " + field.getName() +
                                 ", Column: " + column.name() +
                                 ", Nullable: " + column.nullable());
            }
        }

        // Method annotations
        Method[] methods = clazz.getDeclaredMethods();
        for (Method method : methods) {
            if (method.isAnnotationPresent(Transactional.class)) {
                Transactional tx = method.getAnnotation(Transactional.class);
                System.out.println("Method: " + method.getName() +
                                 ", Readonly: " + tx.readOnly());
            }
        }
    }

    // Creating instances dynamically
    @SuppressWarnings("unchecked")
    public static <T> T createInstance(Class<T> clazz, Object... args) throws Exception {
        if (args.length == 0) {
            return clazz.getDeclaredConstructor().newInstance();
        }

        // Find matching constructor
        Constructor<?>[] constructors = clazz.getConstructors();
        for (Constructor<?> constructor : constructors) {
            Class<?>[] paramTypes = constructor.getParameterTypes();
            if (paramTypes.length == args.length) {
                boolean matches = true;
                for (int i = 0; i < paramTypes.length; i++) {
                    if (!paramTypes[i].isAssignableFrom(args[i].getClass())) {
                        matches = false;
                        break;
                    }
                }
                if (matches) {
                    return (T) constructor.newInstance(args);
                }
            }
        }

        throw new IllegalArgumentException("No matching constructor found");
    }

    // Helper classes for examples
    static class GenericClass<T> {
        private List<String> stringList;

        public <U> List<U> processData(List<T> data) {
            return new ArrayList<>();
        }
    }

    interface UserService {
        User findById(Long id);
        void save(User user);
    }

    static class UserServiceImpl implements UserService {
        @Override
        public User findById(Long id) {
            return new User("User " + id, 25);
        }

        @Override
        public void save(User user) {
            System.out.println("Saving user: " + user.getName());
        }
    }

    static class LoggingInvocationHandler implements InvocationHandler {
        private final Object target;

        public LoggingInvocationHandler(Object target) {
            this.target = target;
        }

        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            System.out.println("Before method: " + method.getName());
            Object result = method.invoke(target, args);
            System.out.println("After method: " + method.getName());
            return result;
        }
    }

    static class User {
        private String name;
        private int age;

        public User(String name, int age) {
            this.name = name;
            this.age = age;
        }

        public String getName() { return name; }
        public int getAge() { return age; }
    }
}
```

## Annotations

### Built-in Annotations

```java
public class BuiltInAnnotations {

    // Override annotation
    static class Parent {
        public void method() {
            System.out.println("Parent method");
        }

        /**
         * @deprecated Use newMethod() instead
         */
        @Deprecated
        public void oldMethod() {
            System.out.println("Old method");
        }

        public void newMethod() {
            System.out.println("New method");
        }
    }

    static class Child extends Parent {
        @Override // Ensures we're actually overriding
        public void method() {
            System.out.println("Child method");
        }

        @SuppressWarnings("deprecation") // Suppress compiler warnings
        public void useDeprecatedMethod() {
            oldMethod(); // Would normally show warning
        }
    }

    // SafeVarargs annotation
    @SafeVarargs // Suppresses heap pollution warnings
    public static <T> void printItems(T... items) {
        for (T item : items) {
            System.out.println(item);
        }
    }

    // FunctionalInterface annotation
    @FunctionalInterface
    public interface Calculator {
        int calculate(int a, int b);

        // Can have default methods
        default int multiply(int a, int b) {
            return a * b;
        }

        // Can have static methods
        static int add(int a, int b) {
            return a + b;
        }
    }

    public static void demonstrateBuiltInAnnotations() {
        Child child = new Child();
        child.method(); // Uses overridden method
        child.useDeprecatedMethod(); // No warning due to @SuppressWarnings

        // Use functional interface
        Calculator calc = (a, b) -> a + b;
        System.out.println("Result: " + calc.calculate(5, 3));

        // SafeVarargs in action
        printItems("Hello", "World", "Java");
        printItems(1, 2, 3, 4, 5);
    }
}
```

### Custom Annotations

```java
// Annotation definitions
@Retention(RetentionPolicy.RUNTIME) // Available at runtime
@Target(ElementType.TYPE) // Can be applied to classes
public @interface Entity {
    String name() default "";
    String table() default "";
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Column {
    String name() default "";
    boolean nullable() default true;
    int length() default 255;
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Transactional {
    boolean readOnly() default false;
    String propagation() default "REQUIRED";
    int timeout() default -1;
}

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface Cacheable {
    String value() default "";
    String key() default "";
    int expiration() default 3600; // seconds
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.PARAMETER)
public @interface Valid {
    String message() default "Invalid parameter";
}

// Using custom annotations
@Entity(name = "User", table = "users")
public class AnnotatedClass {

    @Column(name = "user_id", nullable = false)
    private Long id;

    @Column(name = "username", length = 50)
    private String username;

    @Column(name = "email", length = 100)
    private String email;

    @Column(nullable = true)
    private String address;

    @Transactional(readOnly = true, timeout = 30)
    @Cacheable(value = "users", key = "id", expiration = 1800)
    public User findById(Long id) {
        // Database query logic
        return new User("User " + id, 25);
    }

    @Transactional(propagation = "REQUIRES_NEW")
    public void saveUser(@Valid User user) {
        // Validation and save logic
        System.out.println("Saving user: " + user.getName());
    }

    @Cacheable("usersByEmail")
    public User findByEmail(String email) {
        // Database query logic
        return new User("User with email " + email, 30);
    }
}

// Meta-annotations (annotations on annotations)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Documented {
    // Marker annotation
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Inherited {
    // Marker annotation
}

@Documented
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Service {
    String value() default "";
}

@Service("userService")
public class UserService {
    public void processUser() {
        System.out.println("Processing user");
    }
}

// Child class inherits @Service annotation due to @Inherited
public class ExtendedUserService extends UserService {
    // Inherits @Service annotation
}
```

### Annotation Processing

```java
public class AnnotationProcessor {

    // Simple annotation processor
    public static void processEntityAnnotations(Class<?> clazz) {
        if (clazz.isAnnotationPresent(Entity.class)) {
            Entity entity = clazz.getAnnotation(Entity.class);

            System.out.println("Processing entity: " + entity.name());
            System.out.println("Table: " + entity.table());

            // Process field annotations
            Field[] fields = clazz.getDeclaredFields();
            for (Field field : fields) {
                if (field.isAnnotationPresent(Column.class)) {
                    Column column = field.getAnnotation(Column.class);
                    System.out.println("Field: " + field.getName());
                    System.out.println("  Column: " + column.name());
                    System.out.println("  Nullable: " + column.nullable());
                    System.out.println("  Length: " + column.length());
                }
            }

            // Process method annotations
            Method[] methods = clazz.getDeclaredMethods();
            for (Method method : methods) {
                if (method.isAnnotationPresent(Transactional.class)) {
                    Transactional tx = method.getAnnotation(Transactional.class);
                    System.out.println("Method: " + method.getName());
                    System.out.println("  ReadOnly: " + tx.readOnly());
                    System.out.println("  Propagation: " + tx.propagation());
                    System.out.println("  Timeout: " + tx.timeout());
                }

                if (method.isAnnotationPresent(Cacheable.class)) {
                    Cacheable cache = method.getAnnotation(Cacheable.class);
                    System.out.println("Cacheable method: " + method.getName());
                    System.out.println("  Cache: " + cache.value());
                    System.out.println("  Key: " + cache.key());
                    System.out.println("  Expiration: " + cache.expiration());
                }
            }
        }
    }

    // Advanced annotation processing with validation
    public static void validateAndProcess(Object obj) throws Exception {
        Class<?> clazz = obj.getClass();

        // Validate fields
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            Object value = field.get(obj);

            if (field.isAnnotationPresent(Column.class)) {
                Column column = field.getAnnotation(Column.class);

                // Check nullable constraint
                if (!column.nullable() && value == null) {
                    throw new IllegalArgumentException(
                        "Field " + field.getName() + " cannot be null");
                }

                // Check length constraint for strings
                if (value instanceof String) {
                    String strValue = (String) value;
                    if (strValue.length() > column.length()) {
                        throw new IllegalArgumentException(
                            "Field " + field.getName() + " exceeds maximum length: " +
                            column.length());
                    }
                }
            }
        }

        System.out.println("Validation passed for: " + clazz.getSimpleName());
    }

    // Reflection-based dependency injection
    public static void injectDependencies(Object obj) throws Exception {
        Class<?> clazz = obj.getClass();
        Field[] fields = clazz.getDeclaredFields();

        for (Field field : fields) {
            if (field.isAnnotationPresent(Inject.class)) {
                field.setAccessible(true);

                // Simple factory - in real DI framework this would be more sophisticated
                Object dependency = createDependency(field.getType());
                field.set(obj, dependency);

                System.out.println("Injected " + field.getType().getSimpleName() +
                                 " into " + field.getName());
            }
        }
    }

    private static Object createDependency(Class<?> type) throws Exception {
        // Simple factory method - create instance using default constructor
        return type.getDeclaredConstructor().newInstance();
    }

    // Custom annotation for dependency injection
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    public @interface Inject {
    }

    // Example class using dependency injection
    public static class OrderService {
        @Inject
        private UserService userService;

        @Inject
        private PaymentService paymentService;

        public void processOrder() {
            System.out.println("Processing order with injected dependencies");
        }
    }

    public static class PaymentService {
        public void processPayment() {
            System.out.println("Processing payment");
        }
    }
}
```

### Compile-Time Annotation Processing

```java
// Annotation processor that runs at compile time
import javax.annotation.processing.*;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.*;
import javax.tools.Diagnostic;
import java.util.Set;

@SupportedAnnotationTypes("com.example.Entity")
@SupportedSourceVersion(SourceVersion.RELEASE_11)
public class EntityProcessor extends AbstractProcessor {

    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        for (TypeElement annotation : annotations) {
            Set<? extends Element> annotatedElements = roundEnv.getElementsAnnotatedWith(annotation);

            for (Element element : annotatedElements) {
                if (element.getKind() == ElementKind.CLASS) {
                    TypeElement classElement = (TypeElement) element;

                    // Validate entity class
                    if (!hasDefaultConstructor(classElement)) {
                        processingEnv.getMessager().printMessage(
                            Diagnostic.Kind.ERROR,
                            "Entity classes must have a default constructor",
                            element
                        );
                    }

                    // Generate additional code if needed
                    generateRepositoryClass(classElement);
                }
            }
        }

        return true;
    }

    private boolean hasDefaultConstructor(TypeElement classElement) {
        for (Element enclosedElement : classElement.getEnclosedElements()) {
            if (enclosedElement.getKind() == ElementKind.CONSTRUCTOR) {
                ExecutableElement constructor = (ExecutableElement) enclosedElement;
                if (constructor.getParameters().isEmpty()) {
                    return true;
                }
            }
        }
        return false;
    }

    private void generateRepositoryClass(TypeElement classElement) {
        // Code generation logic would go here
        // This could create repository classes, DTOs, etc.
        processingEnv.getMessager().printMessage(
            Diagnostic.Kind.NOTE,
            "Generated repository for " + classElement.getSimpleName(),
            classElement
        );
    }
}
```

## Real-World Applications

### ORM Framework Simulation

```java
public class SimpleORM {

    // Simple ORM that uses reflection and annotations
    public static class EntityManager {
        private Map<Class<?>, String> tableNames = new HashMap<>();
        private Map<Class<?>, Map<String, String>> fieldMappings = new HashMap<>();

        public void registerEntity(Class<?> entityClass) {
            if (!entityClass.isAnnotationPresent(Entity.class)) {
                throw new IllegalArgumentException("Class must be annotated with @Entity");
            }

            Entity entity = entityClass.getAnnotation(Entity.class);
            String tableName = entity.table().isEmpty() ?
                              entityClass.getSimpleName().toLowerCase() : entity.table();
            tableNames.put(entityClass, tableName);

            // Map fields to columns
            Map<String, String> mapping = new HashMap<>();
            Field[] fields = entityClass.getDeclaredFields();

            for (Field field : fields) {
                if (field.isAnnotationPresent(Column.class)) {
                    Column column = field.getAnnotation(Column.class);
                    String columnName = column.name().isEmpty() ?
                                      field.getName() : column.name();
                    mapping.put(field.getName(), columnName);
                }
            }

            fieldMappings.put(entityClass, mapping);
        }

        public String generateInsertSQL(Object entity) throws Exception {
            Class<?> clazz = entity.getClass();
            String tableName = tableNames.get(clazz);
            Map<String, String> mapping = fieldMappings.get(clazz);

            StringBuilder sql = new StringBuilder("INSERT INTO ");
            sql.append(tableName).append(" (");

            StringBuilder values = new StringBuilder(" VALUES (");

            Field[] fields = clazz.getDeclaredFields();
            boolean first = true;

            for (Field field : fields) {
                if (mapping.containsKey(field.getName())) {
                    if (!first) {
                        sql.append(", ");
                        values.append(", ");
                    }

                    sql.append(mapping.get(field.getName()));

                    field.setAccessible(true);
                    Object value = field.get(entity);
                    values.append("'").append(value).append("'");

                    first = false;
                }
            }

            sql.append(")");
            values.append(")");
            sql.append(values);

            return sql.toString();
        }

        public String generateSelectSQL(Class<?> entityClass, Object id) {
            String tableName = tableNames.get(entityClass);
            return "SELECT * FROM " + tableName + " WHERE id = '" + id + "'";
        }
    }
}
```

### Validation Framework

```java
public class ValidationFramework {

    // Custom validation annotations
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    public @interface NotNull {
        String message() default "Field cannot be null";
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    public @interface Size {
        int min() default 0;
        int max() default Integer.MAX_VALUE;
        String message() default "Size validation failed";
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    public @interface Email {
        String message() default "Invalid email format";
    }

    // Validator class
    public static class Validator {

        public static void validate(Object obj) throws ValidationException {
            Class<?> clazz = obj.getClass();
            Field[] fields = clazz.getDeclaredFields();

            List<String> errors = new ArrayList<>();

            for (Field field : fields) {
                field.setAccessible(true);

                try {
                    Object value = field.get(obj);

                    // NotNull validation
                    if (field.isAnnotationPresent(NotNull.class) && value == null) {
                        NotNull notNull = field.getAnnotation(NotNull.class);
                        errors.add(field.getName() + ": " + notNull.message());
                    }

                    // Size validation
                    if (field.isAnnotationPresent(Size.class) && value != null) {
                        Size size = field.getAnnotation(Size.class);

                        if (value instanceof String) {
                            String strValue = (String) value;
                            if (strValue.length() < size.min() || strValue.length() > size.max()) {
                                errors.add(field.getName() + ": " + size.message());
                            }
                        } else if (value instanceof Collection) {
                            Collection<?> collection = (Collection<?>) value;
                            if (collection.size() < size.min() || collection.size() > size.max()) {
                                errors.add(field.getName() + ": " + size.message());
                            }
                        }
                    }

                    // Email validation
                    if (field.isAnnotationPresent(Email.class) && value != null) {
                        Email email = field.getAnnotation(Email.class);
                        String emailValue = (String) value;

                        if (!emailValue.matches("^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$")) {
                            errors.add(field.getName() + ": " + email.message());
                        }
                    }

                } catch (IllegalAccessException e) {
                    errors.add("Unable to access field: " + field.getName());
                }
            }

            if (!errors.isEmpty()) {
                throw new ValidationException("Validation failed: " +
                                            String.join(", ", errors));
            }
        }
    }

    public static class ValidationException extends Exception {
        public ValidationException(String message) {
            super(message);
        }
    }

    // Example usage
    public static class UserDTO {
        @NotNull(message = "Username is required")
        @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
        private String username;

        @NotNull(message = "Email is required")
        @Email(message = "Please provide a valid email address")
        private String email;

        @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;

        // Constructors, getters, setters
        public UserDTO(String username, String email, String password) {
            this.username = username;
            this.email = email;
            this.password = password;
        }
    }

    public static void demonstrateValidation() {
        // Valid user
        UserDTO validUser = new UserDTO("john_doe", "john@example.com", "password123");
        try {
            Validator.validate(validUser);
            System.out.println("Valid user passed validation");
        } catch (ValidationException e) {
            System.out.println("Validation failed: " + e.getMessage());
        }

        // Invalid user
        UserDTO invalidUser = new UserDTO(null, "invalid-email", "123");
        try {
            Validator.validate(invalidUser);
            System.out.println("Invalid user passed validation");
        } catch (ValidationException e) {
            System.out.println("Validation failed: " + e.getMessage());
        }
    }
}
```

## Performance Considerations

### Reflection Performance Impact

```java
public class ReflectionPerformance {

    private static final int ITERATIONS = 1_000_000;

    public static void comparePerformance() throws Exception {
        Person person = new Person("John", 25);

        // Direct method call
        long startTime = System.nanoTime();
        for (int i = 0; i < ITERATIONS; i++) {
            String name = person.getName();
        }
        long directTime = System.nanoTime() - startTime;

        // Reflection method call
        Method getNameMethod = Person.class.getMethod("getName");
        startTime = System.nanoTime();
        for (int i = 0; i < ITERATIONS; i++) {
            String name = (String) getNameMethod.invoke(person);
        }
        long reflectionTime = System.nanoTime() - startTime;

        // Cached reflection (method lookup done once)
        startTime = System.nanoTime();
        for (int i = 0; i < ITERATIONS; i++) {
            String name = (String) getNameMethod.invoke(person);
        }
        long cachedReflectionTime = System.nanoTime() - startTime;

        System.out.println("Direct call time: " + directTime / 1_000_000 + " ms");
        System.out.println("Reflection time: " + reflectionTime / 1_000_000 + " ms");
        System.out.println("Cached reflection time: " + cachedReflectionTime / 1_000_000 + " ms");
        System.out.println("Reflection overhead: " + (reflectionTime / (double) directTime) + "x");
    }

    // Method handle performance (Java 7+)
    public static void compareMethodHandles() throws Throwable {
        Person person = new Person("John", 25);
        MethodHandles.Lookup lookup = MethodHandles.lookup();
        MethodHandle getNameHandle = lookup.findVirtual(Person.class, "getName",
                                                       MethodType.methodType(String.class));

        // Method handle performance
        long startTime = System.nanoTime();
        for (int i = 0; i < ITERATIONS; i++) {
            String name = (String) getNameHandle.invoke(person);
        }
        long methodHandleTime = System.nanoTime() - startTime;

        System.out.println("Method handle time: " + methodHandleTime / 1_000_000 + " ms");
    }

    static class Person {
        private String name;
        private int age;

        public Person(String name, int age) {
            this.name = name;
            this.age = age;
        }

        public String getName() { return name; }
        public int getAge() { return age; }
    }
}
```

## Common Interview Questions

### Reflection Basics

**Q: What is reflection and when would you use it?**
A: Reflection allows examining and modifying program structure at runtime. Use cases include frameworks (Spring, Hibernate), serialization libraries, testing frameworks, and dynamic proxy creation.

**Q: What's the difference between Class.forName() and .class?**
A: Class.forName() loads the class dynamically and may throw ClassNotFoundException. .class is compile-time constant and always succeeds for existing classes.

### Performance and Security

**Q: What are the performance implications of reflection?**
A: Reflection is slower than direct method calls (10-50x slower), bypasses JVM optimizations, and should be cached when possible. Method handles (Java 7+) offer better performance.

**Q: What security concerns exist with reflection?**
A: Reflection can bypass access controls, access private members, and potentially violate encapsulation. SecurityManager can restrict reflection usage.

### Annotations

**Q: What's the difference between @Retention policies?**
A: SOURCE (compile-time only), CLASS (in bytecode but not runtime), RUNTIME (available at runtime for reflection).

**Q: When would you create custom annotations?**
A: For frameworks, configuration, validation, code generation, AOP, or any cross-cutting concerns that need metadata.

### Advanced Topics

**Q: How do frameworks like Spring use reflection?**
A: For dependency injection, AOP proxies, bean lifecycle management, and annotation processing.

**Q: What are the limitations of reflection?**
A: Performance overhead, security restrictions, complexity, and potential breaking of encapsulation. Some optimizations like inlining are disabled.
