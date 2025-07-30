import { Inject, Injectable } from "@nestjs/common";
import { join } from "path";

import {
  CsrfTokenOptions,
  EdgeJsViewOptions,
  NestMvcOptions,
  ViteAssetsPipelineOptions,
} from "../nest-mvc.options";

/**
 * Service for managing NestJS MVC configuration options.
 * Provides access to various module settings and configurations.
 */
@Injectable()
export class NestMvcOptionsService {
  // --------------------------------------------------------
  // Properties
  // --------------------------------------------------------

  readonly excludePaths: string[];
  readonly debug: boolean;
  readonly viewOptions: EdgeJsViewOptions;
  readonly assetOptions: ViteAssetsPipelineOptions;
  readonly csrfOptions: CsrfTokenOptions;

  // --------------------------------------------------------
  // Methods
  // --------------------------------------------------------

  constructor(
    @Inject("NEST_MVC_OPTIONS")
    private readonly options: NestMvcOptions
  ) {
    this.excludePaths = this.options.excludePaths ?? [
      "/api",
      "/favicon.ico",
      "/.well-known/appspecific/com.chrome.devtools.json",
    ];
    this.debug = this.options.debug ?? false;
    this.viewOptions = this.initViewOptions(this.options.view ?? {});
    this.assetOptions = this.initAssetPipelineOptions(this.options.asset ?? {});
    this.csrfOptions = this.initCsrfTokenOptions(this.options.csrf ?? {});
  }

  private initViewOptions(
    options: Partial<EdgeJsViewOptions>
  ): EdgeJsViewOptions {
    return {
      rootDir: options?.rootDir ?? join(process.cwd(), "resources", "views"),
      disks: options?.disks ?? [],
      cache: options?.cache ?? false,
    };
  }

  private initAssetPipelineOptions(
    options: Partial<ViteAssetsPipelineOptions>
  ): ViteAssetsPipelineOptions {
    return {
      mode: options?.mode ?? "development",
      staticAssetPrefix: options?.staticAssetPrefix ?? "/public",
      buildOutDir:
        options?.buildOutDir ??
        join(process.cwd(), "resources", "public", "builds"),
      devServerUrl: options?.devServerUrl ?? "http://localhost:5173",
    };
  }

  private initCsrfTokenOptions(
    options: Partial<CsrfTokenOptions>
  ): CsrfTokenOptions {
    return {
      enabled: options?.enabled ?? false,
      ignoredMethods: options?.ignoredMethods ?? ["GET", "HEAD", "OPTIONS"],
      saltLength: options?.saltLength ?? 8,
      secretLength: options?.secretLength ?? 18,
    };
  }
}
