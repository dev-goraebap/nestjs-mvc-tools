import { Module } from "@nestjs/common";
import { NestMvcModule } from "nestjs-mvc-tools";
import { join } from "path";

import { Test01Controller } from "./controllers/test01.controller";
import { Test02Controller } from "./controllers/test02.controller";

@Module({
  imports: [
    NestMvcModule.forRoot({
      view: {
        rootDir: join(__dirname, "..", "resources", "views"),
        disks: ["test-disk"],
      },
    }),
  ],
  controllers: [Test01Controller, Test02Controller],
})
export class AppModule {}
