import { Injectable } from "@nestjs/common";
import Csrf from "csrf";
import { NestMvcOptionsService } from "./nest-mvc-options.service";

@Injectable()
export class NestMvcCsrfService {
  private readonly tokens: Csrf;

  constructor(private readonly optionsService: NestMvcOptionsService) {
    const options = this.optionsService.csrfOptions;
    this.tokens = new Csrf({
      saltLength: options.saltLength,
      secretLength: options.secretLength,
    });
  }

  /**
   * 새로운 CSRF secret 생성
   */
  generateSecret(): string {
    return this.tokens.secretSync();
  }

  /**
   * secret으로부터 토큰 생성
   */
  generateToken(secret: string): string {
    return this.tokens.create(secret);
  }

  /**
   * 토큰 검증
   */
  verifyToken(secret: string, token: string): boolean {
    return this.tokens.verify(secret, token);
  }
}
