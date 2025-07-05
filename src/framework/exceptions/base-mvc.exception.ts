/**
 * MVC 전용 예외의 기본 클래스
 * NestJS의 HttpException과 분리하여 MVC 패턴에 특화된 예외 처리를 제공합니다.
 */
export class MvcException extends Error {
  public readonly statusCode: number;
  public readonly data?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    data?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.data = data;

    // Error 스택 트레이스를 올바르게 설정
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
