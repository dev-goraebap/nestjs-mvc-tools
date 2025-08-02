# Troubleshooting Guide

## Project Core Libraries and Key Considerations

This project allows you to select and install only the libraries you need through template options. You can selectively include @hotwired series and @tailwindcss libraries based on project requirements, with the default being the most basic `minimal` template.

## Vite HMR Support Issues

### Problem

Currently, the project doesn't properly support Vite's HMR (Hot Module Replacement). This means code changes aren't immediately reflected on the website, and you need to manually refresh to see changes.

### Root Cause

This occurs because Vite primarily handles static asset management while the Edge.js template engine runs on the NestJS server side. The frontend and backend environments are separated, making it difficult to fully utilize Vite's HMR functionality.

### Technical Background

AdonisJS is designed around an ESM (ECMAScript Modules) environment where the frontend configuration works as tightly integrated as a single project. In contrast, NestJS has been widely used in CommonJS environments. 

While ESM configuration in NestJS isn't impossible, we decided it would be difficult to respond to unexpected issues like conflicts with existing libraries. Therefore, we chose a structure that extends NestJS's existing environment configuration without modifying it.

### Current Situation

Due to this approach, it's common to build and deploy frontend and backend independently, creating constraints in HMR integration.

We're currently working to find an appropriate compromise between development convenience and management efficiency.

### Temporary Solutions

Currently, you can improve the development experience with the following methods:

1. **Frontend Changes**: CSS/JS changes are immediately reflected through the Vite development server
2. **Template Changes**: Restart the NestJS server or manually refresh the browser
3. **Concurrent Development**: Use two terminals to monitor each separately

```bash
# Terminal 1: NestJS server
npm run start:dev

# Terminal 2: Vite development server  
cd resources && npm run dev
```

## Library Testing Issues

### Problem

This library uses the Edge.js template engine, which is designed for use in ESM (ECMAScript Modules) environments. However, most NestJS projects run in CommonJS environments, creating difficulties in test environment configuration.

### Jest E2E Testing Limitations

Initially, we attempted E2E testing using Jest in the `tests/tmp` directory, but abandoned it due to the following issues:

#### Main Issues

- **Module System Conflicts**: Compatibility issues when loading ESM library Edge.js in Jest's CommonJS environment
- **Complex Configuration**: Complex setup required for Jest's ESM support and potential conflicts with other libraries
- **Unstable Test Environment**: Tests failing intermittently depending on module loading order or configuration

#### Attempted Solutions

1. **Jest ESM Configuration**: Enabling ESM support in `jest.config.js`
2. **Transform Configuration**: Adjusting Babel or TypeScript compiler settings
3. **Module Mapping**: Manual mapping settings for specific modules

However, these methods also failed to provide a consistent test environment.

### Alternative: Manual Test Environment

Due to these limitations, we currently test functionality manually by running an actual NestJS application in `tests/manual-test-app`:

```bash
# Run test app
cd tests/manual-test-app
npm install
npm run start:dev
```

#### Manual Test App Structure

```
tests/manual-test-app/
├── src/
│   ├── app.controller.ts    # Basic functionality tests
│   ├── app.module.ts        # Module configuration tests
│   └── exception.filter.ts  # Exception handling tests
├── resources/               # Frontend resources
└── package.json
```

#### Test Scenarios

1. **Basic Rendering**: Verify Edge.js template rendering
2. **CSRF Protection**: Verify token generation and validation
3. **Flash Messages**: Verify message setting and display
4. **Asset Pipeline**: Verify Vite build and serving
5. **Exception Handling**: Verify 404, 500 error pages

### Future Improvement Plans

1. **Test Environment Improvement**: Establish separate test strategy to resolve ESM compatibility issues
2. **CI/CD Integration**: Build automated test environment through GitHub Actions
3. **Unit Testing**: Write isolated unit tests for individual features

## Common Problem Solutions

### 1. Session-Related Warning Messages

**Problem**: Persistent session-related warning messages

**Solution**: Refer to the [Configuration Guide](./CONFIGURATION.md#important-session-dependencies) to set up express-session

### 2. Static Assets Not Loading

**Problem**: CSS, JS files not loading with 404 errors

**Solution**: Verify that the `useStaticAssets` configuration in `main.ts` matches the `staticAssetPrefix` configuration in `NestMvcModule`

### 3. CSRF Token Validation Failure

**Problem**: CSRF token errors when submitting forms

**Solution**: 
- Verify that the `{{ csrfToken }}` variable is correctly set in templates
- Check the `_csrf` hidden field in forms
- When using Hotwired, verify meta tag setup

### 4. Production Build Errors

**Problem**: Static assets not properly served in production environment

**Solution**:
```bash
# Both NestJS and Vite must be built
npm run build  # nest build && cd resources && npm run build
```

### 5. Template Rendering Errors

**Problem**: Edge.js template parsing errors

**Solution**:
- Check template syntax (refer to Edge.js syntax guide)
- Verify file paths and extensions (.edge)
- Check for variable name typos

## Support and Contributing

### Issue Reporting

If you encounter problems, please create an issue with the following information:

1. **Environment Info**: Node.js version, NestJS version, OS info
2. **Reproduction Steps**: Minimal steps to reproduce the problem
3. **Expected Result**: Expected behavior
4. **Actual Result**: Actual problem that occurred
5. **Error Messages**: Console logs and error stack

### How to Contribute

1. **Fork**: Fork the project
2. **Branch**: Create a branch for your feature or fix
3. **Test**: Test your changes in `tests/manual-test-app`
4. **Pull Request**: Submit a PR with a description of your changes

### Development Environment Setup

```bash
# Clone project
git clone https://github.com/dev-goraebap/nestjs-mvc-tools.git
cd nestjs-mvc-tools

# Install dependencies
npm install

# Test in test app
cd tests/manual-test-app
npm install
npm run start:dev
```