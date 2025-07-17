import { BadRequestException } from "@nestjs/common";
import { Response } from "express";
import { NestMvcReq } from "../interfaces";

/**
 * NestJS MVC 예외 처리 유틸 함수
 *
 * - BadRequestException 발생 시 flash 메시지와 input flash 처리 후 리다이렉트
 * - 그 외 예외는 커스텀 에러 페이지를 렌더링하여 응답
 *
 * 프로젝트에서 직접 ExceptionFilter를 구현할 때 이 함수를 호출하거나,
 * 아래의 추상 클래스를 상속받아 사용할 수 있습니다.
 */
export async function handleMvcException(
  exception: any,
  req: NestMvcReq,
  res: Response
) {
  if (exception instanceof BadRequestException) {
    req.flash.error(exception.message).flashInput(["password", "_token"]);
    const redirectUrl = req.body?._redirect_to || req.headers.referer || "/";
    return res.redirect(303, redirectUrl);
  }
  res.status(exception.getStatus());
  try {
    return res.send(
      await req.view.render("pages/errors/index", {
        error: exception.message,
        status: exception.getStatus(),
      })
    );
  } catch (renderError) {
    // 에러 페이지 렌더링 실패 시 기본 텍스트 응답
    return res.send(`Error ${exception.getStatus()}: ${exception.message}`);
  }
}

/**
 * NestJS MVC 예외 처리용 베이스 추상 클래스
 *
 * - handleMvcException 메서드는 내부적으로 위의 유틸 함수를 호출하여 중복을 제거합니다.
 * - ExceptionFilter를 직접 구현할 때 이 클래스를 상속받아 사용하거나,
 *   유틸 함수만 직접 호출하는 등 원하는 스타일로 활용하세요.
 */
export abstract class NestMvcBaseExceptionHandler {
  /**
   * 예외 처리 공통 로직을 실행합니다.
   * 필요시 자식 클래스에서 이 메서드를 호출하세요.
   */
  protected async handleMvcException(
    exception: any,
    req: NestMvcReq,
    res: Response
  ) {
    return handleMvcException(exception, req, res);
  }
}
