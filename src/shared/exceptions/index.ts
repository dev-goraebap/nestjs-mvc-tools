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

/**
 * 페이지를 찾을 수 없을 때 사용하는 예외
 */
export class MvcNotFoundException extends MvcException {
  constructor(message: string = "페이지를 찾을 수 없습니다") {
    super(message, 404);
  }
}

/**
 * 권한이 없을 때 사용하는 예외
 */
export class MvcForbiddenException extends MvcException {
  constructor(message: string = "접근 권한이 없습니다") {
    super(message, 403);
  }
}

/**
 * 인증이 필요할 때 사용하는 예외
 */
export class MvcUnauthorizedException extends MvcException {
  constructor(message: string = "로그인이 필요합니다") {
    super(message, 401);
  }
}

/**
 * 서버에 에러시 사용하는 예외
 */
export class MvcInternalServerException extends MvcException {
  constructor(message: string = "무언가 잘못되었어요") {
    super(message, 500);
  }
}

/**
 * 유효성 검사 실패를 위한 예외
 * 폼 데이터 검증 실패 시 사용
 */
export class MvcValidationException extends MvcException {
  public readonly errors: Record<string, string[]>;
  public readonly redirectUrl?: string;

  constructor(
    message: string = "유효성 검사에 실패했습니다",
    redirectUrl?: string,
    errors: Record<string, string[]> = {},
    oldData?: Record<string, any>
  ) {
    super(message, 400, oldData);
    this.errors = errors;
    this.redirectUrl = redirectUrl;
  }
}
