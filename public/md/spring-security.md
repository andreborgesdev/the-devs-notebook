# Spring Security

It gives us form based authentication out of the box without us having to do anything.

Default user is "user" and the password is automatically generated on the java console

## Basic Auth

![basic-auth](./images/basic-auth.png)

To use basic auth we have to add .httpBasic() to the security config.

We send the username and password on the request header as base64 on every single request!

The basic auth from a browser shows us a browser pop up for the login instead of the login page on the form based auth

To override the security configs we have to create a config class 

We can use ant matchers to whitelist pages

We are required to implement a password encoder in our security config

Authorities = Permissions

![permissions-and-roles](./images/permissions-and-roles.png)

We can define the authority/permissions either on the security config file or directly with an annotation on the method level

For the method level we have to add the annotation `@EnableGlobalMethodSecurity(prePostEnabled = *true)` to our security config file and as the annotation we can use* `@PreAuthorize("hasAuthority('admin:read')")`  there is hasAuthority, hasAnyAuthority, hasRole, hasAnyRole

The order in which we define the ant matchers DOES MATTER. Once it hits a “true” on the matchers it return true

[https://www.baeldung.com/spring-security-granted-authority-vs-role](https://www.baeldung.com/spring-security-granted-authority-vs-role)

## CSRF (CROSS SITE REQUEST FORGERY)

![https://www.imperva.com/learn/wp-content/uploads/sites/13/2019/01/csrf-cross-site-request-forgery.png](https://www.imperva.com/learn/wp-content/uploads/sites/13/2019/01/csrf-cross-site-request-forgery.png)

![csrf-token-flow](./images/csrf-token-flow.png)

![when-to-use-csrf](./images/when-to-use-csrf.png)

The name of the request header is X-XSRF-TOKEN

## Form based authentication

![form-based-auth](./images/form-based-auth.png)

By default spring security uses an in-memory db but we can use our own RDBMS

To use the form based auth we have to add .formLogin to our configuration.

By default a sessionid expires after 30 mins of inactivity. We can extend it by using the rememberMe option which defaults to 2 weeks but we can extend it even more. This remember me option is normally the checkbox that we have bellow the login form.

The remember me also has a cookie that is stored in a DB, same as sessionID.

The remember me cookies contains 2 things, the username and expiration time. These 2 values are hashed with md5.

We can override the default login form by using .loginPage(page) and using thymeleaf for the templating

sessionID is stateful

![logout-url](./images/logout-url.png)

We can change the name of the parameters for username, password, and remember-me.

## Database Authentication

We can either use the JDBC implementation that already comes out of the box or create our own

## JWT (JSON Web Token)

JSON Web Token (JWT) is an open standard ([RFC 7519](https://tools.ietf.org/html/rfc7519)) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the **HMAC** algorithm) or a public/private key pair using **RSA** or **ECDSA**.

Although JWTs can be encrypted to also provide secrecy between parties, we will focus on *signed* tokens. Signed tokens can verify the *integrity* of the claims contained within it, while encrypted tokens *hide* those claims from other parties. When tokens are signed using public/private key pairs, the signature also certifies that only the party holding the private key is the one that signed it.

It is basically a way for an application to transmit information. It's small, self-contained, and security.

![jwt](./image/jwt.png)

![authentication-and-authorization](./images/authentication-and-authorization.png)

With JWT, authentication is the first time the user logs in and we give him the token. Authorization is when they send subsequent requests and we verify is it is valid and it has the permissions to access that resource.

JWT is stateless

![security-with-jwt](./images/security-with-jwt.png)

Refresh token is used to give new access token to not keep asking the user login if the expiration is due

# **Stateless Spring API**

Let's review the case of a stateless Spring API consumed by a frontend.

As explained in [our dedicated article](https://www.baeldung.com/csrf-stateless-rest-api), we need to understand if CSRF protection is required for our stateless API.

**If our stateless API uses token-based authentication, like JWT, we don't need CSRF protection and we must disable it as we saw earlier.**

**However, if our stateless API uses a session cookie authentication, we need to enable CSRF protection** **as we'll see next**.