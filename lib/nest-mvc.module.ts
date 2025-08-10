import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from "@nestjs/common";

import { NestMvcCsrfMiddleware } from "./middlewares/nest-mvc-csrf.middleware";
import { NestMvcFlashMiddleware } from "./middlewares/nest-mvc-flash.middleware";
import { NestMvcViewMiddleware } from "./middlewares/nest-mvc-view.middleware";
import { NestMvcOptions } from "./nest-mvc.options";
import { EdgeJsService, GLOBALS_FACTORY_PROVIDER_TOKEN } from "./services/edge-js.service";
import { NestMvcCsrfService } from "./services/nest-mvc-csrf.service";
import { NestMvcLoggerService } from "./services/nest-mvc-logger.service";
import { NestMvcOptionsService } from "./services/nest-mvc-options.service";
import { ViteAssetPathHelperFactoryService } from "./services/vite-asset-path-helper-factory.service";

/**
 * NestJS MVC module providing server-side rendering capabilities.
 * Integrates Edge.js templating, Vite asset pipeline, and CSRF protection.
 */
@Module({})
export class NestMvcModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        NestMvcViewMiddleware, // Middleware that creates renderer for each request
        NestMvcFlashMiddleware, // Middleware that provides flash messages to renderer state
        NestMvcCsrfMiddleware // Middleware that generates and validates CSRF tokens
      )
      .forRoutes("*");
  }

  /**
   * Registers the module synchronously with static configuration.
   * @param options - Static configuration options for the module
   * @returns Dynamic module configuration
   */
  static forRoot(options?: NestMvcOptions): DynamicModule {
    // Create raw options provider
    const nestMvcOptionsProvider: Provider = {
      provide: "NEST_MVC_OPTIONS",
      useValue: options,
    };

    const providers: Provider[] = [
      // Additional options provider
      nestMvcOptionsProvider,
      // Service that provides options so each internal class can use only the options it needs
      NestMvcOptionsService,
      // Service that provides EdgeJs library for use in NestJS
      EdgeJsService,
      // Service that provides helper functions for easy Vite asset path management
      ViteAssetPathHelperFactoryService,
      // Service that provides CSRF token generation and validation
      NestMvcCsrfService,
      // NestMvc dedicated logger
      NestMvcLoggerService,
    ];

    // Create globals factory provider if globalsFactory and globalsInjects are provided
    const viewOptions = options?.view;
    if (viewOptions?.globalsFactory && viewOptions?.globalsInjects) {
      const globalsFactoryProvider: Provider = {
        provide: GLOBALS_FACTORY_PROVIDER_TOKEN,
        useFactory: viewOptions.globalsFactory,
        inject: viewOptions.globalsInjects,
      };
      providers.push(globalsFactoryProvider);
    }

    return {
      global: true,
      module: NestMvcModule,
      providers,
      exports: [EdgeJsService]
    };
  }
}
