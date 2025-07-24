import { Controller, Get, Req } from "@nestjs/common";
import { NestMvcReq } from "../../lib/v2/nest-mvc.type";

@Controller()
export class TestController {
  @Get("/")
  async index(@Req() req: NestMvcReq) {
    return req.view.render("hello", {
      message: "Hello from v2",
      timestamp: new Date().toISOString(),
    });
  }

  @Get("/data-binding")
  async dataBinding(@Req() req: NestMvcReq) {
    return req.view.render("data-test", {
      user: { name: "John", age: 30 },
      items: ["apple", "banana", "cherry"],
    });
  }

  @Get("/custom-disk-template")
  async customDiskTemplate(@Req() req: NestMvcReq) {
    // 등록된 disk1을 인식하는지 테스트
    return req.view.render("::disk1/disk-test", {});
  }

  @Get("/missing-template")
  async missingTemplate(@Req() req: NestMvcReq) {
    // 존재하지 않는 템플릿을 렌더링하여 에러 테스트
    return req.view.render("non-existent-template", {});
  }
}
