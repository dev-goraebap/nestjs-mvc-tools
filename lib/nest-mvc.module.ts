import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
  Type,
} from "@nestjs/common";

import { NestMvcFlashMiddleware } from "./middlewares/nest-mvc-flash.middleware";
import { NestMvcViewMiddleware } from "./middlewares/nest-mvc-view.middleware";
import { NestMvcOptions, NestMvcOptionsFactory } from "./nest-mvc.options";
import { EdgeJsService } from "./services/edge-js.service";
import { NestMvcCsrfService } from "./services/nest-mvc-csrf.service";
import { NestMvcOptionsService } from "./services/nest-mvc-options.service";
import { ViteAssetPathHelperFactoryService } from "./services/vite-asset-path-helper-factory.service";
import { NestMvcCsrfMiddleware } from "./middlewares/nest-mvc-csrf.middleware";

@Module({})
export class NestMvcModule implements NestModule {
  /**
   * @description 전용 미들웨어 등록
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        NestMvcViewMiddleware, // 요청마다 렌더러를 생성하는 미들웨어
        NestMvcFlashMiddleware, // 플래시 메시지를 렌더러의 상태로 제공하는 미들웨어
        NestMvcCsrfMiddleware // CSRF 토큰을 생성하고 검증하는 미들웨어
      )
      // .exclude("/api/*path") <- is not working... what the xx
      .forRoutes("*");
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
      useValue: options,
    };
    return this.getDynamicModulePlainObj([nestMvcOptionsProvider]);
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

    // useClass에서 지정한 팩토리 클래스도 프로바이더로 등록
    const factoryProvider: Provider = {
      provide: "NEST_MVC_OPTIONS_FACTORY",
      useClass: options.useClass,
    };

    return this.getDynamicModulePlainObj([
      nestMvcOptionsProvider,
      factoryProvider,
    ]);
  }

  // --------------------------------------------------------
  // 공용 기능
  // --------------------------------------------------------

  private static getDynamicModulePlainObj(
    additionalProviders: Provider[] = []
  ): DynamicModule {
    return {
      global: true,
      module: NestMvcModule,
      providers: [
        // 추가 프로바이더들
        ...additionalProviders,
        // 옵션을 각 내부 클래스마다 필요한 옵션만 사용할 수 있게 제공하는 서비스
        NestMvcOptionsService,
        // EdgeJs 라이브러리를 Nestjs에서 사용할 수 있게 제공하는 서비스
        EdgeJsService,
        // (Vite 에셋 경로를 관리하기 쉽게 생성해 주는) 헬퍼 함수를 제공하는 서비스
        ViteAssetPathHelperFactoryService,
        // CSRF 토큰 생성, 검증을 제공하는 서비스
        NestMvcCsrfService,
      ],
    };
  }
}
