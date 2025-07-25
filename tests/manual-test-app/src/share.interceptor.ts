import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { NestMvcReq } from "nestjs-mvc-tools";
import { Observable } from "rxjs";

@Injectable()
export class ShareInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const req: NestMvcReq = context.switchToHttp().getRequest();
    
    /**
     * Registered as global state for this request only
     * 해당 요청에 한해서 전역 상태로 등록됨
    */
    const categories = ["apple", "banana", "orange"];
    req.view.share({
      categories,
    });

    return next.handle();
  }
}
