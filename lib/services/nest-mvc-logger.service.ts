import { Injectable, Logger } from "@nestjs/common";
import { NestMvcOptionsService } from "./nest-mvc-options.service";

/**
 * Custom logger service extending NestJS Logger.
 * Provides conditional debug logging based on configuration settings.
 */
@Injectable()
export class NestMvcLoggerService extends Logger {
  // --------------------------------------------------------
  // Properties
  // --------------------------------------------------------

  private readonly debugMode: boolean;

  // --------------------------------------------------------
  // Methods
  // --------------------------------------------------------

  constructor(private readonly optionsService: NestMvcOptionsService) {
    super();
    this.debugMode = this.optionsService.debug;
  }

  debug(message: unknown, ...optionalParams: [...any, string?]): void {
    if (!this.debugMode) return;
    super.debug(message, ...optionalParams);
  }
}
