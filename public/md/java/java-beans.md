# Java Beans

@Primary Indicates that a bean should be given **preference when multiple candidates are qualified to autowire** a single-valued dependency. If exactly one 'primary' bean exists among the candidates, it will be the autowired value. This annotation is semantically equivalent to the `<bean>` element's `primary` attribute in Spring XML.

If we have more than one bean that qualifies for spring injection, then we use `@Qualifer`
 to specify which needs to be used for injection.

The latest version of the Spring framework defines 6 types of scopes:

- singleton
- prototype
- request
- session
- application
- websocket