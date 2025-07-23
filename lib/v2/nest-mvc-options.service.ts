import { Inject, Injectable } from "@nestjs/common";
import { join } from "path";

import { EdgeJsViewOptions, NestMvcOptions } from "./nest-mvc.options";

@Injectable()
export class NestMvcOptionsService {
  readonly viewOptions: EdgeJsViewOptions;

  constructor(
    @Inject("NEST_MVC_OPTIONS")
    private readonly options: NestMvcOptions
  ) {
    this.viewOptions = this.initViewOptions(this.options.view ?? {});
  }

  private initViewOptions(options: Partial<EdgeJsViewOptions>) {
    console.log(options);
    return {
      rootDir: options?.rootDir ?? join(process.cwd(), "resources", "views"),
      disks: options?.disks ?? [],
    };
  }
}
