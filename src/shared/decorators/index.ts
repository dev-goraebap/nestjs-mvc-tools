import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { NestMvcFlash } from "../flash";
import { NestMvcReq, NestMvcView } from "../interfaces";

/**
 * 컨트롤러 메서드의 파라미터에 @View() 형식으로 사용
 * 렌더링 서비스 인스턴스에 접근 가능
 */
export const View = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req: NestMvcReq = ctx.switchToHttp().getRequest();
    return req.view as NestMvcView;
  }
);

/**
 * 컨트롤러 메서드의 파라미터에 @Flash() 형식으로 사용
 * 렌더링 서비스 인스턴스에 접근 가능
 */
export const Flash = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req: NestMvcReq = ctx.switchToHttp().getRequest();
    return req.flash as NestMvcFlash;
  }
);
