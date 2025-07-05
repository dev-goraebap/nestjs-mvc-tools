import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  Type,
} from "@nestjs/common";

import { EdgeRegistry } from "./app/edge.registry";
import { EdgeView } from "./app/edge.view";
import { EdgeInitMiddleware } from "./framework/edge-init.middleware";
import {
  NestMvcCoreOptions,
  NestMvcCoreOptionsFactory
} from "./interfaces/nest-mvc-core-options";
import {
  provideCoreOptionsAsync,
  provideCoreOptionsSync,
  provideCsrfGuard,
  provideExceptionFilter,
} from "./providers";

@Module({})
export class NestMvcCoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EdgeInitMiddleware).exclude("/api/*path").forRoutes("*");
  }

  static forRoot(options?: Partial<NestMvcCoreOptions>): DynamicModule {
    return {
      module: NestMvcCoreModule,
      providers: [
        provideCoreOptionsSync(options),
        provideCsrfGuard(),
        provideExceptionFilter(),
        EdgeRegistry,
        EdgeView,
      ],
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
        provideCsrfGuard(),
        provideExceptionFilter(),
        EdgeRegistry,
        EdgeView,
      ],
      global: true,
    };
  }
}
