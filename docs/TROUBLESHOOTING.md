## Project Basic Library and Key Considerations

### Vite HMR Support Issues

Currently, Vite's HMR (Hot Module Replacement) is not properly supported in the project. Due to this, code modifications are not immediately reflected on the website, and manual refresh is required to check changes.

This phenomenon occurs because Vite primarily handles static asset management, while the Edge.js template engine runs on the NestJS server side. In other words, the frontend and backend environments are separated, making it difficult to fully utilize Vite's HMR functionality.

AdonisJS is designed based on an ESM (ECMAScript Modules) environment, where the frontend configuration itself works tightly like a single project. In contrast, NestJS has been widely used in CommonJS environments. While ESM configuration is not impossible in NestJS, we determined it would be difficult to respond to unexpected issues such as conflicts with existing libraries. Therefore, we chose a structure that extends the existing NestJS environment without touching it. Due to this approach, it is common to build and deploy frontend and backend independently, creating constraints for HMR integration.

Currently, we are striving to find an appropriate compromise between development convenience and management efficiency.

## Library Testing Issues

This library uses the Edge.js template engine, which is designed for use in ESM (ECMAScript Modules) environments. However, most NestJS projects run in CommonJS environments, creating difficulties in test environment configuration.

### Jest E2E Testing Limitations

Initially, we attempted E2E testing using Jest in the `tests/tmp` directory, but abandoned it due to the following problems:

- **Module System Conflicts**: Compatibility issues when loading the ESM library Edge.js in Jest's CommonJS environment
- **Complex Configuration**: Complex setup for Jest's ESM support and potential conflicts with other libraries
- **Unstable Test Environment**: Tests intermittently failing depending on module loading order or configuration

### Alternative: Manual Testing Environment

Due to these limitations, we currently test functionality manually by running an actual NestJS application in `tests/manual-test-app`:

```bash
# Run test app
cd tests/manual-test-app
npm install
npm run start:dev
```

## Response Object Usage Precautions

When declaring `@Res() res: Response` as a parameter in controllers and using `return req.view.render()`, infinite loading issues may occur.

### Problem Example

```typescript
@Get('login')
async loginForm(@Req() req: NestMvcReq, @Res() res: Response) {
  if (req.session?.isAuthenticated) {
    return res.redirect('/admin');
  }
  const template = await req.view.render('pages/admin/login');
  return template; // ❌ Wrong approach - causes infinite loading
}
```

### Root Cause

- `req.view.render()` simply returns a `Promise<string>`
- When using the `@Res()` decorator, NestJS assumes the developer will handle the response directly
- Therefore, you must explicitly send the response using methods like `res.send()`, `res.json()`, etc.
- If this is omitted, the response is not sent, causing infinite loading in the browser

### Solution

Always handle responses explicitly when using `@Res()`:

```typescript
@Get('login')
async loginForm(@Req() req: NestMvcReq, @Res() res: Response) {
  if (req.session?.isAuthenticated) {
    return res.redirect('/admin');
  }
  const template = await req.view.render('pages/admin/login');
  return res.send(template); // ✅ Must use res.send()
}
```