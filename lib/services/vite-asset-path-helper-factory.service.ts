import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";

import { ViteAssetsPipelineOptions } from "../nest-mvc.options";
import { NestMvcLoggerService } from "./nest-mvc-logger.service";
import { NestMvcOptionsService } from "./nest-mvc-options.service";

/**
 * Factory service for creating Vite asset path helper functions.
 * Generates helpers for resolving asset paths in both development and production modes.
 */
@Injectable()
export class ViteAssetPathHelperFactoryService {
  // --------------------------------------------------------
  // Properties
  // --------------------------------------------------------

  private readonly options: ViteAssetsPipelineOptions;

  // --------------------------------------------------------
  // Methods
  // --------------------------------------------------------

  constructor(
    private readonly optionsService: NestMvcOptionsService,
    private readonly logger: NestMvcLoggerService
  ) {
    this.options = this.optionsService.assetOptions;
    this.logger.debug('ViteAssetPathHelperFactoryService constructor called', ViteAssetPathHelperFactoryService.name);
    this.logger.debug(`Asset options: mode=${this.options.mode}, devServerUrl=${this.options.devServerUrl}`, ViteAssetPathHelperFactoryService.name);
  }

  create(): (path: string) => string {
    this.logger.debug('Creating Vite asset path helper function', ViteAssetPathHelperFactoryService.name);
    let manifest: Record<string, any> | null = null;

    const options = this.options;
    const logger = this.logger;

    return function viteAssetPath(path: string): string {
      logger.debug(`Resolving asset path: ${path} in ${options.mode} mode`, ViteAssetPathHelperFactoryService.name);
      // Return Vite dev server URL in development environment
      if (options.mode === "development") {
        const resolvedPath = `${options.devServerUrl}/${path}`;
        logger.debug(`Development mode - resolved to: ${resolvedPath}`, ViteAssetPathHelperFactoryService.name);
        return resolvedPath;
      }

      // Return hashed asset path through manifest file in production environment
      if (!manifest) {
        try {
          const manifestPath = `${options.buildOutDir}/.vite/manifest.json`;
          const manifestContent = readFileSync(manifestPath, "utf-8");
          manifest = JSON.parse(manifestContent);
        } catch (error) {
          logger.error(`Error reading manifest file at ${options.buildOutDir}/.vite/manifest.json: ${error}`, ViteAssetPathHelperFactoryService.name);
          return "";
        }
      }

      const manifestEntry = manifest![path];

      if (!manifestEntry) {
        logger.error(`Asset not found in manifest: ${path}`, ViteAssetPathHelperFactoryService.name);
        return "";
      }

      const resolvedPath = `${options.staticAssetPrefix}/builds/${manifestEntry.file}`;
      logger.debug(`Production mode - resolved to: ${resolvedPath}`, ViteAssetPathHelperFactoryService.name);
      return resolvedPath;
    };
  }
}
