import { Provider, Type } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { join } from "path";

import { NestMvcExceptionFilter } from "./app/nest-mvc-exception.filter";
import {
  NEST_MVC_CORE_OPTIONS,
  NestMvcCoreOptions,
  NestMvcCoreOptionsFactory,
} from "./shared/interfaces";

export function provideCoreOptionsSync(
  options?: Partial<NestMvcCoreOptions>
): Provider {
  return {
    provide: NEST_MVC_CORE_OPTIONS,
    useValue: mergeWithDefaults(options ?? {}),
  };
}

export function provideCoreOptionsAsync(
  useClass: Type<NestMvcCoreOptionsFactory>
): Provider {
  return {
    provide: NEST_MVC_CORE_OPTIONS,
    useFactory: async (factory: NestMvcCoreOptionsFactory) => {
      const options = await factory.create();
      return mergeWithDefaults(options);
    },
    inject: [useClass],
  };
}

export function provideExceptionFilter(): Provider {
  return { provide: APP_FILTER, useClass: NestMvcExceptionFilter };
}

/**
 * 사용자 옵션과 기본값을 병합하여 완전한 설정 객체를 생성합니다.
 */
function mergeWithDefaults(
  options: Partial<NestMvcCoreOptions> = {}
): NestMvcCoreOptions {
  const defaults: NestMvcCoreOptions = {
    edgeTemplate: {
      rootDir: join(process.cwd(), "resources", "views"),
      disks: [],
      cache: false,
    },
    vite: {
      mode: 'development',
      buildOutDir: join(process.cwd(), "resources", "public", "builds"),
      developServerUrl: "http://localhost:5173",
    },
    debug: false,
  };

  return {
    edgeTemplate: {
      ...defaults.edgeTemplate,
      ...options.edgeTemplate,
    },
    vite: {
      ...defaults.vite,
      ...options.vite,
    },
    debug: options.debug ?? defaults.debug,
  };
}
