// --------------------------------------------------------
// View 관련 옵션
// --------------------------------------------------------

export type EdgeJsViewOptions = {
  rootDir: string;
  disks: string[];
};

// --------------------------------------------------------
// 모듈에서 제공받을 통합 옵션
// --------------------------------------------------------

export type NestMvcOptions = {
  view?: Partial<EdgeJsViewOptions>;
};

// --------------------------------------------------------
// 통합 옵션 클래스 주입방식 제공
// --------------------------------------------------------

export interface NestMvcOptionsFactory {
  create(): Promise<NestMvcOptions> | NestMvcOptions;
}
