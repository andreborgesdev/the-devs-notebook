# Spring Security Interview Questions

## What is Spring Security?

Spring Security is a powerful authentication and authorization framework for Java applications. It provides comprehensive security services including:

- **Authentication** - Verifying user identity
- **Authorization** - Controlling access to resources
- **Protection against common exploits** - CSRF, session fixation, clickjacking
- **Integration** - Works seamlessly with Spring applications

## What are the core components of Spring Security?

- **SecurityContext** - Stores security information about the current thread
- **Authentication** - Represents authenticated user details
- **UserDetails** - Core user information interface
- **GrantedAuthority** - Represents an authority granted to an Authentication object
- **SecurityFilterChain** - Chain of security filters that process requests
- **AuthenticationManager** - Processes authentication requests

## Explain the difference between authentication and authorization

- **Authentication** - "Who are you?" - Process of verifying user identity
- **Authorization** - "What can you do?" - Process of determining what authenticated users can access

Example:

```java
// Authentication
@PreAuthorize("isAuthenticated()")
public void someMethod() { }

// Authorization
@PreAuthorize("hasRole('ADMIN')")
public void adminMethod() { }
```

## What is the difference between hasRole() and hasAuthority()?

- **hasRole()** - Checks for roles with automatic "ROLE\_" prefix
- **hasAuthority()** - Checks for exact authority strings

```java
// These are equivalent
hasRole("ADMIN")        // Looks for "ROLE_ADMIN"
hasAuthority("ROLE_ADMIN")  // Looks for exact "ROLE_ADMIN"

// For granular permissions
hasAuthority("USER_READ")
hasAuthority("USER_WRITE")
```

## How does Spring Security filter chain work?

Spring Security uses a chain of filters to process requests:

1. **SecurityContextPersistenceFilter** - Manages SecurityContext
2. **UsernamePasswordAuthenticationFilter** - Handles form login
3. **ExceptionTranslationFilter** - Handles security exceptions
4. **FilterSecurityInterceptor** - Authorizes requests

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/public/**").permitAll()
                .anyRequest().authenticated())
            .formLogin(Customizer.withDefaults())
            .build();
    }
}
```

## What is CSRF and how does Spring Security handle it?

**CSRF (Cross-Site Request Forgery)** - Attack where malicious websites perform unauthorized actions on behalf of authenticated users.

Spring Security provides CSRF protection by:

- Generating unique tokens for each session
- Validating tokens on state-changing requests
- Automatically including tokens in forms

```java
// Enable CSRF (default)
http.csrf(Customizer.withDefaults());

// Disable for APIs
http.csrf(csrf -> csrf.disable());

// Custom CSRF configuration
http.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
    .ignoringRequestMatchers("/api/public/**"));
```

## How do you implement JWT authentication in Spring Security?

JWT authentication involves:

1. **JWT Token Generation**

```java
@Component
public class JwtUtil {

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
            .signWith(SignatureAlgorithm.HS512, secret)
            .compact();
    }
}
```

2. **JWT Filter**

```java
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) {
        String token = extractTokenFromHeader(request);
        if (token != null && jwtUtil.validateToken(token)) {
            String username = jwtUtil.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null,
                                                      userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }
}
```

## What is UserDetailsService and how is it used?

`UserDetailsService` is a core interface for loading user data during authentication:

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return UserPrincipal.create(user);
    }
}
```

## Explain different authentication mechanisms in Spring Security

### 1. Form-Based Authentication

```java
http.formLogin(form -> form
    .loginPage("/login")
    .defaultSuccessUrl("/dashboard")
    .failureUrl("/login?error"));
```

### 2. HTTP Basic Authentication

```java
http.httpBasic(Customizer.withDefaults());
```

### 3. OAuth2 Login

```java
http.oauth2Login(oauth2 -> oauth2
    .loginPage("/oauth2/authorization/google")
    .userInfoEndpoint(userInfo -> userInfo
        .userService(customOAuth2UserService)));
```

### 4. JWT Authentication

```java
http.addFilterBefore(jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class);
```

## What are Spring Security annotations for method-level security?

### @PreAuthorize

```java
@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(Long userId) { }

@PreAuthorize("hasRole('ADMIN') or authentication.name == #username")
public User getUser(String username) { }
```

### @PostAuthorize

```java
@PostAuthorize("returnObject.owner == authentication.name")
public Document getDocument(Long id) { }
```

### @Secured

```java
@Secured({"ROLE_ADMIN", "ROLE_MODERATOR"})
public void moderateContent() { }
```

### @RolesAllowed

```java
@RolesAllowed("ADMIN")
public void adminOperation() { }
```

### @PreFilter and @PostFilter

```java
@PreFilter("filterObject.owner == authentication.name")
public void processDocuments(List<Document> documents) { }

@PostFilter("filterObject.owner == authentication.name")
public List<Document> getAllDocuments() { }
```

## How do you configure password encoding in Spring Security?

```java
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

## What is SecurityContext and SecurityContextHolder?

- **SecurityContext** - Interface for storing security information
- **SecurityContextHolder** - Associates SecurityContext with current thread

```java
// Get current authentication
Authentication auth = SecurityContextHolder.getContext().getAuthentication();

// Get current user
String username = auth.getName();
Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();

// Check if user is authenticated
boolean isAuthenticated = auth.isAuthenticated();
```

## How do you implement custom authentication provider?

```java
@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

    @Override
    public Authentication authenticate(Authentication authentication)
            throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        // Custom authentication logic
        if (customAuthenticate(username, password)) {
            List<GrantedAuthority> authorities = getAuthorities(username);
            return new UsernamePasswordAuthenticationToken(username, password, authorities);
        } else {
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
```

## How do you handle authentication success and failure?

### Authentication Success Handler

```java
@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                      HttpServletResponse response,
                                      Authentication authentication) {
        // Log successful login
        String username = authentication.getName();
        System.out.println("User " + username + " logged in successfully");

        // Redirect based on role
        if (hasRole(authentication, "ADMIN")) {
            response.sendRedirect("/admin/dashboard");
        } else {
            response.sendRedirect("/user/dashboard");
        }
    }
}
```

### Authentication Failure Handler

```java
@Component
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                      HttpServletResponse response,
                                      AuthenticationException exception) {
        // Log failed attempt
        String username = request.getParameter("username");
        System.out.println("Failed login attempt for user: " + username);

        response.sendRedirect("/login?error=true");
    }
}
```

## What is Remember-Me authentication?

Remember-Me allows users to stay logged in across sessions:

```java
http.rememberMe(remember -> remember
    .key("uniqueAndSecret")
    .tokenValiditySeconds(86400) // 24 hours
    .userDetailsService(userDetailsService)
    .rememberMeParameter("remember-me"));
```

## How do you implement session management?

```java
http.sessionManagement(session -> session
    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
    .maximumSessions(1)
    .maxSessionsPreventsLogin(false)
    .sessionRegistry(sessionRegistry())
    .and()
    .invalidSessionUrl("/login?expired"));
```

## What are the differences between stateful and stateless authentication?

### Stateful (Session-based)

- Server maintains session state
- Uses cookies for session ID
- Suitable for traditional web applications

```java
http.sessionManagement(session -> session
    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED));
```

### Stateless (Token-based)

- No server-side session storage
- Uses tokens (JWT) for authentication
- Suitable for APIs and microservices

```java
http.sessionManagement(session -> session
    .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
```

## How do you test Spring Security?

### Unit Testing

```java
@SpringBootTest
@AutoConfigureTestDatabase
class SecurityTest {

    @Test
    @WithMockUser(roles = "ADMIN")
    void testAdminAccess() {
        // Test admin functionality
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    void testUserAccess() {
        // Test user functionality
    }

    @Test
    @WithAnonymousUser
    void testAnonymousAccess() {
        // Test public access
    }
}
```

### Integration Testing

```java
@AutoConfigureMockMvc
@SpringBootTest
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testLoginSuccess() throws Exception {
        mockMvc.perform(post("/login")
            .param("username", "admin")
            .param("password", "password"))
            .andExpect(status().is3xxRedirection())
            .andExpect(redirectedUrl("/dashboard"));
    }
}
```

## What are common Spring Security vulnerabilities and how to prevent them?

### 1. Session Fixation

```java
http.sessionManagement(session -> session
    .sessionFixation().migrateSession());
```

### 2. Clickjacking

```java
http.headers(headers -> headers
    .frameOptions().deny());
```

### 3. CSRF

```java
http.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()));
```

### 4. Insecure HTTP Headers

```java
http.headers(headers -> headers
    .httpStrictTransportSecurity(hstsConfig -> hstsConfig
        .maxAgeInSeconds(31536000)
        .includeSubdomains(true))
    .contentTypeOptions()
    .and()
    .addHeaderWriter(new XFrameOptionsHeaderWriter(XFrameOptionsMode.DENY)));
```

## How do you implement rate limiting in Spring Security?

```java
@Component
public class RateLimitingFilter implements Filter {

    private final RateLimiter rateLimiter = RateLimiter.create(10.0); // 10 requests/second

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                        FilterChain chain) throws IOException, ServletException {
        if (rateLimiter.tryAcquire()) {
            chain.doFilter(request, response);
        } else {
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            httpResponse.getWriter().write("Rate limit exceeded");
        }
    }
}
```

## Best Practices for Spring Security

1. **Use HTTPS in production**
2. **Implement proper password policies**
3. **Use BCrypt for password encoding**
4. **Implement account lockout mechanisms**
5. **Log security events**
6. **Regular security audits**
7. **Keep dependencies updated**
8. **Use secure session management**
9. **Implement proper CORS configuration**
10. **Validate and sanitize inputs**
