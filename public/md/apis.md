# APIs

# Idempotent HTTP Methods

An HTTP method is **idempotent** if an identical request can be made once or several times in a row with the same effect while leaving the server in the same state. In other words, an idempotent method should not have any side-effects (except for keeping statistics). Implemented correctly, the GET, HEAD, PUT, and DELETE methods are **idempotent**, but not the POST method. All safe methods are also idempotent.

To be idempotent, only the actual back-end state of the server is considered, the status code returned by each request may differ: the first call of a DELETE will likely return a 200, while successive ones will likely return a 404. Another implication of DELETE being idempotent is that developers should not implement RESTful APIs with a *delete last entry* functionality using the DELETE method.

Note that the idempotence of a method is not guaranteed by the server and some applications may incorrectly break the idempotence constraint.

## REST architectural constraints such as statelessness, cacheability, maintainability, and scalability.

### **What do you understand by RESTful Web Services?**

RESTful web services are services that follow REST architecture. REST stands for Representational State Transfer and uses HTTP protocol (web protocol) for implementation. These services are lightweight, provide maintainability, scalability, support communication among multiple applications that are developed using different programming languages. They provide means of accessing resources present at server required for the client via the web browser by means of request headers, request body, response body, status codes, etc.

### **What is a REST Resource?**

Every content in the REST architecture is considered a resource. The resource is analogous to the object in the object-oriented programming world. They can either be represented as text files, HTML pages, images, or any other dynamic data.

- The REST Server provides access to these resources whereas the REST client consumes (accesses and modifies) these resources. Every resource is identified globally by means of a URI.

### **What is URI?**

**Uniform Resource Identifier** is the full form of URI which is used for identifying each resource of the REST architecture. URI is of the format:

```
<protocol>://<service-name>/<ResourceType>/<ResourceID>
```

There are 2 types of URI:

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/461/original/URI.png?1622556755](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/461/original/URI.png?1622556755)

- **URN:** Uniform Resource Name identifies the resource by means of a name that is both unique and persistent.
    - URN doesn’t always specify where to locate the resource on the internet. They are used as templates that are used by other parsers to identify the resource.
    - These follow the urn scheme and usually prefixed with urn:. Examples include
        - urn:isbn:1234567890 is used for identification of book based on the ISBN number in a library application.
        - urn:mpeg:mpeg7:schema:2001 is the default namespace rules for metadata of MPEG-7 video.
    - Whenever a URN identifies a document, they are easily translated into a URL by using “resolver” after which the document can be downloaded.
- **URL:** Uniform Resource Locator has the information regarding fetching of a resource from its location.
    - Examples include:
        - http://abc.com/samplePage.html
        - ftp://sampleServer.com/sampleFile.zip
        - file:///home/interviewbit/sampleFile.txt
    - URLs start with a protocol (like ftp, http etc) and they have the information of the network hostname (sampleServer.com) and the path to the document(/samplePage.html). It can also have query parameters.

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/462/original/uri_example.png?1622557125](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/462/original/uri_example.png?1622557125)

### **What are the features of RESTful Web Services?**

Every RESTful web service has the following features:

- The service is based on the Client-Server model.
- The service uses HTTP Protocol for fetching data/resources, query execution, or any other functions.
- The medium of communication between the client and server is called “Messaging”.
- Resources are accessible to the service by means of URIs.
- It follows the statelessness concept where the client request and response are not dependent on others and thereby provides total assurance of getting the required data.
- These services also use the concept of caching to minimize the server calls for the same type of repeated requests.
- These services can also use SOAP services as implementation protocol to REST architectural pattern.

### **What is the concept of statelessness in REST?**

The REST architecture is designed in such a way that the client state is not maintained on the server. This is known as statelessness. The context is provided by the client to the server using which the server processes the client’s request. The session on the server is identified by the session identifier sent by the client.

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/463/original/statelessness_in_REST.png?1622557550](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/463/original/statelessness_in_REST.png?1622557550)

### **What do you understand by JAX-RS?**

As the name itself stands (JAX-RS= Java API for RESTful Web Services) is a Java-based specification defined by JEE for the implementation of RESTful services. The JAX-RS library makes usage of annotations from Java 5 onwards to simplify the process of web services development. The latest version is 3.0 which was released in June 2020. This specification also provides necessary support to create REST clients.

### **What are HTTP Status codes?**

These are the standard codes that refer to the predefined status of the task at the server. Following are the status codes formats available:

- 1xx - represents informational responses
- 2xx - represents successful responses
- 3xx - represents redirects
- 4xx - represents client errors
- 5xx - represents server errors

Most commonly used status codes are:

- 200 - success/OK
- 201 - CREATED - used in POST or PUT methods.
- 304 - NOT MODIFIED - used in conditional GET requests to reduce the bandwidth use of the network. Here, the body of the response sent should be empty.
- 400 - BAD REQUEST - This can be due to validation errors or missing input data.
- 401- UNAUTHORIZED - This is returned when there is no valid authentication credentials sent along with the request.
- 403 - FORBIDDEN - sent when the user does not have access (or is forbidden) to the resource.
- 404 - NOT FOUND - Resource method is not available.
- 500 - INTERNAL SERVER ERROR - server threw some exceptions while running the method.
- 502 - BAD GATEWAY - Server was not able to get the response from another upstream server.

### **What are the HTTP Methods?**

HTTP Methods are also known as HTTP Verbs. They form a major portion of uniform interface restriction followed by the REST that specifies what action has to be followed to get the requested resource. Below are some examples of HTTP Methods:

- GET: This is used for fetching details from the server and is basically a read-only operation.
- POST: This method is used for the creation of new resources on the server.
- PUT: This method is used to update the old/existing resource on the server or to replace the resource.
- DELETE: This method is used to delete the resource on the server.
- PATCH: This is used for modifying the resource on the server.
- OPTIONS: This fetches the list of supported options of resources present on the server.

The POST, GET, PUT, DELETE corresponds to the create, read, update, delete operations which are most commonly called **CRUD Operations**.

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/464/original/crud_operations.png?1622557853](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/464/original/crud_operations.png?1622557853)

GET, HEAD, OPTIONS are safe and idempotent methods whereas PUT and DELETE methods are only idempotent. POST and PATCH methods are neither safe nor idempotent.

### **Can you tell the disadvantages of RESTful web services?**

The disadvantages are:

- As the services follow the idea of statelessness, it is not possible to maintain sessions. (Session simulation responsibility lies on the client-side to pass the session id)
- REST does not impose security restrictions inherently. It inherits the security measures of the protocols implementing it. Hence, care must be chosen to implement security measures like integrating SSL/TLS based authentications, etc.

### **Define Messaging in terms of RESTful web services.**

The technique of sending a message from the REST client to the REST server in the form of an HTTP request and the server responding back with the response as HTTP Response is called Messaging. The messages contained constitute the data and the metadata about the message.

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/465/original/messaging_in_restful_web_api.png?1622558054](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/465/original/messaging_in_restful_web_api.png?1622558054)

# **Differentiate between SOAP and REST?**

![rest-vs-soap](./images/rest-vs-soap.png)

### **While creating URI for web services, what are the best practices that needs to be followed?**

Below is the list of best practices that need to be considered with designing URI for web services:

- While defining resources, use plural nouns. Example: To identify user resource, use the name “users” for that resource.
- While using the long name for resources, use underscore or hyphen. Avoid using spaces between words. For example, to define authorized users resource, the name can be “authorized_users” or “authorized-users”.
- The URI is case-insensitive, but as part of best practice, it is recommended to use lower case only.
- While developing URI, the backward compatibility must be maintained once it gets published. When the URI is updated, the older URI must be redirected to the new one using the HTTP status code 300.
- Use appropriate HTTP methods like GET, PUT, DELETE, PATCH, etc. It is not needed or recommended to use these method names in the URI. Example: To get user details of a particular ID, use `/users/{id}` instead of `/getUser`
- Use the technique of forward slashing to indicate the hierarchy between the resources and the collections. Example: To get the address of the user of a particular id, we can use: `/users/{id}/address`

### **What are the best practices to develop RESTful web services?**

RESTful web services use REST API as means of implementation using the HTTP protocol. REST API is nothing but an application programming interface that follows REST architectural constraints such as statelessness, cacheability, maintainability, and scalability. It has become very popular among the developer community due to its simplicity. Hence, it is very important to develop safe and secure REST APIs that follow good conventions. Below are some best practices for developing REST APIs:

- Since REST supports multiple data formats, it is however good practice to develop REST APIs that accept and responds with JSON data format whenever possible. This is because a majority of the client and server technologies have inbuilt support to read and parse JSON objects with ease, thereby making JSON the standard object notation.
    - To ensure that the application responds using JSON data format, the response header should have Content-Type set to as `application/JSON`, this is because certain HTTP clients look at the value of this response header to parse the objects appropriately.
    - To ensure that the request sends the data in JSON format, again the Content-Type must be set to `application/JSON` on the request header.
- While naming the resource endpoints, ensure to use plural nouns and not verbs. The API endpoints should be clear, brief, easy to understand, and informative. Using verbs in the resource name doesn’t contribute much information because an HTTP request already has what the request is doing in its HTTP method/verb. An appropriate HTTP verb should be used to represent the task of the API endpoint.
    - Below are the most commonly used HTTP methods to define the verb:
        - GET - indicates get/retrieve the resource data
        - POST - indicates create new resource data
        - PUT - indicates update the existing resource data
        - DELETE - indicates remove the resource data
- To represent the hierarchy of resources, use the nesting in the naming convention of the endpoints. In case, you want to retrieve data of one object residing in another object, the endpoint should reflect this to communicate what is happening. For example, to get the address of an author, we can use the GET method for the URI `/authors/:id/address'`
    - Please ensure there are no more than 2 or 3 levels of nesting as the name of the URI can become too long and unwieldy.
- Error Handling should be done gracefully by returning appropriate error codes the application has encountered. REST has defined standard HTTP Status codes that can be sent along with the response based on the scenario.
    - Error codes should also be accompanied by appropriate error messages that can help the developers to take corrective actions. However, the message should not be too elaborate as well which can help the hacker to hack your application.
    - Common status codes are:
        - 400 - Bad Request – client-side error - failed input validation.
        - 401 - Unauthorized – The user is not authenticated and hence does not have authority to access the resource.
        - 403 - Forbidden – User is authenticated but is not authorized to access the resource.
        - 404 - Not Found – The resource is not found.
        - 500 - Internal server error – This is a very generic server-side error that is thrown when the server goes down. This shouldn’t be returned by the programmer explicitly.
        - 502 - Bad Gateway – Server did not receive a valid response from the upstream server.
        - 503 - Service Unavailable – Some unexpected things happened on the server such as system failure, overload, etc.
- While retrieving huge resource data, it is advisable to include filtering and pagination of the resources. This is because returning huge data all at once can slow down the system and reduce the application performance. Hence, filter some items reduces the data to some extent. Pagination of data is done to ensure only some results are sent at a time. Doing this can increase the server performance and reduce the burden of the server resources.
- Good security practices are a must while developing REST APIs. The client-server communication must be private due to the nature of data sensitivity. Hence, incorporating SSL/TLS becomes the most important step while developing APIs as they facilitate establishing secure communication. SSL certificates are easier to get and load on the server.
    - Apart from the secure channels, we need to ensure that not everyone should be able to access the resource. For example, normal users should not access the data of admins or another user. Hence, role-based access controls should be in place to make sure only the right set of users can access the right set of data.
- Since REST supports the feature of caching, we can use this feature to cache the data in order to improve the application performance. Caching is done to avoid querying the database for a request repeated times. Caching makes data retrieval fast. However, care must be taken to ensure that the cache has updated data and not outdated ones. Frequent cache update measures need to be incorporated. There are many cache providers like Redis that can assist in caching.
- API Versioning: Versioning needs to be done in case we are planning to make any changes with the existing endpoints. We do not want to break communication between our application and the apps that consume our application while we are working on the API release. The transition has to be seamless. Semantic versioning can be followed. For example, 3.0.1 represents 3rd major version with the first patch. Usually, in the API endpoints, we define /v1, /v2, etc at the beginning of the API path.

### **What are Idempotent methods? How is it relevant in RESTful web services domain?**

The meaning of idempotent is that even after calling a single request multiple times, the outcome of the request should be the same. While designing REST APIs, we need to keep in mind to develop idempotent APIs. This is because the consumers can write client-side code which can result in duplicate requests intentionally or not. Hence, fault-tolerant APIs need to be designed so that they do not result in erroneous responses.

- Idempotent methods ensure that the responses to a request if called once or ten times or more than that remain the same. This is equivalent to adding any number with 0.
- REST provides idempotent methods automatically. GET, PUT, DELETE, HEAD, OPTIONS, and TRACE are the idempotent HTTP methods. POST is not idempotent.
    - POST is not idempotent because POST APIs are usually used for creating a new resource on the server. While calling POST methods N times, there will be N new resources. This does not result in the same outcome at a time.
    - Methods like GET, OPTIONS, TRACE, and HEAD are idempotent because they do not change the state of resources on the server. They are meant for resource retrieval whenever called. They do not result in write operations on the server thereby making it idempotent.
    - PUT methods are generally used for updating the state of resources. If you call PUT methods N times, the first request updates the resource and the subsequent requests will be overwriting the same resource again and again without changing anything. Hence, PUT methods are idempotent.
    - DELETE methods are said to be idempotent because when calling them for N times, the first request results in successful deletion (Status Code 200), and the next subsequent requests result in nothing - Status Code 204. The response is different, but there is no change of resources on the server-side.
        - However, if you are attempting to delete the resource present, at last, every time you hit the API, such as the request **DELETE /user/last** which deletes the last user record, then calling the request N times would delete N resources on the server. This does not make DELETE idempotent. In such cases, as part of good practices, it is advisable to use POST requests.

## **What are the differences between REST and AJAX?**

![rest-vs-ajax](./images/rest-vs-ajax.png)

### **Can you tell what constitutes the core components of HTTP Request?**

In REST, any HTTP Request has 5 main components, they are:

- Method/Verb − This part tells what methods the request operation represents. Methods like GET, PUT, POST, DELETE, etc are some examples.
- URI − This part is used for uniquely identifying the resources on the server.
- HTTP Version − This part indicates what version of HTTP protocol you are using. An example can be HTTP v1.1.
- Request Header − This part has the details of the request metadata such as client type, the content format supported, message format, cache settings, etc.
- Request Body − This part represents the actual message content to be sent to the server.

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/468/original/core_components_of_HTTP_Request.png?1622561120](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/468/original/core_components_of_HTTP_Request.png?1622561120)

### **What constitutes the core components of HTTP Response?**

HTTP Response has 4 components:

- Response Status Code − This represents the server response status code for the requested resource. Example- 400 represents a client-side error, 200 represents a successful response.
- HTTP Version − Indicates the HTTP protocol version.
- Response Header − This part has the metadata of the response message. Data can describe what is the content length, content type, response date, what is server type, etc.
- Response Body − This part contains what is the actual resource/message returned from the server.

![https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/467/original/core_components_of_HTTP_Response.png?1622561057](https://s3.ap-south-1.amazonaws.com/myinterviewtrainer-domestic/public_assets/assets/000/000/467/original/core_components_of_HTTP_Response.png?1622561057)

### **Define Addressing in terms of RESTful Web Services.**

Addressing is the process of locating a single/multiple resources that are present on the server. This task is accomplished by making use of URI (Uniform Resource Identifier). The general format of URI is

```
<protocol>://<application-name>/<type-of-resource>/<id-of-resource>
```

## **What are the differences between PUT and POST in REST?**

![put-vs-post.png](./images/put-vs-post.png.png)

### **What makes REST services to be easily scalable?**

REST services follow the concept of statelessness which essentially means no storing of any data across the requests on the server. This makes it easier to scale horizontally because the servers need not communicate much with each other while serving requests.

### **Based on what factors, you can decide which type of web services you need to use - SOAP or REST?**

REST services have gained popularity due to the nature of simplicity, scalability, faster speed, improved performance, and multiple data format support. But, SOAP has its own advantages too. Developers use SOAP where the services require advanced security and reliability.

Following are the questions you need to ask to help you decide which service can be used:

- Do you want to expose resource data or business logic?
    - SOAP is commonly used for exposing business logic and REST for exposing data.
- Does the client require a formal strict contract?
    - If yes, SOAP provides strict contracts by using WSDL. Hence, SOAP is preferred here.
- Does your service require support for multiple formats of data?
    - If yes, REST supports multiple data formats which is why it is preferred in this case.
- Does your service require AJAX call support?
    - If yes, REST can be used as it provides the XMLHttpRequest.
- Does your service require both synchronous and asynchronous requests?
    - SOAP has support for both sync/async operations.
    - REST only supports synchronous calls.
- Does your service require statelessness?
    - If yes, REST is suitable. If no, SOAP is preferred.
- Does your service require a high-security level?
    - If yes, SOAP is preferred. REST inherits the security property based on the underlying implementation of the protocol. Hence, it can’t be preferred at all times.
- Does your service require support for transactions?
    - If yes, SOAP is preferred as it is good in providing advanced support for transaction management.
- What is the bandwidth/resource required?
    - SOAP involves a lot of overhead while sending and receiving XML data, hence it consumes a lot of bandwidth.
    - REST makes use of less bandwidth for data transmission.
- Do you want services that are easy to develop, test, and maintain frequently?
    - REST is known for simplicity, hence it is preferred.

## **We can develop webservices using web sockets as well as REST. What are the differences between these two?**

![rest-vs-web-sockets](./images/rest-vs-web-sockets.png)

The request flow difference between the REST and Web Socket is shown below:

![request-diff-between-rest-and-web-sockets](./images/request-diff-between-rest-and-web-sockets.png)

### **Can we implement transport layer security (TLS) in REST?**

Yes, we can. TLS does the task of encrypting the communication between the REST client and the server and provides the means to authenticate the server to the client. It is used for secure communication as it is the successor of the Secure Socket Layer (SSL). HTTPS works well with both TLS and SSL thereby making it effective while implementing RESTful web services. One point to mention here is, the REST inherits the property of the protocol it implements. So security measures are dependent on the protocol REST implements.

### **Should we make the resources thread safe explicitly if they are made to share across multiple clients?**

There is no need to explicitly making the resources thread-safe because, upon every request, new resource instances are created which makes them thread-safe by default.

### **What is Payload in terms of RESTful web services?**

Payload refers to the data passes in the request body. It is not the same as the request parameters. The payload can be sent only in POST methods as part of the request body.

### **Is it possible to send payload in the GET and DELETE methods?**

No, the payload is not the same as the request parameters. Hence, it is not possible to send payload data in these methods.

### **How can you test RESTful Web Services?**

RESTful web services can be tested using various tools like Postman, Swagger, etc. Postman provides a lot of features like sending requests to endpoints and show the response which can be converted to JSON or XML and also provides features to inspect request parameters like headers, query parameters, and also the response headers. Swagger also provides similar features like Postman and it provides the facility of documentation of the endpoints too. We can also use tools like Jmeter for performance and load testing of APIs.

### **What is the maximum payload size that can be sent in POST methods?**

Theoretically, there is no restriction on the size of the payload that can be sent. But one must remember that the greater the size of the payload, the larger would be the bandwidth consumption and time taken to process the request that can impact the server performance.

### **How does HTTP Basic Authentication work?**

While implementing Basic Authentication as part of APIs, the user must provide the username and password which is then concatenated by the browser in the form of “username: password” and then perform base64 encoding on it. The encoded value is then sent as the value for the “Authorization” header on every HTTP request from the browser. Since the credentials are only encoded, it is advised to use this form when requests are sent over HTTPS as they are not secure and can be intercepted by anyone if secure protocols are not used.

### **What is the difference between idempotent and safe HTTP methods?**

- Safe methods are those that do not change any resources internally. These methods can be cached and can be retrieved without any effects on the resource.
- Idempotent methods are those methods that do not change the responses to the resources externally. They can be called multiple times without any change in the responses.

According to [restcookbook.com](https://restcookbook.com/), the following is the table that describes what methods are idempotent and what is safe.

![http-idempotent-vs-safe-methods](./images/http-idempotent-vs-safe-methods.png)

## **Mention whether you can use GET request instead of PUT to create a resource?**

No, you are not supposed to use PUT for GET. GET operations should only have view rights, while PUT resource is used for updating a data.

## **Mention what are the different application integration styles?**

The different integration styles include

- Shared database
- Batch file transfer
- Invoking remote procedure (RPC)
- Swapping asynchronous messages over a message oriented middle-ware (MOM)

## **Mention what is the difference between RPC or document style web services? How you determine to which one to choose?**

In document style web services, we can transport an XML message as part of SOAP request which is not possible in RPC style web service. Document style web service is most appropriate in some application where XML message behaves as document and content of that document can alter and intention of web service does not rely on the content of XML message.