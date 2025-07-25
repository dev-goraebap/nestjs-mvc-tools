import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Req,
} from "@nestjs/common";
import { NestMvcReq } from "nestjs-mvc-tools";

@Controller({ path: "page-exception-test" })
export class PageExceptionTestController {
  /**
   * @test 404 Error
   * http://localhost:3000/page-exception-test/01
   */
  @Get("01")
  test01(@Req() req: NestMvcReq) {
    throw new NotFoundException("Page not found");
  }

  /**
   * @test 500 Error
   * http://localhost:3000/page-exception-test/02
   */
  @Get("02")
  test02(@Req() req: NestMvcReq) {
    throw new InternalServerErrorException("Something went wrong.");
  }

  /**
   * @test en: Rendering non-existent template engine
   * @test ko: 존재하지 않는 템플릿 엔진 렌더링
   * http://localhost:3000/page-exception-test/03
   */
  @Get("03")
  test03(@Req() req: NestMvcReq) {
    return req.view.render("abcdefg");
  }
}
