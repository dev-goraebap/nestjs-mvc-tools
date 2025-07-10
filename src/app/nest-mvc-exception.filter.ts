import { ArgumentsHost, Catch, ExceptionFilter, Inject } from "@nestjs/common";
import { Response } from "express";

import { MvcException, MvcValidationException } from "../shared/exceptions";
import {
  NEST_MVC_CORE_OPTIONS,
  NestMvcCoreOptions,
} from "../shared/interfaces/nest-mvc-core-options";
import { NestMvcReq } from "../shared/interfaces/nest-mvc-req";

import { NestMvcLogger } from "./nest-mvc-logger";

@Catch(MvcException)
export class NestMvcExceptionFilter implements ExceptionFilter {
  private readonly logger: NestMvcLogger;

  constructor(
    @Inject(NEST_MVC_CORE_OPTIONS)
    private readonly options: NestMvcCoreOptions
  ) {
    this.logger = new NestMvcLogger(
      NestMvcExceptionFilter.name,
      this.options.debug
    );
    this.logger.debug("Init MvcExceptionFilter");
  }

  async catch(exception: MvcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<NestMvcReq>();
    const res = ctx.getResponse<Response>();

    this.logger.debug(`MVC Exception 발생: ${exception.constructor.name}`, {
      message: exception.message,
      statusCode: exception.statusCode,
      data: exception.data,
    });

    // 유효성 검사 예외 처리
    if (exception instanceof MvcValidationException) {
      req.flash.error(exception.message).flashInput(["password", "_token"]);

      this.logger.debug(JSON.stringify(req.body));

      // 리다이렉트 URL 우선순위 적용
      const redirectUrl = req.body?._redirect_to || exception.redirectUrl || req.headers.referer || "/";

      this.logger.debug(`유효성 검사 실패 리다이렉트: ${redirectUrl}`, {
        exceptionRedirectUrl: exception.redirectUrl,
        referer: req.headers.referer,
        finalUrl: redirectUrl,
        errors: exception.errors,
      });

      return res.redirect(303, redirectUrl);
    }

    // 일반 MVC 예외 처리 (에러 페이지 렌더링)
    res.status(exception.statusCode);

    try {
      return res.send(
        await req.view.render("pages/errors/index", {
          error: exception.message,
          status: exception.statusCode,
        })
      );
    } catch (renderError) {
      // 에러 페이지 렌더링 실패 시 기본 텍스트 응답
      this.logger.error("Error page rendering failed", renderError);
      return res.send(`Error ${exception.statusCode}: ${exception.message}`);
    }
  }
}
