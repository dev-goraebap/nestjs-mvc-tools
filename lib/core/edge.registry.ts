import { Inject, Injectable } from "@nestjs/common";
import { Edge } from "edge.js";
import { join } from "path";

import {
  NEST_MVC_CORE_OPTIONS,
  NestMvcCoreOptions,
} from "../shared/interfaces";

import { EdgeGlobalHelpers } from "./edge-global-helpers";
import { NestMvcLogger } from "./nest-mvc-logger";

@Injectable()
export class EdgeRegistry {
  private edge: Edge | null = null;
  private readonly logger: NestMvcLogger;

  constructor(
    @Inject(NEST_MVC_CORE_OPTIONS)
    private readonly options: NestMvcCoreOptions
  ) {
    this.logger = new NestMvcLogger(EdgeRegistry.name, options.debug);
    this.logger.debug("Init EdgeRegistry");
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
      this.logger.debug("Edge instance already exists, doing nothing.");
      return;
    }

    try {
      const { Edge: EdgeConstructor } = await import("edge.js");

      this.edge = EdgeConstructor.create({
        cache: this.options.edgeTemplate.cache,
      });

      this.edge.mount(this.options.edgeTemplate.rootDir);

      for (let disk of this.options.edgeTemplate.disks) {
        this.edge.mount(disk, join(this.options.edgeTemplate.rootDir, disk));
      }

      const assetHelper = EdgeGlobalHelpers.createAssetHelper(this.options.vite);
      this.edge.global("asset", assetHelper);

      this.logger.debug(`Edge.js 초기화 완료: ${this.options.edgeTemplate.rootDir}`);
    } catch (err: unknown) {
      this.logger.error("Edge.js 초기화에 실패하였습니다:", err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error(String(err));
    }
  }
}
