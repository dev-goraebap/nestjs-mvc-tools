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
    throw new NotFoundException("페이지를 찾을 수 없음");
  }

  /**
   * @test 500 Error
   * http://localhost:3000/page-exception-test/02
   */
  @Get("02")
  test02(@Req() req: NestMvcReq) {
    throw new InternalServerErrorException("무언가 잘못되었어요.");
  }

  /**
   * @test 존재하지 않는 템플릿 엔진 랜더링
   * http://localhost:3000/page-exception-test/03
   */
  @Get("03")
  test03(@Req() req: NestMvcReq) {
    return req.view.render("abcdefg");
  }
}
