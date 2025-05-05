# Spring Security

Spring Security provides robust security features for Java applications, offering **authentication**, **authorization**, and protection against common exploits out of the box.

By default, Spring Security:

- Provides **form-based authentication**.
- Creates a default user (`user`) with a randomly generated password (displayed in the console at startup).

## Basic Authentication

```java
http
    .authorizeRequests()
        .anyRequest().authenticated()
    .and()
    .httpBasic();
```

- **Credentials** (username & password) are sent as **Base64** in the `Authorization` header with **every request**.
- Browsers prompt a native **login pop-up**.
- Useful for simple APIs or internal tools.

## Overriding Security Configurations

- Create a configuration class extending `WebSecurityConfigurerAdapter`.
- Use `antMatchers()` to **whitelist** URLs.
- Always implement a `PasswordEncoder` to encode passwords.

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

## Authorities vs Roles

- **Authorities** = **Permissions**.
- Can be defined in the security configuration or using method-level annotations.

```java
@EnableGlobalMethodSecurity(prePostEnabled = true)

@PreAuthorize("hasAuthority('admin:read')")
public void secureMethod() {
    // secure code here
}
```

- Use `hasAuthority`, `hasAnyAuthority`, `hasRole`, `hasAnyRole`.
- **Order of `antMatchers` matters**: first match wins.

[Read more](https://www.baeldung.com/spring-security-granted-authority-vs-role)

## CSRF (Cross-Site Request Forgery)

CSRF protects against malicious websites performing unauthorized actions on behalf of an authenticated user.

```java
.csrf().disable() // for stateless APIs like JWT
```

**CSRF token header**: `X-XSRF-TOKEN`

**When to use CSRF**:

- Enable for **stateful** apps (session-based).
- Disable for **stateless** apps (JWT or API token-based).

## Form-Based Authentication

```java
http
    .formLogin()
        .loginPage("/custom-login")
        .permitAll();
```

- Default uses an **in-memory user store**.
- Can integrate with a **database (JDBC)**.
- Supports a **remember-me** option (cookie-based, stores username + expiration time hashed with MD5).

```java
http
    .rememberMe()
        .key("uniqueKey")
        .tokenValiditySeconds(1209600); // 2 weeks
```

- **Session ID** is **stateful** and expires after 30 minutes (by default).

## Logout

```java
http
    .logout()
        .logoutUrl("/custom-logout")
        .logoutSuccessUrl("/login?logout");
```

## Database Authentication

Options:

1. **JDBC Authentication** (built-in).
2. Custom **UserDetailsService**.

```java
@Override
protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.jdbcAuthentication().dataSource(dataSource);
}
```

## JWT (JSON Web Tokens)

JWT is a **stateless** authentication mechanism.

- Transmits claims as a **signed** JSON object.
- Used for **stateless** APIs.

### JWT Structure:

- **Header**: Signing algorithm (e.g., HMAC, RSA).
- **Payload**: Claims (e.g., user ID, roles).
- **Signature**: Verifies data integrity.

**JWT flow**:

1. User authenticates and receives a token.
2. Token included in `Authorization: Bearer <token>` header.
3. Each request is validated without server-side session storage.

```java
http
    .csrf().disable()
    .authorizeRequests()
        .anyRequest().authenticated()
    .and()
    .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
```

**Refresh Tokens**: Provide a new access token without requiring re-login when the old token expires.

## Stateless Spring API & CSRF

- **JWT/token-based authentication** → CSRF **disabled**.
- **Session cookie-based authentication** → CSRF **enabled**.

[More details](https://www.baeldung.com/csrf-stateless-rest-api)
