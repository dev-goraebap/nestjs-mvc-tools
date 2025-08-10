# 변경 사항

이 프로젝트의 모든 주목할 만한 변경 사항이 이 파일에 문서화됩니다.

## [0.9.12] - 2025-08-11

### 변경됨
- `EdgeJsService`: 외부 서비스에서 주입받을 수 있도록 처리
  - 이메일 템플릿 등 `service` 레이어에서 edge 템플릿에 접근하는 사례등을 위해 처리됨

## [0.9.11] - 2025-08-08

### 추가됨
- **주입 기반 글로벌 팩토리**: `globalsFactory`에서 명시적 의존성 주입을 위한 새로운 `globalsInjects` 옵션
  - `ModuleRef` 방식을 직접 서비스 주입으로 대체하여 타입 안전성 향상
  - 더 나은 DI 통합을 위한 팩토리 프로바이더 패턴 추가
  - `ConfigService` 같은 서비스를 완전한 타입 안전성과 함께 주입 지원

### 변경됨
- **헬퍼 API 개선**: 헬퍼 형식을 배열에서 객체 기반 방식으로 변경
  - `helpers`가 이제 배열 대신 `Record<string, ViewHelperFactory>` 형식을 기대함
  - 객체 키가 자동으로 헬퍼 이름이 됨 (수동 `key` 지정 불필요)
  - 간소화된 헬퍼 함수 정의 - `{key, fn}` 객체를 반환할 필요 없음

### 호환성을 깨는 변경사항
- **헬퍼 형식**: 기존 `helpers: [helperFunction1, helperFunction2]`를 `helpers: {helperName: helperFunction}`로 변경해야 함
- **ViewHelperFactory 시그니처**: 헬퍼 팩토리가 `{key: string, fn: function}` 객체 대신 함수를 직접 반환
- **GlobalsFactory 시그니처**: `(moduleRef: ModuleRef) => Record<string, any>`에서 `(...injectedServices: any[]) => Record<string, any>`로 변경
- **제거된 타입**: `ViewHelperDefinition` 타입이 더 이상 필요하지 않아 제거됨

### 마이그레이션 가이드
```typescript
// 이전 (v0.9.10)
helpers: [
  (req) => ({ key: 'helperName', fn: (arg) => { /* 로직 */ } })
]
globalsFactory: (moduleRef) => {
  const service = moduleRef.get(SomeService);
  return { /* 글로벌 */ };
}

// 이후 (v0.9.11)
helpers: {
  helperName: (req) => (arg) => { /* 로직 */ }
}
globalsInjects: [SomeService]
globalsFactory: (someService) => {
  return { /* 글로벌 */ };
}
```

## [0.9.10] - 2025-08-04

### 수정됨
- **CSRF 미들웨어 안정성**: CSRF 토큰 추출 시 undefined 에러를 방지하기 위해 옵셔널 체이닝(`?.`) 추가
  - `req.body`가 파싱되지 않았을 때 발생하는 `Cannot read properties of undefined (reading '_csrf')` 에러 수정

## [0.9.9] - 2025-08-02

### 변경됨
- **템플릿 구조 재구성**:
  - 명확한 명명을 위해 `full` 템플릿 디렉토리를 `hotwired-tailwind`로 이름 변경
  - 기본 템플릿을 `hotwired-tailwind`에서 `minimal`로 변경
  - 새로운 템플릿 명명 규칙을 지원하도록 CLI 업데이트

### 추가됨
- **향상된 CLI 사용자 경험**:
  - 설명과 함께 사용 가능한 템플릿을 표시하는 `list-templates` 명령어 추가
  - 설명과 사용 사례를 포함한 개선된 템플릿 정보 구조
  - 더 나은 개발자 경험을 위한 향상된 오류 메시지 및 도움말 텍스트
  - 템플릿별 맞춤 성공 메시지

### 개선됨
- **문서 구성**:
  - 긴 README 파일을 집중된 주제별 가이드로 분할
  - CLI, 설정, 문제 해결을 위한 별도 문서 파일 생성
  - 더 나은 탐색을 위해 한국어 및 영어 버전 모두 재구성
  - 문서 파일 간 상호 참조 및 링크 업데이트

## [0.9.8] - 2025-07-31

### 추가됨
- **커스텀 뷰 헬퍼**: 템플릿을 위한 새로운 요청별 헬퍼 시스템
  - 요청 범위 헬퍼 생성을 위한 `ViewHelperFactory`와 `ViewHelperDefinition` 타입 추가
  - 커스텀 헬퍼 함수 등록을 위한 뷰 설정의 `helpers` 옵션 추가

### 개선됨
- **문서화**: 한국어와 영어 README에 포괄적인 커스텀 뷰 헬퍼 섹션 추가
  - 템플릿 사용 패턴 및 모범 사례
  - 성능 고려사항 및 최적화 가이드라인
- **설정**: 헬퍼 옵션을 포함하도록 뷰 설정 문서 업데이트
- **예제**: 헬퍼 사용법을 시연하는 컨트롤러 및 템플릿 예제 강화

## [0.9.7] - 2025-07-30

### 변경됨
- **캐시 기본값 변경**: 템플릿 캐싱 기본값을 `true`에서 `false`로 변경
  - 개발 환경에서 템플릿 변경사항을 즉시 확인할 수 있도록 개선
  - 서비스, 타입 정의, 문서, 테스트 파일 전체 업데이트
  - JSDoc에 개발/프로덕션 환경별 사용 가이드 추가
- **CSRF 보호 기본값 변경**: CSRF 보호 기본값을 `false`에서 `true`로 변경
  - 보안 강화를 위해 기본적으로 CSRF 보호 활성화
  - 서비스, 타입 정의, 문서 예제 전체 업데이트

### 추가됨
- **프로덕션 빌드 문서화**: 배포를 위한 포괄적인 빌드 가이드 추가
  - NestJS와 resources 디렉토리 모두 빌드해야 함을 명시
  - 빌드 스크립트 예제와 배포 가이드 제공
- **정적 에셋 설정 설명 강화**: `useStaticAssets` 설정의 목적과 필요성 명확화
  - Vite 빌드 에셋, 정적 파일 제공, 개발/프로덕션 환경 호환성 설명
  - NestMvcModule 에셋 설정과의 연관성 설명 추가
- **설정 동기화 가이드**: 설정 일관성에 대한 중요한 주의사항 추가
  - `staticAssetPrefix`와 `useStaticAssets`의 `prefix` 값 일치 필요성 강조
  - 두 설정을 함께 변경하는 예제 제공

### 개선됨
- **개발자 경험**: 개발 환경에서 템플릿 변경사항 즉시 반영으로 개발 효율성 향상
- **보안**: CSRF 보호 기본 활성화로 애플리케이션 보안 강화
- **문서화**: 빌드 프로세스와 설정 동기화에 대한 명확한 가이드 제공

## [0.9.6] - 2025-07-30

### 추가됨
- CLI 템플릿 선택 옵션 추가: `--template` 또는 `-t` 옵션으로 4가지 템플릿 선택 가능
  - `minimal`: Vite만 포함한 기본 구성
  - `tailwind`: TailwindCSS + Vite 구성
  - `hotwired`: Hotwired (Turbo + Stimulus) + Vite 구성
  - `full`: TailwindCSS + Hotwired + Vite 완전 구성 (기본값)
- ExceptionFilter 설정 가이드를 README_KO.md에 추가
  - 404 에러 페이지 처리 방법
  - SSR 양식 오류의 플래시 메시지 자동 처리
  - API와 페이지 분기 처리 로직

### 변경됨
- CLI 템플릿 폴더 구조 재설계: `template-*` → `templates/` 하위로 이동
- 기본 템플릿을 `full`로 변경 (기존 전체 라이브러리 포함 동작 유지)
- README_KO.md의 CLI 명령어 섹션 대대적 개선
  - 템플릿별 사용법과 차이점 상세 설명
  - 빠른 시작 섹션에 템플릿 선택 옵션 추가
- 빌드 시스템의 `copy-resources` 스크립트를 `templates` 경로로 수정

### 개선됨
- 개발자 경험: 프로젝트 요구사항에 맞게 필요한 라이브러리만 선택 설치 가능
- 문서화: ExceptionFilter 구현을 위한 완전한 코드 예제와 설정 방법 제공
- CLI 사용성: 직관적인 템플릿 이름과 명확한 옵션 설명

## [0.9.5] - 2025-07-29

### 수정됨
- init 시 resources 디렉토리에 `.gitignore` 파일이 생성되지 않던 문제 해결
- CLI가 `nestjs-mvc-tools init` 실행 시 적절한 내용(`node_modules`, `public/builds`)으로 `.gitignore` 파일을 직접 생성하도록 변경

## [0.9.4] - 2025-07-29

### 수정됨
- copy-resources의 `.gitignore` 파일이 npm 패키지에 포함되지 않던 문제 해결
- copy-resources 디렉토리의 `.gitignore` 파일을 명시적으로 포함하도록 `.npmignore` 업데이트

## [0.9.3] - 2025-07-28

### 제거됨
- `forRootAsync` 메서드 및 `NestMvcOptionsFactory` 인터페이스 지원
- README 파일에서 비동기 설정 문서화
- 복잡한 팩토리 패턴 설정 예제

### 변경됨
- 동기식 `forRoot` 메서드만 사용하도록 모듈 등록 단순화
- 간단한 설정 접근법에 집중하도록 문서 업데이트

*참고: 대부분의 사용 사례에 불필요한 복잡성을 추가하는 비동기 설정 지원을 제거했습니다. 가끔 개발자 쿨병이 도지는 것 같습니다.*

## [0.9.2] - 2025-07-28

### 추가됨
- 조건부 디버그 로깅을 위한 `NestMvcLoggerService` 추가
- 모든 클래스와 메서드에 포괄적인 JSDoc 문서화 추가
- 모든 서비스에 선택적 로거 지원으로 디버그 및 에러 로깅 기능 추가
- 국제적 호환성을 위한 주요 코드베이스 영문 주석 번역
- 설정 옵션에 `debug` 속성 추가 (디버그 로그 출력 제어)
- 예외 처리 클래스에 선택적 로거 매개변수 추가

### 변경됨
- 명확성을 위해 `getDynamicModulePlainObj` 메서드를 `createDynamicModule`로 이름 변경
- Edge.js, CSRF, Vite 에셋 헬퍼 서비스에 통합된 로깅 시스템
- 상세한 속성 문서화로 타입 정의 개선
- 모든 서비스에서 `ClassName.name`을 사용한 일관된 로깅 컨텍스트
- 한글 섹션 헤더 및 인라인 주석을 영어로 전환
- 개발/프로덕션 환경에 따른 조건부 디버그 로깅 예시 추가

### 개선됨
- 확장된 Express Request 타입에 속성별 상세 문서화
- 에러 처리 시 console.log/warn을 구조화된 로거로 교체
- 모든 서비스 초기화, 동작, 에러 상황에 대한 디버그 가시성 향상
- 주요 코드베이스의 문서화 품질 및 일관성 개선

## [0.9.1] - 2025-07-26

### 변경됨
- README 파일 한국 버전 링크 추가: <del>아 문서 바꾸면서 이걸 빼먹네..</del>

## [0.9.0] - 2025-07-26

### 추가됨
- 세션 기반 토큰 생성을 사용하는 CSRF(Cross-Site Request Forgery) 보호 미들웨어
- 특정 경로를 미들웨어 처리에서 제외하는 설정 가능한 `excludePaths` 옵션 (기본값: `/api`, `/favicon.ico`)
- 템플릿에서 `csrfToken` 변수를 통한 CSRF 토큰 지원
- 다양한 토큰 전달 방식: 폼 데이터(`_csrf`), 쿼리 파라미터, HTTP 헤더(`x-csrf-token`, `csrf-token`, `xsrf-token`)
- 적절한 HTTP 상태 코드를 사용한 향상된 예외 처리 (CSRF 위반 시 500 대신 403)
- 모든 설정 옵션에 대한 포괄적인 JSDoc 문서화
- README 문서의 완전한 영문 번역

### 변경됨
- 더 나은 성능을 위한 조기 반환 패턴으로 미들웨어 최적화 개선
- 뷰 존재 확인을 포함한 플래시 미들웨어 향상
- 더 나은 모듈 호환성을 위해 `instanceof` 검사 대신 덕 타이핑을 사용하도록 예외 처리 리팩토링
- 영어 중심으로 템플릿 리소스 업데이트
- 코드베이스 전체에 이중 언어 주석(한국어 + 영어)으로 코드 구조 개선

### 수정됨
- CSRF 미들웨어가 적절한 403 Forbidden 응답 대신 500 오류를 반환하는 문제 수정
- 예외 핸들러에서 `instanceof HttpException` 감지 이슈 수정
- 예외 필터에서 URL 처리 수정 (`url` → `originalUrl`)
- 다양한 테스트 컨트롤러 주석 URL 및 오류 메시지 수정

### 보안
- 사이트 간 요청 위조 공격을 방지하기 위한 세션 기반 CSRF 보호 추가
- 설정 가능한 솔트 및 시크릿 길이로 보안 토큰 생성 구현
- 보안 위반에 대한 적절한 HTTP 상태 코드 응답 추가

## [0.8.0] - 2025-07-25

### 추가됨
- NestJS MVC Tools 초기 릴리스
- Edge.js 템플릿 엔진 통합
- Vite 기반 에셋 파이프라인
- 플래시 메시지 기능
- MVC 예외 처리
- 프로젝트 초기화를 위한 CLI 도구
- 기본 세션 의존성 지원