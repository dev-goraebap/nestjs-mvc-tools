import { Response } from "express";
import { NestMvcReq } from "./nest-mvc.type";

/**
 * NestJS MVC 예외 처리 유틸 함수
 *
 * - BadRequestException 발생 시 flash 메시지와 input flash 처리 후 리다이렉트
 * - 그 외 예외는 커스텀 에러 페이지를 렌더링하여 응답
 *
 * ⚠️ 참고: BadRequestException 등 NestJS의 Exception 타입을 instanceof로 직접 비교할 경우,
 *   라이브러리와 사용하는 프로젝트의 @nestjs/common 버전/인스턴스가 다르면
 *   instanceof가 false가 되어 코드가 정상 동작하지 않는 문제가 있는 것 같습니다. (추측)
 *   (예: node_modules 중복 설치, npm dedupe 미적용 등)
 *   이런 경우 getStatus() === 400 등으로 비교하는 것이 더 안전할 수 있습니다.
 *
 * 프로젝트에서 직접 ExceptionFilter를 구현할 때 이 함수를 호출하거나,
 * 아래의 추상 클래스를 상속받아 사용할 수 있습니다.
 */
export async function handleMvcException(
  exception: any,
  req: NestMvcReq,
  res: Response
) {
  if (exception.getStatus() === 400) {
    // req.flash.error(exception.message).flashInput();
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
