# System Observability and Monitoring

## Three Pillars of Observability

### 1. Metrics

Quantitative measurements of system behavior over time.

```typescript
interface MetricCollector {
  counter(name: string, value: number, tags?: Record<string, string>): void;
  gauge(name: string, value: number, tags?: Record<string, string>): void;
  histogram(name: string, value: number, tags?: Record<string, string>): void;
  timing(name: string, duration: number, tags?: Record<string, string>): void;
}

class PrometheusMetrics implements MetricCollector {
  private registry = new Registry();

  counter(name: string, value: number = 1, tags: Record<string, string> = {}) {
    const counter = new Counter({
      name: name.replace(/[^a-zA-Z0-9_]/g, "_"),
      help: `Counter for ${name}`,
      labelNames: Object.keys(tags),
      registers: [this.registry],
    });

    counter.inc(tags, value);
  }

  gauge(name: string, value: number, tags: Record<string, string> = {}) {
    const gauge = new Gauge({
      name: name.replace(/[^a-zA-Z0-9_]/g, "_"),
      help: `Gauge for ${name}`,
      labelNames: Object.keys(tags),
      registers: [this.registry],
    });

    gauge.set(tags, value);
  }

  histogram(name: string, value: number, tags: Record<string, string> = {}) {
    const histogram = new Histogram({
      name: name.replace(/[^a-zA-Z0-9_]/g, "_"),
      help: `Histogram for ${name}`,
      labelNames: Object.keys(tags),
      buckets: [0.1, 0.5, 1, 2, 5, 10],
      registers: [this.registry],
    });

    histogram.observe(tags, value);
  }

  timing(name: string, duration: number, tags: Record<string, string> = {}) {
    this.histogram(`${name}_duration_seconds`, duration / 1000, tags);
  }

  getMetrics(): string {
    return this.registry.metrics();
  }
}
```

### 2. Logs

Discrete events with timestamps and context.

```typescript
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  service: string;
  traceId?: string;
  spanId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  error?: Error;
}

class StructuredLogger {
  private minLevel: LogLevel;
  private service: string;

  constructor(service: string, minLevel: LogLevel = LogLevel.INFO) {
    this.service = service;
    this.minLevel = minLevel;
  }

  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>,
    error?: Error
  ) {
    if (level < this.minLevel) return;

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      service: this.service,
      traceId: this.getCurrentTraceId(),
      spanId: this.getCurrentSpanId(),
      metadata,
      error: error
        ? ({
            name: error.name,
            message: error.message,
            stack: error.stack,
          } as any)
        : undefined,
    };

    this.writeLog(entry);
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, metadata, error);
  }

  fatal(message: string, error?: Error, metadata?: Record<string, any>) {
    this.log(LogLevel.FATAL, message, metadata, error);
  }

  private writeLog(entry: LogEntry) {
    console.log(JSON.stringify(entry));
  }

  private getCurrentTraceId(): string | undefined {
    return process.env.TRACE_ID;
  }

  private getCurrentSpanId(): string | undefined {
    return process.env.SPAN_ID;
  }
}
```

### 3. Traces

Request flows through distributed systems.

```typescript
interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: number;
  endTime?: number;
  tags: Record<string, any>;
  logs: Array<{ timestamp: number; fields: Record<string, any> }>;
  duration?: number;
}

class DistributedTracer {
  private spans: Map<string, Span> = new Map();
  private activeSpans: Map<string, string> = new Map();

  startSpan(operationName: string, parentSpanId?: string): string {
    const traceId = parentSpanId
      ? this.spans.get(parentSpanId)?.traceId || this.generateTraceId()
      : this.generateTraceId();

    const spanId = this.generateSpanId();

    const span: Span = {
      traceId,
      spanId,
      parentSpanId,
      operationName,
      startTime: Date.now(),
      tags: {},
      logs: [],
    };

    this.spans.set(spanId, span);
    this.activeSpans.set(operationName, spanId);

    process.env.TRACE_ID = traceId;
    process.env.SPAN_ID = spanId;

    return spanId;
  }

  finishSpan(spanId: string) {
    const span = this.spans.get(spanId);
    if (!span) return;

    span.endTime = Date.now();
    span.duration = span.endTime - span.startTime;

    this.sendToCollector(span);
    this.spans.delete(spanId);
  }

  addTag(spanId: string, key: string, value: any) {
    const span = this.spans.get(spanId);
    if (span) {
      span.tags[key] = value;
    }
  }

  logEvent(spanId: string, event: string, payload?: Record<string, any>) {
    const span = this.spans.get(spanId);
    if (span) {
      span.logs.push({
        timestamp: Date.now(),
        fields: { event, ...payload },
      });
    }
  }

  private generateTraceId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private generateSpanId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  private sendToCollector(span: Span) {
    console.log("Sending span to collector:", JSON.stringify(span));
  }
}
```

## Monitoring Strategies

### RED Method

Monitor Rate, Errors, and Duration for services.

```typescript
class REDMetrics {
  private metrics: MetricCollector;

  constructor(metrics: MetricCollector) {
    this.metrics = metrics;
  }

  recordRequest(service: string, endpoint: string, method: string) {
    this.metrics.counter("http_requests_total", 1, {
      service,
      endpoint,
      method,
    });
  }

  recordError(
    service: string,
    endpoint: string,
    method: string,
    statusCode: number
  ) {
    this.metrics.counter("http_errors_total", 1, {
      service,
      endpoint,
      method,
      status_code: statusCode.toString(),
    });
  }

  recordDuration(
    service: string,
    endpoint: string,
    method: string,
    duration: number
  ) {
    this.metrics.histogram("http_request_duration_seconds", duration / 1000, {
      service,
      endpoint,
      method,
    });
  }
}
```

### USE Method

Monitor Utilization, Saturation, and Errors for resources.

```typescript
class USEMetrics {
  private metrics: MetricCollector;

  constructor(metrics: MetricCollector) {
    this.metrics = metrics;
  }

  recordCPUUtilization(utilization: number) {
    this.metrics.gauge("cpu_utilization_percent", utilization);
  }

  recordMemoryUtilization(used: number, total: number) {
    this.metrics.gauge("memory_utilization_percent", (used / total) * 100);
  }

  recordDiskUtilization(used: number, total: number) {
    this.metrics.gauge("disk_utilization_percent", (used / total) * 100);
  }

  recordNetworkSaturation(packetsDropped: number) {
    this.metrics.counter("network_packets_dropped_total", packetsDropped);
  }

  recordResourceError(resource: string, error: string) {
    this.metrics.counter("resource_errors_total", 1, {
      resource,
      error_type: error,
    });
  }
}
```

### Four Golden Signals

Google's SRE monitoring approach.

```typescript
class GoldenSignals {
  private metrics: MetricCollector;

  constructor(metrics: MetricCollector) {
    this.metrics = metrics;
  }

  recordLatency(service: string, latency: number) {
    this.metrics.histogram("request_latency_seconds", latency / 1000, {
      service,
    });
  }

  recordTraffic(service: string, requestCount: number) {
    this.metrics.counter("requests_per_second", requestCount, {
      service,
    });
  }

  recordErrors(service: string, errorCount: number, errorType: string) {
    this.metrics.counter("error_rate", errorCount, {
      service,
      error_type: errorType,
    });
  }

  recordSaturation(service: string, resource: string, saturation: number) {
    this.metrics.gauge("saturation_percent", saturation, {
      service,
      resource,
    });
  }
}
```

## Distributed Tracing

### OpenTelemetry Integration

```typescript
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";

class OpenTelemetrySetup {
  private sdk: NodeSDK;

  initialize(serviceName: string, jaegerEndpoint: string) {
    const jaegerExporter = new JaegerExporter({
      endpoint: jaegerEndpoint,
    });

    this.sdk = new NodeSDK({
      serviceName,
      traceExporter: jaegerExporter,
      instrumentations: [getNodeAutoInstrumentations()],
    });

    this.sdk.start();
  }

  shutdown() {
    this.sdk.shutdown();
  }
}

const telemetry = new OpenTelemetrySetup();
telemetry.initialize("user-service", "http://jaeger:14268/api/traces");
```

### Custom Instrumentation

```typescript
import { trace, context, SpanStatusCode } from "@opentelemetry/api";

class CustomInstrumentation {
  private tracer = trace.getTracer("custom-instrumentation");

  async instrumentAsync<T>(
    operationName: string,
    operation: () => Promise<T>,
    tags?: Record<string, any>
  ): Promise<T> {
    return await this.tracer.startActiveSpan(operationName, async (span) => {
      try {
        if (tags) {
          Object.entries(tags).forEach(([key, value]) => {
            span.setAttributes({ [key]: value });
          });
        }

        const result = await operation();
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: (error as Error).message,
        });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  instrumentSync<T>(
    operationName: string,
    operation: () => T,
    tags?: Record<string, any>
  ): T {
    return this.tracer.startActiveSpan(operationName, (span) => {
      try {
        if (tags) {
          Object.entries(tags).forEach(([key, value]) => {
            span.setAttributes({ [key]: value });
          });
        }

        const result = operation();
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: (error as Error).message,
        });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}
```

## Logging Best Practices

### Structured Logging with Context

```typescript
class ContextualLogger extends StructuredLogger {
  private context: Record<string, any> = {};

  setContext(key: string, value: any) {
    this.context[key] = value;
  }

  clearContext() {
    this.context = {};
  }

  protected writeLog(entry: LogEntry) {
    const enrichedEntry = {
      ...entry,
      metadata: {
        ...this.context,
        ...entry.metadata,
      },
    };

    super.writeLog(enrichedEntry);
  }
}

class RequestLogger {
  private logger: ContextualLogger;

  constructor(logger: ContextualLogger) {
    this.logger = logger;
  }

  logRequest(req: any, res: any, duration: number) {
    this.logger.setContext("request_id", req.headers["x-request-id"]);
    this.logger.setContext("user_id", req.user?.id);
    this.logger.setContext("ip_address", req.ip);

    this.logger.info("HTTP Request", {
      method: req.method,
      url: req.url,
      status_code: res.statusCode,
      duration_ms: duration,
      user_agent: req.headers["user-agent"],
    });

    this.logger.clearContext();
  }
}
```

### Log Sampling and Rate Limiting

```typescript
class SampledLogger extends StructuredLogger {
  private sampleRate: number;
  private rateLimiter: Map<string, { count: number; resetTime: number }> =
    new Map();

  constructor(
    service: string,
    sampleRate: number = 0.1,
    minLevel: LogLevel = LogLevel.INFO
  ) {
    super(service, minLevel);
    this.sampleRate = sampleRate;
  }

  protected writeLog(entry: LogEntry) {
    if (entry.level >= LogLevel.ERROR || this.shouldSample()) {
      const key = `${entry.level}-${entry.message}`;

      if (this.isRateLimited(key)) {
        return;
      }

      super.writeLog(entry);
    }
  }

  private shouldSample(): boolean {
    return Math.random() < this.sampleRate;
  }

  private isRateLimited(key: string): boolean {
    const now = Date.now();
    const limit = this.rateLimiter.get(key);

    if (!limit || now > limit.resetTime) {
      this.rateLimiter.set(key, {
        count: 1,
        resetTime: now + 60000,
      });
      return false;
    }

    if (limit.count >= 100) {
      return true;
    }

    limit.count++;
    return false;
  }
}
```

## Metrics and KPIs

### Application Performance Metrics

```typescript
class ApplicationMetrics {
  private metrics: MetricCollector;

  constructor(metrics: MetricCollector) {
    this.metrics = metrics;
  }

  recordBusinessMetric(
    name: string,
    value: number,
    dimensions?: Record<string, string>
  ) {
    this.metrics.counter(`business_${name}`, value, dimensions);
  }

  recordDatabaseQuery(
    table: string,
    operation: string,
    duration: number,
    success: boolean
  ) {
    this.metrics.histogram("database_query_duration_seconds", duration / 1000, {
      table,
      operation,
    });

    this.metrics.counter("database_queries_total", 1, {
      table,
      operation,
      status: success ? "success" : "error",
    });
  }

  recordCacheOperation(operation: string, hit: boolean, duration: number) {
    this.metrics.counter("cache_operations_total", 1, {
      operation,
      result: hit ? "hit" : "miss",
    });

    this.metrics.histogram(
      "cache_operation_duration_seconds",
      duration / 1000,
      {
        operation,
      }
    );
  }

  recordQueueMetrics(queueName: string, size: number, processingTime: number) {
    this.metrics.gauge("queue_size", size, { queue: queueName });
    this.metrics.histogram(
      "queue_processing_time_seconds",
      processingTime / 1000,
      {
        queue: queueName,
      }
    );
  }
}
```

### Infrastructure Metrics

```typescript
class InfrastructureMetrics {
  private metrics: MetricCollector;

  constructor(metrics: MetricCollector) {
    this.metrics = metrics;
  }

  recordSystemMetrics() {
    const usage = process.cpuUsage();
    const memoryUsage = process.memoryUsage();

    this.metrics.gauge("process_cpu_user_seconds_total", usage.user / 1000000);
    this.metrics.gauge(
      "process_cpu_system_seconds_total",
      usage.system / 1000000
    );
    this.metrics.gauge("process_memory_heap_bytes", memoryUsage.heapUsed);
    this.metrics.gauge("process_memory_external_bytes", memoryUsage.external);
  }

  recordNetworkMetrics(bytesIn: number, bytesOut: number, errors: number) {
    this.metrics.counter("network_bytes_received_total", bytesIn);
    this.metrics.counter("network_bytes_sent_total", bytesOut);
    this.metrics.counter("network_errors_total", errors);
  }

  recordContainerMetrics(
    containerId: string,
    cpuUsage: number,
    memoryUsage: number
  ) {
    this.metrics.gauge("container_cpu_usage_percent", cpuUsage, {
      container_id: containerId,
    });
    this.metrics.gauge("container_memory_usage_bytes", memoryUsage, {
      container_id: containerId,
    });
  }
}
```

## Alerting Patterns

### Alert Rules Engine

```typescript
interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: "info" | "warning" | "critical";
  duration: number;
  description: string;
  runbook?: string;
}

interface AlertInstance {
  ruleId: string;
  triggeredAt: Date;
  resolvedAt?: Date;
  value: number;
  labels: Record<string, string>;
}

class AlertManager {
  private rules: Map<string, AlertRule> = new Map();
  private activeAlerts: Map<string, AlertInstance> = new Map();
  private evaluationInterval = 60000;

  addRule(rule: AlertRule) {
    this.rules.set(rule.id, rule);
  }

  removeRule(ruleId: string) {
    this.rules.delete(ruleId);
  }

  startEvaluation() {
    setInterval(() => {
      this.evaluateRules();
    }, this.evaluationInterval);
  }

  private async evaluateRules() {
    for (const [ruleId, rule] of this.rules) {
      try {
        const value = await this.evaluateCondition(rule.condition);
        const shouldAlert = this.shouldTriggerAlert(rule, value);
        const alertKey = `${ruleId}-${JSON.stringify(rule)}`;

        if (shouldAlert && !this.activeAlerts.has(alertKey)) {
          this.triggerAlert(rule, value, {});
        } else if (!shouldAlert && this.activeAlerts.has(alertKey)) {
          this.resolveAlert(alertKey);
        }
      } catch (error) {
        console.error(`Failed to evaluate rule ${ruleId}:`, error);
      }
    }
  }

  private shouldTriggerAlert(rule: AlertRule, value: number): boolean {
    return value > rule.threshold;
  }

  private triggerAlert(
    rule: AlertRule,
    value: number,
    labels: Record<string, string>
  ) {
    const alertKey = `${rule.id}-${JSON.stringify(labels)}`;
    const alert: AlertInstance = {
      ruleId: rule.id,
      triggeredAt: new Date(),
      value,
      labels,
    };

    this.activeAlerts.set(alertKey, alert);
    this.sendNotification(rule, alert);
  }

  private resolveAlert(alertKey: string) {
    const alert = this.activeAlerts.get(alertKey);
    if (alert) {
      alert.resolvedAt = new Date();
      this.activeAlerts.delete(alertKey);
      this.sendResolutionNotification(alert);
    }
  }

  private async evaluateCondition(condition: string): Promise<number> {
    return 0;
  }

  private sendNotification(rule: AlertRule, alert: AlertInstance) {
    console.log(`ALERT: ${rule.name} - ${rule.description}`);
    console.log(`Value: ${alert.value}, Threshold: ${rule.threshold}`);
  }

  private sendResolutionNotification(alert: AlertInstance) {
    console.log(`RESOLVED: Alert for rule ${alert.ruleId}`);
  }
}
```

### Dead Man's Switch

```typescript
class DeadMansSwitch {
  private heartbeats: Map<string, number> = new Map();
  private checkInterval = 30000;
  private alertThreshold = 120000;

  constructor() {
    this.startMonitoring();
  }

  heartbeat(serviceId: string) {
    this.heartbeats.set(serviceId, Date.now());
  }

  private startMonitoring() {
    setInterval(() => {
      this.checkHeartbeats();
    }, this.checkInterval);
  }

  private checkHeartbeats() {
    const now = Date.now();

    for (const [serviceId, lastHeartbeat] of this.heartbeats) {
      if (now - lastHeartbeat > this.alertThreshold) {
        this.triggerDeadManAlert(serviceId, now - lastHeartbeat);
      }
    }
  }

  private triggerDeadManAlert(
    serviceId: string,
    timeSinceLastHeartbeat: number
  ) {
    console.error(
      `DEAD MAN'S SWITCH: Service ${serviceId} hasn't sent heartbeat for ${timeSinceLastHeartbeat}ms`
    );
  }
}
```

## SLA/SLO Management

### Service Level Management

```typescript
interface ServiceLevelObjective {
  id: string;
  name: string;
  service: string;
  target: number;
  timeWindow: number;
  metricQuery: string;
  description: string;
}

interface SLIResult {
  value: number;
  timestamp: Date;
  isGood: boolean;
}

class SLOManager {
  private slos: Map<string, ServiceLevelObjective> = new Map();
  private sliResults: Map<string, SLIResult[]> = new Map();

  addSLO(slo: ServiceLevelObjective) {
    this.slos.set(slo.id, slo);
    this.sliResults.set(slo.id, []);
  }

  recordSLI(sloId: string, value: number, isGood: boolean) {
    const results = this.sliResults.get(sloId) || [];
    results.push({
      value,
      timestamp: new Date(),
      isGood,
    });

    const cutoff = Date.now() - (this.slos.get(sloId)?.timeWindow || 86400000);
    const filteredResults = results.filter(
      (r) => r.timestamp.getTime() > cutoff
    );

    this.sliResults.set(sloId, filteredResults);
  }

  calculateSLOCompliance(sloId: string): number {
    const slo = this.slos.get(sloId);
    const results = this.sliResults.get(sloId);

    if (!slo || !results || results.length === 0) {
      return 0;
    }

    const goodResults = results.filter((r) => r.isGood).length;
    return (goodResults / results.length) * 100;
  }

  getErrorBudget(sloId: string): number {
    const compliance = this.calculateSLOCompliance(sloId);
    const slo = this.slos.get(sloId);

    if (!slo) return 0;

    return Math.max(0, compliance - slo.target);
  }

  generateSLOReport(sloId: string) {
    const slo = this.slos.get(sloId);
    const compliance = this.calculateSLOCompliance(sloId);
    const errorBudget = this.getErrorBudget(sloId);

    return {
      slo,
      compliance,
      errorBudget,
      status: compliance >= slo?.target ? "HEALTHY" : "AT_RISK",
      lastUpdated: new Date(),
    };
  }
}
```

### Error Budget Policy

```typescript
class ErrorBudgetPolicy {
  private sloManager: SLOManager;
  private policies: Map<string, ErrorBudgetPolicyConfig> = new Map();

  constructor(sloManager: SLOManager) {
    this.sloManager = sloManager;
  }

  addPolicy(serviceId: string, config: ErrorBudgetPolicyConfig) {
    this.policies.set(serviceId, config);
  }

  evaluatePolicy(serviceId: string, sloId: string): PolicyAction {
    const config = this.policies.get(serviceId);
    const errorBudget = this.sloManager.getErrorBudget(sloId);

    if (!config) return PolicyAction.NONE;

    if (errorBudget <= 0) {
      return PolicyAction.FREEZE_DEPLOYMENTS;
    } else if (errorBudget < config.warningThreshold) {
      return PolicyAction.REQUIRE_APPROVAL;
    }

    return PolicyAction.NONE;
  }
}

interface ErrorBudgetPolicyConfig {
  warningThreshold: number;
  criticalThreshold: number;
  actions: {
    onWarning: string[];
    onCritical: string[];
  };
}

enum PolicyAction {
  NONE = "none",
  REQUIRE_APPROVAL = "require_approval",
  FREEZE_DEPLOYMENTS = "freeze_deployments",
}
```

## Incident Response

### Incident Management

```typescript
enum IncidentSeverity {
  SEV1 = "sev1",
  SEV2 = "sev2",
  SEV3 = "sev3",
  SEV4 = "sev4",
}

enum IncidentStatus {
  OPEN = "open",
  INVESTIGATING = "investigating",
  IDENTIFIED = "identified",
  MONITORING = "monitoring",
  RESOLVED = "resolved",
}

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  createdAt: Date;
  resolvedAt?: Date;
  assignee?: string;
  affectedServices: string[];
  timeline: IncidentTimelineEntry[];
  tags: string[];
}

interface IncidentTimelineEntry {
  timestamp: Date;
  author: string;
  action: string;
  description: string;
}

class IncidentManager {
  private incidents: Map<string, Incident> = new Map();
  private onCallSchedule: Map<string, string> = new Map();

  createIncident(
    title: string,
    description: string,
    severity: IncidentSeverity,
    affectedServices: string[]
  ): string {
    const incidentId = this.generateIncidentId();
    const incident: Incident = {
      id: incidentId,
      title,
      description,
      severity,
      status: IncidentStatus.OPEN,
      createdAt: new Date(),
      affectedServices,
      timeline: [
        {
          timestamp: new Date(),
          author: "system",
          action: "created",
          description: "Incident created",
        },
      ],
      tags: [],
    };

    this.incidents.set(incidentId, incident);
    this.notifyOnCall(incident);

    return incidentId;
  }

  updateIncidentStatus(
    incidentId: string,
    status: IncidentStatus,
    author: string,
    notes?: string
  ) {
    const incident = this.incidents.get(incidentId);
    if (!incident) return;

    incident.status = status;
    incident.timeline.push({
      timestamp: new Date(),
      author,
      action: "status_change",
      description: `Status changed to ${status}${notes ? `: ${notes}` : ""}`,
    });

    if (status === IncidentStatus.RESOLVED) {
      incident.resolvedAt = new Date();
      this.schedulePostMortem(incident);
    }
  }

  addTimelineEntry(
    incidentId: string,
    author: string,
    action: string,
    description: string
  ) {
    const incident = this.incidents.get(incidentId);
    if (!incident) return;

    incident.timeline.push({
      timestamp: new Date(),
      author,
      action,
      description,
    });
  }

  private generateIncidentId(): string {
    return `INC-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
  }

  private notifyOnCall(incident: Incident) {
    const onCallEngineer = this.getOnCallEngineer(incident.severity);
    console.log(
      `Notifying ${onCallEngineer} about ${incident.severity} incident: ${incident.title}`
    );
  }

  private getOnCallEngineer(severity: IncidentSeverity): string {
    return this.onCallSchedule.get(severity) || "default-oncall";
  }

  private schedulePostMortem(incident: Incident) {
    if (
      incident.severity === IncidentSeverity.SEV1 ||
      incident.severity === IncidentSeverity.SEV2
    ) {
      console.log(`Scheduling post-mortem for incident ${incident.id}`);
    }
  }
}
```

### Runbook Automation

```typescript
interface RunbookStep {
  id: string;
  title: string;
  description: string;
  automated: boolean;
  command?: string;
  expectedOutput?: string;
  timeout?: number;
}

interface Runbook {
  id: string;
  title: string;
  description: string;
  triggers: string[];
  steps: RunbookStep[];
  tags: string[];
}

class RunbookExecutor {
  private runbooks: Map<string, Runbook> = new Map();

  addRunbook(runbook: Runbook) {
    this.runbooks.set(runbook.id, runbook);
  }

  async executeRunbook(
    runbookId: string,
    context: Record<string, any> = {}
  ): Promise<RunbookExecution> {
    const runbook = this.runbooks.get(runbookId);
    if (!runbook) {
      throw new Error(`Runbook ${runbookId} not found`);
    }

    const execution: RunbookExecution = {
      id: this.generateExecutionId(),
      runbookId,
      startedAt: new Date(),
      status: "running",
      steps: [],
      context,
    };

    for (const step of runbook.steps) {
      const stepResult = await this.executeStep(step, context);
      execution.steps.push(stepResult);

      if (!stepResult.success && stepResult.required) {
        execution.status = "failed";
        execution.failedAt = new Date();
        break;
      }
    }

    if (execution.status === "running") {
      execution.status = "completed";
      execution.completedAt = new Date();
    }

    return execution;
  }

  private async executeStep(
    step: RunbookStep,
    context: Record<string, any>
  ): Promise<StepResult> {
    const stepResult: StepResult = {
      stepId: step.id,
      startedAt: new Date(),
      success: false,
      required: true,
    };

    try {
      if (step.automated && step.command) {
        const output = await this.runCommand(
          step.command,
          step.timeout || 30000
        );
        stepResult.output = output;
        stepResult.success = this.validateOutput(output, step.expectedOutput);
      } else {
        stepResult.success = true;
        stepResult.manualAction = true;
      }
    } catch (error) {
      stepResult.error = (error as Error).message;
    }

    stepResult.completedAt = new Date();
    return stepResult;
  }

  private async runCommand(command: string, timeout: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const { spawn } = require("child_process");
      const process = spawn("sh", ["-c", command]);

      let output = "";
      let error = "";

      process.stdout.on("data", (data: Buffer) => {
        output += data.toString();
      });

      process.stderr.on("data", (data: Buffer) => {
        error += data.toString();
      });

      process.on("close", (code: number) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(error || `Command failed with code ${code}`));
        }
      });

      setTimeout(() => {
        process.kill();
        reject(new Error(`Command timed out after ${timeout}ms`));
      }, timeout);
    });
  }

  private validateOutput(output: string, expected?: string): boolean {
    if (!expected) return true;
    return output.includes(expected);
  }

  private generateExecutionId(): string {
    return `exec-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }
}

interface RunbookExecution {
  id: string;
  runbookId: string;
  startedAt: Date;
  completedAt?: Date;
  failedAt?: Date;
  status: "running" | "completed" | "failed";
  steps: StepResult[];
  context: Record<string, any>;
}

interface StepResult {
  stepId: string;
  startedAt: Date;
  completedAt?: Date;
  success: boolean;
  required: boolean;
  output?: string;
  error?: string;
  manualAction?: boolean;
}
```

## Production Readiness

### Health Checks

```typescript
interface HealthCheck {
  name: string;
  check: () => Promise<HealthCheckResult>;
  timeout: number;
  critical: boolean;
}

interface HealthCheckResult {
  status: "healthy" | "unhealthy" | "degraded";
  message?: string;
  metadata?: Record<string, any>;
  duration: number;
}

class HealthCheckManager {
  private checks: Map<string, HealthCheck> = new Map();

  addCheck(check: HealthCheck) {
    this.checks.set(check.name, check);
  }

  async runHealthChecks(): Promise<Map<string, HealthCheckResult>> {
    const results = new Map<string, HealthCheckResult>();

    const promises = Array.from(this.checks.entries()).map(
      async ([name, check]) => {
        const startTime = Date.now();

        try {
          const timeoutPromise = new Promise<HealthCheckResult>((_, reject) => {
            setTimeout(
              () => reject(new Error("Health check timeout")),
              check.timeout
            );
          });

          const checkPromise = check.check();
          const result = await Promise.race([checkPromise, timeoutPromise]);

          result.duration = Date.now() - startTime;
          results.set(name, result);
        } catch (error) {
          results.set(name, {
            status: "unhealthy",
            message: (error as Error).message,
            duration: Date.now() - startTime,
          });
        }
      }
    );

    await Promise.all(promises);
    return results;
  }

  async getOverallHealth(): Promise<{
    status: string;
    checks: Record<string, HealthCheckResult>;
  }> {
    const results = await this.runHealthChecks();
    const checksObj: Record<string, HealthCheckResult> = {};
    let overallStatus = "healthy";

    for (const [name, result] of results) {
      checksObj[name] = result;

      const check = this.checks.get(name);
      if (check?.critical && result.status === "unhealthy") {
        overallStatus = "unhealthy";
      } else if (result.status === "degraded" && overallStatus === "healthy") {
        overallStatus = "degraded";
      }
    }

    return {
      status: overallStatus,
      checks: checksObj,
    };
  }
}
```

### Circuit Breaker with Observability

```typescript
class ObservableCircuitBreaker {
  private state: "closed" | "open" | "half-open" = "closed";
  private failureCount = 0;
  private lastFailureTime = 0;
  private metrics: MetricCollector;
  private logger: StructuredLogger;

  constructor(
    private name: string,
    private failureThreshold: number,
    private timeout: number,
    metrics: MetricCollector,
    logger: StructuredLogger
  ) {
    this.metrics = metrics;
    this.logger = logger;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime < this.timeout) {
        this.metrics.counter("circuit_breaker_rejected_total", 1, {
          circuit: this.name,
        });
        throw new Error(`Circuit breaker ${this.name} is open`);
      } else {
        this.state = "half-open";
        this.logger.info("Circuit breaker transitioning to half-open", {
          circuit: this.name,
        });
      }
    }

    try {
      const startTime = Date.now();
      const result = await operation();
      const duration = Date.now() - startTime;

      this.onSuccess(duration);
      return result;
    } catch (error) {
      this.onFailure(error as Error);
      throw error;
    }
  }

  private onSuccess(duration: number) {
    this.failureCount = 0;

    if (this.state === "half-open") {
      this.state = "closed";
      this.logger.info("Circuit breaker closed after successful call", {
        circuit: this.name,
      });
    }

    this.metrics.counter("circuit_breaker_success_total", 1, {
      circuit: this.name,
    });

    this.metrics.histogram(
      "circuit_breaker_duration_seconds",
      duration / 1000,
      {
        circuit: this.name,
      }
    );
  }

  private onFailure(error: Error) {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    this.metrics.counter("circuit_breaker_failure_total", 1, {
      circuit: this.name,
      error_type: error.constructor.name,
    });

    if (this.failureCount >= this.failureThreshold) {
      this.state = "open";
      this.logger.error(
        "Circuit breaker opened due to failures",
        {
          circuit: this.name,
          failure_count: this.failureCount,
          threshold: this.failureThreshold,
        },
        error
      );
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
    };
  }
}
```

## Implementation Examples

### Express.js Middleware

```typescript
import express from "express";

function createObservabilityMiddleware(
  metrics: MetricCollector,
  logger: StructuredLogger,
  tracer: DistributedTracer
) {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const startTime = Date.now();
    const spanId = tracer.startSpan(
      `HTTP ${req.method} ${req.route?.path || req.path}`
    );

    tracer.addTag(spanId, "http.method", req.method);
    tracer.addTag(spanId, "http.url", req.url);
    tracer.addTag(spanId, "http.user_agent", req.headers["user-agent"]);

    res.on("finish", () => {
      const duration = Date.now() - startTime;

      metrics.counter("http_requests_total", 1, {
        method: req.method,
        status_code: res.statusCode.toString(),
        route: req.route?.path || "unknown",
      });

      metrics.histogram("http_request_duration_seconds", duration / 1000, {
        method: req.method,
        status_code: res.statusCode.toString(),
      });

      if (res.statusCode >= 400) {
        metrics.counter("http_errors_total", 1, {
          method: req.method,
          status_code: res.statusCode.toString(),
        });
      }

      logger.info("HTTP Request", {
        method: req.method,
        url: req.url,
        status_code: res.statusCode,
        duration_ms: duration,
        user_agent: req.headers["user-agent"],
      });

      tracer.addTag(spanId, "http.status_code", res.statusCode);
      tracer.finishSpan(spanId);
    });

    next();
  };
}
```

### Database Observability

```typescript
class ObservableDatabase {
  private db: any;
  private metrics: MetricCollector;
  private logger: StructuredLogger;

  constructor(db: any, metrics: MetricCollector, logger: StructuredLogger) {
    this.db = db;
    this.metrics = metrics;
    this.logger = logger;
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    const startTime = Date.now();
    const operation = this.extractOperation(sql);
    const table = this.extractTable(sql);

    this.logger.debug("Database query started", {
      operation,
      table,
      sql: sql.substring(0, 100),
    });

    try {
      const result = await this.db.query(sql, params);
      const duration = Date.now() - startTime;

      this.metrics.histogram(
        "database_query_duration_seconds",
        duration / 1000,
        {
          operation,
          table,
          status: "success",
        }
      );

      this.metrics.counter("database_queries_total", 1, {
        operation,
        table,
        status: "success",
      });

      this.logger.debug("Database query completed", {
        operation,
        table,
        duration_ms: duration,
        rows_affected: result.rowCount || result.length,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.metrics.histogram(
        "database_query_duration_seconds",
        duration / 1000,
        {
          operation,
          table,
          status: "error",
        }
      );

      this.metrics.counter("database_queries_total", 1, {
        operation,
        table,
        status: "error",
      });

      this.logger.error("Database query failed", error as Error, {
        operation,
        table,
        duration_ms: duration,
        sql: sql.substring(0, 100),
      });

      throw error;
    }
  }

  private extractOperation(sql: string): string {
    const match = sql
      .trim()
      .match(/^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i);
    return match ? match[1].toUpperCase() : "UNKNOWN";
  }

  private extractTable(sql: string): string {
    const patterns = [
      /FROM\s+(\w+)/i,
      /INTO\s+(\w+)/i,
      /UPDATE\s+(\w+)/i,
      /TABLE\s+(\w+)/i,
    ];

    for (const pattern of patterns) {
      const match = sql.match(pattern);
      if (match) return match[1];
    }

    return "unknown";
  }
}
```

## Best Practices Summary

### Observability Checklist

1. **Instrumentation**

   - Add tracing to all service boundaries
   - Implement structured logging with correlation IDs
   - Collect business and technical metrics
   - Use consistent naming conventions

2. **Alerting**

   - Alert on symptoms, not causes
   - Use SLO-based alerting
   - Implement escalation policies
   - Avoid alert fatigue with proper tuning

3. **Monitoring**

   - Monitor the Four Golden Signals
   - Implement health checks
   - Use circuit breakers for resilience
   - Monitor both infrastructure and application metrics

4. **Incident Response**

   - Maintain runbooks for common issues
   - Practice incident response procedures
   - Conduct post-mortems for learning
   - Automate remediation where possible

5. **Performance**
   - Set up performance baselines
   - Monitor key user journeys
   - Track performance regressions
   - Use distributed tracing for debugging

This comprehensive observability and monitoring guide provides the foundation for building robust, observable systems that can be effectively monitored, debugged, and maintained in production environments.
