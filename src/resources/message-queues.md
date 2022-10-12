# Message Queues

We can see it as a pizza restaurant. Client asks for a pizza, staff says "we'll take care of it" and then that pizza is added to the list/queue of pizzas to do. When it is done, it is removed from the list/queue and client pays and gets pizza. This is an async operation because meanwhile client can be doing other things.

We can manipulate the queue taking into account the priority, because some requests might be faster, like filling a cup of coke.

A server can crash. The jobs running on the crashed server still needs to get processed.

A notifier constantly polls the status of each server and if a server crashes it takes ALL unfinished jobs (listed in some database) and distributes it to the rest of the servers. Because distribution uses a load balancer (with consistent hashing) duplicate processing will not occur as job_1 which might be processing on server_3 (alive) will land again on server_3, and so on.

This "notifier with load balancing" is a "Message Queue".