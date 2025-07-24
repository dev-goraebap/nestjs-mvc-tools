import { Injectable } from "@nestjs/common";
import { join } from "path";
import { NestMvcOptionsFactory, NestMvcOptions } from "../../lib";

@Injectable()
export class TestOptionsFactory implements NestMvcOptionsFactory {
  create(): NestMvcOptions {
    return {
      view: {
        rootDir: join(__dirname, "views"),
        disks: ["disk1"],
      },
    };
  }
}
