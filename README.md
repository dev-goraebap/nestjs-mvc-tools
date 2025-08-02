# NestJS MVC Tools

[View Korean version 👾](https://github.com/dev-goraebap/nestjs-mvc-tools/blob/HEAD/README_KO.md)

**NestJS MVC Tools** is a small utility that helps you get started with traditional web development patterns in NestJS more easily.
It began as a simple utility for easily using the Edge.js template engine in NestJS, but has evolved into its current form as various features needed for the View layer in the MVC pattern were added one by one.

It includes AdonisJS's [Edge.js](https://edgejs.dev/docs/introduction) template engine and an asset pipeline using [Vite](https://vite.dev/). When automatically configuring the frontend directory, you can select [Tailwindcss](https://tailwindcss.com/) and [Hotwired](https://hotwired.dev/) libraries as template options, allowing you to include only the libraries needed for your project requirements.

Examples can be found in the project's [tests/manual-test-app](./tests/manual-test-app).

## Developer's Note

The development approach of separating frontend and backend has become mainstream, but there are often cases where the trade-offs regarding project scale and workforce are not sufficiently considered. I have had such experiences myself, which is why I tried to find answers in traditional fullstack development approaches.

However, even when using fancy template engines or lightweight JavaScript libraries (such as Alpine.js), if you don't fundamentally change your mindset, you'll eventually face the same problems. When dynamic features that cannot be solved by server rendering alone (such as review registration, asynchronous data processing, etc.) are needed, creating and manipulating the DOM with JavaScript becomes unavoidable.

At this point, you start missing frontend libraries like React or Vue again. However, including these libraries in a monolithic structure while keeping it lightweight can actually become a bigger burden. The desire to start light eventually makes you want to separate the project again.

Managing Server-Side Rendering (SSR) and Client-Side Rendering (CSR) together is not an easy task. The Laravel community created [Inertia.js](https://inertiajs.com/) to solve these problems. The fact that most current client-side frameworks are focusing on hydration technology to resolve the boundaries between SSR and CSR is in the same context.

Nevertheless, if you prefer the traditional template engine approach, a slightly different approach might help.

[Hotwired](https://hotwired.dev/), created by the Ruby on Rails community, can help solve this dilemma. Using the [HTMX](https://htmx.org/) library is also a good alternative. While these two libraries aim for different purposes, the core concept of returning HTML from the server is the same.

Regarding the HTML-first mindset, both positive and negative opinions coexist in the community, so the choice is yours. Considering this, my library also optionally provides Hotwired options, and adding HTMX to the default options is entirely possible.

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

## Installation

```bash
npm install nestjs-mvc-tools
```

## Quick Start

We'll help you set up basic configuration for using MVC patterns in NestJS.

### 1. Project Initialization

```bash
# Set up MVC templates and resources (default: minimal - Vite only)
npx nestjs-mvc-tools init

# Or select desired template
npx nestjs-mvc-tools init --template=minimal           # Vite only (default)
npx nestjs-mvc-tools init --template=tailwind          # TailwindCSS only
npx nestjs-mvc-tools init --template=hotwired          # Hotwired only
npx nestjs-mvc-tools init --template=hotwired-tailwind # Hotwired + TailwindCSS
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
  // Static asset serving configuration
  app.useStaticAssets(join(process.cwd(), "resources", "public"), {
    prefix: "/public",
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

This configuration serves the following purposes:
- **Production Built Vite Assets**: Serves CSS, JavaScript files and other built assets via `/public` path
- **Other Static Assets**: Makes images, fonts, favicon and other static files accessible on the web
- **Development Environment Compatibility**: Ensures consistent asset access paths across development/production environments

### 3. NestMvcModule Registration

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { NestMvcModule } from "nestjs-mvc-tools";

@Module({
  imports: [
    NestMvcModule.forRoot(),
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

You can configure it like this using the [concurrently](https://www.npmjs.com/package/concurrently) library:

```json
// package.json
"scripts": {
  "start:resource": "cd resources && npm run dev",
  "start:dev": "concurrently \"nest start --watch\" \"npm run start:resource\"",
}
```

Then run with just `npm run start:dev`

### 6. Production Build

For production deployment, you need to build both the NestJS application and the frontend assets in the resources directory.

```json
// package.json
"scripts": {
  "build": "nest build && cd resources && npm run build"
}
```

```bash
# Run production build
npm run build
```

> **Important**: Building only NestJS won't build frontend assets. You must also run the Vite build in the `resources` directory to properly serve static assets.

## Detailed Documentation

- **[CLI Commands Guide](./docs/CLI.md)** - Template options and CLI usage
- **[Configuration and Features Guide](./docs/CONFIGURATION.md)** - CSRF, flash messages, custom helpers, and more
- **[Troubleshooting Guide](./docs/TROUBLESHOOTING.md)** - Known issues and solutions

---

**NestJS MVC Tools** is a small utility that helps you get started with traditional web development patterns in NestJS more easily.