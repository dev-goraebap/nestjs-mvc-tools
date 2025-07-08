import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  Type,
} from "@nestjs/common";

import { EdgeRegistry } from "./app/edge.registry";
import { NestMvcInitMiddleware } from "./app/nest-mvc-init.middleware";
import {
  NestMvcCoreOptions,
  NestMvcCoreOptionsFactory,
} from "./shared/interfaces";
import {
  provideCoreOptionsAsync,
  provideCoreOptionsSync,
  provideExceptionFilter,
} from "./providers";

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
        provideExceptionFilter(),
        EdgeRegistry,
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
        provideExceptionFilter(),
        EdgeRegistry,
      ],
      global: true,
    };
  }
}
