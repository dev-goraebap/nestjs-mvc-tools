import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
  Type,
} from "@nestjs/common";

import { EdgeJsService } from "./edge-js.service";
import { NestMvcOptionsService } from "./nest-mvc-options.service";
import { NestMvcMiddleware } from "./nest-mvc.middleware";
import { NestMvcOptions, NestMvcOptionsFactory } from "./nest-mvc.options";

@Module({})
export class NestMvcModule implements NestModule {
  /**
   * @description 전용 미들웨어 등록
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(NestMvcMiddleware).forRoutes("*");
  }

  // --------------------------------------------------------
  // 여러 방식으로 다이나믹 모듈 제공
  // --------------------------------------------------------

  /**
   * @description 다이나믹 모듈 사용방식 1
   */
  static forRoot(options: NestMvcOptions): DynamicModule {
    // 날것 그대로의 옵션 프로바이더 생성
    const nestMvcOptionsProvider: Provider = {
      provide: "NEST_MVC_OPTIONS",
      useValue: () => options,
    };
    return this.getDynamicModulePlainObj(nestMvcOptionsProvider);
  }

  /**
   * @description 다이나믹 모듈 사용방식 2
   */
  static forRootAsync(options: {
    useClass: Type<NestMvcOptionsFactory>;
  }): DynamicModule {
    // 의존성 주입 체이닝을 고려한 방식의 옵션 프로바이더 생성
    const nestMvcOptionsProvider: Provider = {
      provide: "NEST_MVC_OPTIONS",
      useFactory: async (factory: NestMvcOptionsFactory) => {
        return await factory.create();
      },
      inject: [options.useClass],
    };
    return this.getDynamicModulePlainObj(nestMvcOptionsProvider);
  }

  // --------------------------------------------------------
  // 공용 기능
  // --------------------------------------------------------

  private static getDynamicModulePlainObj(
    nestMvcOptionsProvider: Provider
  ): DynamicModule {
    return {
      global: true,
      module: NestMvcModule,
      providers: [
        // 제공된 옵션 프로바이더
        nestMvcOptionsProvider,
        // 옵션을 각 내부 클래스마다 필요한 옵션만 사용할 수 있게 제공하는 서비스
        NestMvcOptionsService,
        // EdgeJs 라이브러리를 Nestjs에서 사용할 수 있게 제공하는 서비스
        EdgeJsService,
      ],
    };
  }
}
