import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Response } from "express";

import { EdgeJsService } from "./edge-js.service";
import { NestMvcFlash } from "./nest-mvc-flash";
import { NestMvcReq } from "./nest-mvc.type";

@Injectable()
export class NestMvcMiddleware implements NestMiddleware {
  private readonly logger = new Logger(NestMvcMiddleware.name);

  constructor(private readonly edgeJsService: EdgeJsService) {}

  use(req: NestMvcReq, res: Response, next: (error?: any) => void) {
    // 매 요청마다 새로운 렌더러 생성
    // request 객체 view 속성에 생성된 랜더러 참조
    // 해당 속성은 라이브러리를 사용하는 nestjs의 인터셉터, 가드, 컨트롤러에서 사용될 수 있음
    const edge = this.edgeJsService.getEdgeInstance();
    req.view = edge.createRenderer();

    // request 객체 flash 속성에 플래시 기능 참조
    req.flash = new NestMvcFlash(req);

    // 세션을 사용할 경우 플레시 데이터 사용
    if (!req?.session) {
      this.logger.warn(`
      EN: Session not active. Please configure sessions to use Flash functionality.
      KO: 세션이 활성화되지 않았습니다. Flash 기능을 사용하기 위해 세션을 설정해주세요.
      https://github.com/dev-goraebap/nestjs-mvc-tools/tree/develop?tab=readme-ov-file#important-session-dependency
      `);
      return next();
    }

    // 플래시 데이터를 템플릿에 자동 공유
    req.view.share({
      flash: req.flash.getAndClear(),
    });
    return next();
  }
}
