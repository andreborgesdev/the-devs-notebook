# Java JDBC and Database Connectivity - Complete Guide

JDBC (Java Database Connectivity) is a Java API that enables Java applications to interact with relational databases. This guide covers everything from basic concepts to advanced techniques for database operations in Java.

## Table of Contents

1. [JDBC Fundamentals](#jdbc-fundamentals)
2. [Database Connection Management](#database-connection-management)
3. [Statement Types](#statement-types)
4. [ResultSet Operations](#resultset-operations)
5. [Transaction Management](#transaction-management)
6. [Connection Pooling](#connection-pooling)
7. [Advanced JDBC Features](#advanced-jdbc-features)
8. [Best Practices](#best-practices)
9. [Performance Optimization](#performance-optimization)
10. [Interview Tips](#interview-tips)

## JDBC Fundamentals

### JDBC Architecture

JDBC provides a standard interface for Java applications to communicate with databases:

- **JDBC API**: Defines interfaces and classes for database operations
- **JDBC Driver Manager**: Manages database drivers
- **JDBC Drivers**: Database-specific implementations
- **Database**: The actual data storage system

### JDBC Driver Types

1. **Type 1 (JDBC-ODBC Bridge)**: Uses ODBC drivers (deprecated)
2. **Type 2 (Native-API)**: Uses database-specific native libraries
3. **Type 3 (Network Protocol)**: Uses middleware to communicate with database
4. **Type 4 (Pure Java)**: Direct communication with database (most common)

### Essential JDBC Classes and Interfaces

```java
import java.sql.*;
import javax.sql.*;

DriverManager    // Manages database drivers
Connection       // Represents database connection
Statement        // Executes SQL statements
PreparedStatement // Pre-compiled SQL statements
CallableStatement // Executes stored procedures
ResultSet        // Holds query results
SQLException     // Database-related exceptions
```

## Database Connection Management

### Basic Connection Setup

```java
public class DatabaseConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/mydb";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "password";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }
}
```

### Connection with Properties

```java
public class DatabaseConnection {
    public static Connection getConnection() throws SQLException {
        Properties props = new Properties();
        props.setProperty("user", "root");
        props.setProperty("password", "password");
        props.setProperty("useSSL", "false");
        props.setProperty("serverTimezone", "UTC");
        props.setProperty("autoReconnect", "true");

        String url = "jdbc:mysql://localhost:3306/mydb";
        return DriverManager.getConnection(url, props);
    }
}
```

### Connection Factory Pattern

```java
public class ConnectionFactory {
    private static final String DRIVER = "com.mysql.cj.jdbc.Driver";
    private static final String URL = "jdbc:mysql://localhost:3306/mydb";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "password";

    static {
        try {
            Class.forName(DRIVER);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("Failed to load database driver", e);
        }
    }

    public static Connection createConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }

    public static void closeConnection(Connection connection) {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
        }
    }
}
```

### Configuration Management

```java
public class DatabaseConfig {
    private static final Properties properties = new Properties();

    static {
        try (InputStream input = DatabaseConfig.class
                .getClassLoader()
                .getResourceAsStream("database.properties")) {
            properties.load(input);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load database configuration", e);
        }
    }

    public static String getProperty(String key) {
        return properties.getProperty(key);
    }

    public static Connection getConnection() throws SQLException {
        String url = getProperty("db.url");
        String username = getProperty("db.username");
        String password = getProperty("db.password");

        return DriverManager.getConnection(url, username, password);
    }
}
```

## Statement Types

### 1. Statement

Basic SQL execution without parameters:

```java
public class StatementExample {
    public void createTable() throws SQLException {
        String sql = "CREATE TABLE users (" +
                    "id INT PRIMARY KEY AUTO_INCREMENT, " +
                    "name VARCHAR(100) NOT NULL, " +
                    "email VARCHAR(100) UNIQUE, " +
                    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                    ")";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {

            stmt.executeUpdate(sql);
            System.out.println("Table created successfully");
        }
    }

    public void insertUser(String name, String email) throws SQLException {
        String sql = "INSERT INTO users (name, email) VALUES ('" +
                    name + "', '" + email + "')";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {

            int rowsAffected = stmt.executeUpdate(sql);
            System.out.println(rowsAffected + " row(s) inserted");
        }
    }
}
```

### 2. PreparedStatement

Pre-compiled SQL with parameters (recommended):

```java
public class PreparedStatementExample {

    public void insertUser(String name, String email) throws SQLException {
        String sql = "INSERT INTO users (name, email) VALUES (?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, name);
            pstmt.setString(2, email);

            int rowsAffected = pstmt.executeUpdate();
            System.out.println(rowsAffected + " row(s) inserted");
        }
    }

    public User getUserById(int id) throws SQLException {
        String sql = "SELECT * FROM users WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return new User(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getTimestamp("created_at")
                    );
                }
            }
        }
        return null;
    }

    public void updateUser(int id, String name, String email) throws SQLException {
        String sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, name);
            pstmt.setString(2, email);
            pstmt.setInt(3, id);

            int rowsAffected = pstmt.executeUpdate();
            System.out.println(rowsAffected + " row(s) updated");
        }
    }

    public void deleteUser(int id) throws SQLException {
        String sql = "DELETE FROM users WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);

            int rowsAffected = pstmt.executeUpdate();
            System.out.println(rowsAffected + " row(s) deleted");
        }
    }
}
```

### 3. CallableStatement

Execute stored procedures:

```java
public class CallableStatementExample {

    public void callStoredProcedure(int userId) throws SQLException {
        String sql = "{call getUserWithOrders(?, ?)}";

        try (Connection conn = DatabaseConnection.getConnection();
             CallableStatement cstmt = conn.prepareCall(sql)) {

            cstmt.setInt(1, userId);
            cstmt.registerOutParameter(2, Types.INTEGER);

            cstmt.execute();

            int orderCount = cstmt.getInt(2);
            System.out.println("User has " + orderCount + " orders");
        }
    }

    public List<User> callStoredProcedureWithResultSet() throws SQLException {
        String sql = "{call getAllActiveUsers()}";
        List<User> users = new ArrayList<>();

        try (Connection conn = DatabaseConnection.getConnection();
             CallableStatement cstmt = conn.prepareCall(sql)) {

            try (ResultSet rs = cstmt.executeQuery()) {
                while (rs.next()) {
                    users.add(new User(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getTimestamp("created_at")
                    ));
                }
            }
        }
        return users;
    }
}
```

## ResultSet Operations

### Basic ResultSet Navigation

```java
public class ResultSetExample {

    public void demonstrateResultSetNavigation() throws SQLException {
        String sql = "SELECT * FROM users ORDER BY id";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(
                 sql,
                 ResultSet.TYPE_SCROLL_INSENSITIVE,
                 ResultSet.CONCUR_READ_ONLY)) {

            try (ResultSet rs = pstmt.executeQuery()) {

                System.out.println("Forward navigation:");
                while (rs.next()) {
                    System.out.println("ID: " + rs.getInt("id") +
                                     ", Name: " + rs.getString("name"));
                }

                System.out.println("\nBackward navigation:");
                while (rs.previous()) {
                    System.out.println("ID: " + rs.getInt("id") +
                                     ", Name: " + rs.getString("name"));
                }

                if (rs.first()) {
                    System.out.println("First row: " + rs.getString("name"));
                }

                if (rs.last()) {
                    System.out.println("Last row: " + rs.getString("name"));
                }

                rs.absolute(3);
                System.out.println("Third row: " + rs.getString("name"));
            }
        }
    }
}
```

### ResultSet Metadata

```java
public class ResultSetMetadataExample {

    public void analyzeResultSet() throws SQLException {
        String sql = "SELECT * FROM users LIMIT 1";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            try (ResultSet rs = pstmt.executeQuery()) {
                ResultSetMetaData metaData = rs.getMetaData();

                int columnCount = metaData.getColumnCount();
                System.out.println("Column count: " + columnCount);

                for (int i = 1; i <= columnCount; i++) {
                    System.out.println("Column " + i + ":");
                    System.out.println("  Name: " + metaData.getColumnName(i));
                    System.out.println("  Type: " + metaData.getColumnTypeName(i));
                    System.out.println("  Size: " + metaData.getColumnDisplaySize(i));
                    System.out.println("  Nullable: " +
                        (metaData.isNullable(i) == ResultSetMetaData.columnNullable));
                }
            }
        }
    }
}
```

### Advanced ResultSet Operations

```java
public class AdvancedResultSetExample {

    public void updateableResultSet() throws SQLException {
        String sql = "SELECT * FROM users WHERE id > ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(
                 sql,
                 ResultSet.TYPE_SCROLL_SENSITIVE,
                 ResultSet.CONCUR_UPDATABLE)) {

            pstmt.setInt(1, 10);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    String currentEmail = rs.getString("email");
                    if (!currentEmail.contains("@")) {
                        rs.updateString("email", currentEmail + "@example.com");
                        rs.updateRow();
                    }
                }

                rs.moveToInsertRow();
                rs.updateString("name", "New User");
                rs.updateString("email", "newuser@example.com");
                rs.insertRow();
            }
        }
    }
}
```

## Transaction Management

### Basic Transaction Control

```java
public class TransactionExample {

    public void transferMoney(int fromAccount, int toAccount, double amount)
            throws SQLException {

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false);

            String debitSql = "UPDATE accounts SET balance = balance - ? WHERE id = ?";
            try (PreparedStatement debitStmt = conn.prepareStatement(debitSql)) {
                debitStmt.setDouble(1, amount);
                debitStmt.setInt(2, fromAccount);
                debitStmt.executeUpdate();
            }

            String creditSql = "UPDATE accounts SET balance = balance + ? WHERE id = ?";
            try (PreparedStatement creditStmt = conn.prepareStatement(creditSql)) {
                creditStmt.setDouble(1, amount);
                creditStmt.setInt(2, toAccount);
                creditStmt.executeUpdate();
            }

            conn.commit();
            System.out.println("Transaction completed successfully");

        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                    System.out.println("Transaction rolled back");
                } catch (SQLException rollbackEx) {
                    System.err.println("Error during rollback: " + rollbackEx.getMessage());
                }
            }
            throw e;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    System.err.println("Error closing connection: " + e.getMessage());
                }
            }
        }
    }
}
```

### Savepoint Management

```java
public class SavepointExample {

    public void complexTransaction() throws SQLException {
        Connection conn = null;
        Savepoint savepoint1 = null;
        Savepoint savepoint2 = null;

        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false);

            String sql1 = "INSERT INTO users (name, email) VALUES (?, ?)";
            try (PreparedStatement pstmt1 = conn.prepareStatement(sql1)) {
                pstmt1.setString(1, "User1");
                pstmt1.setString(2, "user1@example.com");
                pstmt1.executeUpdate();
            }

            savepoint1 = conn.setSavepoint("SavePoint1");

            String sql2 = "INSERT INTO orders (user_id, total) VALUES (?, ?)";
            try (PreparedStatement pstmt2 = conn.prepareStatement(sql2)) {
                pstmt2.setInt(1, 1);
                pstmt2.setDouble(2, 100.00);
                pstmt2.executeUpdate();
            }

            savepoint2 = conn.setSavepoint("SavePoint2");

            String sql3 = "INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)";
            try (PreparedStatement pstmt3 = conn.prepareStatement(sql3)) {
                pstmt3.setInt(1, 1);
                pstmt3.setInt(2, 1);
                pstmt3.setInt(3, 2);
                pstmt3.executeUpdate();
            }

            conn.commit();
            System.out.println("All operations completed successfully");

        } catch (SQLException e) {
            if (conn != null) {
                try {
                    if (savepoint2 != null) {
                        conn.rollback(savepoint2);
                        System.out.println("Rolled back to savepoint2");
                    } else if (savepoint1 != null) {
                        conn.rollback(savepoint1);
                        System.out.println("Rolled back to savepoint1");
                    } else {
                        conn.rollback();
                        System.out.println("Complete rollback");
                    }
                } catch (SQLException rollbackEx) {
                    System.err.println("Error during rollback: " + rollbackEx.getMessage());
                }
            }
            throw e;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    System.err.println("Error closing connection: " + e.getMessage());
                }
            }
        }
    }
}
```

## Connection Pooling

### Basic Connection Pool Implementation

```java
public class BasicConnectionPool {
    private final Queue<Connection> availableConnections = new ConcurrentLinkedQueue<>();
    private final Set<Connection> usedConnections = ConcurrentHashMap.newKeySet();
    private final int maxPoolSize;
    private final int minPoolSize;

    public BasicConnectionPool(int minPoolSize, int maxPoolSize) {
        this.minPoolSize = minPoolSize;
        this.maxPoolSize = maxPoolSize;
        initializePool();
    }

    private void initializePool() {
        for (int i = 0; i < minPoolSize; i++) {
            try {
                availableConnections.offer(createConnection());
            } catch (SQLException e) {
                System.err.println("Error creating connection: " + e.getMessage());
            }
        }
    }

    private Connection createConnection() throws SQLException {
        return DriverManager.getConnection(
            "jdbc:mysql://localhost:3306/mydb",
            "root",
            "password"
        );
    }

    public synchronized Connection getConnection() throws SQLException {
        if (availableConnections.isEmpty() && usedConnections.size() < maxPoolSize) {
            availableConnections.offer(createConnection());
        }

        Connection connection = availableConnections.poll();
        if (connection != null) {
            usedConnections.add(connection);
        }
        return connection;
    }

    public synchronized void releaseConnection(Connection connection) {
        if (usedConnections.remove(connection)) {
            availableConnections.offer(connection);
        }
    }

    public synchronized void shutdown() {
        for (Connection connection : availableConnections) {
            try {
                connection.close();
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
        }

        for (Connection connection : usedConnections) {
            try {
                connection.close();
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
        }
    }
}
```

### Using HikariCP (Production-Ready)

```java
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

public class HikariConnectionPool {
    private static HikariDataSource dataSource;

    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/mydb");
        config.setUsername("root");
        config.setPassword("password");
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");

        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);
        config.setIdleTimeout(300000);
        config.setConnectionTimeout(20000);
        config.setMaxLifetime(1200000);
        config.setLeakDetectionThreshold(60000);

        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        config.addDataSourceProperty("useServerPrepStmts", "true");

        dataSource = new HikariDataSource(config);
    }

    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    public static void close() {
        if (dataSource != null) {
            dataSource.close();
        }
    }
}
```

## Advanced JDBC Features

### Batch Processing

```java
public class BatchProcessingExample {

    public void batchInsert(List<User> users) throws SQLException {
        String sql = "INSERT INTO users (name, email) VALUES (?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            conn.setAutoCommit(false);

            for (User user : users) {
                pstmt.setString(1, user.getName());
                pstmt.setString(2, user.getEmail());
                pstmt.addBatch();

                if (users.indexOf(user) % 1000 == 0) {
                    pstmt.executeBatch();
                    pstmt.clearBatch();
                }
            }

            pstmt.executeBatch();
            conn.commit();

            System.out.println("Batch insert completed for " + users.size() + " users");
        }
    }

    public void batchUpdate() throws SQLException {
        String sql = "UPDATE users SET email = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            conn.setAutoCommit(false);

            for (int i = 1; i <= 1000; i++) {
                pstmt.setString(1, "user" + i + "@newdomain.com");
                pstmt.setInt(2, i);
                pstmt.addBatch();
            }

            int[] updateCounts = pstmt.executeBatch();
            conn.commit();

            System.out.println("Batch update completed. Updated rows: " +
                             Arrays.stream(updateCounts).sum());
        }
    }
}
```

### Large Object Handling (BLOB/CLOB)

```java
public class LargeObjectExample {

    public void insertBlob(int id, File file) throws SQLException, IOException {
        String sql = "INSERT INTO documents (id, content) VALUES (?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             FileInputStream fis = new FileInputStream(file)) {

            pstmt.setInt(1, id);
            pstmt.setBinaryStream(2, fis, (int) file.length());

            pstmt.executeUpdate();
            System.out.println("BLOB inserted successfully");
        }
    }

    public void retrieveBlob(int id, String outputPath) throws SQLException, IOException {
        String sql = "SELECT content FROM documents WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    Blob blob = rs.getBlob("content");

                    try (InputStream is = blob.getBinaryStream();
                         FileOutputStream fos = new FileOutputStream(outputPath)) {

                        byte[] buffer = new byte[4096];
                        int bytesRead;
                        while ((bytesRead = is.read(buffer)) != -1) {
                            fos.write(buffer, 0, bytesRead);
                        }
                    }
                    System.out.println("BLOB retrieved successfully");
                }
            }
        }
    }

    public void insertClob(int id, String content) throws SQLException {
        String sql = "INSERT INTO articles (id, content) VALUES (?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);
            pstmt.setClob(2, new StringReader(content));

            pstmt.executeUpdate();
            System.out.println("CLOB inserted successfully");
        }
    }
}
```

### Generated Keys

```java
public class GeneratedKeysExample {

    public int insertUserAndGetId(String name, String email) throws SQLException {
        String sql = "INSERT INTO users (name, email) VALUES (?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql,
                                                            Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setString(1, name);
            pstmt.setString(2, email);

            int affectedRows = pstmt.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Creating user failed, no rows affected.");
            }

            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                } else {
                    throw new SQLException("Creating user failed, no ID obtained.");
                }
            }
        }
    }
}
```

## Best Practices

### Resource Management

```java
public class ResourceManagementExample {

    public List<User> getAllUsers() throws SQLException {
        List<User> users = new ArrayList<>();
        String sql = "SELECT * FROM users";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                users.add(new User(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getString("email"),
                    rs.getTimestamp("created_at")
                ));
            }
        }
        return users;
    }

    public void properExceptionHandling() {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DatabaseConnection.getConnection();
            pstmt = conn.prepareStatement("SELECT * FROM users");
            rs = pstmt.executeQuery();

            while (rs.next()) {
                System.out.println(rs.getString("name"));
            }
        } catch (SQLException e) {
            System.err.println("Database error: " + e.getMessage());
        } finally {
            closeQuietly(rs);
            closeQuietly(pstmt);
            closeQuietly(conn);
        }
    }

    private void closeQuietly(AutoCloseable resource) {
        if (resource != null) {
            try {
                resource.close();
            } catch (Exception e) {
                System.err.println("Error closing resource: " + e.getMessage());
            }
        }
    }
}
```

### SQL Injection Prevention

```java
public class SQLInjectionPreventionExample {

    public User getUserByEmail(String email) throws SQLException {
        String sql = "SELECT * FROM users WHERE email = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return new User(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getTimestamp("created_at")
                    );
                }
            }
        }
        return null;
    }

    public List<User> searchUsers(String searchTerm) throws SQLException {
        String sql = "SELECT * FROM users WHERE name LIKE ? OR email LIKE ?";
        String searchPattern = "%" + searchTerm + "%";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, searchPattern);
            pstmt.setString(2, searchPattern);

            try (ResultSet rs = pstmt.executeQuery()) {
                List<User> users = new ArrayList<>();
                while (rs.next()) {
                    users.add(new User(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getTimestamp("created_at")
                    ));
                }
                return users;
            }
        }
    }
}
```

## Performance Optimization

### Statement Caching

```java
public class StatementCachingExample {
    private final Map<String, PreparedStatement> statementCache = new ConcurrentHashMap<>();
    private final Connection connection;

    public StatementCachingExample(Connection connection) {
        this.connection = connection;
    }

    public PreparedStatement getCachedStatement(String sql) throws SQLException {
        PreparedStatement stmt = statementCache.get(sql);
        if (stmt == null) {
            stmt = connection.prepareStatement(sql);
            statementCache.put(sql, stmt);
        }
        return stmt;
    }

    public void clearCache() throws SQLException {
        for (PreparedStatement stmt : statementCache.values()) {
            stmt.close();
        }
        statementCache.clear();
    }
}
```

### Pagination

```java
public class PaginationExample {

    public List<User> getUsersPaginated(int page, int pageSize) throws SQLException {
        String sql = "SELECT * FROM users ORDER BY id LIMIT ? OFFSET ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, pageSize);
            pstmt.setInt(2, (page - 1) * pageSize);

            try (ResultSet rs = pstmt.executeQuery()) {
                List<User> users = new ArrayList<>();
                while (rs.next()) {
                    users.add(new User(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("email"),
                        rs.getTimestamp("created_at")
                    ));
                }
                return users;
            }
        }
    }

    public int getTotalUserCount() throws SQLException {
        String sql = "SELECT COUNT(*) FROM users";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            if (rs.next()) {
                return rs.getInt(1);
            }
        }
        return 0;
    }
}
```

## Interview Tips

### Common JDBC Interview Questions

1. **"What is JDBC and how does it work?"**

   - Java API for database connectivity
   - Provides standard interface for different databases
   - Uses database-specific drivers

2. **"Explain the difference between Statement, PreparedStatement, and CallableStatement"**

   - Statement: Basic SQL execution
   - PreparedStatement: Pre-compiled SQL with parameters
   - CallableStatement: Stored procedure execution

3. **"How do you prevent SQL injection in JDBC?"**

   - Use PreparedStatement with parameters
   - Validate input data
   - Use stored procedures
   - Implement proper error handling

4. **"What is connection pooling and why is it important?"**

   - Reuses database connections
   - Improves performance
   - Reduces resource overhead
   - Handles connection lifecycle

5. **"How do you handle transactions in JDBC?"**
   - setAutoCommit(false)
   - commit() and rollback()
   - Savepoints for partial rollback
   - Proper exception handling

### Performance Considerations

- **Use connection pooling** for production applications
- **Prefer PreparedStatement** over Statement
- **Implement batch processing** for bulk operations
- **Close resources properly** to prevent memory leaks
- **Use appropriate fetch sizes** for large result sets
- **Implement statement caching** when appropriate

### Best Practices Summary

1. **Always use try-with-resources** for automatic resource management
2. **Never concatenate user input** into SQL strings
3. **Use appropriate transaction isolation levels**
4. **Implement proper error handling and logging**
5. **Monitor and tune database performance**
6. **Use connection pooling** in production environments
7. **Validate input data** before database operations
8. **Implement proper security measures**

Remember: JDBC is foundational for Java database programming. Understanding its core concepts, best practices, and performance optimization techniques is crucial for building robust, scalable database applications.
