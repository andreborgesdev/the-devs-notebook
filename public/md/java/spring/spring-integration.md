# Spring Integration

## Overview

Spring Integration provides an extension of the Spring programming model to support enterprise integration patterns. It enables lightweight messaging within Spring-based applications and supports integration with external systems via declarative adapters.

## Core Concepts

### Message and Message Channel

```java
@Configuration
@EnableIntegration
public class IntegrationConfig {

    @Bean
    public MessageChannel inputChannel() {
        return MessageChannels.direct("inputChannel").get();
    }

    @Bean
    public MessageChannel outputChannel() {
        return MessageChannels.direct("outputChannel").get();
    }

    @Bean
    public QueueChannel queueChannel() {
        return MessageChannels.queue("queueChannel", 100).get();
    }

    @Bean
    public PublishSubscribeChannel pubSubChannel() {
        return MessageChannels.publishSubscribe("pubSubChannel").get();
    }
}
```

### Message Endpoints

```java
@Component
public class MessageHandler {

    @ServiceActivator(inputChannel = "inputChannel", outputChannel = "outputChannel")
    public String processMessage(String payload) {
        return "Processed: " + payload.toUpperCase();
    }

    @Transformer(inputChannel = "transformChannel", outputChannel = "outputChannel")
    public Person transformMessage(String payload) {
        String[] parts = payload.split(",");
        return new Person(parts[0], parts[1], parts[2]);
    }

    @Filter(inputChannel = "filterChannel", outputChannel = "outputChannel")
    public boolean filterMessage(String payload) {
        return payload.length() > 5;
    }

    @Router(inputChannel = "routerChannel")
    public String routeMessage(String payload) {
        return payload.startsWith("A") ? "channelA" : "channelB";
    }
}
```

## Integration Flows

### Java DSL

```java
@Configuration
public class IntegrationFlowConfig {

    @Bean
    public IntegrationFlow simpleFlow() {
        return IntegrationFlows
                .from("inputChannel")
                .transform(String.class, String::toUpperCase)
                .filter(String.class, s -> s.length() > 5)
                .handle(msg -> System.out.println("Received: " + msg.getPayload()))
                .get();
    }

    @Bean
    public IntegrationFlow complexFlow() {
        return IntegrationFlows
                .from("complexInputChannel")
                .enrichHeaders(h -> h.header("timestamp", System.currentTimeMillis()))
                .transform(String.class, this::processMessage)
                .route(String.class,
                    msg -> msg.contains("error") ? "errorChannel" : "successChannel",
                    mapping -> mapping
                        .channelMapping("error", "errorChannel")
                        .channelMapping("success", "successChannel"))
                .get();
    }

    @Bean
    public IntegrationFlow aggregatorFlow() {
        return IntegrationFlows
                .from("aggregatorInputChannel")
                .split()
                .channel(MessageChannels.executor(taskExecutor()))
                .transform(String.class, String::toUpperCase)
                .aggregate(aggregator -> aggregator
                    .correlationStrategy(msg -> msg.getHeaders().get("correlationId"))
                    .releaseStrategy(group -> group.size() == 5)
                    .outputProcessor(group ->
                        group.getMessages().stream()
                            .map(msg -> msg.getPayload().toString())
                            .collect(Collectors.joining(","))))
                .handle("outputChannel")
                .get();
    }

    private String processMessage(String input) {
        return "Processed: " + input;
    }
}
```

### Gateway Pattern

```java
@MessagingGateway
public interface OrderGateway {

    @Gateway(requestChannel = "orderProcessingChannel")
    OrderResult processOrder(Order order);

    @Gateway(requestChannel = "orderProcessingChannel",
             replyTimeout = 5000,
             requestTimeout = 2000)
    Future<OrderResult> processOrderAsync(Order order);

    @Gateway(requestChannel = "orderValidationChannel")
    void validateOrder(Order order);
}

@Configuration
public class OrderProcessingConfig {

    @Bean
    public IntegrationFlow orderProcessingFlow() {
        return IntegrationFlows
                .from("orderProcessingChannel")
                .handle(OrderService.class, "processOrder")
                .get();
    }

    @Bean
    public IntegrationFlow orderValidationFlow() {
        return IntegrationFlows
                .from("orderValidationChannel")
                .handle(OrderService.class, "validateOrder")
                .get();
    }
}
```

## File Integration

### File Adapters

```java
@Configuration
public class FileIntegrationConfig {

    @Bean
    public IntegrationFlow fileInboundFlow() {
        return IntegrationFlows
                .from(Files.inboundAdapter(new File("/input"))
                    .patternFilter("*.txt")
                    .autoCreateDirectory(true)
                    .preventDuplicates(true),
                    e -> e.poller(Pollers.fixedDelay(1000)))
                .transform(File.class, this::readFileContent)
                .handle(msg -> processFileContent((String) msg.getPayload()))
                .get();
    }

    @Bean
    public IntegrationFlow fileOutboundFlow() {
        return IntegrationFlows
                .from("fileOutputChannel")
                .handle(Files.outboundAdapter(new File("/output"))
                    .fileExistsMode(FileExistsMode.APPEND)
                    .fileNameGenerator(msg -> "output-" + System.currentTimeMillis() + ".txt"))
                .get();
    }

    @Bean
    public IntegrationFlow fileTailFlow() {
        return IntegrationFlows
                .from(Files.tailAdapter(new File("/var/log/app.log"))
                    .delay(500)
                    .end(false),
                    e -> e.poller(Pollers.fixedDelay(1000)))
                .transform(String.class, this::parseLogLine)
                .filter(LogEntry.class, entry -> entry.getLevel().equals("ERROR"))
                .handle("errorNotificationChannel")
                .get();
    }

    private String readFileContent(File file) {
        try {
            return Files.readString(file.toPath());
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file", e);
        }
    }

    private void processFileContent(String content) {
        System.out.println("Processing: " + content);
    }

    private LogEntry parseLogLine(String line) {
        // Parse log line and return LogEntry
        return new LogEntry(line);
    }
}
```

### FTP Integration

```java
@Configuration
public class FtpIntegrationConfig {

    @Bean
    public SessionFactory<ChannelSftp.LsEntry> sftpSessionFactory() {
        DefaultSftpSessionFactory factory = new DefaultSftpSessionFactory(true);
        factory.setHost("ftp.example.com");
        factory.setPort(22);
        factory.setUser("username");
        factory.setPassword("password");
        factory.setAllowUnknownKeys(true);
        return new CachingSessionFactory<>(factory);
    }

    @Bean
    public IntegrationFlow sftpInboundFlow() {
        return IntegrationFlows
                .from(Sftp.inboundAdapter(sftpSessionFactory())
                    .preserveTimestamp(true)
                    .remoteDirectory("/remote/input")
                    .regexFilter(".*\\.csv$")
                    .localDirectory(new File("/local/input"))
                    .autoCreateLocalDirectory(true),
                    e -> e.poller(Pollers.fixedDelay(30000)))
                .handle(msg -> processDownloadedFile((File) msg.getPayload()))
                .get();
    }

    @Bean
    public IntegrationFlow sftpOutboundFlow() {
        return IntegrationFlows
                .from("sftpUploadChannel")
                .handle(Sftp.outboundAdapter(sftpSessionFactory())
                    .useTemporaryFileName(false)
                    .remoteDirectory("/remote/output"))
                .get();
    }

    private void processDownloadedFile(File file) {
        System.out.println("Downloaded file: " + file.getName());
    }
}
```

## JMS Integration

### JMS Configuration

```java
@Configuration
@EnableJms
public class JmsIntegrationConfig {

    @Bean
    public IntegrationFlow jmsInboundFlow() {
        return IntegrationFlows
                .from(Jms.inboundAdapter(connectionFactory())
                    .destination("input.queue")
                    .errorChannel("jmsErrorChannel"))
                .transform(String.class, this::processJmsMessage)
                .handle("processedMessageChannel")
                .get();
    }

    @Bean
    public IntegrationFlow jmsOutboundFlow() {
        return IntegrationFlows
                .from("jmsOutputChannel")
                .handle(Jms.outboundAdapter(connectionFactory())
                    .destination("output.queue")
                    .deliveryPersistent(true))
                .get();
    }

    @Bean
    public IntegrationFlow jmsPubSubFlow() {
        return IntegrationFlows
                .from("pubSubInputChannel")
                .publishSubscribeChannel(c -> c
                    .subscribe(f -> f
                        .handle(Jms.outboundAdapter(connectionFactory())
                            .destination("topic.notifications")))
                    .subscribe(f -> f
                        .handle(Jms.outboundAdapter(connectionFactory())
                            .destination("topic.audit"))))
                .get();
    }

    private String processJmsMessage(String message) {
        return "Processed JMS: " + message;
    }
}
```

### Message-Driven Endpoints

```java
@Component
public class JmsMessageHandler {

    @JmsListener(destination = "order.queue")
    @ServiceActivator(inputChannel = "orderProcessingChannel")
    public void handleOrderMessage(Order order) {
        System.out.println("Processing order: " + order.getId());
    }

    @JmsListener(destination = "notification.queue")
    public void handleNotification(
            @Payload String message,
            @Header("priority") String priority) {

        if ("HIGH".equals(priority)) {
            // Handle high priority notification
            handleHighPriorityNotification(message);
        } else {
            // Handle normal notification
            handleNormalNotification(message);
        }
    }

    private void handleHighPriorityNotification(String message) {
        System.out.println("High priority: " + message);
    }

    private void handleNormalNotification(String message) {
        System.out.println("Normal priority: " + message);
    }
}
```

## HTTP Integration

### HTTP Adapters

```java
@Configuration
public class HttpIntegrationConfig {

    @Bean
    public IntegrationFlow httpInboundFlow() {
        return IntegrationFlows
                .from(Http.inboundGateway("/api/process")
                    .requestMapping(m -> m.methods(HttpMethod.POST))
                    .requestPayloadType(String.class))
                .transform(String.class, this::processHttpRequest)
                .get();
    }

    @Bean
    public IntegrationFlow httpOutboundFlow() {
        return IntegrationFlows
                .from("httpRequestChannel")
                .handle(Http.outboundGateway("http://external-api.com/process")
                    .httpMethod(HttpMethod.POST)
                    .expectedResponseType(String.class)
                    .charset("UTF-8"))
                .get();
    }

    @Bean
    public IntegrationFlow restTemplateFlow() {
        return IntegrationFlows
                .from("restRequestChannel")
                .handle(Http.outboundGateway("http://api.example.com/{path}")
                    .uriVariable("path", "data")
                    .httpMethod(HttpMethod.GET)
                    .restTemplate(restTemplate())
                    .expectedResponseType(ApiResponse.class))
                .get();
    }

    private String processHttpRequest(String request) {
        return "HTTP Response: " + request.toUpperCase();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

### WebFlux Integration

```java
@Configuration
public class WebFluxIntegrationConfig {

    @Bean
    public IntegrationFlow webFluxFlow() {
        return IntegrationFlows
                .from("webFluxInputChannel")
                .handle(WebFlux.outboundGateway("http://reactive-api.com/process")
                    .httpMethod(HttpMethod.POST)
                    .expectedResponseType(String.class)
                    .webClient(webClient()))
                .get();
    }

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl("http://reactive-api.com")
                .build();
    }
}
```

## Database Integration

### JDBC Integration

```java
@Configuration
public class JdbcIntegrationConfig {

    @Bean
    public IntegrationFlow jdbcInboundFlow() {
        return IntegrationFlows
                .from(Jdbc.inboundAdapter(dataSource())
                    .query("SELECT * FROM messages WHERE processed = false")
                    .updateSql("UPDATE messages SET processed = true WHERE id = :id")
                    .rowMapper(new MessageRowMapper()),
                    e -> e.poller(Pollers.fixedRate(5000)))
                .handle(msg -> processMessage((Message) msg.getPayload()))
                .get();
    }

    @Bean
    public IntegrationFlow jdbcOutboundFlow() {
        return IntegrationFlows
                .from("jdbcOutputChannel")
                .handle(Jdbc.outboundAdapter(dataSource())
                    .sql("INSERT INTO processed_messages (content, timestamp) VALUES (?, ?)")
                    .sqlParameterSourceFactory(new BeanPropertySqlParameterSourceFactory()))
                .get();
    }

    @Bean
    public IntegrationFlow storedProcFlow() {
        return IntegrationFlows
                .from("storedProcChannel")
                .handle(Jdbc.storedProc(dataSource(), "process_message")
                    .parameter("message_id", "payload.id")
                    .parameter("content", "payload.content")
                    .returningResultSet("results", new MessageRowMapper()))
                .get();
    }

    private void processMessage(Message message) {
        System.out.println("Processing message: " + message.getContent());
    }

    private static class MessageRowMapper implements RowMapper<Message> {
        @Override
        public Message mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Message(rs.getLong("id"), rs.getString("content"));
        }
    }
}
```

## Error Handling

### Error Channels

```java
@Configuration
public class ErrorHandlingConfig {

    @Bean
    public IntegrationFlow errorHandlingFlow() {
        return IntegrationFlows
                .from("inputChannel")
                .transform(String.class, this::riskyTransformation)
                .handle("outputChannel")
                .get();
    }

    @Bean
    public IntegrationFlow errorFlow() {
        return IntegrationFlows
                .from("errorChannel")
                .transform(ErrorMessage.class, this::handleError)
                .handle("deadLetterChannel")
                .get();
    }

    @ServiceActivator(inputChannel = "errorChannel")
    public void handleError(ErrorMessage errorMessage) {
        Throwable cause = errorMessage.getPayload().getCause();
        Message<?> failedMessage = errorMessage.getPayload().getFailedMessage();

        log.error("Failed to process message: {}", failedMessage.getPayload(), cause);

        if (cause instanceof RetryableException) {
            retryService.scheduleRetry(failedMessage);
        } else {
            deadLetterService.sendToDeadLetter(failedMessage, cause);
        }
    }

    private String riskyTransformation(String input) {
        if (input.equals("error")) {
            throw new RuntimeException("Transformation failed");
        }
        return input.toUpperCase();
    }

    private String handleError(ErrorMessage errorMessage) {
        return "Error handled: " + errorMessage.getPayload().getMessage();
    }
}
```

### Retry and Circuit Breaker

```java
@Configuration
public class ResilienceConfig {

    @Bean
    public IntegrationFlow retryFlow() {
        return IntegrationFlows
                .from("retryInputChannel")
                .handle(msg -> callExternalService((String) msg.getPayload()),
                    e -> e.advice(retryAdvice()))
                .get();
    }

    @Bean
    public RetryOperationsInterceptor retryAdvice() {
        return RetryInterceptorBuilder.stateless()
                .maxAttempts(3)
                .backOffOptions(1000, 2.0, 10000)
                .retryOn(ExternalServiceException.class)
                .build();
    }

    @Bean
    public IntegrationFlow circuitBreakerFlow() {
        return IntegrationFlows
                .from("circuitBreakerInputChannel")
                .handle(msg -> callUnreliableService((String) msg.getPayload()),
                    e -> e.advice(circuitBreakerAdvice()))
                .get();
    }

    @Bean
    public RequestHandlerCircuitBreakerAdvice circuitBreakerAdvice() {
        RequestHandlerCircuitBreakerAdvice advice =
                new RequestHandlerCircuitBreakerAdvice();
        advice.setThreshold(5);
        advice.setHalfOpenAfter(60000);
        advice.setFallbackChannel(MessageChannels.direct("fallbackChannel"));
        return advice;
    }

    private String callExternalService(String input) {
        // Simulate external service call
        if (Math.random() < 0.3) {
            throw new ExternalServiceException("Service unavailable");
        }
        return "Service response: " + input;
    }

    private String callUnreliableService(String input) {
        if (Math.random() < 0.5) {
            throw new RuntimeException("Service failure");
        }
        return "Unreliable service response: " + input;
    }
}
```

## Message Store

### Message Store Configuration

```java
@Configuration
public class MessageStoreConfig {

    @Bean
    public MessageStore messageStore() {
        JdbcMessageStore store = new JdbcMessageStore(dataSource());
        store.setTablePrefix("INT_");
        return store;
    }

    @Bean
    public IntegrationFlow aggregatingFlow() {
        return IntegrationFlows
                .from("aggregatingInputChannel")
                .aggregate(a -> a
                    .correlationStrategy(msg -> msg.getHeaders().get("correlationId"))
                    .releaseStrategy(new MessageCountReleaseStrategy(5))
                    .messageStore(messageStore())
                    .sendPartialResultOnExpiry(true)
                    .groupTimeout(30000))
                .handle("aggregatedOutputChannel")
                .get();
    }

    @Bean
    public IntegrationFlow claimCheckFlow() {
        return IntegrationFlows
                .from("claimCheckInputChannel")
                .claimCheckIn(messageStore())
                .channel("lightweightChannel")
                .claimCheckOut(messageStore())
                .handle("outputChannel")
                .get();
    }
}
```

## Testing

### Integration Testing

```java
@SpringBootTest
@DirtiesContext
class IntegrationFlowTest {

    @Autowired
    private MessageChannel inputChannel;

    @Autowired
    private PollableChannel outputChannel;

    @Test
    void testFlow() {
        inputChannel.send(MessageBuilder.withPayload("test").build());

        Message<?> received = outputChannel.receive(5000);
        assertThat(received).isNotNull();
        assertThat(received.getPayload()).isEqualTo("PROCESSED: TEST");
    }

    @Test
    void testErrorHandling() {
        inputChannel.send(MessageBuilder.withPayload("error").build());

        Message<?> errorMessage = errorChannel.receive(5000);
        assertThat(errorMessage).isNotNull();
        assertThat(errorMessage.getPayload()).isInstanceOf(ErrorMessage.class);
    }
}
```

### MockIntegration

```java
@SpringBootTest
@TestPropertySource(properties = "spring.integration.channels.auto-create=false")
class MockIntegrationTest {

    @MockBean
    private ExternalService externalService;

    @Captor
    private ArgumentCaptor<String> messageCaptor;

    @Test
    void testMockedService() {
        when(externalService.process(any())).thenReturn("mocked response");

        inputChannel.send(MessageBuilder.withPayload("test").build());

        verify(externalService).process(messageCaptor.capture());
        assertThat(messageCaptor.getValue()).isEqualTo("test");
    }
}
```

This comprehensive guide covers Spring Integration from basic message flows to complex enterprise integration patterns, providing practical examples for building robust messaging solutions.
