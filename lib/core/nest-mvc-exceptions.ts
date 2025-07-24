import { Response } from "express";
import { NestMvcReq } from "./nest-mvc.type";

/**
 * NestJS MVC 예외 처리용 베이스 추상 클래스
 *
 * - handleMvcException 메서드는 내부적으로 위의 유틸 함수를 호출하여 중복을 제거합니다.
 * - ExceptionFilter를 직접 구현할 때 이 클래스를 상속받아 사용
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
    // ---------------------------------------------------------------------
    // 유효성을 제외한 모든 에러처리. 에러페이지 랜더링
    // ---------------------------------------------------------------------

    // 일반 에러일 경우 에러페이지 랜더링
    if (exception instanceof Error) {
      const errMsg = exception.message;
      const statusCode = 500;
      return this.renderErrorPage(errMsg, statusCode, req, res);
    }

    // HttpException 에러이면서 BadRequest가 아닌 모든 경우 에러페이지 랜더링
    if (exception.getStatus() !== 400) {
      const errMsg = exception.message;
      const statusCode = exception.getStatus();
      return this.renderErrorPage(errMsg, statusCode, req, res);
    }

    // ---------------------------------------------------------------------
    // 유효성 에러 처리
    // ---------------------------------------------------------------------

    // 세션이 활성화된 경우 플래시 데이터 사용
    if (req?.session) {
      req.flash.error(exception.message).flashInput();
    }

    // 우선적으로 요청 본문의 _redirect_to 값이 있을 경우 해당 url 로 이동
    // 값이 없다면 요청을 보낸 url로 리다이렉트
    const redirectUrl = req.body?._redirect_to || req.headers.referer || "/";
    return res.redirect(303, redirectUrl);
  }

  private async renderErrorPage(
    errMsg: string,
    statusCode: number,
    req: NestMvcReq,
    res: Response
  ) {
    try {
      return res.send(
        await req.view.render("pages/errors/index", {
          error: errMsg,
          status: statusCode,
        })
      );
    } catch (renderError) {
      // 에러 페이지 렌더링 실패 시 기본 텍스트 응답
      return res.send(`Error ${statusCode}: ${errMsg}`);
    }
  }
}
