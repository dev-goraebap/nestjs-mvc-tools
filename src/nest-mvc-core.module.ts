import {
  DynamicModule,
  Module,
  Type,
} from "@nestjs/common";

import { EdgeRegistry } from "./app/edge.registry";
import { EdgeView } from "./app/edge.view";
import {
  NestMvcCoreOptions,
  NestMvcCoreOptionsFactory
} from "./interfaces/nest-mvc-core-options";
import {
  provideCoreOptionsAsync,
  provideCoreOptionsSync,
  provideCsrfGuard,
  provideExceptionFilter,
  provideInitEdgeViewInterceptor,
} from "./providers";

@Module({})
export class NestMvcCoreModule {
  static forRoot(options?: Partial<NestMvcCoreOptions>): DynamicModule {
    return {
      module: NestMvcCoreModule,
      providers: [
        provideCoreOptionsSync(options),
        provideInitEdgeViewInterceptor(),
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
        provideInitEdgeViewInterceptor(),
        provideCsrfGuard(),
        provideExceptionFilter(),
        EdgeRegistry,
        EdgeView,
      ],
      global: true,
    };
  }
}
