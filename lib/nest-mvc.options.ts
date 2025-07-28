// --------------------------------------------------------
// 개별 옵션
// --------------------------------------------------------

export type EdgeJsViewOptions = {
  /**
   * @description en: Template root directory path
   * @description ko: 템플릿 루트 디렉토리 경로
   * @default join(process.cwd(), "resources", "views")
   */
  rootDir: string;

  /**
   * @description en: Additional template disk directories to mount
   * @description ko: 마운트할 추가 템플릿 디스크 디렉토리들
   * @default []
   */
  disks: string[];

  /**
   * @description en: Enable template caching for performance
   * @description ko: 성능 향상을 위한 템플릿 캐싱 활성화
   * @default true
   */
  cache: boolean;
};

export type ViteAssetsPipelineOptions = {
  /**
   * @description en: Build mode for asset pipeline
   * @description ko: 에셋 파이프라인 빌드 모드
   * @default "development"
   */
  mode: "development" | "production";

  /**
   * @description en: Static asset URL prefix for production builds
   * @description ko: 프로덕션 빌드용 정적 에셋 URL 접두사
   * @default "/public"
   */
  staticAssetPrefix: string;

  /**
   * @description en: Vite build output directory path
   * @description ko: Vite 빌드 출력 디렉토리 경로
   * @default join(process.cwd(), "resources", "public", "builds")
   */
  buildOutDir: string;

  /**
   * @description en: Vite development server URL
   * @description ko: Vite 개발 서버 URL
   * @default "http://localhost:5173"
   */
  devServerUrl: string;
};

export type CsrfTokenOptions = {
  /**
   * @description en: Enable CSRF protection
   * @description ko: CSRF 보호 기능 활성화
   * @default false
   */
  enabled: boolean;

  /**
   * @description en: HTTP methods to ignore CSRF validation (safe methods)
   * @description ko: CSRF 검증을 무시할 HTTP 메서드들 (안전한 메서드들)
   * @default ["GET", "HEAD", "OPTIONS"]
   */
  ignoredMethods: string[];

  /**
   * @description en: Salt length for CSRF token generation
   * @description ko: CSRF 토큰 생성용 솔트 길이
   * @default 8
   */
  saltLength: number;

  /**
   * @description en: Secret length for CSRF token generation
   * @description ko: CSRF 토큰 생성용 시크릿 길이
   * @default 18
   */
  secretLength: number;
};

// --------------------------------------------------------
// 모듈에서 제공받을 통합 옵션
// --------------------------------------------------------

export type NestMvcOptions = {
  /**
   * @description en: Paths to exclude from middleware processing (e.g., API routes)
   * @description ko: 미들웨어 처리에서 제외할 경로들 (예: API 라우트)
   * @default ["/api", "/favicon.ico", "/.well-known/appspecific/com.chrome.devtools.json"]
   */
  excludePaths?: string[];

  /**
   * @description en: Whether to output debug logs
   * @description ko: 디버그 로그 출력여부
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
