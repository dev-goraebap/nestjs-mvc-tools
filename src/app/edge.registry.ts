import { Inject, Injectable } from "@nestjs/common";
import { Edge } from "edge.js";
import { join } from "path";

import {
  NEST_MVC_CORE_OPTIONS,
  NestMvcCoreOptions,
} from "../interfaces/nest-mvc-core-options";
import { BaseLogger } from "../shared/base-logger";

import { EdgeHelpers } from "./edge.helper";

@Injectable()
export class EdgeRegistry extends BaseLogger {
  private edge: Edge | null = null;

  constructor(
    @Inject(NEST_MVC_CORE_OPTIONS)
    private readonly options: NestMvcCoreOptions
  ) {
    super(EdgeRegistry.name, options);
    this.debug("Init EdgeRegistry");
    this.init();
  }

  getInstance() {
    if (!this.edge) {
      throw new Error(
        "Edge.js가 초기화되지 않았습니다. edge-js 모듈이 등록되었는지 확인해 주세요."
      );
    }
    return this.edge;
  }

  private async init() {
    if (this.edge) {
      this.debug("Edge instance already exists, doing nothing.");
      return;
    }

    try {
      const { Edge: EdgeConstructor } = await import("edge.js");

      this.edge = EdgeConstructor.create({
        cache: this.options.edgeTemplate.cache,
      });

      this.debug(`기본 뷰 경로 마운트: ${this.options.edgeTemplate.rootDir}`);
      this.edge.mount(this.options.edgeTemplate.rootDir);

      for (let disk of this.options.edgeTemplate.disks) {
        this.debug(`추가 디스크 마운트: ${disk}`);
        this.edge.mount(disk, join(this.options.edgeTemplate.rootDir, disk));
      }

      const assetHelper = EdgeHelpers.createAssetHelper(this.options.vite);
      this.edge.global("asset", assetHelper);

      this.debug(`Edge.js 초기화 완료: ${this.options.edgeTemplate.rootDir}`);
    } catch (err: unknown) {
      this.logger.error("Edge.js 초기화에 실패하였습니다:", err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error(String(err));
    }
  }
}
