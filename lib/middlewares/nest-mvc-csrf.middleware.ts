import {
  ForbiddenException,
  Injectable,
  Logger,
  NestMiddleware,
} from "@nestjs/common";
import { Request, Response } from "express";

import { CsrfTokenOptions } from "../nest-mvc.options";
import { NestMvcReq } from "../nest-mvc.type";
import { NestMvcCsrfService } from "../services/nest-mvc-csrf.service";
import { NestMvcOptionsService } from "../services/nest-mvc-options.service";

@Injectable()
export class NestMvcCsrfMiddleware implements NestMiddleware {
  private readonly logger = new Logger(NestMvcCsrfMiddleware.name);
  private readonly options: CsrfTokenOptions;

  constructor(
    private readonly csrfService: NestMvcCsrfService,
    private readonly optionsService: NestMvcOptionsService
  ) {
    this.options = this.optionsService.csrfOptions;
  }

  use(req: NestMvcReq, res: Response, next: (error?: any) => void) {
    // CSRF 기능 비활성화시 통과
    if (!this.options.enabled) {
      return next();
    }

    // early return: 세션이 없으면 바로 반환
    if (!req?.session) {
      this.logger.warn(`
      EN: Session not active. Please configure sessions to use CSRF functionality.
      KO: 세션이 활성화되지 않았습니다. CSRF 기능을 사용하기 위해 세션을 설정해주세요.
      https://github.com/dev-goraebap/nestjs-mvc-tools/tree/develop?tab=readme-ov-file#important-session-dependency
      `);
      return next();
    }

    // 세션에 secret이 없으면 생성
    if (!req.session.csrfSecret) {
      req.session.csrfSecret = this.csrfService.generateSecret();
    }

    // 뷰가 있는 경우 템플릿에 토큰 전달 (모든 요청에서 공통)
    if (req.view) {
      req.view.share({
        csrfToken: this.csrfService.generateToken(req.session.csrfSecret),
      });
    }

    // early return: 무시할 메서드는 검증하지 않음
    const { ignoredMethods } = this.optionsService.csrfOptions;
    if (ignoredMethods.includes(req.method)) {
      return next();
    }

    // 토큰 검증 (secret 존재 확인 후 토큰 추출)
    const token = this.extractTokenFromRequest(req);
    if (
      !token ||
      !this.csrfService.verifyToken(req.session.csrfSecret, token)
    ) {
      return next(new ForbiddenException("Invalid CSRF token"));
    }

    next();
  }

  // 다양한 위치에서 토큰 추출
  private extractTokenFromRequest(req: Request): string | null {
    return (
      req.headers["x-csrf-token"] || req.body._csrf || req.query._csrf || null
    );
  }
}
