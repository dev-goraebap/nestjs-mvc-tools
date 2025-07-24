[View Korean version](./README_KO.md)

# NestJS MVC Tools

**NestJS MVC Tools** is a small toolkit to help you get started with traditional web development in NestJS more easily.

It combines the [Edge.js](https://edgejs.dev/docs/introduction) template engine from AdonisJS with [Hotwired](https://hotwired.dev/) from Ruby on Rails to build modern web applications. In addition, you can use front-end libraries like TailwindCSS through an asset pipeline using [Vite](https://vite.dev/).

Examples can be found in the project's [tests/manual-test-app](./tests/manual-test-app).

## Developer's Note

I love NestJS's powerful DI system, but sometimes I envy full-stack environments like AdonisJS, Laravel, or Ruby on Rails. I couldn't find a suitable library for front-end configuration in the NestJS ecosystem, so I ended up creating one to my own taste.

This library is merely a package of works created by other great developers, assembled and adapted for NestJS. I'm not confident in my ability to maintain it continuously, so if someone with similar ideas exists, I hope they will release a better library. ~~(So I can use it comfortably)~~

## Main Features

### Edge.js Template Engine Modularization

Provides the Edge.js template engine from AdonisJS as a module for use in NestJS. This increases template sharing and reusability between the two frameworks.

### Automatic Front-end Directory Configuration

The built-in CLI helps you quickly start your project and set up the development environment by automatically creating and configuring the front-end resource folder.

### Vite-based Asset Pipeline

Utilizes Vite to support a front-end development server and provides optimized assets for the production environment through an asset pipeline.

### Flash Messages

Provides session-based temporary message and data functionality to effectively deliver necessary information to users and improve UI/UX.

### MVC Exception Handling

Provides a simple MVC (Model-View-Controller) based exception handling abstract class that integrates with the template engine, allowing developers to handle application errors based on different situations.

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

### 3. Register NestMvcModule

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
        disks: [], // Add additional disk paths if needed
        cache: true,
      },
    }),
  ],
})
export class AppModule {}
```

### 4. Create a Controller

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

#### Check the linked template

```html
// resources/views/pages/hello_world/index.edge @layout.app({ title:
'Helloworld'})
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
  "start:dev": "concurrently \"nest start --watch\" \"npm run start:resource\"",
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
// Default values are provided if no configuration is included
NestMvcModule.forRoot({
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
});
```

### Asynchronous Configuration

If you need to fetch configuration values from a service like `ConfigService` or require more detailed management, you can use an options factory to configure asynchronously.
The code below is an example of implementing `NestMvcOptionsFactory` to provide asynchronous configuration to `NestMvcModule`.

```typescript
@Injectable()
export class NestMvcConfig implements NestMvcOptionsFactory {
  create(): NestMvcOptions {
    return {
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
    };
  }
}

NestMvcModule.forRootAsync({
  useClass: NestMvcConfig,
});
```

## Flash Messages

This library provides a way to display **one-time messages (flash messages)** to users in your web application. Flash messages are primarily useful for giving users feedback after a form submission, such as success or failure notifications, or validation errors.

### Using @Req Decorator with NestMvcReq Object Type

NestMvcReq is an extended request object that adds view and flash properties to the existing Request object. This allows you to use flash functionality via req.flash.

```ts
@Post()
async create(@Req() req: NestMvcReq, @Res() res: Response) {
  if (!req.body) {
    // MVC Exception Handling: Displays a "Task failed" message while preserving the data entered in the form on the screen.
    throw new BadRequestException('Task failed');
  }
  // Sets a success message.
  req.flash.success('Task successful');
  return res.redirect('/admin/documents');
}
```

### Exception Handling and Flash Message Usage

Projects can implement MVC exception handling by extending `NestMvcBaseExceptionHandler`:

```ts
// exception.filter.ts
import { Catch, ExceptionFilter, HttpException, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { NestMvcBaseExceptionHandler, NestMvcReq } from 'nestjs-mvc-tools';

@Catch(HttpException)
export class AppExceptionFilter extends NestMvcBaseExceptionHandler implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const req: NestMvcReq = host.switchToHttp().getRequest();
    const res: Response = host.switchToHttp().getResponse();

    // Return JSON response for API requests
    if (req.url.startsWith('/api')) {
      return res.json({
        status: exception.getStatus(),
        message: exception.message,
      });
    }

    // MVC page exception handling
    return this.handleMvcException(exception, req, res);
  }
}
```

### Important: Session Dependency

Flash messages internally depend on sessions. While rendering functionality itself won't throw an error if a session isn't active, you'll continuously receive warning messages. Therefore, to use flash message features reliably, sessions must be enabled. We recommend installing express-session to utilize these features.

```bash
npm install express-session
```

**main.ts setup:**

```typescript
import * as session from "express-session";

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key"
  })
);
```

## Project Defaults and Key Considerations

This project's front-end environment installs the @hotwired series and @tailwindcss libraries by default. These two libraries are not mandatory, so you can remove them if you wish. However, using Hotwired is highly recommended as it has high utility in this project.

### Vite HMR Support Issues

Currently, Vite's HMR (Hot Module Replacement) is not fully supported in this project. This means that code changes are not immediately reflected on the website, and you must manually refresh to see the changes.

This occurs because Vite primarily manages static assets, while the Edge.js template engine runs on the NestJS server side. In other words, the front-end and back-end environments are separate, making it difficult to fully utilize Vite's HMR capabilities.

AdonisJS is designed based on an ESM (ECMAScript Modules) environment, where the front-end configuration works closely together like a single project. In contrast, NestJS has been widely used in a CommonJS environment. While it's not impossible to set up ESM in NestJS, I judged it would be difficult to handle unexpected issues like conflicts with existing libraries when they occur. Therefore, I chose a structure that extends the existing NestJS environment configuration without altering it. This approach typically involves building and deploying the front-end and back-end independently, which creates limitations for HMR integration.

Currently, we are striving to find a suitable compromise between development convenience and management efficiency.

## Library Testing Issues

This library uses the Edge.js template engine, which is designed to work in an ESM (ECMAScript Modules) environment. However, most NestJS projects run in a CommonJS environment, which creates difficulties in configuring the test environment.

### Jest E2E Testing Limitations

Initially, we attempted E2E testing using Jest in the `tests/tmp` directory, but abandoned it due to the following issues:

- **Module System Conflicts**: Compatibility issues when loading Edge.js, an ESM library, in Jest's CommonJS environment
- **Complex Configuration**: Complex setup required for Jest's ESM support and potential conflicts with other libraries
- **Unstable Test Environment**: Intermittent test failures depending on module loading order or configuration

### Alternative: Manual Testing Environment

Due to these limitations, we currently test functionality manually by running an actual NestJS application in `tests/manual-test-app`:

```bash
# Run test app
cd tests/manual-test-app
npm install
npm run start:dev
```

**Testable Features:**
- Edge.js template rendering: `http://localhost:3000/base-test/01`
- Data passing and rendering: `http://localhost:3000/base-test/02`
- Layout and components: `http://localhost:3000/base-test/03-04`
- Vite asset pipeline: `http://localhost:3000/base-test/05`
- Flash message testing: `http://localhost:3000/edgejs-template-state-test/01-02`
- Exception handling testing: `http://localhost:3000/page-exception-test/01-03`

While this approach is more cumbersome compared to automated testing, it has the advantage of verifying the library's behavior under the same conditions as the actual production environment.

---

**NestJS MVC Tools** is a small toolkit to help you get started with traditional web development in NestJS more easily.