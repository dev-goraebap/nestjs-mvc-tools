import { Controller, Get, Req } from "@nestjs/common";
import { NestMvcReq } from "nestjs-mvc-tools";

@Controller({ path: "base-test" })
export class BaseTestController {
  /**
   * @test edgejs renderer 정상 작동 확인
   * http://localhost:3000/base-test/01
   */
  @Get("/01")
  async test01(@Req() req: NestMvcReq) {
    return req.view.render("pages/base_test/01");
  }

  /**
   * @test 렌더러에 데이터 전달 정상 작동 확인
   * http://localhost:3000/base-test/02
   */
  @Get("/02")
  async test02(@Req() req: NestMvcReq) {
    return req.view.render("pages/base_test/02", {
      message: "hello world",
    });
  }

  /**
   * @test EdgeJs 컴포넌트: 레이아웃 사용
   * http://localhost:3000/base-test/03
   */
  @Get("/03")
  async test03(@Req() req: NestMvcReq) {
    return req.view.render("pages/base_test/03");
  }

  /**
   * @test EdgeJs 컴포넌트: 재사용 컴포넌트 사용
   * http://localhost:3000/base-test/04
   */
  @Get("/04")
  async test04(@Req() req: NestMvcReq) {
    return req.view.render("pages/base_test/04");
  }

  /**
   * @test vite assets pipeline 정상 작동 확인
   * http://localhost:3000/base-test/05
   */
  @Get("/05")
  async test05(@Req() req: NestMvcReq) {
    return req.view.render("pages/base_test/05");
  }
}
