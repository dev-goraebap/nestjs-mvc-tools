import { Injectable } from "@nestjs/common";
import { Edge } from "edge.js";
import { join } from "path";
import { NestMvcOptionsService } from "./nest-mvc-options.service";
import { EdgeJsViewOptions } from "./nest-mvc.options";
import { ViteAssetPathHelperFactory } from "./vite-asset-path-helper.factory";

/**
 * EdgeJs 템플릿 엔진을 N
 */
@Injectable()
export class EdgeJsService {
  // --------------------------------------------------------
  // 속성그룹
  // --------------------------------------------------------

  private edgeInstance: Edge | null = null;
  private readonly options: EdgeJsViewOptions;

  // --------------------------------------------------------
  // 기능그룹
  // --------------------------------------------------------

  constructor(
    private readonly optionsService: NestMvcOptionsService,
    private readonly viteAssetPathHelperFactory: ViteAssetPathHelperFactory
  ) {
    this.options = this.optionsService.viewOptions;
    this.init();
  }

  getEdgeInstance() {
    if (!this.edgeInstance) {
      throw new Error("not initialized edge instance");
    }
    return this.edgeInstance;
  }

  private init() {
    try {
      // EdgeJs 인스턴스 생성 및 속성 할당
      this.edgeInstance = Edge.create({
        cache: this.options.cache,
      });

      // 기본 경로 마운트
      console.log(this.options.rootDir);
      this.edgeInstance.mount(this.options.rootDir);

      // 사용자 지정 디스크 마운트
      for (const disk of this.options.disks) {
        this.edgeInstance.mount(disk, join(this.options.rootDir, disk));
      }

      // [viteAssetPath] 라는 key로 관련 헬퍼 함수 등록
      const viteAssetPathHelperFn = this.viteAssetPathHelperFactory.create();
      this.edgeInstance.global("viteAssetPath", viteAssetPathHelperFn);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error(String(err));
    }
  }
}
