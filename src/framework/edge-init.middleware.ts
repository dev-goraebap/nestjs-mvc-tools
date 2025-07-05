import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { EdgeView } from "../app/edge.view";
import {
  NEST_MVC_CORE_OPTIONS,
  NestMvcCoreOptions,
} from "../interfaces/nest-mvc-core-options";
import { BaseLogger } from "../shared/base-logger";

@Injectable()
export class EdgeInitMiddleware extends BaseLogger implements NestMiddleware {
  constructor(
    private readonly edgeView: EdgeView,
    @Inject(NEST_MVC_CORE_OPTIONS)
    private readonly options: NestMvcCoreOptions
  ) {
    super(EdgeInitMiddleware.name, options);
    this.debug("init EdgeJsMiddleware");
  }

  use(req: Request, res: Response, next: (error?: any) => void) {
    // EdgeView 인스턴스를 요청 객체에 주입합니다.
    req.view = this.edgeView;
    next();
  }
}
