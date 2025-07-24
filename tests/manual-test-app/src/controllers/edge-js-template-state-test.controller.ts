import { Controller, Get, Req } from "@nestjs/common";
import { NestMvcReq } from "nestjs-mvc-tools";

@Controller({ path: "edgejs-template-state-test" })
export class EdgeJsTemplateStateTestController {
  /**
   * @test 01. edgejs 글로벌 속성 사용
   * http://localhost:3000/edgejs-template-state-test/01
   * 
   * - 참고: main.ts 파일 - edge.global("hello", "world");
   */
  @Get("01")
  async test01(@Req() req: NestMvcReq) {
    return req.view.render("pages/edgejs_template_state_test/01");
  }

  /**
   * @test 02 요청 컨텍스트에 공유되는 share 상태 사용
   * http://localhost:3000/edgejs-template-state-test/02
   * 
   * - 참고: share.interceptor.ts 파일
   */
  @Get("02")
  async test02(@Req() req: NestMvcReq) {
    return req.view.render("pages/edgejs_template_state_test/02");
  }
}
