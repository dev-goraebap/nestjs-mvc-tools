import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Response } from "express";
import { NestMvcReq } from "nestjs-mvc-tools";

@Controller({ path: "csrf-test" })
export class CsrfTestController {
  /**
   * @test en: Form page rendering for csrf failure test
   * @test ko: csrf 실패 테스트를 위한 폼 페이지 렌더링
   * http://localhost:3000/csrf-test/01
   */
  @Get("01")
  test01Index(@Req() req: NestMvcReq) {
    return req.view.render("pages/csrf_test/01");
  }

  /**
   * @test en: Failure test: Test if protected by csrf
   * - Should be error-handled before the actual controller is executed
   * @test ko: 실패 테스트: csrf로 보호되는지 테스트
   * 실제 해당 컨트롤러가 실행되기 전에 에러가 처리되어야함
   */
  @Post("01")
  test01Do() {
    console.log("console is not execute");
    return;
  }

  /**
   * @test en: Form page rendering for csrf success test
   * @test ko: csrf 성공 테스트를 위한 폼 페이지 렌더링
   * http://localhost:3000/csrf-test/02
   */
  @Get("02")
  test02Index(@Req() req: NestMvcReq) {
    return req.view.render("pages/csrf_test/02");
  }

  /**
   * @test en: Success test: Test if csrf authentication works well
   * - Should be error-handled before the actual controller is executed
   * @test ko: 성공 테스트: csrf 인증이 잘 되는지 테스트
   * - 실제 해당 컨트롤러가 실행되기 전에 에러가 처리되어야함
   */
  @Post("02")
  test02Do(@Req() req: NestMvcReq, @Res() res: Response) {
    console.log("csrf verify success");
    return res.redirect(req.headers.referer || "/csrf-test/02");
  }

  // ---------------------------------------------------------------------
  // en: Using the method provided by Hotwired/turbo.
  // When using <meta name="csrf-token" content="{{ csrfToken }}">,
  // Turbo sets x-csrf-token in request headers
  // 
  // ko: Hotwired/turbo가 제공하는 방법 사용.
  // <meta name="csrf-token" content="{{ csrfToken }}"> 을 사용하면
  // 터보가 request headers에 x-csrf-token 설정해줌
  // ---------------------------------------------------------------------

  /**
   * @test en: Form page rendering for csrf success test
   * @test ko: csrf 성공 테스트를 위한 폼 페이지 렌더링
   * http://localhost:3000/csrf-test/03
   */
  @Get("03")
  test03Index(@Req() req: NestMvcReq) {
    return req.view.render("pages/csrf_test/03");
  }

  /**
   * @test Success test: Test if csrf authentication works well
   * @test 성공 테스트: csrf 인증이 잘 되는지 테스트
   */
  @Post("03")
  test03Do(@Req() req: NestMvcReq, @Res() res: Response) {
    console.log("csrf verify success");
    return res.redirect(req.headers.referer || "/csrf-test/03");
  }
}
