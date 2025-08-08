# 설정 및 기능 가이드

## 기본 설정

```typescript
// 설정을 포함하지 않으면 기본으로 제공하는 값
NestMvcModule.forRoot({
  excludePaths: ["/api", "/favicon.ico"], // 미들웨어 처리 제외 경로
  debug: false, // 디버그 로그 출력 여부 (기본값: false)
  view: {
    rootDir: join(process.cwd(), "resources", "views"),
    disks: [], // 추가 템플릿 디스크 경로
    cache: false,
    helpers: {}, // 요청별로 실행되는 커스텀 뷰 헬퍼 함수들 (객체 형식)
    globals: {}, // 모든 템플릿에서 사용 가능한 글로벌 변수/함수
    globalsFactory: undefined, // DI를 통해 글로벌을 생성하는 팩토리 함수
    globalsInjects: [], // globalsFactory에 주입할 서비스 배열
  },
  asset: {
    mode: "development",
    staticAssetPrefix: "/public",
    buildOutDir: join(process.cwd(), "resources", "public", "builds"),
    devServerUrl: "http://localhost:5173",
  },
  csrf: {
    enabled: true, // CSRF 보호 활성화 (기본값)
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    saltLength: 8,
    secretLength: 18,
  },
});
```

> **주의**: `asset.staticAssetPrefix` 값은 반드시 `main.ts`의 `useStaticAssets` 설정의 `prefix` 값과 일치해야 합니다.
> 
> ```typescript
> // 두 설정이 일치해야 함
> app.useStaticAssets(join(process.cwd(), "resources", "public"), {
>   prefix: "/public", // ← 이 값과
> });
> 
> NestMvcModule.forRoot({
>   asset: {
>     staticAssetPrefix: "/public", // ← 이 값이 같아야 함
>   },
> });
> ```
> 
> 만약 경로를 변경하려면 두 곳 모두 동일하게 변경해주세요:
> ```typescript
> // 예: /assets 경로로 변경
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

## 중요: 세션 의존성

**CSRF 보호**와 **플래시 메시지** 기능은 내부적으로 세션(session)에 의존합니다. 세션이 활성화되어 있지 않아도 기본적인 렌더링 기능에는 오류가 발생하지 않지만, 지속적으로 경고 메시지가 발생하며 해당 기능들이 정상적으로 작동하지 않습니다. 

따라서 이러한 기능들을 안정적으로 사용하려면 반드시 세션이 활성화되어 있어야 합니다.

```bash
npm install express-session
npm install @types/express-session # 타입이 필요한 경우
```

**main.ts 설정:**

```typescript
import * as session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // 세션 미들웨어 설정 (CSRF 및 플래시 메시지 사용을 위해 필수)
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24시간
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
        sameSite: 'lax'
      }
    })
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
```

## CSRF 보호

CSRF(Cross-Site Request Forgery) 보호 기능은 악의적인 웹사이트가 사용자의 브라우저를 통해 인증된 요청을 보내는 공격을 방지합니다.

### CSRF 보호 활성화

```typescript
// app.module.ts
NestMvcModule.forRoot({
  csrf: {
    enabled: true, // CSRF 보호 활성화
    ignoredMethods: ["GET", "HEAD", "OPTIONS"], // 검증하지 않을 HTTP 메서드
    saltLength: 8, // 토큰 생성용 솔트 길이
    secretLength: 18, // 토큰 생성용 시크릿 길이
  },
});
```

### 템플릿에서 CSRF 토큰 사용

모든 뷰 템플릿에서 `csrfToken` 변수를 사용할 수 있습니다:

```html
<!-- 폼에 hidden 필드로 토큰 추가 -->
<form method="POST" action="/users">
  <input type="hidden" name="_csrf" value="{{ csrfToken }}" />
  <input type="text" name="name" />
  <button type="submit">Submit</button>
</form>

<!-- Hotwired/Turbo와 함께 사용 (meta 태그) -->
<meta name="csrf-token" content="{{ csrfToken }}" />
```

### 토큰 전달 방식

CSRF 토큰은 다음과 같은 방식으로 전달할 수 있습니다:

1. **폼 데이터**: `_csrf` 필드
2. **쿼리 파라미터**: `?_csrf=token`
3. **HTTP 헤더**:  `x-csrf-token`

### Hotwired/Turbo와의 통합

Hotwired/Turbo를 사용하는 경우, meta 태그를 설정하면 자동으로 AJAX 요청에 CSRF 토큰이 포함됩니다:

```html
<head>
  <meta name="csrf-token" content="{{ csrfToken }}" />
</head>
```

## 플래시 메시지

플래시 메시지는 사용자에게 일회성 알림을 제공하는 기능입니다. 주로 폼 제출 후 성공/실패 메시지나 유효성 검사 오류를 표시할 때 사용됩니다.

### 기본 사용법

```typescript
@Post('/users')
async createUser(@Req() req: NestMvcReq, @Res() res: Response) {
  try {
    // 사용자 생성 로직
    await this.userService.create(req.body);
    
    // 성공 메시지 설정
    req.flash.success('사용자가 성공적으로 생성되었습니다.');
    return res.redirect('/users');
  } catch (error) {
    // 에러 메시지 설정 및 입력값 유지
    req.flash.error('사용자 생성에 실패했습니다.').flashInput();
    return res.redirect('/users/new');
  }
}
```

### 플래시 메시지 타입

```typescript
// 성공 메시지
req.flash.success('작업이 완료되었습니다.');

// 에러 메시지
req.flash.error('오류가 발생했습니다.');

// 정보 메시지
req.flash.info('참고 사항입니다.');

// 경고 메시지  
req.flash.warning('주의가 필요합니다.');

// 사용자 정의 키
req.flash.flash('custom_key', '사용자 정의 메시지');
```

### 폼 입력값 유지

유효성 검사 실패 시 사용자가 입력한 데이터를 유지할 수 있습니다:

```typescript
@Post('/users')
async createUser(@Req() req: NestMvcReq, @Res() res: Response) {
  if (!req.body.name) {
    // 에러 메시지와 함께 입력값 유지
    req.flash.error('이름을 입력해주세요.').flashInput();
    return res.redirect('/users/new');
  }
  
  // 성공 처리...
}
```

### 템플릿에서 플래시 메시지 표시

```html
<!-- 성공 메시지 -->
@if(flash.success)
<div class="alert alert-success">
  {{ flash.success }}
</div>
@end

<!-- 에러 메시지 -->
@if(flash.error)
<div class="alert alert-error">
  {{ flash.error }}
</div>
@end

<!-- 이전 입력값 복원 -->
<input 
  type="text" 
  name="name" 
  value="{{ flash.input.name || '' }}" 
/>
```

### MVC 예외 처리와의 통합

`BadRequestException`을 발생시키면 자동으로 플래시 메시지와 입력값 유지가 처리됩니다:

```typescript
@Post('/users')
async createUser(@Body() createUserDto: CreateUserDto) {
  if (!createUserDto.name) {
    // 자동으로 플래시 메시지 처리됨
    throw new BadRequestException('이름을 입력해주세요.');
  }
  
  // 성공 처리...
}
```

## ExceptionFilter 설정 (권장)

MVC 예외 처리 기능을 완전히 활용하려면 ExceptionFilter를 설정해야 합니다. 이 설정을 통해 404 에러 페이지 처리, SSR 양식 오류의 플래시 메시지 자동 처리, API와 페이지의 분기 처리가 가능합니다.

### ExceptionFilter 클래스 작성

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

    // API가 아닌 모든 경로는 페이지 관련 예외 처리
    if (!req.originalUrl.startsWith("/api")) {
      return this.handleMvcException(exception, req, res, this.logger);
    }

    // API 예외 처리 (JSON 응답)
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

### 모듈에 ExceptionFilter 등록

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { AppExceptionFilter } from "./exception.filter";

@Module({
  // ... 다른 설정들
  providers: [
    { provide: APP_FILTER, useClass: AppExceptionFilter },
    // ... 다른 프로바이더들
  ],
})
export class AppModule {}
```

### 주요 기능

- **자동 분기 처리**: `/api`로 시작하는 경로는 JSON 응답, 그 외는 HTML 템플릿 응답
- **404 에러 처리**: 존재하지 않는 페이지 접근 시 `views/pages/errors/index.edge` 템플릿 렌더링
- **플래시 메시지 연동**: `BadRequestException` 발생 시 자동으로 에러 메시지를 플래시로 설정하고 입력값 유지
- **로깅**: 모든 예외를 로그로 기록

> **개발자 경험 개선 예정**: 현재는 수동으로 ExceptionFilter를 작성하고 등록해야 하지만, 향후 버전에서는 이 과정을 자동화하여 더 나은 개발자 경험을 제공할 예정입니다.

## 글로벌 변수 및 함수

### 정적 글로벌 설정

모든 템플릿에서 사용할 수 있는 정적 변수나 함수를 설정할 수 있습니다:

```typescript
NestMvcModule.forRoot({
  view: {
    globals: {
      // 상수 값들
      APP_NAME: 'My Application',
      VERSION: '1.0.0',
      
      // 유틸리티 함수들
      formatDate: (date: Date) => {
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit'
        }).replace(/\./g, '/').replace(/ /g, '').replace(/\/$/, '');
      },
      
      formatCurrency: (amount: number) => {
        return `₩${amount.toLocaleString()}`;
      },
      
      // 객체 형태
      config: {
        maxUploadSize: 10 * 1024 * 1024,
        supportEmail: 'support@example.com'
      }
    }
  }
});
```

### DI 기반 글로벌 팩토리

서비스 의존성이 필요한 글로벌 변수나 함수는 `globalsFactory`와 `globalsInjects`를 사용합니다:

```typescript
import { ConfigService } from '@nestjs/config';

NestMvcModule.forRoot({
  view: {
    globalsInjects: [ConfigService], // 주입받을 서비스들
    globalsFactory: (configService: ConfigService) => {
      return {
        // 환경 변수 기반 설정
        API_URL: configService.get('API_URL'),
        IS_PRODUCTION: configService.get('NODE_ENV') === 'production',
        
        // 서비스를 활용한 함수
        getImageUrl: (imagePath: string) => {
          const cdnUrl = configService.get('CDN_URL');
          return `${cdnUrl}/${imagePath}`;
        },
        
        // 조건부 설정
        features: {
          darkMode: configService.get('FEATURE_DARK_MODE', 'false') === 'true',
          premium: configService.get('FEATURE_PREMIUM', 'false') === 'true'
        }
      };
    }
  }
});
```

### 여러 서비스 주입

여러 서비스를 동시에 주입받을 수 있습니다:

```typescript
import { ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';
import { CacheService } from './cache/cache.service';

NestMvcModule.forRoot({
  view: {
    globalsInjects: [ConfigService, UserService, CacheService],
    globalsFactory: (configService: ConfigService, userService: UserService, cacheService: CacheService) => {
      return {
        siteName: configService.get('SITE_NAME'),
        totalUsers: () => userService.getTotalCount(),
        cacheStats: () => cacheService.getStats(),
        
        // 복합적인 로직
        getUserGreeting: (userId: string) => {
          const user = userService.findById(userId);
          const timeOfDay = new Date().getHours() < 12 ? '오전' : '오후';
          return `${timeOfDay} 좋은 시간입니다, ${user?.name}님!`;
        }
      };
    }
  }
});
```

### 템플릿에서 글로벌 사용

```html
<!-- 정적 글로벌 사용 -->
<h1>{{ APP_NAME }} v{{ VERSION }}</h1>
<p>오늘: {{ formatDate(new Date()) }}</p>
<p>가격: {{ formatCurrency(29900) }}</p>
<p>지원 이메일: {{ config.supportEmail }}</p>

<!-- 팩토리 글로벌 사용 -->
<p>API 서버: {{ API_URL }}</p>
<img src="{{ getImageUrl('profile/avatar.jpg') }}" />

@if(IS_PRODUCTION)
  <p>프로덕션 환경</p>
@else  
  <p>개발 환경</p>
@endif

@if(features.darkMode)
  <button id="theme-toggle">다크 모드 전환</button>
@endif

<p>전체 사용자: {{ totalUsers() }}명</p>
```

## 커스텀 뷰 헬퍼 (요청별)

커스텀 뷰 헬퍼를 사용하면 템플릿에 요청별 기능을 추가할 수 있습니다. 글로벌 변수와 달리, 이 헬퍼들은 각 HTTP 요청마다 실행되어 URL 파라미터, 헤더, 사용자 정보 등 요청 데이터에 접근할 수 있습니다.

### 커스텀 헬퍼 생성

`ViewHelperFactory` 타입을 사용하여 헬퍼 함수를 만듭니다:

```typescript
// src/view.helpers.ts
import { Request } from 'express';
import { ViewHelperFactory } from 'nestjs-mvc-tools';

/**
 * 현재 라우트가 주어진 경로와 일치하는지 확인하는 헬퍼
 * 템플릿에서 사용법: {{ isCurrentRoute('/home') }}
 */
export const isCurrentRouteHelper: ViewHelperFactory = (req: Request) => {
  return (routePath: string, exact: boolean = false) => {
    if (!exact) {
      return req.originalUrl.startsWith(routePath) || req.path.startsWith(routePath);
    }
    return req.originalUrl === routePath || req.path === routePath;
  };
};

/**
 * 쿼리 파라미터를 가져오는 헬퍼
 * 템플릿에서 사용법: {{ query('page', 1) }}
 */
export const queryHelper: ViewHelperFactory = (req: Request) => {
  return (name: string, defaultValue?: any) => {
    return req.query[name] || defaultValue || '';
  };
};
```

### 헬퍼 등록

모듈 설정에서 헬퍼를 객체 형태로 등록합니다:

```typescript
// app.module.ts
import { isCurrentRouteHelper, queryHelper } from './view.helpers';

@Module({
  imports: [
    NestMvcModule.forRoot({
      view: {
        helpers: {
          isCurrentRoute: isCurrentRouteHelper,
          query: queryHelper,
          // 인라인으로도 정의 가능
          formatTime: (req: Request) => (date: Date) => {
            return date.toLocaleTimeString('ko-KR');
          }
        }
      },
      // ... 다른 설정들
    }),
  ],
})
export class AppModule {}
```

### 템플릿에서 헬퍼 사용

등록된 헬퍼는 모든 템플릿에서 사용할 수 있습니다:

```html
<!-- 활성 상태를 가진 네비게이션 -->
<nav>
  <a href="/" class="{{ isCurrentRoute('/') ? 'active' : '' }}">홈</a>
  <a href="/about" class="{{ isCurrentRoute('/about') ? 'active' : '' }}">소개</a>
  <a href="/products" class="{{ isCurrentRoute('/products', false) ? 'active' : '' }}">상품</a>
</nav>

<!-- 페이지네이션에서 쿼리 파라미터 활용 -->
<div class="pagination">
  <span>현재 페이지: {{ query('page', 1) }}</span>
  <span>검색어: {{ query('search', '') }}</span>
</div>

<!-- 시간 표시 -->
<p>현재 시각: {{ formatTime(new Date()) }}</p>
```

### 글로벌과 헬퍼의 차이점

| 구분 | 글로벌 (globals/globalsFactory) | 헬퍼 (helpers) |
|------|-------------------------------|----------------|
| **실행 시점** | 애플리케이션 시작 시 1회 | 각 요청마다 실행 |
| **데이터 접근** | 정적 데이터, DI 서비스 | 요청 데이터 (URL, 헤더, 세션 등) |
| **성능** | 빠름 (캐시됨) | 상대적으로 느림 |
| **사용 목적** | 전역 설정, 유틸리티 함수 | 요청별 동적 데이터 처리 |

### 성능 고려사항

**글로벌의 경우:**
- 애플리케이션 시작 시 한 번만 실행되므로 성능에 미치는 영향이 적습니다
- `globalsFactory`에서 무거운 계산이 필요하면 여기서 처리하는 것이 효율적입니다

**헬퍼의 경우:**
- 헬퍼는 템플릿을 렌더링하는 모든 요청에서 실행됩니다
- 더 나은 성능을 위해 헬퍼 로직을 가볍게 유지하세요
- 헬퍼 함수 내에서 비용이 많이 드는 작업은 캐싱을 고려하세요
- 많은 헬퍼가 있지만 특정 라우트에서만 일부가 필요한 경우 조건부 헬퍼 등록을 사용하세요

**권장사항:**
- 정적 데이터나 환경 설정은 `globals`나 `globalsFactory` 사용
- 사용자별, 요청별로 달라지는 데이터는 `helpers` 사용
- 복잡한 계산은 가능한 `globalsFactory`에서 처리하고 결과를 글로벌로 제공

## 경로 제외 설정

라이브러리에서 제공하는 view, csrf, flash 등의 기능들은 미들웨어 레벨에서 작동합니다.
특정 경로를 미들웨어 처리에서 제외할 수 있습니다:

```typescript
NestMvcModule.forRoot({
  excludePaths: ["/api", "/favicon.ico", "/health"], // 제외할 경로들
  ...
});
```

기본적으로 `/api`와 `/favicon.ico` 경로는 제외됩니다.