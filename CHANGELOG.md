# Changelog

All notable changes to this project will be documented in this file.

## [0.9.0] - 2025-07-26

### Added
- CSRF (Cross-Site Request Forgery) protection middleware with session-based token generation
- Configurable `excludePaths` option to exclude specific routes from middleware processing (defaults: `/api`, `/favicon.ico`)
- CSRF token support in templates via `csrfToken` variable
- Multiple token delivery methods: form data (`_csrf`), query parameters, and HTTP headers (`x-csrf-token`, `csrf-token`, `xsrf-token`)
- Enhanced exception handling with proper HTTP status codes (403 for CSRF violations instead of 500)
- Comprehensive JSDoc documentation for all configuration options
- Full English translation of README documentation

### Changed
- Improved middleware optimization with early return patterns for better performance
- Enhanced flash middleware with view existence checks
- Refactored exception handling to use duck typing instead of `instanceof` checks for better module compatibility
- Updated template resources to be English-oriented
- Improved code structure with bilingual comments (Korean + English) throughout the codebase

### Fixed
- Fixed CSRF middleware returning 500 errors instead of proper 403 Forbidden responses
- Fixed `instanceof HttpException` detection issues in exception handlers
- Corrected URL handling in exception filters (`url` → `originalUrl`)
- Fixed various test controller comment URLs and error messages

### Security
- Added session-based CSRF protection to prevent cross-site request forgery attacks
- Implemented secure token generation with configurable salt and secret lengths
- Added proper HTTP status code responses for security violations

## [0.8.0] - 2025-07-25

### Added
- Initial release of NestJS MVC Tools
- Edge.js template engine integration
- Vite-based asset pipeline
- Flash message functionality
- MVC exception handling
- CLI tool for project initialization
- Basic session dependency support