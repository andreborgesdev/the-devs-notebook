# Oracle

Regarding use of table functions:

In case you need to filter already in sub-queries, you can create a table function around the query and use the parameters in the sub-queries. The table function is just a view with parameters in this case. This can help to achieve much better performance in some use cases. It’s because indexes will be optimal used in the sub-queries.