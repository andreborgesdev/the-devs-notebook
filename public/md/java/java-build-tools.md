# Java Build Tools and Dependency Management

## Overview

Build tools automate the compilation, packaging, testing, and deployment of Java applications. They manage dependencies, execute tasks, and ensure consistent builds across different environments.

## Maven

### Project Structure

```
project/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   └── test/
│       ├── java/
│       └── resources/
└── target/
```

### POM.xml Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Maven Lifecycle Phases

```bash
# Clean lifecycle
mvn clean

# Default lifecycle
mvn validate    # Validate project structure
mvn compile     # Compile source code
mvn test        # Run unit tests
mvn package     # Create JAR/WAR
mvn verify      # Run integration tests
mvn install     # Install to local repository
mvn deploy      # Deploy to remote repository

# Site lifecycle
mvn site        # Generate project site
```

### Dependency Management

```xml
<!-- Dependency with version -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>5.3.21</version>
</dependency>

<!-- Optional dependency -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
    <optional>true</optional>
</dependency>

<!-- Exclude transitive dependencies -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>5.3.21</version>
    <exclusions>
        <exclusion>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

### Dependency Scopes

```xml
<!-- compile (default) - available in all phases -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.12.0</version>
    <scope>compile</scope>
</dependency>

<!-- provided - available at compile time, not packaged -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>servlet-api</artifactId>
    <version>2.5</version>
    <scope>provided</scope>
</dependency>

<!-- runtime - not needed for compilation -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
    <scope>runtime</scope>
</dependency>

<!-- test - only for testing -->
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13.2</version>
    <scope>test</scope>
</dependency>

<!-- system - provided by JDK or container -->
<dependency>
    <groupId>com.sun</groupId>
    <artifactId>tools</artifactId>
    <version>1.8</version>
    <scope>system</scope>
    <systemPath>${java.home}/lib/tools.jar</systemPath>
</dependency>
```

### Multi-Module Projects

```xml
<!-- Parent POM -->
<project>
    <groupId>com.example</groupId>
    <artifactId>parent-project</artifactId>
    <version>1.0</version>
    <packaging>pom</packaging>

    <modules>
        <module>module-a</module>
        <module>module-b</module>
    </modules>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>junit</groupId>
                <artifactId>junit</artifactId>
                <version>4.13.2</version>
                <scope>test</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>

<!-- Child POM -->
<project>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>parent-project</artifactId>
        <version>1.0</version>
    </parent>

    <artifactId>module-a</artifactId>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
        </dependency>
    </dependencies>
</project>
```

### Maven Profiles

```xml
<profiles>
    <profile>
        <id>development</id>
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>
        <properties>
            <database.url>jdbc:h2:mem:testdb</database.url>
        </properties>
    </profile>

    <profile>
        <id>production</id>
        <properties>
            <database.url>jdbc:mysql://prod-server/mydb</database.url>
        </properties>
        <build>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-surefire-plugin</artifactId>
                    <configuration>
                        <skipTests>true</skipTests>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>
</profiles>
```

## Gradle

### Project Structure

```
project/
├── build.gradle
├── settings.gradle
├── gradle.properties
├── gradlew
├── gradlew.bat
├── gradle/
│   └── wrapper/
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   └── test/
│       ├── java/
│       └── resources/
└── build/
```

### Basic Build Script (Groovy)

```groovy
plugins {
    id 'java'
    id 'application'
}

group = 'com.example'
version = '1.0-SNAPSHOT'

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
    jcenter()
}

dependencies {
    implementation 'org.springframework:spring-core:5.3.21'
    implementation 'org.apache.commons:commons-lang3:3.12.0'

    runtimeOnly 'mysql:mysql-connector-java:8.0.33'

    testImplementation 'junit:junit:4.13.2'
    testImplementation 'org.mockito:mockito-core:4.6.1'
}

application {
    mainClass = 'com.example.Main'
}

test {
    useJUnitPlatform()
}
```

### Kotlin DSL Build Script

```kotlin
plugins {
    java
    application
}

group = "com.example"
version = "1.0-SNAPSHOT"

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework:spring-core:5.3.21")
    implementation("org.apache.commons:commons-lang3:3.12.0")

    runtimeOnly("mysql:mysql-connector-java:8.0.33")

    testImplementation("junit:junit:4.13.2")
    testImplementation("org.mockito:mockito-core:4.6.1")
}

application {
    mainClass.set("com.example.Main")
}

tasks.test {
    useJUnitPlatform()
}
```

### Gradle Tasks

```bash
# Build tasks
./gradlew build           # Full build
./gradlew compileJava     # Compile main sources
./gradlew compileTestJava # Compile test sources
./gradlew test            # Run tests
./gradlew jar             # Create JAR
./gradlew clean           # Clean build directory

# Application tasks
./gradlew run             # Run application
./gradlew installDist     # Create distribution

# Dependency tasks
./gradlew dependencies    # Show dependency tree
./gradlew dependencyInsight --dependency spring-core
```

### Multi-Project Build

```groovy
// settings.gradle
rootProject.name = 'multi-project'
include 'shared', 'api', 'services:webservice'

// Root build.gradle
subprojects {
    apply plugin: 'java'

    repositories {
        mavenCentral()
    }

    dependencies {
        testImplementation 'junit:junit:4.13.2'
    }
}

project(':shared') {
    dependencies {
        implementation 'org.apache.commons:commons-lang3:3.12.0'
    }
}

project(':api') {
    dependencies {
        implementation project(':shared')
        implementation 'org.springframework:spring-web:5.3.21'
    }
}
```

### Custom Tasks

```groovy
task hello {
    doLast {
        println 'Hello, World!'
    }
}

task copyFiles(type: Copy) {
    from 'src/main/resources'
    into 'build/config'
    include '**/*.properties'
}

task createDist(type: Zip) {
    from 'build/libs'
    from 'build/config'
    archiveFileName = "${project.name}-${version}.zip"
}
```

## Dependency Resolution

### Version Conflicts

```xml
<!-- Maven - Force version -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>5.3.21</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

```groovy
// Gradle - Force version
configurations.all {
    resolutionStrategy {
        force 'org.springframework:spring-core:5.3.21'
    }
}

// Gradle - Exclude transitive dependency
dependencies {
    implementation('org.springframework:spring-web:5.3.21') {
        exclude group: 'commons-logging', module: 'commons-logging'
    }
}
```

### Dependency Analysis

```bash
# Maven
mvn dependency:tree
mvn dependency:analyze
mvn dependency:resolve-sources

# Gradle
./gradlew dependencies
./gradlew dependencies --configuration compileClasspath
./gradlew dependencyInsight --dependency spring-core
```

## Repository Management

### Maven Repositories

```xml
<repositories>
    <repository>
        <id>central</id>
        <url>https://repo1.maven.org/maven2</url>
    </repository>
    <repository>
        <id>spring-releases</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>

<distributionManagement>
    <repository>
        <id>releases</id>
        <url>https://nexus.company.com/repository/maven-releases/</url>
    </repository>
    <snapshotRepository>
        <id>snapshots</id>
        <url>https://nexus.company.com/repository/maven-snapshots/</url>
    </snapshotRepository>
</distributionManagement>
```

### Gradle Repositories

```groovy
repositories {
    mavenCentral()
    jcenter()
    mavenLocal()

    maven {
        url 'https://repo.spring.io/release'
    }

    maven {
        url 'https://nexus.company.com/repository/maven-public/'
        credentials {
            username project.findProperty('nexusUsername') ?: ''
            password project.findProperty('nexusPassword') ?: ''
        }
    }
}
```

## Plugin Ecosystem

### Essential Maven Plugins

```xml
<build>
    <plugins>
        <!-- Compiler -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.11.0</version>
            <configuration>
                <source>17</source>
                <target>17</target>
            </configuration>
        </plugin>

        <!-- Surefire (Unit Tests) -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <version>3.0.0</version>
        </plugin>

        <!-- Failsafe (Integration Tests) -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-failsafe-plugin</artifactId>
            <version>3.0.0</version>
        </plugin>

        <!-- JAR -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-jar-plugin</artifactId>
            <version>3.3.0</version>
            <configuration>
                <archive>
                    <manifest>
                        <mainClass>com.example.Main</mainClass>
                    </manifest>
                </archive>
            </configuration>
        </plugin>

        <!-- Assembly -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-assembly-plugin</artifactId>
            <version>3.4.2</version>
            <configuration>
                <descriptorRefs>
                    <descriptorRef>jar-with-dependencies</descriptorRef>
                </descriptorRefs>
            </configuration>
        </plugin>
    </plugins>
</build>
```

### Essential Gradle Plugins

```groovy
plugins {
    id 'java'
    id 'application'
    id 'jacoco'
    id 'checkstyle'
    id 'com.github.johnrengelman.shadow' version '7.1.2'
    id 'org.springframework.boot' version '2.7.0'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
}

jacoco {
    toolVersion = "0.8.7"
}

checkstyle {
    toolVersion = '10.3'
    configFile = file('config/checkstyle/checkstyle.xml')
}

shadowJar {
    archiveClassifier.set('')
    mergeServiceFiles()
}
```

## Build Optimization

### Maven Performance

```xml
<!-- Parallel builds -->
<properties>
    <maven.test.parallel>methods</maven.test.parallel>
    <maven.test.perCoreThreadCount>true</maven.test.perCoreThreadCount>
</properties>

<!-- Skip tests for faster builds -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <configuration>
        <skipTests>${skip.tests}</skipTests>
    </configuration>
</plugin>
```

```bash
# Maven command-line optimizations
mvn clean install -T 4          # 4 threads
mvn clean install -T 1C         # 1 thread per CPU core
mvn clean install -DskipTests   # Skip tests
mvn clean install -o            # Offline mode
```

### Gradle Performance

```groovy
// gradle.properties
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.configureondemand=true
org.gradle.daemon=true
org.gradle.jvmargs=-Xmx2048m -XX:+UseParallelGC

// Build cache
buildCache {
    local {
        enabled = true
    }
}
```

## CI/CD Integration

### Maven CI Configuration

```yaml
# GitHub Actions
name: Maven CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: "17"
          distribution: "temurin"
      - name: Cache Maven dependencies
        uses: actions/cache@v3
        with:
          path: ~/.m2
          key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
      - name: Run tests
        run: mvn clean test
      - name: Build
        run: mvn clean package
```

### Gradle CI Configuration

```yaml
# GitHub Actions
name: Gradle CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: "17"
          distribution: "temurin"
      - name: Cache Gradle dependencies
        uses: actions/cache@v3
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
      - name: Grant execute permission for gradlew
        run: chmod +x gradlew
      - name: Run tests
        run: ./gradlew test
      - name: Build
        run: ./gradlew build
```

## Best Practices

### General Guidelines

1. **Version Management**: Use semantic versioning and avoid SNAPSHOT in production
2. **Dependency Scope**: Use appropriate scopes to minimize JAR size
3. **Repository Order**: Place faster repositories first
4. **Cache Usage**: Enable build caches for faster builds
5. **Security**: Regularly update dependencies for security patches

### Maven Best Practices

```xml
<!-- Use properties for versions -->
<properties>
    <spring.version>5.3.21</spring.version>
    <junit.version>4.13.2</junit.version>
</properties>

<!-- Use dependencyManagement for version consistency -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-framework-bom</artifactId>
            <version>${spring.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<!-- Plugin management -->
<pluginManagement>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.11.0</version>
        </plugin>
    </plugins>
</pluginManagement>
```

### Gradle Best Practices

```groovy
// Use version catalogs (Gradle 7+)
dependencyResolutionManagement {
    versionCatalogs {
        libs {
            library('spring-core', 'org.springframework', 'spring-core').version('5.3.21')
            library('junit', 'junit', 'junit').version('4.13.2')
        }
    }
}

// Use buildSrc for custom logic
// buildSrc/src/main/groovy/Versions.groovy
class Versions {
    static final String SPRING = '5.3.21'
    static final String JUNIT = '4.13.2'
}

// Precompiled script plugins
plugins {
    id 'java-library-conventions'
}
```

## Interview Questions

### Fundamental Questions

1. **What are the main differences between Maven and Gradle?**

   - Maven: XML-based, convention over configuration, declarative
   - Gradle: Groovy/Kotlin DSL, flexible, imperative and declarative

2. **Explain Maven's dependency resolution mechanism.**

   - Nearest definition wins (depth in dependency tree)
   - First declaration wins (if same depth)
   - Dependency mediation and exclusions

3. **What is the purpose of Maven's dependencyManagement section?**
   - Define versions without adding dependencies
   - Ensure version consistency across modules
   - Override transitive dependency versions

### Advanced Questions

4. **How do you handle version conflicts in dependencies?**

   - Use dependency exclusions
   - Force specific versions
   - Analyze dependency tree
   - Use BOMs (Bill of Materials)

5. **Explain Gradle's incremental builds and build cache.**

   - Task input/output tracking
   - UP-TO-DATE checks
   - Local and remote build caches
   - Cacheable task annotations

6. **How would you optimize build performance?**
   - Parallel execution
   - Build caching
   - Incremental compilation
   - Exclude unnecessary tasks
   - Use appropriate scopes

### Scenario-Based Questions

7. **You have a multi-module project with shared dependencies. How would you manage versions?**

   - Use parent POM with dependencyManagement
   - Create a BOM module
   - Use Gradle version catalogs
   - Implement custom version management

8. **How would you set up different configurations for different environments?**
   - Maven profiles
   - Gradle build variants
   - Property files
   - Environment-specific configurations

## Common Pitfalls

### Maven Issues

- **Dependency Hell**: Conflicting transitive dependencies
- **SNAPSHOT Dependencies**: Unreliable builds in production
- **Plugin Compatibility**: Version mismatches between plugins
- **Repository Order**: Slow builds due to repository ordering

### Gradle Issues

- **Configuration Cache**: Incompatible plugins
- **Daemon Issues**: Memory leaks in long-running daemons
- **Build Script Complexity**: Over-engineered build logic
- **Task Dependencies**: Incorrect task ordering

## Summary

Build tools are essential for Java development, providing dependency management, build automation, and project standardization. Maven offers convention-based builds with XML configuration, while Gradle provides flexibility with programmatic DSLs. Understanding both tools, their ecosystems, and best practices is crucial for effective Java development and successful technical interviews.

Key areas to focus on:

- Project structure and configuration
- Dependency management and resolution
- Build lifecycles and task execution
- Multi-module project organization
- CI/CD integration
- Performance optimization
- Troubleshooting common issues
