import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { NestMvcModule } from "nestjs-mvc-tools";
import { join } from "path";

import { BaseTestController } from "./controllers/base-test.controller";
import { CsrfTestController } from "./controllers/csrf-test.controller";
import { EdgeJsTemplateStateTestController } from "./controllers/edge-js-template-state-test.controller";
import { PageExceptionTestController } from "./controllers/page-exception-test.controller";
import { AppExceptionFilter } from "./exception.filter";
import { ShareInterceptor } from "./share.interceptor";

@Module({
  imports: [
    NestMvcModule.forRoot({
      view: {
        rootDir: join(__dirname, "..", "resources", "views"),
        disks: ["test-disk"],
        cache: true,
      },
      asset: {
        buildOutDir: join(__dirname, "..", "resources", "public", "builds"),
      },
      csrf: {
        enabled: true,
      },
      debug: true
    }),
  ],
  controllers: [
    BaseTestController,
    EdgeJsTemplateStateTestController,
    PageExceptionTestController,
    CsrfTestController
  ],
  providers: [
    { provide: APP_FILTER, useClass: AppExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ShareInterceptor },
  ],
})
export class AppModule {}
