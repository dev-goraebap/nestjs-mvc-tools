import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  Scope,
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { EdgeView } from "../app/edge.view";
import {
  NEST_MVC_CORE_OPTIONS,
  NestMvcCoreOptions,
} from "../interfaces/nest-mvc-core-options";
import { BaseLogger } from "../shared/base-logger";

@Injectable({
  scope: Scope.REQUEST,
})
export class EdgeViewInitInterceptor
  extends BaseLogger
  implements NestInterceptor
{
  constructor(
    private readonly edgeView: EdgeView,
    @Inject(NEST_MVC_CORE_OPTIONS)
    private readonly options: NestMvcCoreOptions
  ) {
    super(EdgeViewInitInterceptor.name, options);
    this.debug(`
    ----------------------------------------
    | Init EdgeViewInitInterceptor
    ----------------------------------------
    | Note. 
    | - Request마다 생성됨
    | - EdgeView 인스턴스를 Request객체에 view
    | 로 주입
    ----------------------------------------
    `);
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    console.log("hello world");
    const req: Request = context.switchToHttp().getRequest();
    req.view = this.edgeView;
    return next.handle();
  }
}
