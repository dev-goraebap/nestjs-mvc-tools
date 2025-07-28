import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
  Type,
} from "@nestjs/common";

import { NestMvcCsrfMiddleware } from "./middlewares/nest-mvc-csrf.middleware";
import { NestMvcFlashMiddleware } from "./middlewares/nest-mvc-flash.middleware";
import { NestMvcViewMiddleware } from "./middlewares/nest-mvc-view.middleware";
import { NestMvcOptions, NestMvcOptionsFactory } from "./nest-mvc.options";
import { EdgeJsService } from "./services/edge-js.service";
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

  // --------------------------------------------------------
  // Multiple ways to provide dynamic modules
  // --------------------------------------------------------

  /**
   * Registers the module synchronously with static configuration.
   * @param options - Static configuration options for the module
   * @returns Dynamic module configuration
   */
  static forRoot(options: NestMvcOptions): DynamicModule {
    // Create raw options provider
    const nestMvcOptionsProvider: Provider = {
      provide: "NEST_MVC_OPTIONS",
      useValue: options,
    };
    return this.createDynamicModule([nestMvcOptionsProvider]);
  }

  /**
   * Registers the module asynchronously with factory-based configuration.
   * @param options - Asynchronous configuration options with factory class
   * @returns Dynamic module configuration
   */
  static forRootAsync(options: {
    useClass: Type<NestMvcOptionsFactory>;
  }): DynamicModule {
    // Create options provider considering dependency injection chaining
    const nestMvcOptionsProvider: Provider = {
      provide: "NEST_MVC_OPTIONS",
      useFactory: async (factory: NestMvcOptionsFactory) => {
        return await factory.create();
      },
      inject: [options.useClass],
    };

    // Register factory class specified in useClass as provider
    const factoryProvider: Provider = {
      provide: "NEST_MVC_OPTIONS_FACTORY",
      useClass: options.useClass,
    };

    return this.createDynamicModule([
      nestMvcOptionsProvider,
      factoryProvider,
    ]);
  }

  // --------------------------------------------------------
  // Common functionality
  // --------------------------------------------------------

  private static createDynamicModule(
    additionalProviders: Provider[] = []
  ): DynamicModule {
    return {
      global: true,
      module: NestMvcModule,
      providers: [
        // Additional providers
        ...additionalProviders,
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
      ],
    };
  }
}
