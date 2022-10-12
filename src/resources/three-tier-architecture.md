# Three tier architecture

A 3-tier application architecture is a modular [client-server](https://www.techtarget.com/searchnetworking/definition/client-server) architecture that consists of a presentation tier, an application tier and a data tier. The data tier stores information, the application tier handles logic and the presentation tier is a graphical user interface ([GUI](https://www.techtarget.com/whatis/definition/GUI)) that communicates with the other two tiers. The three tiers are logical, not physical, and may or may not run on the same physical server.

### **The logical tiers of a 3-tier application architecture**

![https://cdn.ttgtmedia.com/rms/onlineImages/three_tier_arch_half_column_mobile.jpg](https://cdn.ttgtmedia.com/rms/onlineImages/three_tier_arch_half_column_mobile.jpg)

**Presentation tier**: This tier, which is built with [HTML5](https://www.techtarget.com/whatis/definition/HTML5), cascading style sheets ([CSS](https://www.theserverside.com/definition/cascading-style-sheet-CSS)) and [JavaScript](https://www.theserverside.com/definition/JavaScript), is deployed to a computing device through a web browser or a web-based application. The presentation tier communicates with the other tiers through application program interface ([API](https://www.techtarget.com/searchapparchitecture/definition/application-program-interface-API)) calls.

**Application tier**: The application tier, which may also be referred to as the logic tier, is written in a programming language such as [Java](https://www.theserverside.com/definition/JavaScript) and contains the [business logic](https://www.techtarget.com/whatis/definition/business-logic) that supports the application's core functions. The underlying application tier can either be hosted on distributed servers in the cloud or on a dedicated in-house server, depending on how much processing power the application requires.

**Data tier**: The data tier consists of a database and a program for managing read and write access to a database. This tier may also be referred to as [the storage tier](https://www.techtarget.com/searchstorage/definition/tiered-storage) and can be hosted on-premises or in the cloud. Popular database systems for managing read/write access include [MySQL](https://www.techtarget.com/searchoracle/definition/MySQL), PostgreSQL, Microsoft SQL Server and [MongoDB](https://www.techtarget.com/searchdatamanagement/definition/MongoDB).

### **Benefits of a 3-tier app architecture**

The benefits of using a 3-tier architecture include improved horizontal scalability, performance and availability. With three tiers, each part can be developed concurrently by a different team of programmers coding in different languages from the other tier developers. Because the programming for a tier can be changed or relocated without affecting the other tiers, the 3-tier model makes it easier for an enterprise or software packager to continually evolve an application as new needs and opportunities arise. Existing applications or critical parts can be permanently or temporarily retained and encapsulated within the new tier of which it becomes a component.

3-tier application programs may also be referred to as n-tier programs. In this context, the letter *n* stands for "a number of tiers."