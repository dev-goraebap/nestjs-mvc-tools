import { Injectable, Logger } from "@nestjs/common";

/**
 * - nestjs/common Logger를 래핑
 * - debug, warn, error 만 인터페이스 노출
 * - debug는 debugMode에 따라 표시
 */
@Injectable()
export class NestMvcLogger {
  private readonly logger = new Logger(this.className);

  constructor(
    private readonly className: string,
    private readonly debugMode: boolean
  ) {}

  /**
   * 디버그 모드일 때만 로그를 출력하는 헬퍼 메서드
   */
  debug(message: string, ...args: any[]) {
    if (this.debugMode) {
      this.logger.debug(message, ...args);
    }
  }

  /**
   * 경고 로그 (항상 출력)
   */
  warn(message: string, ...args: any[]) {
    this.logger.warn(message, ...args);
  }

  /**
   * 에러 로그 (항상 출력)
   */
  error(message: string, ...args: any[]) {
    this.logger.error(message, ...args);
  }
}
