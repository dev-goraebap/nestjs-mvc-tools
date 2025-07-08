import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Response } from "express";

import { NestMvcFlash } from "../shared/flash";
import {
  NEST_MVC_CORE_OPTIONS,
  NestMvcCoreOptions,
  NestMvcReq
} from "../shared/interfaces";

import { EdgeRegistry } from "./edge.registry";
import { NestMvcLogger } from "./nest-mvc-logger";

@Injectable()
export class NestMvcInitMiddleware implements NestMiddleware {
  private readonly logger: NestMvcLogger;

  constructor(
    private readonly edgeRegistry: EdgeRegistry,
    @Inject(NEST_MVC_CORE_OPTIONS)
    private readonly options: NestMvcCoreOptions
  ) {
    this.logger = new NestMvcLogger(NestMvcInitMiddleware.name, this.options.debug);
    this.logger.debug("Init EdgeViewInitMiddleware");
  }

  use(req: NestMvcReq, res: Response, next: (error?: any) => void) {
    this.logger.debug(`
    URL: ${req.baseUrl}
    METHOD: ${req.method}
    BODY: ${JSON.stringify(req.body)}
    QUERY: ${JSON.stringify(req.query)}
    `);

    // EdgeJsRegistry에서 기본 Edge 인스턴스를 가져와,
    // 이로부터 요청별로 독립적인 새 렌더러 인스턴스를 생성합니다.
    req.view = this.edgeRegistry.getInstance().createRenderer();
    this.logger.debug("Create New EdgeRenderer");

    req.flash = new NestMvcFlash(req);
    this.logger.debug("Create New FlashSession");

    req.view.share({ request: req });

    // GET 요청이 아니면 기본 초기화만 수행
    if (req.method !== "GET") {
      this.logger.debug(
        `${req.method} 요청이므로 기본 초기화만 수행 (${req.path})`
      );
      return next();
    }

    if (!req?.session) {
      this.logger.warn(`
      세션이 활성화되지 않았습니다. Flash, Csrf Token 기능을 사용하기 위해 세션을 설정해주세요.
      https://github.com/dev-goraebap/nestjs-mvc-tools?tab=readme-ov-file#express-session-recommended
      `);
      return next();
    }

    // 플래시 데이터를 템플릿에 자동 공유
    req.view.share({
      flash: req.flash.getAndClear(),
    });

    next();
  }
}
