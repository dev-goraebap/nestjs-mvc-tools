import { Injectable } from "@nestjs/common";
import Csrf from "csrf";

import { NestMvcLoggerService } from "./nest-mvc-logger.service";
import { NestMvcOptionsService } from "./nest-mvc-options.service";

/**
 * Service for CSRF (Cross-Site Request Forgery) protection.
 * Provides token generation, management, and verification functionality.
 */
@Injectable()
export class NestMvcCsrfService {
  // --------------------------------------------------------
  // Properties
  // --------------------------------------------------------
  private readonly tokens: Csrf;

  // --------------------------------------------------------
  // Methods
  // --------------------------------------------------------

  constructor(
    private readonly optionsService: NestMvcOptionsService,
    private readonly logger: NestMvcLoggerService
  ) {
    const options = this.optionsService.csrfOptions;
    this.logger.debug("NestMvcCsrfService constructor called", NestMvcCsrfService.name);
    this.logger.debug(`CSRF options: saltLength=${options.saltLength}, secretLength=${options.secretLength}`, NestMvcCsrfService.name);

    this.tokens = new Csrf({
      saltLength: options.saltLength,
      secretLength: options.secretLength,
    });

    this.logger.debug("CSRF token generator initialized successfully", NestMvcCsrfService.name);
  }

  /**
   * @description Generate a new CSRF secret
   */
  generateSecret(): string {
    this.logger.debug("Generating CSRF secret", NestMvcCsrfService.name);
    const secret = this.tokens.secretSync();
    this.logger.debug("CSRF secret generated successfully", NestMvcCsrfService.name);
    return secret;
  }

  /**
   * @description Generate token from secret
   */
  generateToken(secret: string): string {
    this.logger.debug("Generating CSRF token from secret", NestMvcCsrfService.name);
    const token = this.tokens.create(secret);
    this.logger.debug("CSRF token generated successfully", NestMvcCsrfService.name);
    return token;
  }

  /**
   * @description Token Verification
   */
  verifyToken(secret: string, token: string): boolean {
    this.logger.debug("Verifying CSRF token", NestMvcCsrfService.name);
    const isValid = this.tokens.verify(secret, token);
    this.logger.debug(`CSRF token verification result: ${isValid}`, NestMvcCsrfService.name);
    return isValid;
  }
}
