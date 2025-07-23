import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  Type,
} from "@nestjs/common";

import { EdgeRegistry } from "./core/edge.registry";
import { NestMvcInitMiddleware } from "./core/nest-mvc-init.middleware";
import { provideCoreOptionsAsync, provideCoreOptionsSync } from "./providers";
import {
  NEST_MVC_CORE_OPTIONS,
  NestMvcCoreOptions,
  NestMvcCoreOptionsFactory,
} from "./shared/interfaces";

@Module({})
export class NestMvcCoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(NestMvcInitMiddleware).exclude("/api/*path").forRoutes("*");
  }

  static forRoot(options?: Partial<NestMvcCoreOptions>): DynamicModule {
    return {
      module: NestMvcCoreModule,
      providers: [
        provideCoreOptionsSync(options),
        EdgeRegistry,
      ],
      exports: [NEST_MVC_CORE_OPTIONS],
      global: true,
    };
  }

  static forRootAsync(options: {
    useClass: Type<NestMvcCoreOptionsFactory>;
  }): DynamicModule {
    return {
      module: NestMvcCoreModule,
      providers: [
        options.useClass,
        provideCoreOptionsAsync(options.useClass),
        EdgeRegistry,
      ],
      exports: [NEST_MVC_CORE_OPTIONS],
      global: true,
    };
  }
}
