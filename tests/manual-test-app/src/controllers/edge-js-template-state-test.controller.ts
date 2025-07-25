import { Controller, Get, Req } from "@nestjs/common";
import { NestMvcReq } from "nestjs-mvc-tools";

@Controller({ path: "edgejs-template-state-test" })
export class EdgeJsTemplateStateTestController {
  /**
   * @test en: edgejs global property usage
   * - Reference: main.ts file - edge.global("hello", "world");
   * @test ko: edgejs 글로벌 속성 사용
   * - 참고: main.ts 파일 - edge.global("hello", "world");
   * 
   * http://localhost:3000/edgejs-template-state-test/01
   */
  @Get("01")
  async test01(@Req() req: NestMvcReq) {
    return req.view.render("pages/edgejs_template_state_test/01");
  }

  /**
   * @test en: Using share state shared in request context
   * - Reference: share.interceptor.ts file
   * @test ko: 요청 컨텍스트에 공유되는 share 상태 사용
   * - 참고: share.interceptor.ts 파일
   * 
   * http://localhost:3000/edgejs-template-state-test/02
   */
  @Get("02")
  async test02(@Req() req: NestMvcReq) {
    return req.view.render("pages/edgejs_template_state_test/02");
  }
}
