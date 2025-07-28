import { Injectable } from "@nestjs/common";
import { Edge } from "edge.js";
import { join } from "path";

import { EdgeJsViewOptions } from "../nest-mvc.options";
import { NestMvcLoggerService } from "./nest-mvc-logger.service";
import { NestMvcOptionsService } from "./nest-mvc-options.service";
import { ViteAssetPathHelperFactoryService } from "./vite-asset-path-helper-factory.service";

/**
 * Service for managing Edge.js template engine integration with NestJS.
 * Provides initialization, configuration, and access to Edge.js instances for server-side rendering.
 */
@Injectable()
export class EdgeJsService {
  // --------------------------------------------------------
  // Properties
  // --------------------------------------------------------

  private edgeInstance: Edge | null = null;
  private readonly options: EdgeJsViewOptions;

  // --------------------------------------------------------
  // Methods
  // --------------------------------------------------------

  constructor(
    private readonly optionsService: NestMvcOptionsService,
    private readonly logger: NestMvcLoggerService,
    private readonly viteAssetPathHelperFactory: ViteAssetPathHelperFactoryService
  ) {
    this.options = this.optionsService.viewOptions;
    this.logger.debug('EdgeJsService constructor called', EdgeJsService.name);
    this.init();
  }

  getEdgeInstance() {
    this.logger.debug('Getting Edge instance', EdgeJsService.name);
    if (!this.edgeInstance) {
      throw new Error("not initialized edge instance");
    }
    return this.edgeInstance;
  }

  private init() {
    this.logger.debug('Initializing EdgeJs service', EdgeJsService.name);
    try {
      // Create EdgeJs instance and assign properties
      this.edgeInstance = Edge.create({
        cache: this.options.cache,
      });
      this.logger.debug(`EdgeJs instance created with cache: ${this.options.cache}`, EdgeJsService.name);

      // Mount default path
      this.edgeInstance.mount(this.options.rootDir);
      this.logger.debug(`Mounted default path: ${this.options.rootDir}`, EdgeJsService.name);

      // Mount custom disks
      for (const disk of this.options.disks) {
        this.edgeInstance.mount(disk, join(this.options.rootDir, disk));
        this.logger.debug(`Mounted custom disk: ${disk} -> ${join(this.options.rootDir, disk)}`, EdgeJsService.name);
      }

      // Register helper function with [viteAssetPath] key
      const viteAssetPathHelperFn = this.viteAssetPathHelperFactory.create();
      this.edgeInstance.global("viteAssetPath", viteAssetPathHelperFn);
      this.logger.debug('Registered viteAssetPath helper function', EdgeJsService.name);
      
      this.logger.debug('EdgeJs service initialization completed successfully', EdgeJsService.name);
    } catch (err: unknown) {
      this.logger.error(`EdgeJs service initialization failed: ${err instanceof Error ? err.message : String(err)}`, EdgeJsService.name);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error(String(err));
    }
  }
}
