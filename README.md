# NestJS MVC Tools

[View Korean version 👾](https://github.com/dev-goraebap/nestjs-mvc-tools/blob/HEAD/README_KO.md)

**NestJS MVC Tools** is a small utility that helps you get started with traditional web development patterns in NestJS more easily.
It began as a simple utility for easily using the Edge.js template engine in NestJS, but has evolved into its current form as various features needed for the View layer in the MVC pattern were added one by one.

It includes AdonisJS's [Edge.js](https://edgejs.dev/docs/introduction) template engine and an asset pipeline using [Vite](https://vite.dev/). When automatically configuring the frontend directory, you can select [Tailwindcss](https://tailwindcss.com/) and [Hotwired](https://hotwired.dev/) libraries as template options, allowing you to include only the libraries needed for your project requirements.

Hotwired is a library developed by the Ruby on Rails community and may be unfamiliar to many developers. However, if you want to implement a smooth user experience like SPAs while maintaining traditional server-side development approaches, it's worth considering. Note that the community has both positive and negative opinions about it, so the choice is ultimately yours.

Examples can be found in the project's [tests/manual-test-app](./tests/manual-test-app).

## Developer's Note

While I love NestJS's powerful DI system, sometimes I envy full-stack environments like AdonisJS, Laravel, and Ruby on Rails. I looked for libraries to configure the frontend in the NestJS ecosystem but couldn't find anything suitable, so I ended up creating this to my own taste.

This library is merely an assembly of excellent works created by other talented developers, packaged for NestJS. Since I'm not confident about maintaining it consistently, I hope someone with similar thoughts will release a better library. ~~(So I can use it comfortably)~~

## Key Features

### Edge.js Template Engine Modularization

Provides AdonisJS's Edge.js template engine in a modularized form for use in NestJS. Why use Edge.js specifically? It's simply easy and powerful... that's all!

### Automatic Frontend Directory Setup

Uses a built-in CLI to automatically generate and configure frontend resource folders, helping you quickly start projects and set up development environments.

### Vite-based Asset Pipeline

Leverages Vite to support frontend development servers and provides optimized assets for production environments through an asset pipeline.

### CSRF Protection

Provides session-based CSRF (Cross-Site Request Forgery) protection to safely guard applications from malicious requests. Supports various token delivery methods (headers, form data, query).

### Flash Messages

Provides session-based temporary message and data functionality to effectively communicate necessary information to users and improve UI/UX.

### MVC Exception Handling

Provides MVC (Model-View-Controller) based exception handling that integrates with the template engine. This feature enables:

- **404 Error Page Handling**: Converts NestJS's default 404 errors to template-based error pages when accessing non-existent pages
- **SSR Form Error Handling**: Automatically handles flash messages and input value retention when BadRequestException occurs
- **API/Page Route Separation**: Distinguishes between API routes (`/api`) and regular page routes to provide appropriate response formats (JSON/HTML)

### Modern Web Compatibility

Supports compatibility with modern web technologies like Hotwired/Turbo, providing SPA (Single Page Application)-like user experiences while maintaining the advantages of server-side rendering.

## Installation

```bash
npm install nestjs-mvc-tools
```

## Quick Start

We'll help you set up basic configuration for using MVC patterns in NestJS.

### 1. Project Initialization

```bash
# Set up MVC templates and resources (default: full - Hotwired + TailwindCSS)
npx nestjs-mvc-tools init

# Or select desired template
npx nestjs-mvc-tools init --template=minimal   # Vite only
npx nestjs-mvc-tools init --template=tailwind  # TailwindCSS only
npx nestjs-mvc-tools init --template=hotwired  # Hotwired only
npx nestjs-mvc-tools init --template=full      # Full (default)
```

Creates a resources directory in the project root and downloads necessary dependencies based on the selected template.

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

@layout.app({ title: 'Helloworld' })
<h1 data-controller="hello" class="text-3xl">{{ message ?? 'hello world' }}</h1>
@end
```

### 5. Run Project

```bash
# 1. Run vite development server
cd resources && npm run dev

# 2. Run nestjs server
npm run start:dev
```

You can configure it like this using the concurrently library:

```json
// package.json
"scripts": {
  "start:resource": "cd resources && npm run dev",
  "start:dev": "concurrently \"nest start --watch\" \"npm run start:resource\"",
}
```

Then run with just `npm run start:dev`

## CLI Commands

### `nestjs-mvc-tools init`

Creates MVC templates and resource structure in your project. You can select only the libraries you need through template options.

```bash
# Basic usage (full template - Hotwired + TailwindCSS)
nestjs-mvc-tools init

# Template selection
nestjs-mvc-tools init --template=minimal   # Vite only
nestjs-mvc-tools init --template=tailwind  # TailwindCSS only  
nestjs-mvc-tools init --template=hotwired  # Hotwired only
nestjs-mvc-tools init --template=full      # Full (default)

# Using short options
nestjs-mvc-tools init -t minimal
```

**Available Templates:**
- `minimal`: Basic configuration with Vite only
- `tailwind`: TailwindCSS + Vite configuration  
- `hotwired`: Hotwired (Turbo + Stimulus) + Vite configuration
- `full`: Complete configuration with TailwindCSS + Hotwired + Vite (default)

**Generated Structure:**

Different structures are generated based on the selected template.

```
resources/
├── package.json        # Template-specific dependencies
├── vite.config.js      # Vite configuration (template-specific plugins)
├── src/
│   ├── app.js         # Frontend entry (template-specific imports)
│   ├── style.css      # Styles (minimal, hotwired)
│   └── controllers/   # Stimulus controllers (hotwired, full only)
├── views/
│   ├── components/    # Reusable components
│   └── pages/         # Page templates
└── public/
    └── builds/        # Built assets
```

**Template Differences:**
- `minimal`: Basic CSS, Vite only
- `tailwind`: TailwindCSS import, Tailwind plugin included
- `hotwired`: Hotwired import, Stimulus controller folder included
- `full`: All features including TailwindCSS + Hotwired

## Configuration

### Basic Configuration

```typescript
// Default values provided when configuration is not included
NestMvcModule.forRoot({
  excludePaths: ["/api", "/favicon.ico"], // Paths to exclude from middleware processing
  debug: false, // Whether to output debug logs (default: false)
  view: {
    rootDir: join(process.cwd(), "resources", "views"),
    disks: [], // Additional template disk paths
    cache: false,
  },
  asset: {
    mode: "development",
    staticAssetPrefix: "/public",
    buildOutDir: join(process.cwd(), "resources", "public", "builds"),
    devServerUrl: "http://localhost:5173",
  },
  csrf: {
    enabled: true, // CSRF protection enabled (default)
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    saltLength: 8,
    secretLength: 18,
  },
});
```

## Important: Session Dependencies

**CSRF Protection** and **Flash Messages** functionality internally depend on sessions. While basic rendering functionality won't error without active sessions, warning messages will continuously appear and these features won't work properly.

Therefore, sessions must be activated to use these features reliably.

```bash
npm install express-session
npm install @types/express-session # If types are needed
```

**main.ts Configuration:**

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

### Enable CSRF Protection

```typescript
// app.module.ts
NestMvcModule.forRoot({
  csrf: {
    enabled: true, // Enable CSRF protection
    ignoredMethods: ["GET", "HEAD", "OPTIONS"], // HTTP methods to skip validation
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

1. **Form Data**: `_csrf` field
2. **Query Parameter**: `?_csrf=token`  
3. **HTTP Headers**: 
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

Flash messages provide one-time notifications to users. They're primarily used to display success/failure messages after form submissions or validation errors.

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
    // Set error message and retain input values
    req.flash.error('Failed to create user.').flashInput();
    return res.redirect('/users/new');
  }
}
```

### Flash Message Types

```typescript
// Success message
req.flash.success('Task completed successfully.');

// Error message
req.flash.error('An error occurred.');

// Info message
req.flash.info('This is informational.');

// Warning message  
req.flash.warning('Attention required.');

// Custom key
req.flash.flash('custom_key', 'Custom message');
```

### Retaining Form Input Values

You can retain user input data when validation fails:

```typescript
@Post('/users')
async createUser(@Req() req: NestMvcReq, @Res() res: Response) {
  if (!req.body.name) {
    // Retain input values along with error message
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

Throwing `BadRequestException` automatically handles flash messages and input value retention:

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

## ExceptionFilter Setup (Recommended)

To fully utilize MVC exception handling features, you should set up an ExceptionFilter. This setup enables 404 error page handling, automatic flash message processing for SSR form errors, and API/page route separation.

### Create ExceptionFilter Class

```typescript
// src/exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { NestMvcBaseExceptionHandler, NestMvcReq } from "nestjs-mvc-tools";

@Catch()
export class AppExceptionFilter extends NestMvcBaseExceptionHandler implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const req: NestMvcReq = host.switchToHttp().getRequest();
    const res: Response = host.switchToHttp().getResponse();

    this.logger.warn(exception.message);

    // All non-API routes use page-related exception handling
    if (!req.originalUrl.startsWith("/api")) {
      return this.handleMvcException(exception, req, res, this.logger);
    }

    // API exception handling (JSON response)
    if (exception instanceof HttpException) {
      return res.json({
        status: exception.getStatus(),
        message: exception.message,
      });
    } else {
      return res.json({
        status: 500,
        message: exception.message,
      });
    }
  }
}
```

### Register ExceptionFilter in Module

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { AppExceptionFilter } from "./exception.filter";

@Module({
  // ... other configurations
  providers: [
    { provide: APP_FILTER, useClass: AppExceptionFilter },
    // ... other providers
  ],
})
export class AppModule {}
```

### Key Features

- **Automatic Route Separation**: Routes starting with `/api` get JSON responses, others get HTML template responses
- **404 Error Handling**: Renders `views/pages/errors/index.edge` template when accessing non-existent pages
- **Flash Message Integration**: Automatically sets error messages as flash messages and retains input values when `BadRequestException` occurs
- **Logging**: Records all exceptions in logs

> **Developer Experience Improvement Planned**: Currently, you need to manually write and register the ExceptionFilter, but future versions will automate this process to provide a better developer experience.

## Path Exclusion Configuration

The view, csrf, flash, and other features provided by the library operate at the middleware level.
You can exclude specific paths from middleware processing:

```typescript
NestMvcModule.forRoot({
  excludePaths: ["/api", "/favicon.ico", "/health"], // Paths to exclude
  ...
});
```

By default, `/api` and `/favicon.ico` paths are excluded.

## Project Core Libraries and Key Considerations

This project allows you to select and install only the libraries you need through template options. You can selectively include @hotwired series and @tailwindcss libraries based on project requirements, with the default being the `full` template that includes both libraries.

### Vite HMR Support Issues

Currently, the project doesn't properly support Vite's HMR (Hot Module Replacement). This means code changes aren't immediately reflected on the website, and you need to manually refresh to see changes.

This occurs because Vite primarily handles static asset management while the Edge.js template engine runs on the NestJS server side. The frontend and backend environments are separated, making it difficult to fully utilize Vite's HMR functionality.

AdonisJS is designed around an ESM (ECMAScript Modules) environment where the frontend configuration works as tightly integrated as a single project. In contrast, NestJS has been widely used in CommonJS environments. While ESM configuration in NestJS isn't impossible, we decided it would be difficult to respond to unexpected issues like conflicts with existing libraries. Therefore, we chose a structure that extends NestJS's existing environment configuration without modifying it. Due to this approach, it's common to build and deploy frontend and backend independently, creating constraints in HMR integration.

We're currently working to find an appropriate compromise between development convenience and management efficiency.

## Library Testing Issues

This library uses the Edge.js template engine, which is designed for use in ESM (ECMAScript Modules) environments. However, most NestJS projects run in CommonJS environments, creating difficulties in test environment configuration.

### Jest E2E Testing Limitations

Initially, we attempted E2E testing using Jest in the `tests/tmp` directory, but abandoned it due to the following issues:

- **Module System Conflicts**: Compatibility issues when loading ESM library Edge.js in Jest's CommonJS environment
- **Complex Configuration**: Complex setup required for Jest's ESM support and potential conflicts with other libraries
- **Unstable Test Environment**: Tests failing intermittently depending on module loading order or configuration

### Alternative: Manual Test Environment

Due to these limitations, we currently test functionality manually by running an actual NestJS application in `tests/manual-test-app`:

```bash
# Run test app
cd tests/manual-test-app
npm install
npm run start:dev
```

---

**NestJS MVC Tools** is a small utility that helps you get started with traditional web development patterns in NestJS more easily.