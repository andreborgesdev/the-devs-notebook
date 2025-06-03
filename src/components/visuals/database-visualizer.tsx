"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Input } from "@/src/components/ui/input";
import {
  Database,
  Table as TableIcon,
  Key,
  Link,
  Search,
  Filter,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react";

interface DatabaseVisualizerProps {
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  concept:
    | "sql-joins"
    | "normalization"
    | "indexing"
    | "acid-properties"
    | "nosql-types";
}

interface TableRow {
  id: number;
  [key: string]: any;
}

interface DatabaseTable {
  name: string;
  columns: string[];
  rows: TableRow[];
  primaryKey: string;
}

interface JoinResult {
  type: string;
  description: string;
  result: TableRow[];
}

export function DatabaseVisualizer({
  title,
  description,
  className,
  height = 500,
  concept,
}: DatabaseVisualizerProps) {
  const [selectedJoin, setSelectedJoin] = useState<string>("inner");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTable, setSelectedTable] = useState<string>("users");

  const renderSQLJoins = () => {
    const usersTable: DatabaseTable = {
      name: "users",
      columns: ["id", "name", "dept_id"],
      primaryKey: "id",
      rows: [
        { id: 1, name: "Alice", dept_id: 10 },
        { id: 2, name: "Bob", dept_id: 20 },
        { id: 3, name: "Charlie", dept_id: 10 },
        { id: 4, name: "David", dept_id: null },
      ],
    };

    const departmentsTable: DatabaseTable = {
      name: "departments",
      columns: ["id", "name"],
      primaryKey: "id",
      rows: [
        { id: 10, name: "Engineering" },
        { id: 20, name: "Marketing" },
        { id: 30, name: "HR" },
      ],
    };

    const joinTypes = {
      inner: {
        description: "Returns records that have matching values in both tables",
        result: [
          { id: 1, name: "Alice", dept_id: 10, dept_name: "Engineering" },
          { id: 2, name: "Bob", dept_id: 20, dept_name: "Marketing" },
          { id: 3, name: "Charlie", dept_id: 10, dept_name: "Engineering" },
        ],
      },
      left: {
        description:
          "Returns all records from left table and matched records from right table",
        result: [
          { id: 1, name: "Alice", dept_id: 10, dept_name: "Engineering" },
          { id: 2, name: "Bob", dept_id: 20, dept_name: "Marketing" },
          { id: 3, name: "Charlie", dept_id: 10, dept_name: "Engineering" },
          { id: 4, name: "David", dept_id: null, dept_name: null },
        ],
      },
      right: {
        description:
          "Returns all records from right table and matched records from left table",
        result: [
          { id: 1, name: "Alice", dept_id: 10, dept_name: "Engineering" },
          { id: 2, name: "Bob", dept_id: 20, dept_name: "Marketing" },
          { id: 3, name: "Charlie", dept_id: 10, dept_name: "Engineering" },
          { id: null, name: null, dept_id: 30, dept_name: "HR" },
        ],
      },
      full: {
        description:
          "Returns all records when there is a match in either left or right table",
        result: [
          { id: 1, name: "Alice", dept_id: 10, dept_name: "Engineering" },
          { id: 2, name: "Bob", dept_id: 20, dept_name: "Marketing" },
          { id: 3, name: "Charlie", dept_id: 10, dept_name: "Engineering" },
          { id: 4, name: "David", dept_id: null, dept_name: null },
          { id: null, name: null, dept_id: 30, dept_name: "HR" },
        ],
      },
    };

    const renderTable = (table: DatabaseTable, highlight?: string) => (
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="bg-gray-50 px-3 py-2 border-b">
          <div className="flex items-center gap-2">
            <TableIcon className="h-4 w-4" />
            <span className="font-semibold">{table.name}</span>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {table.columns.map((col) => (
                <th key={col} className="px-3 py-2 text-left font-medium">
                  {col}
                  {col === table.primaryKey && (
                    <Key className="inline h-3 w-3 ml-1" />
                  )}
                  {col === highlight && (
                    <span className="text-blue-500 ml-1">*</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, index) => (
              <tr key={index} className="border-t">
                {table.columns.map((col) => (
                  <td
                    key={col}
                    className={cn(
                      "px-3 py-2",
                      col === highlight && "bg-blue-50"
                    )}
                  >
                    {row[col] ?? "NULL"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    const renderJoinResult = () => {
      const join = joinTypes[selectedJoin as keyof typeof joinTypes];
      return (
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="bg-green-50 px-3 py-2 border-b">
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              <span className="font-semibold">
                {selectedJoin.toUpperCase()} JOIN Result
              </span>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-medium">id</th>
                <th className="px-3 py-2 text-left font-medium">name</th>
                <th className="px-3 py-2 text-left font-medium">dept_id</th>
                <th className="px-3 py-2 text-left font-medium">dept_name</th>
              </tr>
            </thead>
            <tbody>
              {join.result.map((row, index) => (
                <tr key={index} className="border-t">
                  <td className="px-3 py-2">{row.id ?? "NULL"}</td>
                  <td className="px-3 py-2">{row.name ?? "NULL"}</td>
                  <td className="px-3 py-2">{row.dept_id ?? "NULL"}</td>
                  <td className="px-3 py-2">{row.dept_name ?? "NULL"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderTable(usersTable, "dept_id")}
          {renderTable(departmentsTable, "id")}
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.keys(joinTypes).map((type) => (
            <Button
              key={type}
              variant={selectedJoin === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedJoin(type)}
            >
              {type.toUpperCase()} JOIN
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              {joinTypes[selectedJoin as keyof typeof joinTypes].description}
            </p>
          </div>
          {renderJoinResult()}
        </div>
      </div>
    );
  };

  const renderNormalization = () => {
    const unnormalizedData = [
      {
        student_id: 1,
        student_name: "Alice",
        course1: "Math",
        course2: "Physics",
        instructor1: "Dr. Smith",
        instructor2: "Dr. Jones",
      },
      {
        student_id: 2,
        student_name: "Bob",
        course1: "Math",
        course2: "Chemistry",
        instructor1: "Dr. Smith",
        instructor2: "Dr. Brown",
      },
    ];

    const firstNormalForm = {
      students: [
        {
          student_id: 1,
          student_name: "Alice",
          course: "Math",
          instructor: "Dr. Smith",
        },
        {
          student_id: 1,
          student_name: "Alice",
          course: "Physics",
          instructor: "Dr. Jones",
        },
        {
          student_id: 2,
          student_name: "Bob",
          course: "Math",
          instructor: "Dr. Smith",
        },
        {
          student_id: 2,
          student_name: "Bob",
          course: "Chemistry",
          instructor: "Dr. Brown",
        },
      ],
    };

    const secondNormalForm = {
      students: [
        { student_id: 1, student_name: "Alice" },
        { student_id: 2, student_name: "Bob" },
      ],
      enrollments: [
        { student_id: 1, course: "Math", instructor: "Dr. Smith" },
        { student_id: 1, course: "Physics", instructor: "Dr. Jones" },
        { student_id: 2, course: "Math", instructor: "Dr. Smith" },
        { student_id: 2, course: "Chemistry", instructor: "Dr. Brown" },
      ],
    };

    const thirdNormalForm = {
      students: [
        { student_id: 1, student_name: "Alice" },
        { student_id: 2, student_name: "Bob" },
      ],
      courses: [
        { course_id: 1, course_name: "Math", instructor_id: 1 },
        { course_id: 2, course_name: "Physics", instructor_id: 2 },
        { course_id: 3, course_name: "Chemistry", instructor_id: 3 },
      ],
      instructors: [
        { instructor_id: 1, instructor_name: "Dr. Smith" },
        { instructor_id: 2, instructor_name: "Dr. Jones" },
        { instructor_id: 3, instructor_name: "Dr. Brown" },
      ],
      enrollments: [
        { student_id: 1, course_id: 1 },
        { student_id: 1, course_id: 2 },
        { student_id: 2, course_id: 1 },
        { student_id: 2, course_id: 3 },
      ],
    };

    const normalForms = [
      {
        name: "Unnormalized",
        description: "Contains repeating groups and redundant data",
        data: unnormalizedData,
        issues: ["Repeating groups", "Data redundancy", "Update anomalies"],
      },
      {
        name: "1st Normal Form (1NF)",
        description: "Eliminate repeating groups, ensure atomic values",
        data: firstNormalForm,
        issues: ["Partial dependencies still exist", "Some redundancy remains"],
      },
      {
        name: "2nd Normal Form (2NF)",
        description: "Remove partial dependencies on composite keys",
        data: secondNormalForm,
        issues: ["Transitive dependencies exist"],
      },
      {
        name: "3rd Normal Form (3NF)",
        description: "Remove transitive dependencies",
        data: thirdNormalForm,
        issues: ["Fully normalized for most use cases"],
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {normalForms.map((form, index) => (
            <Button
              key={index}
              variant={currentStep === index ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentStep(index)}
            >
              {form.name}
            </Button>
          ))}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">
            {normalForms[currentStep].name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {normalForms[currentStep].description}
          </p>

          <div className="space-y-2">
            <span className="text-sm font-medium">Key Points:</span>
            <ul className="space-y-1">
              {normalForms[currentStep].issues.map((issue, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      currentStep === 3 ? "bg-green-500" : "bg-orange-500"
                    )}
                  />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          {Array.isArray(normalForms[currentStep].data) ? (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-3 py-2 border-b">
                <span className="font-semibold">Student Data</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      {Object.keys(normalForms[currentStep].data[0]).map(
                        (key) => (
                          <th
                            key={key}
                            className="px-3 py-2 text-left font-medium"
                          >
                            {key}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(normalForms[currentStep].data as any[]).map(
                      (row, index) => (
                        <tr key={index} className="border-t">
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex} className="px-3 py-2">
                              {value as string}
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(normalForms[currentStep].data as any).map(
                ([tableName, tableData]) => (
                  <div
                    key={tableName}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 px-3 py-2 border-b">
                      <span className="font-semibold">{tableName}</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            {Object.keys((tableData as any[])[0]).map((key) => (
                              <th
                                key={key}
                                className="px-3 py-2 text-left font-medium"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(tableData as any[]).map((row, index) => (
                            <tr key={index} className="border-t">
                              {Object.values(row).map((value, cellIndex) => (
                                <td key={cellIndex} className="px-3 py-2">
                                  {value as string}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderIndexing = () => {
    const tableData = [
      { id: 1, name: "Alice", age: 25, department: "Engineering" },
      { id: 2, name: "Bob", age: 30, department: "Marketing" },
      { id: 3, name: "Charlie", age: 28, department: "Engineering" },
      { id: 4, name: "David", age: 35, department: "HR" },
      { id: 5, name: "Eve", age: 27, department: "Marketing" },
    ];

    const indexes = {
      none: {
        name: "No Index",
        description: "Full table scan required for queries",
        scanCount: 5,
        performance: "O(n)",
      },
      primary: {
        name: "Primary Index (ID)",
        description: "Clustered index on primary key",
        scanCount: 1,
        performance: "O(log n)",
      },
      secondary: {
        name: "Secondary Index (Department)",
        description: "Non-clustered index on department column",
        scanCount: 2,
        performance: "O(log n)",
      },
    };

    const [selectedIndex, setSelectedIndex] =
      useState<keyof typeof indexes>("none");
    const [searchQuery, setSearchQuery] = useState("");

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(indexes).map(([key, index]) => (
            <Card
              key={key}
              className={cn(
                "cursor-pointer transition-all",
                selectedIndex === key ? "ring-2 ring-blue-500" : ""
              )}
              onClick={() => setSelectedIndex(key as keyof typeof indexes)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{index.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-gray-600">{index.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {index.performance}
                  </Badge>
                  <Badge
                    variant={index.scanCount === 1 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {index.scanCount} scan{index.scanCount > 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by ID or Department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-b">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Employee Table</span>
                <Badge variant="outline">
                  {indexes[selectedIndex].name} Active
                </Badge>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">
                    ID{" "}
                    {selectedIndex === "primary" && (
                      <Key className="inline h-3 w-3 ml-1" />
                    )}
                  </th>
                  <th className="px-3 py-2 text-left font-medium">Name</th>
                  <th className="px-3 py-2 text-left font-medium">Age</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Department{" "}
                    {selectedIndex === "secondary" && (
                      <Database className="inline h-3 w-3 ml-1" />
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => {
                  const isHighlighted =
                    searchQuery &&
                    (row.id.toString().includes(searchQuery) ||
                      row.department
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()));

                  return (
                    <tr
                      key={index}
                      className={cn(
                        "border-t",
                        isHighlighted ? "bg-yellow-50" : ""
                      )}
                    >
                      <td className="px-3 py-2">{row.id}</td>
                      <td className="px-3 py-2">{row.name}</td>
                      <td className="px-3 py-2">{row.age}</td>
                      <td className="px-3 py-2">{row.department}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              With {indexes[selectedIndex].name}: Query performance is{" "}
              {indexes[selectedIndex].performance}, requiring{" "}
              {indexes[selectedIndex].scanCount} table scan
              {indexes[selectedIndex].scanCount > 1 ? "s" : ""}.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderACIDProperties = () => {
    const properties = [
      {
        name: "Atomicity",
        description: "All operations in a transaction succeed or fail together",
        example: "Bank transfer: debit and credit must both succeed",
        icon: "⚛️",
        color: "bg-blue-50 border-blue-300",
      },
      {
        name: "Consistency",
        description:
          "Database remains in valid state before and after transaction",
        example: "Account balances cannot be negative",
        icon: "🔄",
        color: "bg-green-50 border-green-300",
      },
      {
        name: "Isolation",
        description: "Concurrent transactions don't interfere with each other",
        example: "Two users updating same record see consistent data",
        icon: "🔒",
        color: "bg-yellow-50 border-yellow-300",
      },
      {
        name: "Durability",
        description: "Committed transactions persist even after system failure",
        example: "Saved data survives power outage or crash",
        icon: "💾",
        color: "bg-purple-50 border-purple-300",
      },
    ];

    const transactionSteps = [
      "BEGIN TRANSACTION",
      "Debit $100 from Account A",
      "Credit $100 to Account B",
      "COMMIT TRANSACTION",
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((property, index) => (
            <div
              key={property.name}
              className={cn("p-4 rounded-lg border-2", property.color)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{property.icon}</span>
                <h3 className="font-semibold text-lg">{property.name}</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                {property.description}
              </p>
              <div className="p-2 bg-white rounded border text-xs">
                <strong>Example:</strong> {property.example}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Database className="h-5 w-5" />
            ACID Transaction Example
          </h3>
          <div className="space-y-2">
            {transactionSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </div>
                <code className="text-sm bg-white px-2 py-1 rounded">
                  {step}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderNoSQLTypes = () => {
    const nosqlTypes = [
      {
        type: "Document",
        description: "Store data in JSON-like documents",
        examples: ["MongoDB", "CouchDB", "Amazon DocumentDB"],
        useCase: "Content management, user profiles, catalogs",
        structure: {
          _id: "507f1f77bcf86cd799439011",
          name: "John Doe",
          email: "john@example.com",
          address: {
            street: "123 Main St",
            city: "New York",
          },
        },
        color: "bg-green-50 border-green-300",
      },
      {
        type: "Key-Value",
        description: "Simple key-value pairs for fast lookup",
        examples: ["Redis", "DynamoDB", "Riak"],
        useCase: "Caching, session storage, shopping carts",
        structure: {
          "user:1001": "John Doe",
          "session:abc123": "logged_in",
          "cart:user:1001": "[{item: 'book', qty: 2}]",
        },
        color: "bg-blue-50 border-blue-300",
      },
      {
        type: "Column-Family",
        description: "Store data in column families/super columns",
        examples: ["Cassandra", "HBase", "Amazon SimpleDB"],
        useCase: "Time-series data, IoT data, analytics",
        structure: {
          row_key: "user:1001",
          profile: { name: "John", email: "john@example.com" },
          activity: { last_login: "2024-01-15", page_views: "150" },
        },
        color: "bg-purple-50 border-purple-300",
      },
      {
        type: "Graph",
        description: "Store entities and relationships as nodes and edges",
        examples: ["Neo4j", "Amazon Neptune", "ArangoDB"],
        useCase: "Social networks, recommendation engines, fraud detection",
        structure:
          "Nodes: (User), (Product)\nEdges: [PURCHASED], [FRIENDS_WITH], [RECOMMENDED]",
        color: "bg-orange-50 border-orange-300",
      },
    ];

    return (
      <Tabs defaultValue="Document" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {nosqlTypes.map((type) => (
            <TabsTrigger key={type.type} value={type.type} className="text-xs">
              {type.type}
            </TabsTrigger>
          ))}
        </TabsList>

        {nosqlTypes.map((type) => (
          <TabsContent key={type.type} value={type.type} className="space-y-4">
            <div className={cn("p-4 rounded-lg border-2", type.color)}>
              <h3 className="font-semibold text-lg mb-2">
                {type.type} Database
              </h3>
              <p className="text-sm text-gray-700 mb-3">{type.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Popular Examples:</h4>
                  <div className="flex flex-wrap gap-1">
                    {type.examples.map((example) => (
                      <Badge
                        key={example}
                        variant="secondary"
                        className="text-xs"
                      >
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Best Use Case:</h4>
                  <p className="text-sm text-gray-600">{type.useCase}</p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-3 py-2 border-b">
                <span className="font-semibold">Data Structure Example</span>
              </div>
              <div className="p-4">
                <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
                  {typeof type.structure === "string"
                    ? type.structure
                    : JSON.stringify(type.structure, null, 2)}
                </pre>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  const renderConcept = () => {
    switch (concept) {
      case "sql-joins":
        return renderSQLJoins();
      case "normalization":
        return renderNormalization();
      case "indexing":
        return renderIndexing();
      case "acid-properties":
        return renderACIDProperties();
      case "nosql-types":
        return renderNoSQLTypes();
      default:
        return <div>Database concept not implemented</div>;
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      {(title || description) && (
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              {title && <CardTitle className="text-lg">{title}</CardTitle>}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(0)}
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div style={{ minHeight: `${height}px` }}>{renderConcept()}</div>
      </CardContent>
    </Card>
  );
}

export function SQLJoinsDemo({ className }: { className?: string }) {
  return (
    <DatabaseVisualizer
      title="SQL Joins Visualization"
      description="Interactive demonstration of different SQL join types and their results"
      className={className}
      height={600}
      concept="sql-joins"
    />
  );
}

export function DatabaseNormalizationDemo({
  className,
}: {
  className?: string;
}) {
  return (
    <DatabaseVisualizer
      title="Database Normalization"
      description="Step-by-step visualization of database normalization from 1NF to 3NF"
      className={className}
      height={500}
      concept="normalization"
    />
  );
}

export function DatabaseIndexingDemo({ className }: { className?: string }) {
  return (
    <DatabaseVisualizer
      title="Database Indexing"
      description="Compare query performance with different indexing strategies"
      className={className}
      height={400}
      concept="indexing"
    />
  );
}

export function ACIDPropertiesDemo({ className }: { className?: string }) {
  return (
    <DatabaseVisualizer
      title="ACID Properties"
      description="Understanding Atomicity, Consistency, Isolation, and Durability in databases"
      className={className}
      height={400}
      concept="acid-properties"
    />
  );
}

export function NoSQLTypesDemo({ className }: { className?: string }) {
  return (
    <DatabaseVisualizer
      title="NoSQL Database Types"
      description="Explore different NoSQL database types and their use cases"
      className={className}
      height={500}
      concept="nosql-types"
    />
  );
}
