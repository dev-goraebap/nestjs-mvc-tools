// --------------------------------------------------------
// 개별 옵션
// --------------------------------------------------------

import { Request } from "express";

/**
 * 뷰 템플릿에서 사용할 커스텀 헬퍼 함수의 정의
 * 현재 요청 컨텍스트에서 사용되며 글로벌이 아님
 */
export type ViewHelperDefinition = {
  key: string;
  fn: (...args: any[]) => any;
};

/**
 * 요청별로 헬퍼 함수를 생성하는 팩토리 함수
 * 각 HTTP 요청마다 실행되어 해당 요청 컨텍스트의 헬퍼를 등록
 */
export type ViewHelperFactory = (req: Request) => ViewHelperDefinition;

export type EdgeJsViewOptions = {
  /**
   * @description en: Template root directory path.
   * @description ko: 템플릿 루트 디렉토리 경로.
   * @default join(process.cwd(), "resources", "views")
   */
  rootDir: string;

  /**
   * https://edgejs.dev/docs/getting_started#mounting-disks
   * 
   * @description en: Additional template disk directories to mount.
   * @description ko: 마운트할 추가 템플릿 디스크 디렉토리들.
   * @default []
   */
  disks: string[];

  /**
   * https://edgejs.dev/docs/getting_started#caching-templates
   * 
   * @description en: Enable template caching for performance. Set to false in development to see changes immediately, true in production for better performance.
   * @description ko: 성능 향상을 위한 템플릿 캐싱 활성화. 개발환경에서는 변경사항 확인을 위해 false로, 프로덕션에서는 성능을 위해 true로 설정하세요.
   * @default false
   */
  cache: boolean;

  /**
   * @description en: Custom helper functions that will be executed on each request and shared with templates
   * @description ko: 각 요청마다 실행되어 템플릿과 공유될 커스텀 헬퍼 함수들
   * @default []
   */
  helpers: ViewHelperFactory[];
};

export type ViteAssetsPipelineOptions = {
  /**
   * @description en: Build mode for asset pipeline. 'development' uses Vite dev server, 'production' serves pre-built assets
   * @description ko: 에셋 파이프라인 빌드 모드. 'development'는 Vite 개발 서버 사용, 'production'은 미리 빌드된 에셋 제공
   * @default "development"
   */
  mode: "development" | "production";

  /**
   * @description en: Static asset URL prefix for production builds. Must match the 'prefix' in app.useStaticAssets() configuration
   * @description ko: 프로덕션 빌드용 정적 에셋 URL 접두사. app.useStaticAssets()의 'prefix' 설정과 일치해야 함
   * @default "/public"
   */
  staticAssetPrefix: string;

  /**
   * @description en: Vite build output directory path. This is where 'npm run build' in resources directory outputs compiled assets
   * @description ko: Vite 빌드 출력 디렉토리 경로. resources 디렉토리에서 'npm run build' 실행시 컴파일된 에셋이 출력되는 위치
   * @default join(process.cwd(), "resources", "public", "builds")
   */
  buildOutDir: string;

  /**
   * @description en: Vite development server URL. Used for HMR (Hot Module Replacement) and asset serving during development
   * @description ko: Vite 개발 서버 URL. 개발 중 HMR(Hot Module Replacement) 및 에셋 제공에 사용
   * @default "http://localhost:5173"
   */
  devServerUrl: string;
};

export type CsrfTokenOptions = {
  /**
   * @description en: Enable CSRF protection. Requires active session middleware to function properly
   * @description ko: CSRF 보호 기능 활성화. 올바른 동작을 위해 세션 미들웨어 활성화 필요
   * @default true
   */
  enabled: boolean;

  /**
   * @description en: HTTP methods to ignore CSRF validation (safe methods). These methods are considered safe as they don't modify server state
   * @description ko: CSRF 검증을 무시할 HTTP 메서드들 (안전한 메서드들). 이 메서드들은 서버 상태를 변경하지 않어 안전한 것으로 간주
   * @default ["GET", "HEAD", "OPTIONS"]
   */
  ignoredMethods: string[];

  /**
   * @description en: Salt length for CSRF token generation. Higher values provide stronger security but increase token size
   * @description ko: CSRF 토큰 생성용 솔트 길이. 높은 값은 보안성을 향상시키지만 토큰 크기가 증가
   * @default 8
   */
  saltLength: number;

  /**
   * @description en: Secret length for CSRF token generation. Higher values provide stronger security but increase token size
   * @description ko: CSRF 토큰 생성용 시크릿 길이. 높은 값은 보안성을 향상시키지만 토큰 크기가 증가
   * @default 18
   */
  secretLength: number;
};

// --------------------------------------------------------
// 모듈에서 제공받을 통합 옵션
// --------------------------------------------------------

export type NestMvcOptions = {
  /**
   * @description en: Paths to exclude from middleware processing (e.g., API routes). Patterns support wildcards and are matched against request paths
   * @description ko: 미들웨어 처리에서 제외할 경로들 (예: API 라우트). 와일드카드 지원 및 요청 경로와 매칭
   * @default ["/api", "/favicon.ico", "/.well-known/appspecific/com.chrome.devtools.json"]
   */
  excludePaths?: string[];

  /**
   * @description en: Whether to output debug logs. Shows detailed information about middleware processing, template loading, and asset pipeline
   * @description ko: 디버그 로그 출력여부. 미들웨어 처리, 템플릿 로딩, 에셋 파이프라인에 대한 상세 정보 표시
   * @default false
   */
  debug?: boolean;

  /**
   * @description en: EdgeJS template engine configuration
   * @description ko: EdgeJS 템플릿 엔진 설정
   */
  view?: Partial<EdgeJsViewOptions>;

  /**
   * @description en: Vite asset pipeline configuration
   * @description ko: Vite 에셋 파이프라인 설정
   */
  asset?: Partial<ViteAssetsPipelineOptions>;

  /**
   * @description en: CSRF protection configuration
   * @description ko: CSRF 보호 설정
   */
  csrf?: Partial<CsrfTokenOptions>;
};
