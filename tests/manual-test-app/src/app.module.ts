import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { NestMvcModule } from "nestjs-mvc-tools";
import { join } from "path";

import { BaseTestController } from "./controllers/base-test.controller";
import { EdgeJsTemplateStateTestController } from "./controllers/edge-js-template-state-test.controller";
import { AppExceptionFilter } from "./exception.filter";
import { ShareInterceptor } from "./share.interceptor";
import { PageExceptionTestController } from "./controllers/page-exception-test.controller";

@Module({
  imports: [
    NestMvcModule.forRoot({
      view: {
        rootDir: join(__dirname, "..", "resources", "views"),
        disks: ["test-disk"],
      },
    }),
  ],
  controllers: [
    BaseTestController,
    EdgeJsTemplateStateTestController,
    PageExceptionTestController,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AppExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ShareInterceptor },
  ],
})
export class AppModule {}
