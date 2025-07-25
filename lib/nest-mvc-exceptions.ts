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
    // HttpException 체크 (getStatus 메서드 존재 여부로 판별)
    // 
    // instanceof HttpException 체크가 자꾸 실패함,, Claude 왈 다음과 같음
    // 1. 라이브러리와 사용자 애플리케이션 간의 @nestjs/common 버전 차이
    // 2. npm/yarn의 중복 패키지 설치로 인한 서로 다른 HttpException 클래스 참조
    // 3. TypeScript 컴파일 시점과 런타임 시점의 타입 정보 불일치
    // 4. 패키지 호이스팅 문제로 인한 다른 모듈 경로의 HttpException 사용
    //
    // 일단 버전차이는 아닌데, 정상적인 코드가 자꾸 실행이 안되니 화가나서 다음과 같은 코드를 사용합니다.
    if (typeof exception.getStatus === 'function') {
      const statusCode = exception.getStatus();
      
      // BadRequest(400)는 유효성 에러로 플래시 처리
      if (statusCode === 400) {
        return this.handleValidationError(exception, req, res);
      }
      
      // 기타 HttpException은 해당 상태 코드로 에러 페이지 렌더링
      return this.renderErrorPage(exception.message, statusCode, req, res);
    }
    
    // 알 수 없는 예외는 500으로 처리
    return this.renderErrorPage('Internal Server Error', 500, req, res);
  }

  private handleValidationError(
    exception: any,
    req: NestMvcReq,
    res: Response
  ) {
    // 세션이 활성화된 경우에만 플래시 메시지 설정
    if (req?.session) {
      req.flash.error(exception.message).flashInput();
    }

    // 리다이렉트 URL 결정 (우선순위: _redirect_to > referer > 홈)
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
      const html = await req.view.render("pages/errors/index", {
        error: errMsg,
        status: statusCode,
      });
      return res.status(statusCode).send(html);
    } catch (renderError) {
      // 에러 페이지 렌더링 실패 시 기본 텍스트 응답
      return res.status(statusCode).send(`Error ${statusCode}: ${errMsg}`);
    }
  }
}
