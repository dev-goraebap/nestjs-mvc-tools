# NestJS MVC Tools

**NestJS MVC Tools**는 NestJS에서 전통적인 웹 개발 방식을 좀 더 편하게 시작할 수 있도록 도움을 드리는 작은 도구입니다.

AdonisJS의 [Edge.js](https://edgejs.dev/docs/introduction) 템플릿 엔진에 Ruby on Rails의 [Hotwired](https://hotwired.dev/)를 결합하여 최신 웹 애플리케이션을 구축할 수 있습니다. 거기에 더해 [Vite](https://vite.dev/)를 사용한 에셋 파이프라인을 통해 TailwindCSS 등의 프론트엔드 라이브러리를 사용할 수 있습니다.

완전한 예제는 [nestjs-mvc-is-coming](https://github.com/dev-goraebap/nestjs-mvc-is-coming)에서 확인할 수 있습니다.

## 개발자의 말

NestJS의 강력한 DI 시스템을 좋아하지만, 때로는 AdonisJS나 Laravel, Ruby on Rails와 같은 풀스택 환경이 부러울 때가 있습니다. NestJS 생태계에서 프론트엔드 구성을 위한 라이브러리를 찾아봤지만 마땅한 것을 찾지 못해, 결국 저의 입맛대로 만들게 되었습니다.

이 라이브러리는 다른 훌륭한 개발자분들이 만들어놓은 작품들을 조립하여 NestJS에 맞게 패키징한 것에 불과합니다. 지속적으로 잘 관리할 자신도 없기 때문에, 비슷한 생각을 가진 분이 계시다면 더 나은 라이브러리를 출시해주시길 바랍니다. ~~(제가 편하게 쓰기 위해서요)~~

## 주요 기능

### Edge.js 템플릿 엔진 모듈화

AdonisJS의 Edge.js 템플릿 엔진을 NestJS에서도 활용할 수 있도록 모듈화하여 제공합니다. 이를 통해 두 프레임워크 간의 템플릿 공유 및 재사용성을 높일 수 있습니다.

### 프론트엔드 디렉토리 자동 구성

내장된 CLI를 통해 프론트엔드 리소스 폴더를 자동으로 생성하고 구성하여, 빠르게 프로젝트를 시작하고 개발 환경을 설정할 수 있도록 돕습니다.

### Vite 기반 에셋 파이프라인 구축

Vite를 활용하여 프론트엔드 개발 서버를 지원하고, 에셋 파이프라인을 통해 프로덕션 환경에서 최적화된 에셋을 제공합니다.

### 플래시 메시지

세션을 기반으로 한 임시 메시지 및 데이터 기능을 제공하여 사용자에게 필요한 정보를 효과적으로 전달하고, UI/UX를 개선할 수 있습니다.

### MVC 예외 처리

템플릿 엔진과 연동되는 MVC(Model-View-Controller) 기반의 예외 처리 메커니즘을 제공하여, 개발자가 애플리케이션의 오류를 효율적으로 관리하고 사용자에게 친화적인 오류 화면을 제공할 수 있도록 돕습니다.

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
# MVC 템플릿 및 리소스 설정
npx nestjs-mvc-tools init
```

프로젝트 root 경로에 resources 디렉토리를 생성하고 내부 vite 개발환경의 필요한 의존성을 다운로드합니다.

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

### 3. NestMvcCoreModule 모듈 등록

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { NestMvcCoreModule } from "nestjs-mvc-tools";

@Module({
  imports: [NestMvcCoreModule.forRoot()],
})
export class AppModule {}
```

### 4. 컨트롤러 작성

```typescript
// app.controller.ts
import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { NestMvcView, View } from "nestjs-mvc-tools";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@View() view: NestMvcView) {
    const message = this.appService.getHello();
    return view.render("pages/hello_world/index", { message });
  }
}
```

#### 연결된 템플릿 확인

```html
// resources/views/pages/hello_world/index.edge @layout.app({ title:
'Helloworld'})
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

프로젝트에 기본적인 MVC 템플릿과 리소스 구조를 생성합니다.

```bash
nestjs-mvc-tools init
```

**생성되는 구조:**

```
resources/
├── package.json        # Vite 개발 환경
├── vite.config.js      # Vite 설정
├── src/
│   ├── app.js         # 프론트엔드 엔트리
│   └── tailwind.css   # 스타일
├── views/
│   ├── components/    # 재사용 컴포넌트
│   └── pages/         # 페이지 템플릿
└── public/
    └── builds/        # 빌드된 에셋
```

## 설정

### 기본 설정

```typescript
// 설정을 포함하지 않으면 기본으로 제공하는 값
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

### 비동기 설정

configService와 같은 설정값을 가져오거나, 더욱 세부적인 관리가 필요하다면 옵션 팩토리를 활용하여 비동기 설정을 구성할 수 있습니다.
아래 코드는 NestMvcCoreOptionsFactory를 구현하여 NestMvcCoreModule에 비동기 설정을 제공하는 예시입니다.

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

## 선택적 의존성

### express-session (권장)

세션 설정 없이도 기본적인 템플릿 렌더링은 문제없이 작동합니다. 
하지만 CSRF 토큰과 플래시 메시지 같은 기능들은 express-session에 의존하고 있습니다.
이러한 기능들을 제대로 사용하려면 express-session 설치를 권장합니다.

```bash
npm install express-session
```

**main.ts 설정:**

```typescript
import * as session from "express-session";

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key"
  })
);
```

## 프로젝트 기본 라이브러리 및 주요 고려 사항

이 프로젝트의 프론트환경에서는 @hotwired 시리즈와 @tailwindcss 라이브러리를 기본적으로 설치합니다. 이 두 라이브러리는 필수는 아니므로 원한다면 제거할 수 있습니다. 하지만 Hotwired는 이 프로젝트에서 활용도가 높으므로 사용을 권장합니다.

### Vite HMR 지원 이슈

현재 프로젝트에서는 Vite의 HMR(Hot Module Replacement)이 제대로 지원되지 않습니다. 이로 인해 코드를 수정해도 웹사이트에 즉시 반영되지 않고, 변경 사항을 확인하려면 수동으로 새로고침해야 합니다.

이러한 현상은 Vite가 주로 정적 에셋 관리를 담당하고, Edge.js 템플릿 엔진은 NestJS 서버 측에서 실행되기 때문에 발생합니다. 즉, 프론트엔드와 백엔드 환경이 분리되어 있어 Vite의 HMR 기능을 온전히 활용하기 어렵습니다.

AdonisJS는 ESM(ECMAScript Modules) 환경을 기반으로 설계되어 프론트엔드 구성 자체가 하나의 프로젝트처럼 긴밀하게 작동합니다. 반면 NestJS는 CommonJS 환경에서 널리 사용되어 왔습니다. NestJS에서도 ESM 설정이 불가능한 것은 아니지만, 기존 라이브러리와의 충돌 등 예상치 못한 문제가 발생했을 때 대응하기 어렵다고 판단했습니다. 따라서 NestJS의 기존 환경 구성은 건드리지 않고, 확장하는 구조를 택했습니다. 이러한 접근 방식 때문에 프론트엔드와 백엔드를 독립적으로 빌드하고 배포하는 것이 일반적이며, HMR 통합에 제약이 발생하고 있습니다.

현재로서는 개발 편의성과 관리 효율성 사이의 적절한 타협점을 찾기 위해 노력하고 있습니다.

## 🌟 예제 프로젝트

완전한 예제는 [nestjs-mvc-is-coming](https://github.com/dev-goraebap/nestjs-mvc-is-coming)에서 확인할 수 있습니다.

## 📝 라이선스

ISC License

---

**NestJS MVC Tools**는 NestJS에서 전통적인 웹 개발 방식을 좀 더 편하게 시작할 수 있도록 도움을 드리는 작은 도구입니다.
