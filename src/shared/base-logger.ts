import { Logger } from "@nestjs/common";

import { NestMvcCoreOptions } from "../interfaces/nest-mvc-core-options";

/**
 * 디버그 로깅 기능을 제공하는 기본 클래스
 * 모든 서비스는 이 클래스를 상속하여 일관된 디버그 로깅을 사용할 수 있습니다.
 */
export abstract class BaseLogger {
  protected readonly logger: Logger;
  private readonly isDebugMode: boolean;

  constructor(className: string, options: NestMvcCoreOptions) {
    this.logger = new Logger(className);
    this.isDebugMode = options?.debug === true;
  }

  /**
   * 디버그 모드일 때만 로그를 출력하는 헬퍼 메서드
   */
  protected debug(message: string, ...args: any[]) {
    if (this.isDebugMode) {
      this.logger.debug(message, ...args);
    }
  }
}
