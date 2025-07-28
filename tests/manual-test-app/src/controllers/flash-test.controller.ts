import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { NestMvcReq } from "nestjs-mvc-tools";
import { Response } from "express";

@Controller({ path: "flash-test" })
export class FlashTestController {
  // -------------------------------------------------------------------
  // base test
  // -------------------------------------------------------------------

  /**
   * @test flash success or failure message
   * http://localhost:3000/flash-test/01
   */
  @Get("01")
  test01(@Req() req: NestMvcReq) {
    return req.view.render("pages/flash_test/01");
  }

  @Post("01")
  test01Do(@Req() req: NestMvcReq, @Res() res: Response) {
    if (req.body?.state === "success") {
      req.flash.success("task success");
    } else {
      req.flash.error("task failure");
    }
    return res.redirect(req.headers.referer || "/");
  }

  // -------------------------------------------------------------------
  // Old data test
  // -------------------------------------------------------------------

  /**
   * @test flash old data test
   * http://localhost:3000/flash-test/02
   */
  @Get("02")
  test02(@Req() req: NestMvcReq) {
    return req.view.render("pages/flash_test/02");
  }

  @Post("02")
  test02Do() {
    throw new BadRequestException("just failure!");
  }

  // -------------------------------------------------------------------
  // Old data with form extends test
  // -------------------------------------------------------------------

  /**
   * @test flash old data with form extends test
   * http://localhost:3000/flash-test/03
   */
  @Get("03")
  test03(@Req() req: NestMvcReq) {
    return req.view.render("pages/flash_test/03");
  }

  @Post("03")
  test03Do() {
    throw new BadRequestException("just failure!");
  }
}
