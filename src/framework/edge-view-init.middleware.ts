import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { EdgeView } from "../app/edge.view";
import {
  NEST_MVC_CORE_OPTIONS,
  NestMvcCoreOptions,
} from "../interfaces/nest-mvc-core-options";
import { BaseLogger } from "../shared/base-logger";

@Injectable()
export class EdgeViewInitMiddleware extends BaseLogger implements NestMiddleware {
  constructor(
    private readonly edgeView: EdgeView,
    @Inject(NEST_MVC_CORE_OPTIONS)
    private readonly options: NestMvcCoreOptions
  ) {
    super(EdgeViewInitMiddleware.name, options);
    this.debug("init EdgeViewInitMiddleware");
  }

  use(req: Request, res: Response, next: (error?: any) => void) {
    req.view = this.edgeView;
    next();
  }
}
