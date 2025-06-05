# Java I/O and NIO - Complete Guide

Java I/O (Input/Output) and NIO (New I/O) provide comprehensive APIs for handling data streams, file operations, and network communication. This guide covers everything from basic I/O operations to advanced NIO.2 features.

## Table of Contents

1. [Java I/O Fundamentals](#java-io-fundamentals)
2. [Stream-Based I/O](#stream-based-io)
3. [Character-Based I/O](#character-based-io)
4. [File Operations](#file-operations)
5. [Serialization](#serialization)
6. [Java NIO (New I/O)](#java-nio-new-io)
7. [NIO.2 (Java 7+)](#nio2-java-7)
8. [Performance Comparison](#performance-comparison)
9. [Best Practices](#best-practices)
10. [Interview Tips](#interview-tips)

## Java I/O Fundamentals

### I/O Stream Hierarchy

Java I/O is built around streams - sequences of data that can be read from or written to:

- **Byte Streams**: Handle raw binary data (8-bit bytes)
- **Character Streams**: Handle text data (16-bit Unicode characters)
- **Input Streams**: Read data from a source
- **Output Streams**: Write data to a destination

### Core I/O Classes

```java
java.io.InputStream          // Abstract class for byte input
java.io.OutputStream         // Abstract class for byte output
java.io.Reader               // Abstract class for character input
java.io.Writer               // Abstract class for character output
java.io.File                 // File and directory operations
java.io.RandomAccessFile     // Random access to files
```

### I/O Exception Handling

```java
public class IOExceptionHandling {

    public void readFileWithProperExceptionHandling(String filename) {
        try (FileInputStream fis = new FileInputStream(filename);
             BufferedInputStream bis = new BufferedInputStream(fis)) {

            int data;
            while ((data = bis.read()) != -1) {
                System.out.print((char) data);
            }

        } catch (FileNotFoundException e) {
            System.err.println("File not found: " + filename);
        } catch (IOException e) {
            System.err.println("I/O error occurred: " + e.getMessage());
        }
    }
}
```

## Stream-Based I/O

### Byte Streams

#### Basic File Operations

```java
public class ByteStreamExample {

    public void copyFile(String source, String destination) throws IOException {
        try (FileInputStream fis = new FileInputStream(source);
             FileOutputStream fos = new FileOutputStream(destination)) {

            int data;
            while ((data = fis.read()) != -1) {
                fos.write(data);
            }
            System.out.println("File copied successfully");
        }
    }

    public void copyFileBuffered(String source, String destination) throws IOException {
        try (BufferedInputStream bis = new BufferedInputStream(new FileInputStream(source));
             BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(destination))) {

            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = bis.read(buffer)) != -1) {
                bos.write(buffer, 0, bytesRead);
            }
            System.out.println("File copied with buffering");
        }
    }

    public void writeByteArray(String filename, byte[] data) throws IOException {
        try (FileOutputStream fos = new FileOutputStream(filename)) {
            fos.write(data);
            System.out.println("Byte array written to file");
        }
    }

    public byte[] readFileToByteArray(String filename) throws IOException {
        try (FileInputStream fis = new FileInputStream(filename);
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = fis.read(buffer)) != -1) {
                baos.write(buffer, 0, bytesRead);
            }
            return baos.toByteArray();
        }
    }
}
```

#### Data Streams

```java
public class DataStreamExample {

    public void writeDataTypes(String filename) throws IOException {
        try (DataOutputStream dos = new DataOutputStream(
                new BufferedOutputStream(new FileOutputStream(filename)))) {

            dos.writeInt(42);
            dos.writeDouble(3.14159);
            dos.writeBoolean(true);
            dos.writeUTF("Hello, World!");
            dos.writeLong(System.currentTimeMillis());

            System.out.println("Data types written to file");
        }
    }

    public void readDataTypes(String filename) throws IOException {
        try (DataInputStream dis = new DataInputStream(
                new BufferedInputStream(new FileInputStream(filename)))) {

            int intValue = dis.readInt();
            double doubleValue = dis.readDouble();
            boolean booleanValue = dis.readBoolean();
            String stringValue = dis.readUTF();
            long longValue = dis.readLong();

            System.out.println("Int: " + intValue);
            System.out.println("Double: " + doubleValue);
            System.out.println("Boolean: " + booleanValue);
            System.out.println("String: " + stringValue);
            System.out.println("Long: " + longValue);
        }
    }
}
```

### Object Streams

```java
public class ObjectStreamExample {

    public void writeObject(String filename, Object obj) throws IOException {
        try (ObjectOutputStream oos = new ObjectOutputStream(
                new BufferedOutputStream(new FileOutputStream(filename)))) {

            oos.writeObject(obj);
            System.out.println("Object written to file");
        }
    }

    public Object readObject(String filename) throws IOException, ClassNotFoundException {
        try (ObjectInputStream ois = new ObjectInputStream(
                new BufferedInputStream(new FileInputStream(filename)))) {

            return ois.readObject();
        }
    }

    public void writeMultipleObjects(String filename, List<Object> objects) throws IOException {
        try (ObjectOutputStream oos = new ObjectOutputStream(
                new BufferedOutputStream(new FileOutputStream(filename)))) {

            oos.writeInt(objects.size());
            for (Object obj : objects) {
                oos.writeObject(obj);
            }
            System.out.println("Multiple objects written to file");
        }
    }

    public List<Object> readMultipleObjects(String filename) throws IOException, ClassNotFoundException {
        try (ObjectInputStream ois = new ObjectInputStream(
                new BufferedInputStream(new FileInputStream(filename)))) {

            int count = ois.readInt();
            List<Object> objects = new ArrayList<>(count);

            for (int i = 0; i < count; i++) {
                objects.add(ois.readObject());
            }

            return objects;
        }
    }
}
```

## Character-Based I/O

### Reader and Writer Classes

```java
public class CharacterStreamExample {

    public void writeTextFile(String filename, String content) throws IOException {
        try (FileWriter fw = new FileWriter(filename);
             BufferedWriter bw = new BufferedWriter(fw)) {

            bw.write(content);
            bw.newLine();
            bw.write("Second line");
            System.out.println("Text written to file");
        }
    }

    public String readTextFile(String filename) throws IOException {
        StringBuilder content = new StringBuilder();

        try (FileReader fr = new FileReader(filename);
             BufferedReader br = new BufferedReader(fr)) {

            String line;
            while ((line = br.readLine()) != null) {
                content.append(line).append(System.lineSeparator());
            }
        }

        return content.toString();
    }

    public void copyTextFile(String source, String destination) throws IOException {
        try (BufferedReader br = new BufferedReader(new FileReader(source));
             BufferedWriter bw = new BufferedWriter(new FileWriter(destination))) {

            String line;
            while ((line = br.readLine()) != null) {
                bw.write(line);
                bw.newLine();
            }
            System.out.println("Text file copied successfully");
        }
    }
}
```

### PrintWriter and Scanner

```java
public class PrintWriterScannerExample {

    public void writeWithPrintWriter(String filename, List<String> lines) throws IOException {
        try (PrintWriter pw = new PrintWriter(
                new BufferedWriter(new FileWriter(filename)))) {

            for (String line : lines) {
                pw.println(line);
            }

            pw.printf("Current time: %tc%n", System.currentTimeMillis());
            pw.print("End of file");

            if (pw.checkError()) {
                System.err.println("Error occurred while writing");
            }
        }
    }

    public List<String> readWithScanner(String filename) throws FileNotFoundException {
        List<String> lines = new ArrayList<>();

        try (Scanner scanner = new Scanner(new File(filename))) {
            while (scanner.hasNextLine()) {
                lines.add(scanner.nextLine());
            }
        }

        return lines;
    }

    public void parseStructuredData(String filename) throws FileNotFoundException {
        try (Scanner scanner = new Scanner(new File(filename))) {
            scanner.useDelimiter(",|\\n");

            while (scanner.hasNext()) {
                if (scanner.hasNextInt()) {
                    int number = scanner.nextInt();
                    System.out.println("Number: " + number);
                } else if (scanner.hasNextDouble()) {
                    double decimal = scanner.nextDouble();
                    System.out.println("Decimal: " + decimal);
                } else {
                    String text = scanner.next();
                    System.out.println("Text: " + text);
                }
            }
        }
    }
}
```

## File Operations

### File Class Operations

```java
public class FileOperationsExample {

    public void demonstrateFileOperations() {
        File file = new File("example.txt");
        File directory = new File("testDir");

        try {
            if (file.createNewFile()) {
                System.out.println("File created: " + file.getName());
            } else {
                System.out.println("File already exists");
            }

            System.out.println("File exists: " + file.exists());
            System.out.println("File name: " + file.getName());
            System.out.println("Absolute path: " + file.getAbsolutePath());
            System.out.println("File size: " + file.length() + " bytes");
            System.out.println("Can read: " + file.canRead());
            System.out.println("Can write: " + file.canWrite());
            System.out.println("Is file: " + file.isFile());
            System.out.println("Is directory: " + file.isDirectory());
            System.out.println("Last modified: " + new Date(file.lastModified()));

            if (directory.mkdir()) {
                System.out.println("Directory created: " + directory.getName());
            }

            File[] files = new File(".").listFiles();
            if (files != null) {
                System.out.println("Files in current directory:");
                for (File f : files) {
                    System.out.println((f.isDirectory() ? "[DIR] " : "[FILE] ") + f.getName());
                }
            }

        } catch (IOException e) {
            System.err.println("I/O error: " + e.getMessage());
        }
    }

    public void searchFiles(File directory, String extension) {
        if (!directory.isDirectory()) {
            return;
        }

        File[] files = directory.listFiles((dir, name) -> name.endsWith(extension));
        if (files != null) {
            for (File file : files) {
                System.out.println("Found: " + file.getAbsolutePath());
            }
        }

        File[] subdirs = directory.listFiles(File::isDirectory);
        if (subdirs != null) {
            for (File subdir : subdirs) {
                searchFiles(subdir, extension);
            }
        }
    }
}
```

### RandomAccessFile

```java
public class RandomAccessFileExample {

    public void demonstrateRandomAccess(String filename) throws IOException {
        try (RandomAccessFile raf = new RandomAccessFile(filename, "rw")) {

            raf.writeUTF("Hello");
            raf.writeInt(42);
            raf.writeDouble(3.14159);

            long filePointer = raf.getFilePointer();
            System.out.println("Current position: " + filePointer);

            raf.seek(0);
            String text = raf.readUTF();
            int number = raf.readInt();
            double decimal = raf.readDouble();

            System.out.println("Text: " + text);
            System.out.println("Number: " + number);
            System.out.println("Decimal: " + decimal);

            raf.seek(raf.length());
            raf.writeUTF(" World!");

            raf.seek(0);
            System.out.println("File length: " + raf.length());
        }
    }

    public void insertIntoFile(String filename, long position, String data) throws IOException {
        try (RandomAccessFile raf = new RandomAccessFile(filename, "rw")) {

            long fileLength = raf.length();
            if (position > fileLength) {
                position = fileLength;
            }

            byte[] buffer = new byte[(int) (fileLength - position)];
            raf.seek(position);
            raf.read(buffer);

            raf.seek(position);
            raf.write(data.getBytes());
            raf.write(buffer);

            System.out.println("Data inserted at position: " + position);
        }
    }
}
```

## Serialization

### Basic Serialization

```java
import java.io.Serializable;

public class Person implements Serializable {
    private static final long serialVersionUID = 1L;

    private String name;
    private int age;
    private transient String password;
    private static String country = "USA";

    public Person(String name, int age, String password) {
        this.name = name;
        this.age = age;
        this.password = password;
    }

    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age +
               ", password='" + password + "', country='" + country + "'}";
    }
}

public class SerializationExample {

    public void serializeObject(String filename, Person person) throws IOException {
        try (ObjectOutputStream oos = new ObjectOutputStream(
                new FileOutputStream(filename))) {

            oos.writeObject(person);
            System.out.println("Person serialized successfully");
        }
    }

    public Person deserializeObject(String filename) throws IOException, ClassNotFoundException {
        try (ObjectInputStream ois = new ObjectInputStream(
                new FileInputStream(filename))) {

            Person person = (Person) ois.readObject();
            System.out.println("Person deserialized successfully");
            return person;
        }
    }
}
```

### Custom Serialization

```java
public class CustomSerializationExample implements Serializable {
    private static final long serialVersionUID = 1L;

    private String username;
    private transient String password;
    private int loginCount;

    public CustomSerializationExample(String username, String password) {
        this.username = username;
        this.password = password;
        this.loginCount = 0;
    }

    private void writeObject(ObjectOutputStream oos) throws IOException {
        oos.defaultWriteObject();
        oos.writeObject(encryptPassword(password));
    }

    private void readObject(ObjectInputStream ois) throws IOException, ClassNotFoundException {
        ois.defaultReadObject();
        String encryptedPassword = (String) ois.readObject();
        this.password = decryptPassword(encryptedPassword);
    }

    private void readObjectNoData() throws ObjectStreamException {
        this.username = "unknown";
        this.password = "default";
        this.loginCount = 0;
    }

    private Object readResolve() throws ObjectStreamException {
        if (username == null) {
            return new CustomSerializationExample("default", "default");
        }
        return this;
    }

    private String encryptPassword(String password) {
        return new StringBuilder(password).reverse().toString();
    }

    private String decryptPassword(String encryptedPassword) {
        return new StringBuilder(encryptedPassword).reverse().toString();
    }
}
```

### Externalization

```java
import java.io.Externalizable;

public class ExternalizableExample implements Externalizable {
    private String name;
    private int age;
    private String email;

    public ExternalizableExample() {
    }

    public ExternalizableExample(String name, int age, String email) {
        this.name = name;
        this.age = age;
        this.email = email;
    }

    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeUTF(name != null ? name : "");
        out.writeInt(age);
        out.writeUTF(email != null ? email : "");
    }

    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        this.name = in.readUTF();
        this.age = in.readInt();
        this.email = in.readUTF();

        if (name.isEmpty()) name = null;
        if (email.isEmpty()) email = null;
    }
}
```

## Java NIO (New I/O)

### Channels and Buffers

```java
import java.nio.*;
import java.nio.channels.*;

public class NIOBasicsExample {

    public void demonstrateBuffer() {
        ByteBuffer buffer = ByteBuffer.allocate(10);

        System.out.println("Initial state:");
        printBufferState(buffer);

        buffer.put((byte) 1);
        buffer.put((byte) 2);
        buffer.put((byte) 3);

        System.out.println("After writing 3 bytes:");
        printBufferState(buffer);

        buffer.flip();
        System.out.println("After flip:");
        printBufferState(buffer);

        while (buffer.hasRemaining()) {
            System.out.println("Read: " + buffer.get());
        }

        buffer.clear();
        System.out.println("After clear:");
        printBufferState(buffer);
    }

    private void printBufferState(ByteBuffer buffer) {
        System.out.println("Position: " + buffer.position() +
                          ", Limit: " + buffer.limit() +
                          ", Capacity: " + buffer.capacity());
    }

    public void copyFileWithNIO(String source, String destination) throws IOException {
        try (FileChannel sourceChannel = FileChannel.open(Paths.get(source), StandardOpenOption.READ);
             FileChannel destChannel = FileChannel.open(Paths.get(destination),
                                                       StandardOpenOption.CREATE,
                                                       StandardOpenOption.WRITE)) {

            ByteBuffer buffer = ByteBuffer.allocate(8192);

            while (sourceChannel.read(buffer) != -1) {
                buffer.flip();
                destChannel.write(buffer);
                buffer.clear();
            }

            System.out.println("File copied using NIO");
        }
    }

    public void transferFile(String source, String destination) throws IOException {
        try (FileChannel sourceChannel = FileChannel.open(Paths.get(source), StandardOpenOption.READ);
             FileChannel destChannel = FileChannel.open(Paths.get(destination),
                                                       StandardOpenOption.CREATE,
                                                       StandardOpenOption.WRITE)) {

            long transferred = sourceChannel.transferTo(0, sourceChannel.size(), destChannel);
            System.out.println("Transferred " + transferred + " bytes");
        }
    }
}
```

### Memory-Mapped Files

```java
public class MemoryMappedFileExample {

    public void createLargeFile(String filename, long size) throws IOException {
        try (RandomAccessFile file = new RandomAccessFile(filename, "rw")) {
            file.setLength(size);

            try (FileChannel channel = file.getChannel()) {
                MappedByteBuffer buffer = channel.map(
                    FileChannel.MapMode.READ_WRITE, 0, size);

                for (int i = 0; i < size; i++) {
                    buffer.put((byte) (i % 256));
                }

                buffer.force();
                System.out.println("Large file created with memory mapping");
            }
        }
    }

    public void readMappedFile(String filename) throws IOException {
        try (RandomAccessFile file = new RandomAccessFile(filename, "r");
             FileChannel channel = file.getChannel()) {

            long size = channel.size();
            MappedByteBuffer buffer = channel.map(
                FileChannel.MapMode.READ_ONLY, 0, size);

            byte[] data = new byte[100];
            buffer.get(data);

            System.out.println("Read " + data.length + " bytes from mapped file");
        }
    }
}
```

### Selector and Non-blocking I/O

```java
public class SelectorExample {

    public void startServer(int port) throws IOException {
        Selector selector = Selector.open();
        ServerSocketChannel serverChannel = ServerSocketChannel.open();

        serverChannel.bind(new InetSocketAddress(port));
        serverChannel.configureBlocking(false);
        serverChannel.register(selector, SelectionKey.OP_ACCEPT);

        System.out.println("Server started on port " + port);

        while (true) {
            int readyChannels = selector.select();
            if (readyChannels == 0) continue;

            Set<SelectionKey> selectedKeys = selector.selectedKeys();
            Iterator<SelectionKey> keyIterator = selectedKeys.iterator();

            while (keyIterator.hasNext()) {
                SelectionKey key = keyIterator.next();

                if (key.isAcceptable()) {
                    handleAccept(key, selector);
                } else if (key.isReadable()) {
                    handleRead(key);
                }

                keyIterator.remove();
            }
        }
    }

    private void handleAccept(SelectionKey key, Selector selector) throws IOException {
        ServerSocketChannel serverChannel = (ServerSocketChannel) key.channel();
        SocketChannel clientChannel = serverChannel.accept();

        if (clientChannel != null) {
            clientChannel.configureBlocking(false);
            clientChannel.register(selector, SelectionKey.OP_READ);
            System.out.println("Client connected: " + clientChannel.getRemoteAddress());
        }
    }

    private void handleRead(SelectionKey key) throws IOException {
        SocketChannel clientChannel = (SocketChannel) key.channel();
        ByteBuffer buffer = ByteBuffer.allocate(1024);

        int bytesRead = clientChannel.read(buffer);
        if (bytesRead == -1) {
            clientChannel.close();
            key.cancel();
            return;
        }

        buffer.flip();
        byte[] data = new byte[buffer.remaining()];
        buffer.get(data);

        String message = new String(data);
        System.out.println("Received: " + message);

        ByteBuffer response = ByteBuffer.wrap(("Echo: " + message).getBytes());
        clientChannel.write(response);
    }
}
```

## NIO.2 (Java 7+)

### Path and Files API

```java
import java.nio.file.*;

public class NIO2Example {

    public void demonstratePathOperations() {
        Path path = Paths.get("src", "main", "java", "Example.java");

        System.out.println("Path: " + path);
        System.out.println("Absolute path: " + path.toAbsolutePath());
        System.out.println("Parent: " + path.getParent());
        System.out.println("File name: " + path.getFileName());
        System.out.println("Root: " + path.getRoot());
        System.out.println("Name count: " + path.getNameCount());

        for (int i = 0; i < path.getNameCount(); i++) {
            System.out.println("Name " + i + ": " + path.getName(i));
        }

        Path normalized = path.normalize();
        System.out.println("Normalized: " + normalized);
    }

    public void fileOperationsWithFiles() throws IOException {
        Path source = Paths.get("source.txt");
        Path target = Paths.get("target.txt");
        Path directory = Paths.get("testDir");

        Files.createDirectories(directory);

        if (!Files.exists(source)) {
            Files.createFile(source);
            Files.write(source, "Hello, NIO.2!".getBytes());
        }

        System.out.println("File exists: " + Files.exists(source));
        System.out.println("Is regular file: " + Files.isRegularFile(source));
        System.out.println("Is directory: " + Files.isDirectory(source));
        System.out.println("File size: " + Files.size(source));

        Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
        System.out.println("File copied");

        byte[] content = Files.readAllBytes(target);
        System.out.println("Content: " + new String(content));

        List<String> lines = Files.readAllLines(target);
        lines.add("Second line");
        Files.write(target, lines);

        Files.move(target, directory.resolve("moved.txt"), StandardCopyOption.REPLACE_EXISTING);
        System.out.println("File moved");
    }

    public void walkFileTree(Path startPath) throws IOException {
        Files.walkFileTree(startPath, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                System.out.println("File: " + file);
                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
                System.out.println("Directory: " + dir);
                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult visitFileFailed(Path file, IOException exc) {
                System.err.println("Failed to visit: " + file);
                return FileVisitResult.CONTINUE;
            }
        });
    }
}
```

### Watch Service

```java
public class WatchServiceExample {

    public void watchDirectory(String directoryPath) throws IOException, InterruptedException {
        Path path = Paths.get(directoryPath);
        WatchService watchService = FileSystems.getDefault().newWatchService();

        path.register(watchService,
                     StandardWatchEventKinds.ENTRY_CREATE,
                     StandardWatchEventKinds.ENTRY_DELETE,
                     StandardWatchEventKinds.ENTRY_MODIFY);

        System.out.println("Watching directory: " + path);

        while (true) {
            WatchKey key = watchService.take();

            for (WatchEvent<?> event : key.pollEvents()) {
                WatchEvent.Kind<?> kind = event.kind();
                Path eventPath = (Path) event.context();

                System.out.println("Event: " + kind + " for " + eventPath);

                if (kind == StandardWatchEventKinds.ENTRY_CREATE) {
                    System.out.println("File created: " + eventPath);
                } else if (kind == StandardWatchEventKinds.ENTRY_DELETE) {
                    System.out.println("File deleted: " + eventPath);
                } else if (kind == StandardWatchEventKinds.ENTRY_MODIFY) {
                    System.out.println("File modified: " + eventPath);
                }
            }

            boolean valid = key.reset();
            if (!valid) {
                break;
            }
        }
    }
}
```

## Performance Comparison

### I/O vs NIO Performance Test

```java
public class PerformanceComparison {

    public void compareFileReading(String filename) throws IOException {
        long startTime, endTime;

        startTime = System.currentTimeMillis();
        readWithIO(filename);
        endTime = System.currentTimeMillis();
        System.out.println("Traditional I/O time: " + (endTime - startTime) + "ms");

        startTime = System.currentTimeMillis();
        readWithNIO(filename);
        endTime = System.currentTimeMillis();
        System.out.println("NIO time: " + (endTime - startTime) + "ms");

        startTime = System.currentTimeMillis();
        readWithNIO2(filename);
        endTime = System.currentTimeMillis();
        System.out.println("NIO.2 time: " + (endTime - startTime) + "ms");
    }

    private void readWithIO(String filename) throws IOException {
        try (BufferedInputStream bis = new BufferedInputStream(
                new FileInputStream(filename))) {

            byte[] buffer = new byte[8192];
            int bytesRead;
            long totalBytes = 0;

            while ((bytesRead = bis.read(buffer)) != -1) {
                totalBytes += bytesRead;
            }

            System.out.println("I/O read " + totalBytes + " bytes");
        }
    }

    private void readWithNIO(String filename) throws IOException {
        try (FileChannel channel = FileChannel.open(Paths.get(filename), StandardOpenOption.READ)) {
            ByteBuffer buffer = ByteBuffer.allocate(8192);
            long totalBytes = 0;

            while (channel.read(buffer) != -1) {
                totalBytes += buffer.position();
                buffer.clear();
            }

            System.out.println("NIO read " + totalBytes + " bytes");
        }
    }

    private void readWithNIO2(String filename) throws IOException {
        byte[] content = Files.readAllBytes(Paths.get(filename));
        System.out.println("NIO.2 read " + content.length + " bytes");
    }
}
```

## Best Practices

### Resource Management

```java
public class BestPracticesExample {

    public void properResourceManagement() {
        try (BufferedReader reader = Files.newBufferedReader(Paths.get("file.txt"));
             BufferedWriter writer = Files.newBufferedWriter(Paths.get("output.txt"))) {

            String line;
            while ((line = reader.readLine()) != null) {
                writer.write(line.toUpperCase());
                writer.newLine();
            }

        } catch (IOException e) {
            System.err.println("I/O error: " + e.getMessage());
        }
    }

    public void efficientBuffering() throws IOException {
        Path source = Paths.get("large-file.txt");
        Path target = Paths.get("processed-file.txt");

        try (BufferedReader reader = Files.newBufferedReader(source, StandardCharsets.UTF_8);
             BufferedWriter writer = Files.newBufferedWriter(target, StandardCharsets.UTF_8)) {

            reader.lines()
                  .filter(line -> !line.trim().isEmpty())
                  .map(String::toUpperCase)
                  .forEach(line -> {
                      try {
                          writer.write(line);
                          writer.newLine();
                      } catch (IOException e) {
                          throw new UncheckedIOException(e);
                      }
                  });
        }
    }

    public void handleLargeFiles(String filename) throws IOException {
        Path path = Paths.get(filename);

        try (Stream<String> lines = Files.lines(path)) {
            long count = lines
                .filter(line -> line.contains("ERROR"))
                .count();

            System.out.println("Error lines: " + count);
        }
    }
}
```

## Interview Tips

### Common I/O Interview Questions

1. **"What's the difference between I/O and NIO?"**

   - I/O: Blocking, stream-oriented, one thread per connection
   - NIO: Non-blocking, buffer-oriented, single thread for multiple connections

2. **"Explain serialization and its requirements"**

   - Objects must implement Serializable
   - All fields must be serializable or transient
   - serialVersionUID for version control

3. **"What are the benefits of using BufferedReader/Writer?"**

   - Reduces system calls
   - Improves performance for small reads/writes
   - Provides convenient methods like readLine()

4. **"How do you handle large files efficiently?"**

   - Use streaming APIs
   - Process data in chunks
   - Consider memory-mapped files for random access

5. **"What's the difference between flush() and close()?"**
   - flush(): Forces buffered data to be written
   - close(): Closes resource and releases system resources

### Key Points to Remember

- **Always use try-with-resources** for automatic resource management
- **Choose appropriate buffer sizes** (typically 8KB-64KB)
- **Use NIO for high-performance, concurrent I/O**
- **Prefer NIO.2 Path API** over File class
- **Handle character encoding explicitly**
- **Use streaming for large datasets**
- **Consider memory mapping for large random access files**

### Performance Tips

1. **Buffer I/O operations** to reduce system calls
2. **Use appropriate stream types** for your data
3. **Consider NIO for concurrent operations**
4. **Use NIO.2 for modern file operations**
5. **Handle exceptions properly** without suppressing them
6. **Close resources in finally blocks** or use try-with-resources

Remember: Understanding I/O performance characteristics and choosing the right approach for your use case is crucial for building efficient Java applications.
