import { Injectable } from "@nestjs/common";
import { join } from "path";
import {
  NestMvcOptionsFactory,
  NestMvcOptions,
} from "../../lib/v2/nest-mvc.options";

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
