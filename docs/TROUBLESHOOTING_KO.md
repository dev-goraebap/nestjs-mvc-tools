## 프로젝트 기본 라이브러리 및 주요 고려 사항

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

## Response 객체 사용 시 주의사항

컨트롤러에서 `@Res() res: Response`를 매개변수로 선언하고 `return req.view.render()`를 사용할 때 페이지가 무한 로딩되는 문제가 발생할 수 있습니다.

### 문제 상황 예시

```typescript
@Get('login')
async loginForm(@Req() req: NestMvcReq, @Res() res: Response) {
  if (req.session?.isAuthenticated) {
    return res.redirect('/admin');
  }
  const template = await req.view.render('pages/admin/login');
  return template; // ❌ 잘못된 방법 - 무한 로딩 발생
}
```

### 원인

- `req.view.render()`는 단순히 `Promise<string>`을 반환합니다
- `@Res()` 데코레이터를 사용하면 NestJS는 개발자가 직접 응답을 처리할 것으로 간주합니다
- 따라서 `res.send()`, `res.json()` 등의 메서드를 사용해 명시적으로 응답을 전송해야 합니다
- 이를 누락하면 응답이 전송되지 않아 브라우저에서 무한 로딩이 발생합니다

### 해결 방법

`@Res()` 사용 시 반드시 명시적으로 응답 처리:

```typescript
@Get('login')
async loginForm(@Req() req: NestMvcReq, @Res() res: Response) {
  if (req.session?.isAuthenticated) {
    return res.redirect('/admin');
  }
  const template = await req.view.render('pages/admin/login');
  return res.send(template); // ✅ 반드시 res.send() 사용
}
```