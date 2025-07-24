import { Module } from "@nestjs/common";
import { join } from "path";
import { NestMvcModule } from '../../lib';
import { TestController } from "./test.controller";

@Module({
  imports: [
    NestMvcModule.forRoot({
      view: {
        rootDir: join(__dirname, "views"),
        disks: ["disk1"],
      },
    }),
  ],
  controllers: [TestController],
})
export class TestAppModule {}
