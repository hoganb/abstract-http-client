# abstract-http-client

Abstract HTTP client implementation

The "abstract-http-client" repository on GitHub is a Node.js package that provides an abstract interface for making HTTP requests using various HTTP client libraries. The package allows developers to use different HTTP clients without having to change their code, making it easier to switch between different HTTP clients or protocols. The repository contains the source code for the package, along with documentation and examples for how to use it.

# Objective

The objective of the "abstract-http-client" package is to provide a common interface for making HTTP requests using various HTTP client libraries, while shielding external dependencies from the consumer.

The package's decoupled approach allows for HTTP dependencies to be managed internally, without any breaking changes or impact externally. This provides developers with the freedom to change or update the underlying HTTP client library without affecting the external usage of the package.

The package harmonizes HTTP traffic in terms of implementation, common logging, and error behavior, allowing developers to manage all outgoing HTTP traffic in a consistent and reliable manner. This simplifies the codebase and reduces the potential for errors or inconsistencies.

The package also provides a set of default options and configurations, making it easy to get started with HTTP requests without having to specify each individual option. Additionally, it provides a set of hooks and middleware that allow for customization of the HTTP request and response handling.

Overall, the objective of the "abstract-http-client" package is to simplify the management of HTTP requests in Node.js applications, while providing flexibility and customization options for developers.

# Key Features

- Abstraction of dependencies used to fulfil a HTTP request hidden away from consumer
- Comprehensive support for request options defined by type (see below) that are decoupled from HTTP engine
  - Separation of internal and external request options
- Back-off retry strategies (`Retry-After`, `Rate-Limit` and `Exponential`)
- Queued requests functionality, useful for throttling queries per second (qps)
- OAuth1.0a authorization
- Consolidated request/response logging
- Error handling
  - HTTP status code errors i.e. `non-2xx` responses
  - Network errors e.g. `ETIMEDOUT`, `ECONNRESET` etc
- Request timings i.e. DNS lookup, TLS handshake etc
- Central point to manage all outgoing HTTP traffic
- Streaming upload & download support
- Advanced TLS/SSL/HTTPS controls with `agent`, `ca`, `cert`, `checkServerIdentity`, `crl` and `key` request options

# Logging

Four log events can be produced:

- DEBUG `http-client-request` - Request start
- ERROR `http-client-request` - Request network error
- DEBUG `http-client-response` - Request finish
- ERROR|WARN `http-client-response` - Request HTTP status code error
