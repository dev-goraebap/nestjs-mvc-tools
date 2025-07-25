# NestJS MVC Tools

[View Korean version 👾](https://github.com/dev-goraebap/nestjs-mvc-tools/blob/HEAD/README_KO.md)

**NestJS MVC Tools** is a small utility that helps you get started with traditional web development approaches in NestJS more comfortably.

By combining AdonisJS's [Edge.js](https://edgejs.dev/docs/introduction) template engine with Ruby on Rails' [Hotwired](https://hotwired.dev/), you can build modern web applications. Additionally, you can use frontend libraries like TailwindCSS through an asset pipeline powered by [Vite](https://vite.dev/).

Examples can be found in the project's [tests/manual-test-app](./tests/manual-test-app).

## Developer's Note

I love NestJS's powerful DI system, but sometimes I envy full-stack environments like AdonisJS, Laravel, and Ruby on Rails. I looked for libraries in the NestJS ecosystem for frontend configuration but couldn't find anything suitable, so I ended up creating one to my taste.

This library is merely a packaging of excellent works created by other great developers, assembled to fit NestJS. Since I don't have the confidence to maintain it consistently over time, if there's anyone with similar thoughts, I hope you'll release a better library. ~~(So I can use it comfortably)~~

## Key Features

### Edge.js Template Engine Modularization

AdonisJS's Edge.js template engine is modularized and provided for use in NestJS. Why use Edge.js? It's just easy and powerful... that's all!

### Automatic Frontend Directory Configuration

Through the built-in CLI, frontend resource folders are automatically created and configured, helping you quickly start projects and set up development environments.

### Vite-based Asset Pipeline Construction

Supports frontend development servers using Vite and provides optimized assets in production environments through asset pipelines.

### CSRF Protection

Provides session-based CSRF (Cross-Site Request Forgery) protection to safely protect applications from malicious requests. Supports various token delivery methods (headers, form data, query).

### Flash Messages

Provides session-based temporary message and data functionality to effectively deliver necessary information to users and improve UI/UX.

### MVC Exception Handling

Provides simple exception handling abstract classes based on MVC (Model-View-Controller) that integrate with template engines, allowing developers to handle application errors according to situations.

### Modern Web Compatibility

Supports compatibility with modern web technologies like Hotwired/Turbo, providing SPA (Single Page Application)-like user experiences while maintaining the advantages of server-side rendering.

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

Creates a resources directory in the project root path and downloads necessary dependencies for the internal vite development environment.

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
        disks: [], // If additional disk paths are needed
      },
      csrf: {
        enabled: true, // Enable CSRF protection
      },
    }),
  ],
})
export class AppModule {}
```

### 4. Controller Creation

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

### 5. Project Execution

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
  excludePaths: ["/api", "/favicon.ico"], // Paths excluded from middleware processing
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

### Asynchronous Configuration

If you need to fetch configuration values like configService or require more detailed management, you can configure asynchronous settings using option factories.
The code below is an example of implementing NestMvcOptionsFactory to provide asynchronous configuration to NestMvcModule.

```typescript
@Injectable()
export class NestMvcConfig implements NestMvcOptionsFactory {
  create(): NestMvcOptions {
    return {
      excludePaths: ["/api", "/favicon.ico"],
      view: {
        rootDir: join(process.cwd(), "resources", "views"),
        disks: [],
        cache: true,
      },
      asset: {
        mode: "development",
        staticAssetPrefix: "/public",
        buildOutDir: join(process.cwd(), "resources", "public", "builds"),
        devServerUrl: "http://localhost:5173",
      },
      csrf: {
        enabled: true, // Recommended to enable in production
        ignoredMethods: ["GET", "HEAD", "OPTIONS"],
        saltLength: 8,
        secretLength: 18,
      },
    };
  }
}

NestMvcModule.forRootAsync({
  useClass: NestMvcConfig,
});
```

## Important: Session Dependencies

**CSRF protection** and **flash message** functionality internally depend on sessions. Even if sessions are not activated, basic rendering functionality will not cause errors, but warning messages will continuously occur and these features will not work properly.

Therefore, sessions must be activated to use these features stably.

```bash
npm install express-session
npm install @types/express-session # If types are needed
```

**main.ts Configuration:**

```typescript
import * as session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Session middleware configuration (required for CSRF and flash messages)
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

CSRF (Cross-Site Request Forgery) protection prevents attacks where malicious websites send authenticated requests through the user's browser.

### Enable CSRF Protection

```typescript
// app.module.ts
NestMvcModule.forRoot({
  csrf: {
    enabled: true, // Enable CSRF protection
    ignoredMethods: ["GET", "HEAD", "OPTIONS"], // HTTP methods not to validate
    saltLength: 8, // Salt length for token generation
    secretLength: 18, // Secret length for token generation
  },
});
```

### Using CSRF Token in Templates

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

When using Hotwired/Turbo, setting meta tags automatically includes CSRF tokens in AJAX requests:

```html
<head>
  <meta name="csrf-token" content="{{ csrfToken }}" />
</head>
```

## Flash Messages

Flash messages provide one-time notifications to users. They are mainly used to display success/failure messages after form submission or validation errors.

### Basic Usage

```typescript
@Post('/users')
async createUser(@Req() req: NestMvcReq, @Res() res: Response) {
  try {
    // User creation logic
    await this.userService.create(req.body);
    
    // Set success message
    req.flash.success('User created successfully.');
    re