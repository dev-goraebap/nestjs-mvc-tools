[View Korean version](./README_KO.md)

# NestJS MVC Tools

**NestJS MVC Tools** is a small toolkit to help you get started with traditional web development in NestJS more easily.

It combines the [Edge.js](https://edgejs.dev/docs/introduction) template engine from AdonisJS with [Hotwired](https://hotwired.dev/) from Ruby on Rails to build modern web applications. In addition, you can use front-end libraries like TailwindCSS through an asset pipeline using [Vite](https://vite.dev/).

A complete example can be found at [nestjs-mvc-is-coming](https://github.com/dev-goraebap/nestjs-mvc-is-coming).

## Developer's Note

I love NestJS's powerful DI system, but sometimes I envy full-stack environments like AdonisJS, Laravel, or Ruby on Rails. I couldn't find a suitable library for front-end configuration in the NestJS ecosystem, so I ended up creating one to my own taste.

This library is merely a package of works created by other great developers, assembled and adapted for NestJS. I'm not confident in my ability to maintain it continuously, so if someone with similar ideas exists, I hope they will release a better library. ~~(So I can use it comfortably)~~

## Main Features

### Edge.js Template Engine Modularization

It provides the Edge.js template engine from AdonisJS as a module for use in NestJS. This increases template sharing and reusability between the two frameworks.

### Automatic Front-end Directory Configuration

The built-in CLI helps you quickly start your project and set up the development environment by automatically creating and configuring the front-end resource folder.

### Vite-based Asset Pipeline

It utilizes Vite to support a front-end development server and provides optimized assets for the production environment through an asset pipeline.

### CSRF Protection

Provides basic token-based CSRF (Cross-Site Request Forgery) protection to enhance application security. (This feature may change in the future.)

### Flash Messages

Provides session-based temporary message and data functionality to effectively deliver necessary information to users and improve UI/UX.

### MVC Exception Handling

Provides an MVC (Model-View-Controller) based exception handling mechanism that integrates with the template engine, helping developers efficiently manage application errors and provide user-friendly error screens.

### Modern Web Compatibility

Supports compatibility with modern web technologies like Hotwired/Turbo, allowing for a user experience similar to a SPA (Single Page Application) while retaining the benefits of server-side rendering.

## Installation

```bash
npm install nestjs-mvc-tools
```

## Quick Start

This guide helps you with the basic setup for using the MVC pattern in NestJS.

### 1. Initialize Project

```bash
# Setup MVC templates and resources
npx nestjs-mvc-tools init
```

This creates a `resources` directory in your project root and downloads the necessary dependencies for the internal Vite development environment.

### 2. Configure Static Assets Path

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Add this line
  app.useStaticAssets(join(process.cwd(), "resources", "public"), {
    prefix: "/public",
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### 3. Register NestMvcCoreModule

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { NestMvcCoreModule } from "nestjs-mvc-tools";

@Module({
  imports: [NestMvcCoreModule.forRoot()],
})
export class AppModule {}
```

### 4. Create a Controller

```typescript
// app.controller.ts
import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { EdgeView, View } from "nestjs-mvc-tools";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@View() view: EdgeView) {
    const message = this.appService.getHello();
    return view.render("pages/hello_world/index", { message });
  }
}
```

#### Check the linked template

```html
// resources/views/pages/hello_world/index.edge
@layout('components/layout/app', { title: 'Helloworld' })
<h1 data-controller="hello" class="text-3xl">{{ message ?? 'hello world' }}</h1>
@end
```

### 5. Run the Project

```bash
# 1. Run the Vite development server
cd resources && npm run dev

# 2. Run the NestJS server
npm run start:dev
```

If you use the `concurrently` library, you can configure it as follows:

```json
// package.json
"scripts": {
  "start:resource": "cd resources && npm run dev",
  "start:dev": "concurrently "nest start --watch" "npm run start:resource"",
}
```

And run it with a single command: `npm run start:dev`

## CLI Commands

### `nestjs-mvc-tools init`

Creates a basic MVC template and resource structure in your project.

```bash
nestjs-mvc-tools init
```

**Generated Structure:**

```
resources/
├── package.json        # Vite development environment
├── vite.config.js      # Vite configuration
├── src/
│   ├── app.js         # Front-end entry point
│   └── tailwind.css   # Styles
├── views/
│   ├── components/    # Reusable components
│   └── pages/         # Page templates
└── public/
    └── builds/        # Built assets
```

## Configuration

### Default Configuration

```typescript
// Default values are provided if no configuration is included.
NestMvcCoreModule.forRoot({
  edgeTemplate: {
    rootDir: join(process.cwd(), "resources", "views"),
    disks: [],
    cache: false,
  },
  vite: {
    mode: "development",
    buildOutDir: join(process.cwd(), "resources", "public", "builds"),
    developServerUrl: "http://localhost:5173",
  },
  debug: false,
});
```

### Asynchronous Configuration

If you need to fetch configuration values from a service like `ConfigService` or require more detailed management, you can use an options factory to configure asynchronously.
The code below is an example of implementing `NestMvcCoreOptionsFactory` to provide asynchronous configuration to `NestMvcCoreModule`.

```typescript
@Injectable()
export class NestMvcConfig implements NestMvcCoreOptionsFactory {
  create(): NestMvcCoreOptions {
    return {
      rootDir: join(process.cwd(), "resources", "views"),
      disks: [],
      cache: false,
      vite: {
        mode: "development",
        buildOutDir: join(process.cwd(), "resources", "public", "builds"),
        developServerUrl: "http://localhost:5173",
      },
      debug: false,
    };
  }
}

NestMvcCoreModule.forRootAsync({
  useClass: NestMvcConfig,
});
```

## Optional Dependencies

### express-session (Recommended)

Basic template rendering works fine without session setup.
However, features like CSRF tokens and flash messages depend on `express-session`.
To use these features properly, installing `express-session` is recommended.

```bash
npm install express-session
```

**main.ts setup:**

```typescript
import * as session from "express-session";

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000 }, // 24 hours
  })
);
```

## Project Defaults and Key Considerations

This project's front-end environment installs the @hotwired series and @tailwindcss libraries by default. These two libraries are not mandatory, so you can remove them if you wish. However, using Hotwired is highly recommended as it is very useful in this project.

### Resolving Issues with Multer and CSRF Handling

There is currently a difficult issue to resolve between the Multer library and CSRF (Cross-Site Request Forgery) handling.

Problem: When using a multipart form for file uploads with a file upload interceptor in the controller, the globally executed `CsrfGuard` fails to receive the `_csrft` value from the request body. A temporary workaround is to use a query string for the `_csrft` value, but this is not recommended.

Solution: Using `@hotwired/turbo` can solve this problem cleanly. Set the CSRF token value in an HTML meta tag as follows:

```html
// resources/views/components/layouts/app.edge

<meta name="csrf-token" content="{{ csrfToken }}" />
```

With this setup, Turbo automatically sets this value in the `X-CSRF-Token` request header. As a result, CSRF protection works correctly regardless of the Multer library, and the default `CsrfGuard` provided by this library is designed with this functionality in mind.

### Vite HMR Support Issues

Currently, Vite's HMR (Hot Module Replacement) is not fully supported in this project. This means that code changes are not immediately reflected on the website, and you must manually refresh to see the changes.

This occurs because Vite primarily manages static assets, while the Edge.js template engine runs on the NestJS server side. In other words, the front-end and back-end environments are separate, making it difficult to fully utilize Vite's HMR capabilities.

AdonisJS is designed based on an ESM (ECMAScript Modules) environment, where the front-end configuration works closely together like a single project. In contrast, NestJS has been widely used in a CommonJS environment. While it's not impossible to set up ESM in NestJS, I decided it would be difficult to handle unexpected issues like conflicts with existing libraries. Therefore, I chose a structure that extends the existing NestJS environment without altering it. This approach typically involves building and deploying the front-end and back-end independently, which creates limitations for HMR integration.

Currently, we are striving to find a suitable compromise between development convenience and management efficiency.

## 🌟 Example Project

A complete example can be found at [nestjs-mvc-is-coming](https://github.com/dev-goraebap/nestjs-mvc-is-coming).

## 📝 License

ISC License
