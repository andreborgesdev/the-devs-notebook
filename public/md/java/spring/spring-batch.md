# Spring Batch

## Overview

Spring Batch is a comprehensive framework for building robust batch applications. It provides reusable functions essential for processing large volumes of data including logging, transaction management, job processing statistics, job restart, skip, and resource management.

## Core Concepts

### Job and Step Architecture

```java
@Configuration
@EnableBatchProcessing
public class BatchConfiguration {

    @Autowired
    private JobBuilderFactory jobBuilderFactory;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    @Bean
    public Job importUserJob(JobCompletionNotificationListener listener, Step step1) {
        return jobBuilderFactory.get("importUserJob")
                .incrementer(new RunIdIncrementer())
                .listener(listener)
                .flow(step1)
                .end()
                .build();
    }

    @Bean
    public Step step1(ItemWriter<Person> writer) {
        return stepBuilderFactory.get("step1")
                .<Person, Person>chunk(10)
                .reader(reader())
                .processor(processor())
                .writer(writer)
                .build();
    }
}
```

### Job Parameters

```java
@Component
public class JobLauncher {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job importUserJob;

    public void runJob(String inputFilePath, String outputFilePath) throws Exception {
        JobParameters jobParameters = new JobParametersBuilder()
                .addString("inputFile", inputFilePath)
                .addString("outputFile", outputFilePath)
                .addLong("timestamp", System.currentTimeMillis())
                .toJobParameters();

        JobExecution jobExecution = jobLauncher.run(importUserJob, jobParameters);

        System.out.println("Job Status: " + jobExecution.getStatus());
    }
}
```

## ItemReader

### File-based Readers

```java
@Bean
public FlatFileItemReader<Person> reader() {
    return new FlatFileItemReaderBuilder<Person>()
            .name("personItemReader")
            .resource(new ClassPathResource("sample-data.csv"))
            .delimited()
            .names(new String[]{"firstName", "lastName", "email", "age"})
            .fieldSetMapper(new BeanWrapperFieldSetMapper<Person>() {{
                setTargetType(Person.class);
            }})
            .build();
}

@Bean
public StaxEventItemReader<Person> xmlReader() {
    return new StaxEventItemReaderBuilder<Person>()
            .name("personXmlReader")
            .resource(new ClassPathResource("persons.xml"))
            .addFragmentRootElements("person")
            .unmarshaller(personUnmarshaller())
            .build();
}
```

### Database Readers

```java
@Bean
public JdbcCursorItemReader<Person> jdbcReader() {
    return new JdbcCursorItemReaderBuilder<Person>()
            .name("personJdbcReader")
            .dataSource(dataSource)
            .sql("SELECT id, first_name, last_name, email FROM person")
            .rowMapper(new BeanPropertyRowMapper<>(Person.class))
            .build();
}

@Bean
public JdbcPagingItemReader<Person> jdbcPagingReader() {
    Map<String, Object> parameterValues = new HashMap<>();
    parameterValues.put("status", "ACTIVE");

    return new JdbcPagingItemReaderBuilder<Person>()
            .name("personPagingReader")
            .dataSource(dataSource)
            .queryProvider(queryProvider())
            .parameterValues(parameterValues)
            .pageSize(10)
            .rowMapper(new BeanPropertyRowMapper<>(Person.class))
            .build();
}

@Bean
public PagingQueryProvider queryProvider() {
    SqlPagingQueryProviderFactoryBean factory = new SqlPagingQueryProviderFactoryBean();
    factory.setDataSource(dataSource);
    factory.setSelectClause("SELECT id, first_name, last_name, email");
    factory.setFromClause("FROM person");
    factory.setWhereClause("WHERE status = :status");
    factory.setSortKey("id");

    try {
        return factory.getObject();
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}
```

### JPA Reader

```java
@Bean
public JpaPagingItemReader<Person> jpaReader() {
    return new JpaPagingItemReaderBuilder<Person>()
            .name("personJpaReader")
            .entityManagerFactory(entityManagerFactory)
            .queryString("SELECT p FROM Person p WHERE p.status = 'ACTIVE'")
            .pageSize(10)
            .build();
}
```

### Custom ItemReader

```java
@Component
public class CustomItemReader implements ItemReader<Person> {

    private List<Person> persons;
    private int index = 0;

    @PostConstruct
    public void initialize() {
        persons = loadPersonsFromExternalSource();
    }

    @Override
    public Person read() throws Exception {
        if (index < persons.size()) {
            return persons.get(index++);
        }
        return null; // Indicates end of data
    }

    private List<Person> loadPersonsFromExternalSource() {
        // Custom logic to load data
        return externalService.loadPersons();
    }
}
```

## ItemProcessor

### Basic Processing

```java
@Component
public class PersonItemProcessor implements ItemProcessor<Person, Person> {

    private static final Logger log = LoggerFactory.getLogger(PersonItemProcessor.class);

    @Override
    public Person process(final Person person) throws Exception {
        final String firstName = person.getFirstName().toUpperCase();
        final String lastName = person.getLastName().toUpperCase();
        final String email = person.getEmail().toLowerCase();

        final Person transformedPerson = new Person(firstName, lastName, email);

        log.info("Converting (" + person + ") into (" + transformedPerson + ")");

        return transformedPerson;
    }
}
```

### Composite Processor

```java
@Bean
public CompositeItemProcessor<Person, Person> compositeProcessor() {
    CompositeItemProcessor<Person, Person> processor = new CompositeItemProcessor<>();

    List<ItemProcessor<Person, Person>> delegates = Arrays.asList(
            new ValidationProcessor(),
            new TransformationProcessor(),
            new EnrichmentProcessor()
    );

    processor.setDelegates(delegates);
    return processor;
}
```

### Conditional Processing

```java
@Component
public class ConditionalProcessor implements ItemProcessor<Person, Person> {

    @Override
    public Person process(Person person) throws Exception {
        if (person.getAge() < 18) {
            return null; // Skip this item
        }

        if (person.getEmail() == null || person.getEmail().isEmpty()) {
            person.setEmail("noemail@example.com");
        }

        return person;
    }
}
```

## ItemWriter

### File Writers

```java
@Bean
public FlatFileItemWriter<Person> writer() {
    return new FlatFileItemWriterBuilder<Person>()
            .name("personItemWriter")
            .resource(new FileSystemResource("output.csv"))
            .delimited()
            .delimiter(",")
            .names(new String[]{"firstName", "lastName", "email"})
            .build();
}

@Bean
public StaxEventItemWriter<Person> xmlWriter() {
    return new StaxEventItemWriterBuilder<Person>()
            .name("personXmlWriter")
            .resource(new FileSystemResource("output.xml"))
            .marshaller(personMarshaller())
            .rootTagName("persons")
            .build();
}
```

### Database Writers

```java
@Bean
public JdbcBatchItemWriter<Person> jdbcWriter() {
    return new JdbcBatchItemWriterBuilder<Person>()
            .itemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<>())
            .sql("INSERT INTO person (first_name, last_name, email) VALUES (:firstName, :lastName, :email)")
            .dataSource(dataSource)
            .build();
}

@Bean
public JpaItemWriter<Person> jpaWriter() {
    JpaItemWriter<Person> writer = new JpaItemWriter<>();
    writer.setEntityManagerFactory(entityManagerFactory);
    return writer;
}
```

### Custom ItemWriter

```java
@Component
public class CustomItemWriter implements ItemWriter<Person> {

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public void write(List<? extends Person> items) throws Exception {
        for (Person person : items) {
            try {
                restTemplate.postForObject("/api/persons", person, Person.class);
            } catch (Exception e) {
                log.error("Failed to send person: " + person, e);
                throw e;
            }
        }
    }
}
```

## Error Handling

### Skip and Retry

```java
@Bean
public Step stepWithErrorHandling() {
    return stepBuilderFactory.get("stepWithErrorHandling")
            .<Person, Person>chunk(10)
            .reader(reader())
            .processor(processor())
            .writer(writer())
            .faultTolerant()
            .skip(ValidationException.class)
            .skipLimit(10)
            .retry(TransientException.class)
            .retryLimit(3)
            .build();
}
```

### Skip Listeners

```java
@Component
public class PersonSkipListener implements SkipListener<Person, Person> {

    @Override
    public void onSkipInRead(Throwable t) {
        log.warn("Skipped item during read: " + t.getMessage());
    }

    @Override
    public void onSkipInWrite(Person item, Throwable t) {
        log.warn("Skipped item during write: " + item + ", error: " + t.getMessage());
    }

    @Override
    public void onSkipInProcess(Person item, Throwable t) {
        log.warn("Skipped item during process: " + item + ", error: " + t.getMessage());
    }
}
```

### Custom Skip Policy

```java
@Component
public class CustomSkipPolicy implements SkipPolicy {

    @Override
    public boolean shouldSkip(Throwable t, int skipCount) throws SkipLimitExceededException {
        if (t instanceof ValidationException) {
            return skipCount < 5;
        }

        if (t instanceof DataAccessException) {
            return skipCount < 2;
        }

        return false;
    }
}
```

## Job Flow Control

### Conditional Flow

```java
@Bean
public Job conditionalJob() {
    return jobBuilderFactory.get("conditionalJob")
            .start(step1())
            .on("COMPLETED").to(step2())
            .on("FAILED").to(step3())
            .from(step2())
            .on("*").to(step4())
            .end()
            .build();
}
```

### Decision

```java
@Component
public class CustomDecider implements JobExecutionDecider {

    @Override
    public FlowExecutionStatus decide(JobExecution jobExecution, StepExecution stepExecution) {
        if (stepExecution.getExitStatus().getExitCode().equals("COMPLETED")) {
            return new FlowExecutionStatus("PROCESS_MORE");
        } else {
            return new FlowExecutionStatus("PROCESS_LESS");
        }
    }
}

@Bean
public Job decisionJob(CustomDecider decider) {
    return jobBuilderFactory.get("decisionJob")
            .start(step1())
            .next(decider)
            .on("PROCESS_MORE").to(step2())
            .on("PROCESS_LESS").to(step3())
            .end()
            .build();
}
```

### Parallel Processing

```java
@Bean
public Job parallelJob() {
    Flow flow1 = new FlowBuilder<SimpleFlow>("flow1")
            .start(step1())
            .build();

    Flow flow2 = new FlowBuilder<SimpleFlow>("flow2")
            .start(step2())
            .build();

    return jobBuilderFactory.get("parallelJob")
            .start(flow1)
            .split(new SimpleAsyncTaskExecutor())
            .add(flow2)
            .next(step3())
            .end()
            .build();
}
```

## Partitioning

### Range Partitioner

```java
@Bean
public Partitioner partitioner() {
    return new Partitioner() {
        @Override
        public Map<String, ExecutionContext> partition(int gridSize) {
            Map<String, ExecutionContext> result = new HashMap<>();

            int range = 1000;
            int fromId = 1;
            int toId = range;

            for (int i = 1; i <= gridSize; i++) {
                ExecutionContext value = new ExecutionContext();
                value.putInt("minValue", fromId);
                value.putInt("maxValue", toId);

                result.put("partition" + i, value);

                fromId = toId + 1;
                toId += range;
            }

            return result;
        }
    };
}

@Bean
public Step masterStep() {
    return stepBuilderFactory.get("masterStep")
            .partitioner(slaveStep().getName(), partitioner())
            .step(slaveStep())
            .gridSize(4)
            .taskExecutor(taskExecutor())
            .build();
}

@Bean
public Step slaveStep() {
    return stepBuilderFactory.get("slaveStep")
            .<Person, Person>chunk(100)
            .reader(partitionedReader(null, null))
            .writer(writer())
            .build();
}

@Bean
@StepScope
public JdbcPagingItemReader<Person> partitionedReader(
        @Value("#{stepExecutionContext[minValue]}") Integer minValue,
        @Value("#{stepExecutionContext[maxValue]}") Integer maxValue) {

    Map<String, Object> parameterValues = new HashMap<>();
    parameterValues.put("minValue", minValue);
    parameterValues.put("maxValue", maxValue);

    return new JdbcPagingItemReaderBuilder<Person>()
            .name("partitionedReader")
            .dataSource(dataSource)
            .queryProvider(createQueryProvider())
            .parameterValues(parameterValues)
            .pageSize(100)
            .rowMapper(new BeanPropertyRowMapper<>(Person.class))
            .build();
}
```

## Remote Chunking

### Master Configuration

```java
@Bean
public IntegrationFlow outboundFlow() {
    return IntegrationFlows
            .from(outboundRequests())
            .handle(outboundAdapter())
            .get();
}

@Bean
public IntegrationFlow inboundFlow() {
    return IntegrationFlows
            .from(inboundAdapter())
            .channel(inboundReplies())
            .get();
}

@Bean
public Step masterStep() {
    return stepBuilderFactory.get("masterStep")
            .<Person, Person>chunk(100)
            .reader(itemReader())
            .writer(chunkWriter())
            .build();
}

@Bean
public ChunkMessageChannelItemWriter<Person> chunkWriter() {
    ChunkMessageChannelItemWriter<Person> writer = new ChunkMessageChannelItemWriter<>();
    writer.setMessagingOperations(messagingTemplate());
    writer.setReplyChannel(inboundReplies());
    return writer;
}
```

### Worker Configuration

```java
@Bean
public IntegrationFlow workerFlow() {
    return IntegrationFlows
            .from(inboundRequests())
            .handle(chunkProcessorChunkHandler())
            .channel(outboundStaging())
            .handle(outboundAdapter())
            .get();
}

@Bean
public ChunkProcessorChunkHandler<Person> chunkProcessorChunkHandler() {
    ChunkProcessor<Person> chunkProcessor = new SimpleChunkProcessor<>(
            itemProcessor(), itemWriter());

    ChunkProcessorChunkHandler<Person> chunkHandler =
            new ChunkProcessorChunkHandler<>();
    chunkHandler.setChunkProcessor(chunkProcessor);
    return chunkHandler;
}
```

## Job Repository and Metadata

### Custom Job Repository

```java
@Configuration
public class BatchInfrastructureConfiguration {

    @Bean
    public JobRepository jobRepository() throws Exception {
        JobRepositoryFactoryBean factory = new JobRepositoryFactoryBean();
        factory.setDataSource(dataSource);
        factory.setTransactionManager(transactionManager);
        factory.setIsolationLevelForCreate("ISOLATION_SERIALIZABLE");
        factory.setTablePrefix("BATCH_");
        factory.setMaxVarCharLength(1000);
        return factory.getObject();
    }

    @Bean
    public SimpleJobLauncher jobLauncher() throws Exception {
        SimpleJobLauncher jobLauncher = new SimpleJobLauncher();
        jobLauncher.setJobRepository(jobRepository());
        jobLauncher.setTaskExecutor(new SimpleAsyncTaskExecutor());
        return jobLauncher;
    }
}
```

### Job Parameters Validation

```java
@Component
public class JobParametersValidator implements org.springframework.batch.core.JobParametersValidator {

    @Override
    public void validate(JobParameters parameters) throws JobParametersInvalidException {
        if (parameters.getString("inputFile") == null) {
            throw new JobParametersInvalidException("inputFile parameter is required");
        }

        String inputFile = parameters.getString("inputFile");
        if (!new File(inputFile).exists()) {
            throw new JobParametersInvalidException("Input file does not exist: " + inputFile);
        }
    }
}
```

## Testing

### Job Testing

```java
@SpringBootTest
@ExtendWith(SpringExtension.class)
class BatchJobTest {

    @Autowired
    private JobLauncherTestUtils jobLauncherTestUtils;

    @Autowired
    private JobRepositoryTestUtils jobRepositoryTestUtils;

    @BeforeEach
    void setUp() {
        jobRepositoryTestUtils.removeJobExecutions();
    }

    @Test
    void testJob() throws Exception {
        JobParameters jobParameters = new JobParametersBuilder()
                .addString("inputFile", "input.csv")
                .addLong("timestamp", System.currentTimeMillis())
                .toJobParameters();

        JobExecution jobExecution = jobLauncherTestUtils.launchJob(jobParameters);

        assertEquals(BatchStatus.COMPLETED, jobExecution.getStatus());
    }

    @Test
    void testStep() {
        JobExecution jobExecution = jobLauncherTestUtils.launchStep("step1");

        assertEquals(BatchStatus.COMPLETED, jobExecution.getStatus());

        StepExecution stepExecution = jobExecution.getStepExecutions().iterator().next();
        assertEquals(10, stepExecution.getReadCount());
        assertEquals(10, stepExecution.getWriteCount());
    }
}
```

### Component Testing

```java
@ExtendWith(SpringExtension.class)
class PersonProcessorTest {

    private PersonItemProcessor processor = new PersonItemProcessor();

    @Test
    void testProcessor() throws Exception {
        Person input = new Person("john", "doe", "john.doe@example.com");
        Person output = processor.process(input);

        assertEquals("JOHN", output.getFirstName());
        assertEquals("DOE", output.getLastName());
        assertEquals("john.doe@example.com", output.getEmail());
    }
}
```

## Monitoring and Management

### Job Execution Listener

```java
@Component
public class JobCompletionNotificationListener extends JobExecutionListenerSupport {

    private static final Logger log = LoggerFactory.getLogger(JobCompletionNotificationListener.class);

    @Override
    public void beforeJob(JobExecution jobExecution) {
        log.info("Job {} starting with parameters: {}",
                jobExecution.getJobInstance().getJobName(),
                jobExecution.getJobParameters());
    }

    @Override
    public void afterJob(JobExecution jobExecution) {
        if (jobExecution.getStatus() == BatchStatus.COMPLETED) {
            log.info("Job {} completed successfully in {} ms",
                    jobExecution.getJobInstance().getJobName(),
                    jobExecution.getEndTime().getTime() - jobExecution.getStartTime().getTime());
        } else {
            log.error("Job {} failed with status: {}",
                    jobExecution.getJobInstance().getJobName(),
                    jobExecution.getStatus());
        }
    }
}
```

### Step Execution Listener

```java
@Component
public class StepExecutionListener implements org.springframework.batch.core.StepExecutionListener {

    @Override
    public void beforeStep(StepExecution stepExecution) {
        log.info("Step {} starting", stepExecution.getStepName());
    }

    @Override
    public ExitStatus afterStep(StepExecution stepExecution) {
        log.info("Step {} completed. Read: {}, Written: {}, Skipped: {}",
                stepExecution.getStepName(),
                stepExecution.getReadCount(),
                stepExecution.getWriteCount(),
                stepExecution.getSkipCount());

        return stepExecution.getExitStatus();
    }
}
```

This comprehensive guide covers Spring Batch from basic job configuration to advanced features like partitioning and remote chunking, providing practical examples for building robust batch processing applications.
