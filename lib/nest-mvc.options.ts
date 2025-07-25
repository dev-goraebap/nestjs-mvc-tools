// --------------------------------------------------------
// 개별 옵션
// --------------------------------------------------------

export type EdgeJsViewOptions = {
  rootDir: string;
  disks: string[];
  cache: boolean;
};

export type ViteAssetsPipelineOptions = {
  mode: "development" | "production";
  staticAssetPrefix: string;
  buildOutDir: string;
  devServerUrl: string;
};

export type CsrfTokenOptions = {
  enabled: boolean;
  ignoredMethods: string[];
  saltLength: number;
  secretLength: number;
};

// --------------------------------------------------------
// 모듈에서 제공받을 통합 옵션
// --------------------------------------------------------

export type NestMvcOptions = {
  view?: Partial<EdgeJsViewOptions>;
  asset?: Partial<ViteAssetsPipelineOptions>;
  csrf?: Partial<CsrfTokenOptions>;
};

// --------------------------------------------------------
// 통합 옵션 클래스 주입방식 제공
// --------------------------------------------------------

export interface NestMvcOptionsFactory {
  create(): Promise<NestMvcOptions> | NestMvcOptions;
}
