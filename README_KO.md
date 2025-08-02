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
# MVC 템플릿 및 리소스 설정 (기본값: minimal - Vite만)
npx nestjs-mvc-tools init

# 또는 원하는 템플릿 선택
npx nestjs-mvc-tools init --template=minimal           # Vite만 (기본값)
npx nestjs-mvc-tools init --template=tailwind          # TailwindCSS만
npx nestjs-mvc-tools init --template=hotwired          # Hotwired만
npx nestjs-mvc-tools init --template=hotwired-tailwind # Hotwired + TailwindCSS
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
  // 정적 에셋 제공 설정
  app.useStaticAssets(join(process.cwd(), "resources", "public"), {
    prefix: "/public",
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

이 설정은 다음과 같은 목적으로 사용됩니다:
- **프로덕션 빌드된 Vite 에셋**: CSS, JavaScript 파일 등 빌드된 에셋을 `/public` 경로로 제공
- **기타 정적 에셋**: 이미지, 폰트, 파비콘 등의 정적 파일을 웹에서 접근 가능하게 함
- **개발 환경 호환성**: 개발/프로덕션 환경에서 동일한 경로로 에셋 접근 보장

### 3. NestMvcModule 모듈 등록

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

### 6. 프로덕션 빌드

프로덕션 배포를 위해서는 NestJS 애플리케이션과 resources 디렉토리의 프론트엔드 에셋을 모두 빌드해야 합니다.

```json
// package.json
"scripts": {
  "build": "nest build && cd resources && npm run build"
}
```

```bash
# 프로덕션 빌드 실행
npm run build
```

> **중요**: NestJS 빌드만으로는 프론트엔드 에셋이 빌드되지 않습니다. `resources` 디렉토리의 Vite 빌드도 함께 실행해야 정적 에셋이 올바르게 제공됩니다.

## 더 자세한 문서

- **[CLI 명령어 가이드](./docs/CLI_KO.md)** - 템플릿 옵션 및 CLI 사용법
- **[설정 및 기능 가이드](./docs/CONFIGURATION_KO.md)** - CSRF, 플래시 메시지, 커스텀 헬퍼 등
- **[문제 해결 가이드](./docs/TROUBLESHOOTING_KO.md)** - 알려진 이슈 및 해결 방법

---

**NestJS MVC Tools**는 NestJS에서 전통적인 웹 개발 방식을 좀 더 편하게 시작할 수 있도록 도움을 드리는 작은 도구입니다.
