import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response } from "express";

import { NestMvcReq } from "../nest-mvc.type";
import { EdgeJsService } from "../services/edge-js.service";
import { NestMvcLoggerService } from "../services/nest-mvc-logger.service";
import { NestMvcOptionsService } from "../services/nest-mvc-options.service";

@Injectable()
export class NestMvcViewMiddleware implements NestMiddleware {
  constructor(
    private readonly edgeJsService: EdgeJsService,
    private readonly optionsService: NestMvcOptionsService,
    private readonly logger: NestMvcLoggerService
  ) {}

  use(req: NestMvcReq, res: Response, next: (error?: any) => void) {
    // 제외 경로 체크
    if (
      this.optionsService.excludePaths.some((path) =>
        req.originalUrl.startsWith(path)
      )
    ) {
      return next();
    }

    // 매 요청마다 새로운 렌더러 생성
    // request 객체 view 속성에 생성된 랜더러 참조
    // 해당 속성은 라이브러리를 사용하는 nestjs의 인터셉터, 가드, 컨트롤러에서 사용될 수 있음
    const edge = this.edgeJsService.getEdgeInstance();
    req.view = edge.createRenderer();
    this.logger.debug("Create EdgeJs Renderer");

    // 헬퍼 등록이 안되어있으면 건너뜀
    if (this.optionsService.viewOptions.helpers.length === 0) {
      return next();
    }
    
    // 뷰에서 사용할 헬퍼 함수들을 수집
    const helpers: Record<string, any> = {};
    this.optionsService.viewOptions.helpers.forEach((helperFactory) => {
      const { key, fn } = helperFactory(req);
      helpers[key] = fn; // 헬퍼 함수를 키-값 쌍으로 저장
    });
    req.view.share(helpers);

    return next();
  }
}
