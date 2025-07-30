# Changelog

All notable changes to this project will be documented in this file.

## [0.9.6] - 2025-07-30

### Added
- CLI template selection options: `--template` or `-t` option with 4 available templates
  - `minimal`: Basic setup with Vite only
  - `tailwind`: TailwindCSS + Vite setup
  - `hotwired`: Hotwired (Turbo + Stimulus) + Vite setup
  - `full`: Complete setup with TailwindCSS + Hotwired + Vite (default)
- ExceptionFilter setup guide added to README_KO.md
  - 404 error page handling methods
  - Automatic flash message handling for SSR form errors
  - API and page branching logic

### Changed
- CLI template folder structure redesign: `template-*` → moved under `templates/` directory
- Default template changed to `full` (maintains existing behavior with all libraries included)
- Major improvements to CLI commands section in README_KO.md
  - Detailed usage and differences for each template
  - Added template selection options to quick start section
- Updated build system `copy-resources` script to use `templates` path

### Improved
- Developer experience: Selective library installation based on project requirements
- Documentation: Complete code examples and setup methods for ExceptionFilter implementation
- CLI usability: Intuitive template names and clear option descriptions

## [0.9.5] - 2025-07-29

### Fixed
- Fixed issue where `.gitignore` file was not created in resources directory during init
- CLI now directly creates `.gitignore` file with proper content (`node_modules`, `public/builds`) during `nestjs-mvc-tools init`

## [0.9.4] - 2025-07-29

### Fixed
- Fixed issue where `.gitignore` file in copy-resources was not included in npm package
- Updated `.npmignore` to explicitly include `.gitignore` file from copy-resources directory

## [0.9.3] - 2025-07-28

### Removed
- `forRootAsync` method and `NestMvcOptionsFactory` interface support
- Asynchronous configuration documentation from README files
- Complex factory pattern configuration examples

### Changed
- Simplified module registration to use only synchronous `forRoot` method
- Updated documentation to focus on straightforward configuration approach

*Note: Removed asynchronous configuration support as it added unnecessary complexity for most use cases. Sometimes developer ego gets the better of us.*

## [0.9.2] - 2025-07-28

### Added
- `NestMvcLoggerService` for conditional debug logging
- Comprehensive JSDoc documentation to all classes and methods
- Debug and error logging capabilities with optional logger support across all services
- Major codebase translation to English comments for international compatibility
- `debug` property in configuration options to control debug log output
- Optional logger parameter support in exception handling classes

### Changed
- Renamed `getDynamicModulePlainObj` method to `createDynamicModule` for clarity
- Integrated logging system across Edge.js, CSRF, and Vite asset helper services
- Enhanced type definitions with detailed property documentation
- Consistent logging context using `ClassName.name` across all services
- Transitioned Korean section headers and inline comments to English
- Added conditional debug logging examples based on development/production environments

### Improved
- Detailed property-level documentation for extended Express Request types
- Replaced console.log/warn with structured logger in error handling
- Enhanced debug visibility for service initialization, operations, and error scenarios
- Overall documentation quality and consistency across major codebase

## [0.9.1] - 2025-07-26

### Changed
- Added Korean version link to README file: <del>Oh, I forgot this while updating the documentation..</del>

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