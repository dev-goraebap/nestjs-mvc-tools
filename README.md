# NestJS MVC Tools

[View Korean version 👾](https://github.com/dev-goraebap/nestjs-mvc-tools/blob/HEAD/README_KO.md)

**NestJS MVC Tools** is a small utility designed to help you get started with traditional web development approaches in NestJS more easily.

What began as a simple utility for conveniently using the Edge.js template engine in NestJS has evolved into its current form as various features needed for the View layer of the MVC pattern were gradually added.

It comes configured with AdonisJS's [Edge.js](https://edgejs.dev/docs/introduction) template engine and an asset pipeline using [Vite](https://vite.dev/). The frontend directory setup includes [TailwindCSS](https://tailwindcss.com/) related libraries and the [Hotwired](https://hotwired.dev/) suite by default, but these are not mandatory. You can remove them if you don't need them.

Hotwired is a library developed by the Ruby on Rails community and may be unfamiliar to many developers. However, if you want to maintain your existing server-side development approach while achieving a smooth SPA-like user experience, it's worth considering. That said, the community has both positive and negative perspectives on it, so the choice is ultimately yours.

You can find examples in the project's [tests/manual-test-app](./tests/manual-test-app).

## Developer's Note

While I love NestJS's powerful DI system, sometimes I envy full-stack environments like AdonisJS, Laravel, or Ruby on Rails. I searched for libraries in the NestJS ecosystem for frontend configuration but couldn't find anything suitable, so I ended up creating one to my taste.

This library is merely an assembly of excellent works created by other talented developers, packaged to fit NestJS. I'm not confident about maintaining it consistently, so if anyone shares similar thoughts, I hope they'll release a better library. ~~(So I can use it comfortably)~~

## Key Features

### Edge.js Template Engine Modularization

AdonisJS's Edge.js template engine is modularized and provided for use in NestJS. Why use Edge.js, you ask? It's simply easy and powerful... that's all!

### Automatic Frontend Directory Configuration

Through the built-in CLI, frontend resource folders are automatically created and configured, helping you quickly start projects and set up development environments.

### Vite-based Asset Pipeline Construction

Using Vite to support frontend development servers and provide optimized assets in production environments through the asset pipeline.

### CSRF Protection

Provides session-based CSRF (Cross-Site Request Forgery) protection to safely guard applications from malicious requests. Supports various token delivery methods (headers, form data, query).

### Flash Messages

Provides session-based temporary message and data functionality to effectively communicate necessary information to users and improve UI/UX.

### MVC Exception Handling

Provides a simple exception handling abstract class based on MVC (Model-View-Controller) that integrates with the template engine, allowing developers to handle application errors according to different situations.

### Modern Web Compatibility

Supports compatibility with modern web technologies like Hotwired/Turbo, providing user experiences similar to SPAs (Single Page Applications) while maintaining the advantages of server-side rendering.

## Installation

```bash
npm install nestjs-mvc-tools
```

## Quick Start

We'll help you with basic setup for using MVC patterns in NestJS.

### 1. Project Initialization

```bash
# Set up MVC templates and resources
npx nestjs-mvc-tools init
```

Creates a resources directory at the project root and downloads necessary dependencies for the internal vite development environment.

### 2. Static File Path Configuration

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Add this
  app.useStaticAssets(join(process.cwd(), "resources", "public"), {
    prefix: "/public",
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### 3. NestMvcModule Registration

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { NestMvcModule } from "nestjs-mvc-tools";
import { join } from "path";

@Module({
  imports: [
    NestMvcModule.forRoot({
      view: {
        rootDir: join(__dirname, "..", "resources", "views"),
        disks: [], // Additional disk paths if needed
      },
      csrf: {
        enabled: true, // Enable CSRF protection
      },
    }),
  ],
})
export class AppModule {}
```

### 4. Controller Implementation

```typescript
// app.controller.ts
import { Controller, Get, Req } from "@nestjs/common";
import { AppService } from "./app.service";
import { NestMvcReq } from "nestjs-mvc-tools";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Req() req: NestMvcReq) {
    const message = this.appService.getHello();
    return req.view.render("pages/hello_world/index", { message });
  }
}
```

#### Check Connected Template

```html
// resources/views/pages/hello_world/index.edge 

@layout.app({ title: 'Helloworld'})
<h1 data-controller="hello" class="text-3xl">{{ message ?? 'hello world' }}</h1>
@end
```

### 5. Running the Project

```bash
# 1. Run vite development server
cd resources && npm run dev

# 2. Run nestjs server
npm run start:dev
```

Using the concurrently library, you can configure it as follows:

```json
// package.json
"scripts": {
  "start:resource": "cd resources && npm run dev",
  "start:dev": "concurrently \"nest start --watch\" \"npm run start:resource\"",
}
```

And run with just `npm run start:dev`

## CLI Commands

### `nestjs-mvc-tools init`

Creates basic MVC templates and resource structure in the project.

```bash
nestjs-mvc-tools init
```

**Generated Structure:**

```
resources/
├── package.json        # Vite development environment
├── vite.config.js      # Vite configuration
├── src/
│   ├── app.js         # Frontend entry
│   └── tailwind.css   # Styles
├── views/
│   ├── components/    # Reusable components
│   └── pages/         # Page templates
└── public/
    └── builds/        # Built assets
```

## Configuration

### Basic Configuration

```typescript
// Default values provided if configuration is not included
NestMvcModule.forRoot({
  excludePaths: ["/api", "/favicon.ico"], // Paths to exclude from middleware processing
  debug: false, // Whether to output debug logs (default: false)
  view: {
    rootDir: join(process.cwd(), "resources", "views"),
    disks: [], // Additional template disk paths
    cache: true,
  },
  asset: {
    mode: "development",
    staticAssetPrefix: "/public",
    buildOutDir: join(process.cwd(), "resources", "public", "builds"),
    devServerUrl: "http://localhost:5173",
  },
  csrf: {
    enabled: false, // Disable CSRF protection (default)
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    saltLength: 8,
    secretLength: 18,
  },
});
```

## Important: Session Dependencies

**CSRF protection** and **flash message** functionality internally depend on sessions. While basic rendering functionality won't cause errors even without active sessions, warning messages will continuously appear and these features won't work properly.

Therefore, sessions must be active to use these features reliably.

```bash
npm install express-session
npm install @types/express-session # If types are needed
```

**main.ts configuration:**

```typescript
import * as session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Session middleware setup (required for CSRF and flash messages)
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Send only over HTTPS
        sameSite: 'lax'
      }
    })
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
```

## CSRF Protection

CSRF (Cross-Site Request Forgery) protection prevents attacks where malicious websites send authenticated requests through a user's browser.

### Enabling CSRF Protection

```typescript
// app.module.ts
NestMvcModule.forRoot({
  csrf: {
    enabled: true, // Enable CSRF protection
    ignoredMethods: ["GET", "HEAD", "OPTIONS"], // HTTP methods to not validate
    saltLength: 8, // Salt length for token generation
    secretLength: 18, // Secret length for token generation
  },
});
```

### Using CSRF Tokens in Templates

The `csrfToken` variable is available in all view templates:

```html
<!-- Add token as hidden field in forms -->
<form method="POST" action="/users">
  <input type="hidden" name="_csrf" value="{{ csrfToken }}" />
  <input type="text" name="name" />
  <button type="submit">Submit</button>
</form>

<!-- Use with Hotwired/Turbo (meta tag) -->
<meta name="csrf-token" content="{{ csrfToken }}" />
```

### Token Delivery Methods

CSRF tokens can be delivered in the following ways:

1. **Form data**: `_csrf` field
2. **Query parameter**: `?_csrf=token`
3. **HTTP headers**: 
   - `x-csrf-token`
   - `csrf-token`
   - `xsrf-token`

### Integration with Hotwired/Turbo

When using Hotwired/Turbo, setting up meta tags automatically includes CSRF tokens in AJAX requests:

```html
<head>
  <meta name="csrf-token" content="{{ csrfToken }}" />
</head>
```

## Flash Messages

Flash messages provide one-time notifications to users. They're mainly used to display success/failure messages after form submissions or validation errors.

### Basic Usage

```typescript
@Post('/users')
async createUser(@Req() req: NestMvcReq, @Res() res: Response) {
  try {
    // User creation logic
    await this.userService.create(req.body);
    
    // Set success message
    req.flash.success('User created successfully.');
    return res.redirect('/users');
  } catch (error) {
    // Set error message and maintain input values
    req.flash.error('Failed to create user.').flashInput();
    return res.redirect('/users/new');
  }
}
```

### Flash Message Types

```typescript
// Success message
req.flash.success('Task completed.');

// Error message
req.flash.error('An error occurred.');

// Info message
req.flash.info('This is for your information.');

// Warning message  
req.flash.warning('Attention required.');

// Custom key
req.flash.flash('custom_key', 'Custom message');
```

### Maintaining Form Input Values

You can maintain user-entered data when validation fails:

```typescript
@Post('/users')
async createUser(@Req() req: NestMvcReq, @Res() res: Response) {
  if (!req.body.name) {
    // Maintain input values along with error message
    req.flash.error('Please enter a name.').flashInput();
    return res.redirect('/users/new');
  }
  
  // Success handling...
}
```

### Displaying Flash Messages in Templates

```html
<!-- Success message -->
@if(flash.success)
<div class="alert alert-success">
  {{ flash.success }}
</div>
@end

<!-- Error message -->
@if(flash.error)
<div class="alert alert-error">
  {{ flash.error }}
</div>
@end

<!-- Restore previous input values -->
<input 
  type="text" 
  name="name" 
  value="{{ flash.input.name || '' }}" 
/>
```

### Integration with MVC Exception Handling

Throwing a `BadRequestException` automatically handles flash messages and input value maintenance:

```typescript
@Post('/users')
async createUser(@Body() createUserDto: CreateUserDto) {
  if (!createUserDto.name) {
    // Flash message handling is automatic
    throw new BadRequestException('Please enter a name.');
  }
  
  // Success handling...
}
```

## Path Exclusion Configuration

Features provided by the library such as view, csrf, flash, etc. work at the middleware level.
You can exclude specific paths from middleware processing:

```typescript
NestMvcModule.forRoot({
  excludePaths: ["/api", "/favicon.ico", "/health"], // Paths to exclude
  ...
});
```

By default, `/api` and `/favicon.ico` paths are excluded.

## Project Default Libraries and Key Considerations

This project's frontend environment installs @hotwired series and @tailwindcss libraries by default. These two libraries are not essential, so you can remove them if desired. However, Hotwired has high utility in this project, so its use is recommended.

### Vite HMR Support Issues

Currently, the project doesn't properly support Vite's HMR (Hot Module Replacement). This means code changes aren't immediately reflected on the website, and you need to manually refresh to see changes.

This occurs because Vite primarily handles static asset management while the Edge.js template engine runs on the NestJS server side. In other words, the frontend and backend environments are separated, making it difficult to fully utilize Vite's HMR functionality.

AdonisJS is designed based on an ESM (ECMAScript Modules) environment, so the frontend configuration itself works closely like a single project. In contrast, NestJS has been widely used in CommonJS environments. While ESM configuration isn't impossible in NestJS, we judged it would be difficult to respond to unexpected problems like conflicts with existing libraries. Therefore, we chose a structure that extends without touching NestJS's existing environment configuration. Due to this approach, it's common to independently build and deploy frontend and backend, which creates constraints in HMR integration.

Currently, we're working to find an appropriate compromise between development convenience and management efficiency.

## Library Testing Issues

This library uses the Edge.js template engine, which is designed for use in ESM (ECMAScript Modules) environments. However, most NestJS projects run in CommonJS environments, creating difficulties in test environment configuration.

### Jest E2E Testing Limitations

Initially, we attempted E2E testing using Jest in the `tests/tmp` directory, but had to abandon it due to the following issues:

- **Module system conflicts**: Compatibility issues when loading Edge.js (an ESM library) in Jest's CommonJS environment
- **Complex configuration**: Complex setup required for Jest's ESM support and potential conflicts with other libraries
- **Unstable test environment**: Tests intermittently failing depending on module loading order or configuration

### Alternative: Manual Testing Environment

Due to these limitations, we currently test functionality manually by running actual NestJS applications in `tests/manual-test-app`:

```bash
# Run test app
cd tests/manual-test-app
npm install
npm run start:dev
```

---

**NestJS MVC Tools** is a small utility that helps you get started with traditional web development patterns in NestJS more easily.