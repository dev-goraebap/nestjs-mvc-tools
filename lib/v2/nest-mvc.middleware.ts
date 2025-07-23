import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response } from "express";

import { EdgeJsService } from "./edge-js.service";
import { NestMvcReq } from "./nest-mvc.type";

@Injectable()
export class NestMvcMiddleware implements NestMiddleware {
  constructor(private readonly edgeJsService: EdgeJsService) {}

  use(req: NestMvcReq, res: Response, next: (error?: any) => void) {
    // 매 요청마다 새로운 렌더러 생성
    const edge = this.edgeJsService.getEdgeInstance();
    const renderer = edge.createRenderer();

    // request 객체 view 속성에 생성된 랜더러 참조
    // 해당 속성은 라이브러리를 사용하는 nestjs의 인터셉터, 가드, 컨트롤러에서 사용될 수 있음
    req.view = renderer;
    next();
  }
}
