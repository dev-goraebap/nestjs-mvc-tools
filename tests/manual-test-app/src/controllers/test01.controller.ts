import { Controller, Get, Req } from "@nestjs/common";
import { NestMvcReq } from "nestjs-mvc-tools";

@Controller({ path: "test-01" })
export class Test01Controller {
  /**
   * @test 01. edgejs renderer 정상 작동 확인
   * http://localhost:3000/test-01
   */
  @Get()
  async test01(@Req() req: NestMvcReq) {
    return req.view.render("pages/test01/01");
  }

  /**
   * @test 02. 렌더러에 데이터 전달 정상 작동 확인
   * http://localhost:3000/test-01/02
   */
  @Get("/02")
  async test02(@Req() req: NestMvcReq) {
    return req.view.render("pages/test01/02", {
      message: "hello world",
    });
  }
}
