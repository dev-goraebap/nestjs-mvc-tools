import { Controller, Get, Req } from "@nestjs/common";
import { NestMvcReq } from "nestjs-mvc-tools";

@Controller({ path: "test-02" })
export class Test02Controller {
  /**
   * @test 01. edgejs 글로벌 속성 사용
   * - 참고: main.ts 파일 - edge.global("hello", "world");
   * 
   * http://localhost:3000/test-02
   */
  @Get()
  async test01(@Req() req: NestMvcReq) {
    return req.view.render("pages/test02/01");
  }
}
