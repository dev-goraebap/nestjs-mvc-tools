import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { NestMvcBaseExceptionHandler, NestMvcReq } from "nestjs-mvc-tools";

@Catch()
export class AppExceptionFilter
  extends NestMvcBaseExceptionHandler
  implements ExceptionFilter
{
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const req: NestMvcReq = host.switchToHttp().getRequest();
    const res: Response = host.switchToHttp().getResponse();

    this.logger.warn(exception.message);

    // ---------------------------------------------------------
    // api가 아닌 모든 경로는 페이지 관련 예외 처리
    // ---------------------------------------------------------

    if (!req.originalUrl.startsWith("/api")) {
      return this.handleMvcException(exception, req, res);
    }

    // ---------------------------------------------------------
    // API 예외처리
    // ---------------------------------------------------------

    if (exception instanceof HttpException) {
      return res.json({
        status: exception.getStatus(),
        message: exception.message,
      });
    } else {
      return res.json({
        status: 500,
        message: exception.message,
      });
    }
  }
}
