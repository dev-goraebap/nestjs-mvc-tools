import { Controller, Get, Req } from "@nestjs/common";
import { NestMvcReq } from "nestjs-mvc-tools";

@Controller("view-helper-test")
export class ViewHelperTestController {
  @Get("01")
  async test01(@Req() req: NestMvcReq) {
    return req.view.render("pages/view-helper-test/01");
  }
}
