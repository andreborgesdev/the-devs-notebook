"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { MermaidDiagram } from "@/src/components/visuals/mermaid-diagram";

export default function DatabaseVisualizersPage() {
  const sqlJoinsChart =
    'graph TB\n    subgraph "Table A (Users)"\n      A1[ID: 1, Name: Alice]\n      A2[ID: 2, Name: Bob]\n      A3[ID: 3, Name: Charlie]\n    end\n    \n    subgraph "Table B (Orders)"\n      B1[UserID: 1, Product: Laptop]\n      B2[UserID: 2, Product: Mouse]\n      B3[UserID: 4, Product: Keyboard]\n    end\n    \n    subgraph "JOIN Types"\n      Inner[INNER JOIN<br/>Matching records only]\n      Left[LEFT JOIN<br/>All A + matching B]\n      Right[RIGHT JOIN<br/>All B + matching A]\n      Full[FULL OUTER JOIN<br/>All records]\n    end';

  const queryExecutionChart =
    'graph TB\n    SQL[SQL Query] --> Parse[Parser]\n    Parse --> Optimize[Query Optimizer]\n    Optimize --> Execute[Execution Engine]\n    Execute --> Result[Result Set]\n    \n    subgraph "Execution Steps"\n      Scan[Table Scan]\n      Filter[Apply WHERE clause]\n      Sort[ORDER BY clause]\n      Join[JOIN operations]\n    end';

  const indexTypesChart =
    'graph TB\n    subgraph "Clustered Index"\n      Clustered[Data pages stored<br/>in key order]\n      CUse[Primary key<br/>Range queries]\n    end\n    \n    subgraph "Non-Clustered Index"\n      NonClustered[Separate structure<br/>Points to data]\n      NCUse[Foreign keys<br/>WHERE clauses]\n    end\n    \n    Clustered --> CUse\n    NonClustered --> NCUse';

  const transactionChart =
    'graph TB\n    Begin[BEGIN TRANSACTION]\n    Begin --> Op1[Operation 1]\n    Op1 --> Op2[Operation 2]\n    Op2 --> Op3[Operation 3]\n    Op3 --> Decision{All Success?}\n    Decision -->|Yes| Commit[COMMIT]\n    Decision -->|No| Rollback[ROLLBACK]\n    \n    subgraph "ACID Properties"\n      A[Atomicity]\n      C[Consistency]\n      I[Isolation]\n      D[Durability]\n    end';

  const nosqlTypesChart =
    "graph TB\n    NoSQL[NoSQL Databases]\n    \n    NoSQL --> KeyValue[Key-Value<br/>Redis, DynamoDB]\n    NoSQL --> Document[Document<br/>MongoDB, CouchDB]\n    NoSQL --> Column[Column-Family<br/>Cassandra, HBase]\n    NoSQL --> Graph[Graph<br/>Amazon Neptune, Neo4j]\n    \n    KeyValue --> KVUse[Simple lookups<br/>Session storage]\n    Document --> DocUse[JSON data<br/>Content management]\n    Column --> ColUse[Time series data<br/>Analytics]\n    Graph --> GraphUse[Social networks<br/>Recommendations]";

  const optimizationChart =
    'graph TB\n    Query[SQL Query] --> Analyze[Query Analysis]\n    Analyze --> Index{Index Available?}\n    Index -->|Yes| Seek[Index Seek<br/>Fast]\n    Index -->|No| Scan[Table Scan<br/>Slow]\n    \n    subgraph "Optimization Techniques"\n      Rewrite[Query Rewriting]\n      Stats[Statistics Update]\n      Cache[Result Caching]\n    end';

  const normalizationChart =
    "graph TB\n    Unnormalized --> NF1[1NF<br/>Atomic values<br/>No repeating groups]\n    NF1 --> NF2[2NF<br/>Remove partial<br/>dependencies]\n    NF2 --> NF3[3NF<br/>Remove transitive<br/>dependencies]\n    NF3 --> BCNF[BCNF<br/>Boyce-Codd<br/>Normal Form]";

  const erdChart =
    'erDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ ORDER_ITEM : contains\n    PRODUCT ||--o{ ORDER_ITEM : "ordered in"\n    \n    CUSTOMER {\n        int customer_id PK\n        string name\n        string email\n        date created_at\n    }\n    \n    ORDER {\n        int order_id PK\n        int customer_id FK\n        date order_date\n        decimal total\n    }\n    \n    PRODUCT {\n        int product_id PK\n        string name\n        decimal price\n        int category_id FK\n    }';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Database Interactive Visualizers
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore database concepts through interactive visualizations and
          practical examples.
        </p>
      </div>

      <Tabs defaultValue="sql" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="sql">SQL Basics</TabsTrigger>
          <TabsTrigger value="indexing">Indexing</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="nosql">NoSQL</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
        </TabsList>

        <TabsContent value="sql" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  SQL Joins Visualizer
                  <Badge variant="secondary">Interactive</Badge>
                </CardTitle>
                <CardDescription>
                  Visualize different SQL join types and their results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="SQL Joins Visualization"
                  chart={sqlJoinsChart}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Query Execution Plan
                  <Badge variant="secondary">Execution</Badge>
                </CardTitle>
                <CardDescription>
                  How databases execute your SQL queries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Query Execution Process"
                  chart={queryExecutionChart}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="indexing" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Index Types Comparison
                  <Badge variant="secondary">Structure</Badge>
                </CardTitle>
                <CardDescription>
                  Clustered vs Non-Clustered indexes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Database Index Types"
                  chart={indexTypesChart}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Performance Impact
                  <Badge variant="secondary">Performance</Badge>
                </CardTitle>
                <CardDescription>
                  How indexes affect query performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Index Performance"
                  chart={optimizationChart}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Transaction Lifecycle
                  <Badge variant="secondary">ACID</Badge>
                </CardTitle>
                <CardDescription>
                  Transaction flow with ACID properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Database Transactions"
                  chart={transactionChart}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nosql" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  NoSQL Database Types
                  <Badge variant="secondary">Categories</Badge>
                </CardTitle>
                <CardDescription>
                  Different NoSQL database types and use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="NoSQL Database Types"
                  chart={nosqlTypesChart}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Query Optimization
                  <Badge variant="secondary">Performance</Badge>
                </CardTitle>
                <CardDescription>
                  How query optimizers improve performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Query Optimization Process"
                  chart={optimizationChart}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="design" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Database Normalization
                  <Badge variant="secondary">Design</Badge>
                </CardTitle>
                <CardDescription>
                  Normal forms and database design principles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Normalization Process"
                  chart={normalizationChart}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Entity Relationship Diagram
                  <Badge variant="secondary">ERD</Badge>
                </CardTitle>
                <CardDescription>
                  Visualize database relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram
                  title="Sample E-commerce ERD"
                  chart={erdChart}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
