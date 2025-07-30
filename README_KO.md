# NestJS MVC Tools

**NestJS MVC Tools**는 NestJS에서 전통적인 웹 개발 방식을 좀 더 편하게 시작할 수 있도록 도움을 드리는 작은 도구입니다.
처음에는 NestJS에서 Edge.js 템플릿 엔진을 간편하게 사용하기 위한 단순한 유틸리티로 시작했지만, MVC 패턴 중 View 계층에 필요한 다양한 기능들이 하나씩 추가되면서 지금의 모습이 되었습니다.

AdonisJS의 [Edge.js](https://edgejs.dev/docs/introduction) 템플릿 엔진과 [Vite](https://vite.dev/)를 사용한 에셋 파이프라인이 구성되어있습니다. 프론트엔드 디렉토리 자동 구성 시 [Tailwindcss](https://tailwindcss.com/)와 [Hotwired](https://hotwired.dev/) 라이브러리를 템플릿 옵션으로 선택할 수 있어, 프로젝트 요구사항에 맞게 필요한 라이브러리만 포함할 수 있습니다.

Hotwired는 Ruby on Rails 진영에서 개발된 라이브러리로, 많은 개발자에게 생소할 수 있습니다. 하지만 기존의 서버 사이드 개발 방식을 유지하면서도 SPA와 같은 매끄러운 사용자 경험을 구현하고 싶다면 고려해볼 만한 도구입니다. 다만 커뮤니티에서는 긍정적 평가와 부정적 의견이 공존하므로, 어디까지나 본인의 선택입니다.

예제는 프로젝트의 [tests/manual-test-app](./tests/manual-test-app)에서 확인할 수 있습니다.

## 개발자의 말

NestJS의 강력한 DI 시스템을 좋아하지만, 때로는 AdonisJS나 Laravel, Ruby on Rails와 같은 풀스택 환경이 부러울 때가 있습니다. NestJS 생태계에서 프론트엔드 구성을 위한 라이브러리를 찾아봤지만 마땅한 것을 찾지 못해, 결국 저의 입맛대로 만들게 되었습니다.

이 라이브러리는 다른 훌륭한 개발자분들이 만들어놓은 작품들을 조립하여 NestJS에 맞게 패키징한 것에 불과합니다. 지속적으로 잘 관리할 자신도 없기 때문에, 비슷한 생각을 가진 분이 계시다면 더 나은 라이브러리를 출시해주시길 바랍니다. ~~(제가 편하게 쓰기 위해서요)~~

## 주요 기능

### Edge.js 템플릿 엔진 모듈화

AdonisJS의 Edge.js 템플릿 엔진을 NestJS에서도 활용할 수 있도록 모듈화하여 제공합니다. 굳이 Edge.js 를 사용하는 이유가 뭐냐구요? 그냥 쉽고 강력합니다.. 그게 다에요!

### 프론트엔드 디렉토리 자동 구성

내장된 CLI를 통해 프론트엔드 리소스 폴더를 자동으로 생성하고 구성하여, 빠르게 프로젝트를 시작하고 개발 환경을 설정할 수 있도록 돕습니다.

### Vite 기반 에셋 파이프라인 구축

Vite를 활용하여 프론트엔드 개발 서버를 지원하고, 에셋 파이프라인을 통해 프로덕션 환경에서 최적화된 에셋을 제공합니다.

### CSRF 보호

세션 기반 CSRF(Cross-Site Request Forgery) 보호 기능을 제공하여 악의적인 요청으로부터 애플리케이션을 안전하게 보호합니다. 다양한 토큰 전달 방식(헤더, 폼 데이터, 쿼리)을 지원합니다.

### 플래시 메시지

세션을 기반으로 한 임시 메시지 및 데이터 기능을 제공하여 사용자에게 필요한 정보를 효과적으로 전달하고, UI/UX를 개선할 수 있습니다.

### MVC 예외 처리

템플릿 엔진과 연동되는 MVC(Model-View-Controller) 기반의 예외 처리 기능을 제공합니다. 이 기능을 통해 다음과 같은 처리가 가능합니다:

- **404 에러 페이지 처리**: 존재하지 않는 페이지 접근 시 NestJS의 기본 404 에러를 템플릿 기반 에러 페이지로 변환
- **SSR 양식 오류 처리**: BadRequestException 발생 시 자동으로 플래시 메시지와 입력값 유지 처리
- **API/페이지 분기 처리**: API 경로(`/api`)와 일반 페이지 경로를 구분하여 적절한 응답 형태(JSON/HTML) 제공

### 모던 웹 호환성

Hotwired/Turbo와 같은 최신 웹 기술들과의 호환성을 지원하여, SPA(Single Page Application)와 유사한 사용자 경험을 제공하면서도 서버 사이드 렌더링의 장점을 유지할 수 있습니다.

## 설치

```bash
npm install nestjs-mvc-tools
```

## 빠른 시작

NestJS에서 MVC 패턴을 사용하기 위한 기본 설정을 도와드립니다.

### 1. 프로젝트 초기화

```bash
# MVC 템플릿 및 리소스 설정 (기본값: full - Hotwired + TailwindCSS)
npx nestjs-mvc-tools init

# 또는 원하는 템플릿 선택
npx nestjs-mvc-tools init --template=minimal   # Vite만
npx nestjs-mvc-tools init --template=tailwind  # TailwindCSS만
npx nestjs-mvc-tools init --template=hotwired  # Hotwired만
npx nestjs-mvc-tools init --template=full      # 전체 (기본값)
```

프로젝트 root 경로에 resources 디렉토리를 생성하고 선택한 템플릿에 따라 필요한 의존성을 다운로드합니다.

### 2. 정적 파일 경로 설정

```ts
// main.ts
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 추가
  app.useStaticAssets(join(process.cwd(), "resources", "public"), {
    prefix: "/public",
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### 3. NestMvcModule 모듈 등록

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
        disks: [], // 추가 디스크 경로가 필요한 경우
      },
      csrf: {
        enabled: true, // CSRF 보호 활성화
      },
    }),
  ],
})
export class AppModule {}
```

### 4. 컨트롤러 작성

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

#### 연결된 템플릿 확인

```html
// resources/views/pages/hello_world/index.edge 

@layout.app({ title: 'Helloworld' })
<h1 data-controller="hello" class="text-3xl">{{ message ?? 'hello world' }}</h1>
@end
```

### 5. 프로젝트 실행

```bash
# 1. vite 개발 서버 실행
cd resources && npm run dev

# 2. nestjs 서버 실행
npm run start:dev
```

concurrently 라이브러리를 사용하면 다음과 같이 구성할 수 있습니다.

```json
// package.json
"scripts": {
  "start:resource": "cd resources && npm run dev",
  "start:dev": "concurrently \"nest start --watch\" \"npm run start:resource\"",
}
```

그리고 `npm run start:dev` 하나로 실행 가능

## CLI 명령어

### `nestjs-mvc-tools init`

프로젝트에 MVC 템플릿과 리소스 구조를 생성합니다. 템플릿 옵션을 통해 필요한 라이브러리만 선택할 수 있습니다.

```bash
# 기본 사용 (full 템플릿 - Hotwired + TailwindCSS)
nestjs-mvc-tools init

# 템플릿별 선택
nestjs-mvc-tools init --template=minimal   # Vite만
nestjs-mvc-tools init --template=tailwind  # TailwindCSS만  
nestjs-mvc-tools init --template=hotwired  # Hotwired만
nestjs-mvc-tools init --template=full      # 전체 (기본값)

# 짧은 옵션 사용
nestjs-mvc-tools init -t minimal
```

**사용 가능한 템플릿:**
- `minimal`: Vite만 포함한 기본 구성
- `tailwind`: TailwindCSS + Vite 구성  
- `hotwired`: Hotwired (Turbo + Stimulus) + Vite 구성
- `full`: TailwindCSS + Hotwired + Vite 완전 구성 (기본값)

**생성되는 구조:**

선택한 템플릿에 따라 다른 구조가 생성됩니다.

```
resources/
├── package.json        # 템플릿별 의존성
├── vite.config.js      # Vite 설정 (템플릿별 플러그인)
├── src/
│   ├── app.js         # 프론트엔드 엔트리 (템플릿별 import)
│   ├── style.css      # 스타일 (minimal, hotwired)
│   └── controllers/   # Stimulus 컨트롤러 (hotwired, full만)
├── views/
│   ├── components/    # 재사용 컴포넌트
│   └── pages/         # 페이지 템플릿
└── public/
    └── builds/        # 빌드된 에셋
```

**템플릿별 차이점:**
- `minimal`: 기본 CSS, Vite만 포함
- `tailwind`: TailwindCSS import, Tailwind 플러그인 포함
- `hotwired`: Hotwired import, Stimulus 컨트롤러 폴더 포함
- `full`: TailwindCSS + Hotwired 모든 기능 포함

## 설정

### 기본 설정

```typescript
// 설정을 포함하지 않으면 기본으로 제공하는 값
NestMvcModule.forRoot({
  excludePaths: ["/api", "/favicon.ico"], // 미들웨어 처리 제외 경로
  debug: false, // 디버그 로그 출력 여부 (기본값: false)
  view: {
    rootDir: join(process.cwd(), "resources", "views"),
    disks: [], // 추가 템플릿 디스크 경로
    cache: false,
  },
  asset: {
    mode: "development",
    staticAssetPrefix: "/public",
    buildOutDir: join(process.cwd(), "resources", "public", "builds"),
    devServerUrl: "http://localhost:5173",
  },
  csrf: {
    enabled: false, // CSRF 보호 비활성화 (기본값)
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    saltLength: 8,
    secretLength: 18,
  },
});
```


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
3. **HTTP 헤더**: 
   - `x-csrf-token`
   - `csrf-token`
   - `xsrf-token`

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

## 프로젝트 기본 라이브러리 및 주요 고려 사항

이 프로젝트는 템플릿 옵션을 통해 필요한 라이브러리만 선택하여 설치할 수 있습니다. @hotwired 시리즈와 @tailwindcss 라이브러리를 프로젝트 요구사항에 따라 선택적으로 포함할 수 있으며, 기본값은 두 라이브러리가 모두 포함된 `full` 템플릿입니다.

### Vite HMR 지원 이슈

현재 프로젝트에서는 Vite의 HMR(Hot Module Replacement)이 제대로 지원되지 않습니다. 이로 인해 코드를 수정해도 웹사이트에 즉시 반영되지 않고, 변경 사항을 확인하려면 수동으로 새로고침해야 합니다.

이러한 현상은 Vite가 주로 정적 에셋 관리를 담당하고, Edge.js 템플릿 엔진은 NestJS 서버 측에서 실행되기 때문에 발생합니다. 즉, 프론트엔드와 백엔드 환경이 분리되어 있어 Vite의 HMR 기능을 온전히 활용하기 어렵습니다.

AdonisJS는 ESM(ECMAScript Modules) 환경을 기반으로 설계되어 프론트엔드 구성 자체가 하나의 프로젝트처럼 긴밀하게 작동합니다. 반면 NestJS는 CommonJS 환경에서 널리 사용되어 왔습니다. NestJS에서도 ESM 설정이 불가능한 것은 아니지만, 기존 라이브러리와의 충돌 등 예상치 못한 문제가 발생했을 때 대응하기 어렵다고 판단했습니다. 따라서 NestJS의 기존 환경 구성은 건드리지 않고, 확장하는 구조를 택했습니다. 이러한 접근 방식 때문에 프론트엔드와 백엔드를 독립적으로 빌드하고 배포하는 것이 일반적이며, HMR 통합에 제약이 발생하고 있습니다.

현재로서는 개발 편의성과 관리 효율성 사이의 적절한 타협점을 찾기 위해 노력하고 있습니다.

## 라이브러리 테스트 이슈

이 라이브러리는 Edge.js 템플릿 엔진을 사용하는데, 이는 ESM(ECMAScript Modules) 환경에서 사용되도록 만들어졌습니다. 하지만 대부분의 NestJS 프로젝트는 CommonJS 환경에서 실행되기 때문에 테스트 환경 구성에 어려움이 있습니다.

### Jest E2E 테스트의 제약사항

초기에는 `tests/tmp` 디렉토리에서 Jest를 활용한 E2E 테스트를 시도했으나, 다음과 같은 문제들로 인해 포기하게 되었습니다:

- **모듈 시스템 충돌**: CommonJS 환경의 Jest에서 ESM 라이브러리인 Edge.js를 로드할 때 발생하는 호환성 문제
- **복잡한 설정**: Jest의 ESM 지원을 위한 설정이 복잡하고, 다른 라이브러리들과의 충돌 가능성
- **불안정한 테스트 환경**: 모듈 로딩 순서나 설정에 따라 테스트가 간헐적으로 실패하는 문제

### 대안: 수동 테스트 환경

이러한 제약사항으로 인해 현재는 `tests/manual-test-app`에서 실제 NestJS 애플리케이션을 실행하여 수동으로 기능을 테스트하고 있습니다:

```bash
# 테스트 앱 실행
cd tests/manual-test-app
npm install
npm run start:dev
```

---

**NestJS MVC Tools**는 NestJS에서 전통적인 웹 개발 방식을 좀 더 편하게 시작할 수 있도록 도움을 드리는 작은 도구입니다.
