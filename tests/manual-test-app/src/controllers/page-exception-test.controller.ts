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
    throw new InternalServerErrorException("뭔가 이상해요.");
  }

  /**
   * @test 존재하지 않는 템플릿 엔진 랜더링
   * http://localhost:3000/page-exception-test/03
   *
   * 이 경우 500 에러가 발생. HttpException이 아닌 Error. 에러 핸들링을 하려고 하기보단 올바른 경로 입력하도록 하기
   * 이 외에 템플릿에서 잘못된 데이터 사용등 나는 에러는 사용에 주의. 어떤식으로 라이브러리에서 해결하면 되는지 고민중
   */
  @Get("03")
  test03(@Req() req: NestMvcReq) {
    return req.view.render("abcdefg");
  }
}
