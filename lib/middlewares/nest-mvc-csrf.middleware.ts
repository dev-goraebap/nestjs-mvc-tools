import {
  ForbiddenException,
  Injectable,
  NestMiddleware
} from "@nestjs/common";
import { Request, Response } from "express";

import { CsrfTokenOptions } from "../nest-mvc.options";
import { NestMvcReq } from "../nest-mvc.type";
import { NestMvcCsrfService } from "../services/nest-mvc-csrf.service";
import { NestMvcLoggerService } from "../services/nest-mvc-logger.service";
import { NestMvcOptionsService } from "../services/nest-mvc-options.service";

@Injectable()
export class NestMvcCsrfMiddleware implements NestMiddleware {
  private readonly options: CsrfTokenOptions;

  constructor(
    private readonly csrfService: NestMvcCsrfService,
    private readonly optionsService: NestMvcOptionsService,
    private readonly logger: NestMvcLoggerService,
  ) {
    this.options = this.optionsService.csrfOptions;
  }

  use(req: NestMvcReq, res: Response, next: (error?: any) => void) {
    // 제외 경로 체크
    if (
      this.optionsService.excludePaths.some((path) =>
        req.originalUrl.startsWith(path)
      )
    ) {
      return next();
    }

    // CSRF 기능 비활성화시 통과
    if (!this.options.enabled) {
      this.logger.debug("Disabled NestMvcCsrf");
      return next();
    }

    this.logger.debug("Enabled NestMvcCsrf");

    // early return: 세션이 없으면 바로 반환
    if (!req?.session) {
      this.logger.warn(`
      Session not active. Please configure sessions to use CSRF functionality.
      https://github.com/dev-goraebap/nestjs-mvc-tools/blob/develop/docs/CONFIGURATION.md#important-session-dependencies
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
      next(new ForbiddenException("Invalid CSRF token"));
    }

    next();
  }

  // 다양한 위치에서 토큰 추출
  private extractTokenFromRequest(req: Request): string | null {
    return (
      req.headers["x-csrf-token"] || req.body?._csrf || req.query?._csrf || null
    );
  }
}
