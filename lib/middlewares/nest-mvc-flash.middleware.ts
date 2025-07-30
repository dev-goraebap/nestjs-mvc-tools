import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response } from "express";

import { NestMvcFlash } from "../nest-mvc-flash";
import { NestMvcReq } from "../nest-mvc.type";
import { NestMvcLoggerService } from "../services/nest-mvc-logger.service";
import { NestMvcOptionsService } from "../services/nest-mvc-options.service";

@Injectable()
export class NestMvcFlashMiddleware implements NestMiddleware {

  constructor(
    private readonly optionsService: NestMvcOptionsService,
    private readonly logger: NestMvcLoggerService,
  ) {}

  use(req: NestMvcReq, res: Response, next: (error?: any) => void) {
    // 제외 경로 체크
    if (this.optionsService.excludePaths.some(path => req.originalUrl.startsWith(path))) {
      return next();
    }

    // request 객체 flash 속성에 플래시 기능 참조
    // 플래시 메시지 인스턴스 자체는 세션과 상관없이 생성.
    // 어차피 세션이 활성화 되지 않으면 기능이 작동하지 않음
    req.flash = new NestMvcFlash(req);

    // 뷰가 있는 경우에만 템플릿에 flash 데이터 전달
    if (req.view) {
      req.view.share({
        flash: req.flash.getAndClear(),
      });
    }

    this.logger.debug("Create NestMvcFlash");

    // 세션이 활성화되어있지 않으면 경고 로그 출력
    if (!req?.session) {
      this.logger.warn(`
      EN: Session not active. Please configure sessions to use Flash functionality.
      KO: 세션이 활성화되지 않았습니다. Flash 기능을 사용하기 위해 세션을 설정해주세요.
      https://github.com/dev-goraebap/nestjs-mvc-tools?tab=readme-ov-file#important-session-dependencies
      `);
    }

    next();
  }
}
