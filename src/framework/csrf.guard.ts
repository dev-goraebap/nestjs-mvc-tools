import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

import {
  NEST_MVC_CORE_OPTIONS,
  NestMvcCoreOptions,
} from "../interfaces/nest-mvc-core-options";
import { BaseLogger } from "../shared/base-logger";

import { MvcRedirectException } from "./exceptions";

@Injectable()
export class CsrfGuard extends BaseLogger implements CanActivate {
  constructor(
    @Inject(NEST_MVC_CORE_OPTIONS)
    private readonly options: NestMvcCoreOptions
  ) {
    super(CsrfGuard.name, options);
    this.debug("Init CsrfGuard");
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // API 경로는 CSRF 검증 제외
    if (request.path.startsWith("/api/")) {
      return true;
    }

    // GET, HEAD, OPTIONS 등 안전한 요청은 CSRF 검증 제외
    if (!["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
      return true;
    }

    // CSRF 토큰 검증 (헤더, 바디, 쿼리에서)
    const tokenFromHeader = request.headers["x-csrf-token"] as string;
    const tokenFromBody = request.body?._csrft;
    // 쿼리에서 토큰 확인 (일반적으로 권장되지 않음)
    // 하지만 multipart/form-data + Multer 사용 시 Guard가 Interceptor보다 먼저 실행되어
    // body 파싱 전에 CSRF 검증이 필요한 경우 임시 해결책으로 사용
    const tokenFromQuery = request.query._csrft;
    const token = tokenFromHeader || tokenFromBody || tokenFromQuery;
    const sessionToken = request.session?.csrfToken;

    this.debug(`CSRF Token from header: ${tokenFromHeader}`);
    this.debug(`CSRF Token from body: ${tokenFromBody}`);
    this.debug(`CSRF Token from query: ${tokenFromQuery}`);
    this.debug(`CSRF Token from session: ${sessionToken}`);

    if (!token || token !== sessionToken) {
      this.debug("Invalid CSRF token");
      throw new MvcRedirectException(
        request.headers.referer || "/",
        "보안 토큰이 만료되었습니다. 페이지를 새로고침 후 다시 시도해주세요.",
        "alert"
      );
    }

    return true;
  }
}
