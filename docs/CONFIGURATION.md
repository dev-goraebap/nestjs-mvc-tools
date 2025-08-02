# Configuration and Features Guide

## Basic Configuration

```typescript
// Default values provided when configuration is not included
NestMvcModule.forRoot({
  excludePaths: ["/api", "/favicon.ico"], // Paths to exclude from middleware processing
  debug: false, // Whether to output debug logs (default: false)
  view: {
    rootDir: join(process.cwd(), "resources", "views"),
    disks: [], // Additional template disk paths
    cache: false,
    helpers: [], // Custom view helper functions executed per request
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

> **Note**: The `asset.staticAssetPrefix` value must match the `prefix` value in the `useStaticAssets` configuration in `main.ts`.
> 
> ```typescript
> // These two settings must match
> app.useStaticAssets(join(process.cwd(), "resources", "public"), {
>   prefix: "/public", // ← This value and
> });
> 
> NestMvcModule.forRoot({
>   asset: {
>     staticAssetPrefix: "/public", // ← This value must be the same
>   },
> });
> ```
> 
> If you want to change the path, modify both locations identically:
> ```typescript
> // Example: Change to /assets path
> app.useStaticAssets(join(process.cwd(), "resources", "public"), {
>   prefix: "/assets",
> });
> 
> NestMvcModule.forRoot({
>   asset: {
>     staticAssetPrefix: "/assets",
>   },
> });
> ```

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

## Custom View Helpers

Custom view helpers allow you to add request-specific functionality to your templates. Unlike global helpers, these are executed for each HTTP request, giving you access to request data like URL parameters, headers, user information, and more.

### Creating Custom Helpers

Create helper functions using the `ViewHelperFactory` type:

```typescript
// src/view.helpers.ts
import { Request } from 'express';
import { ViewHelperFactory } from 'nestjs-mvc-tools';

/**
 * Helper to check if current route matches a given path
 * Usage in template: {{ isCurrentRoute('/home') }}
 */
export const isCurrentRouteHelper: ViewHelperFactory = (req: Request) => {
  return {
    key: 'isCurrentRoute',
    fn: (routePath: string) => {
      return req.originalUrl === routePath || req.path === routePath;
    }
  };
};
```

### Registering Helpers

Register your helpers in the module configuration:

```typescript
// app.module.ts
import { isCurrentRouteHelper } from './view.helpers';

@Module({
  imports: [
    NestMvcModule.forRoot({
      view: {
        helpers: [
          isCurrentRouteHelper
        ]
      },
      // ... other configurations
    }),
  ],
})
export class AppModule {}
```

### Using Helpers in Templates

Once registered, helpers are available in all templates:

```html
<!-- Navigation with active state -->
<nav>
  <a href="/" class="{{ isCurrentRoute('/') ? 'active' : '' }}">Home</a>
  <a href="/about" class="{{ isCurrentRoute('/about') ? 'active' : '' }}">About</a>
</nav>
```

### Performance Considerations

- Helpers are executed on every request to routes that render templates
- Keep helper logic lightweight for better performance
- Consider caching expensive operations within helper functions
- Use conditional helper registration if you have many helpers but only need some on specific routes

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