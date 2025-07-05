import { ArgumentsHost, Catch, ExceptionFilter, Inject } from "@nestjs/common";
import { Request, Response } from "express";

import {
  NEST_MVC_CORE_OPTIONS,
  NestMvcCoreOptions,
} from "../interfaces/nest-mvc-core-options";
import { BaseLogger } from "../shared/base-logger";
import { MvcException } from "./exceptions/base-mvc.exception";
import { MvcRedirectException } from "./exceptions/mvc-redirect.exception";
import { MvcValidationException } from "./exceptions/mvc-validation.exception";

@Catch(MvcException)
export class MvcExceptionFilter extends BaseLogger implements ExceptionFilter {
  constructor(
    @Inject(NEST_MVC_CORE_OPTIONS)
    private readonly options: NestMvcCoreOptions
  ) {
    // BaseLogger 생성자에 기본값 전달 (옵션이 없는 경우)
    super(MvcExceptionFilter.name, options);
  }

  async catch(exception: MvcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    this.debug(`MVC Exception 발생: ${exception.constructor.name}`, {
      message: exception.message,
      statusCode: exception.statusCode,
      data: exception.data,
    });

    // 리다이렉트 예외 처리
    if (exception instanceof MvcRedirectException) {
      return this.handleRedirectException(exception, req, res);
    }

    // 유효성 검사 예외 처리
    if (exception instanceof MvcValidationException) {
      return this.handleValidationException(exception, req, res);
    }

    // 일반 MVC 예외 처리 (에러 페이지 렌더링)
    return this.handleGeneralException(exception, req, res);
  }

  private async handleRedirectException(
    exception: MvcRedirectException,
    req: Request,
    res: Response
  ) {
    // 플래시 메시지 설정
    req.view.setFlash(
      exception.flashType,
      exception.message,
      exception.data || {}
    );

    this.debug(`리다이렉트: ${exception.redirectUrl}`);

    return res.redirect(exception.statusCode, exception.redirectUrl);
  }

  private async handleValidationException(
    exception: MvcValidationException,
    req: Request,
    res: Response
  ) {
    // 유효성 검사 실패 시 이전 페이지로 리다이렉트
    req.view.setFlash("alert", exception.message, {
      ...exception.data,
      errors: exception.errors,
    });

    const redirectUrl = req.headers.referer || req.originalUrl || "/";

    this.debug(`유효성 검사 실패 리다이렉트: ${redirectUrl}`, exception.errors);

    return res.redirect(303, redirectUrl);
  }

  private async handleGeneralException(
    exception: MvcException,
    req: Request,
    res: Response
  ) {
    res.status(exception.statusCode);

    try {
      return res.send(
        await req.view.render("pages/errors/index", {
          error: exception.message,
          status: exception.statusCode,
          data: exception.data,
        })
      );
    } catch (renderError) {
      // 에러 페이지 렌더링 실패 시 기본 텍스트 응답
      this.logger.error("Error page rendering failed", renderError);
      return res.send(`Error ${exception.statusCode}: ${exception.message}`);
    }
  }
}
