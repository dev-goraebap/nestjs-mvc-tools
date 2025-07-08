import { Request } from "express";

declare module "express-session" {
  interface SessionData {
    [key: string]: any;
  }
}

export class NestMvcFlash {
  private readonly FLASH_KEY = "__flash__";

  constructor(private readonly req: Request) {}

  /**
   * 플래시 메시지 설정
   */
  flash(key: string, value: any): void {
    if (!this.req.session) return;

    const currentFlash = this.req.session[this.FLASH_KEY] || {};
    currentFlash[key] = value;
    this.req.session[this.FLASH_KEY] = currentFlash;
  }

  /**
   * 플래시 메시지 조회
   */
  get(key?: string): any {
    if (!this.req.session) return null;

    const flash = this.req.session[this.FLASH_KEY];
    if (!flash) return null;

    if (key) {
      return flash[key];
    } else {
      return flash;
    }
  }

  /**
   * 플래시 메시지 삭제
   */
  clear(key?: string): void {
    if (!this.req.session) return;

    const flash = this.req.session[this.FLASH_KEY];
    if (!flash) return;

    if (key) {
      delete flash[key];

      if (Object.keys(flash).length === 0) {
        delete this.req.session[this.FLASH_KEY];
      }
    } else {
      delete this.req.session[this.FLASH_KEY];
    }
  }

  /**
   * 플래시 메시지 조회 후 삭제
   */
  getAndClear(key?: string): any {
    const value = this.get(key);
    this.clear(key);
    return value;
  }

  /**
   * 성공 메시지 설정
   */
  success(message: string): void {
    this.flash("success", message);
  }

  /**
   * 에러 메시지 설정
   */
  error(message: string) {
    this.flash("error", message);
    return this;
  }

  /**
   * 정보 메시지 설정
   */
  info(message: string): void {
    this.flash("info", message);
  }

  /**
   * 경고 메시지 설정
   */
  warning(message: string) {
    this.flash("warning", message);
    return this;
  }

  /**
   * 폼 입력값 플래시 (PRG 패턴용)
   */
  flashInput(except: string[] = []): void {
    if (this.req.method === "POST" && this.req.body) {
      const input = { ...this.req.body };
      except.forEach((key) => delete input[key]);
      this.flash("input", input);
    }
  }
}
