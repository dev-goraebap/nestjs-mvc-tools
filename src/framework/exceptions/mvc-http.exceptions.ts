import { MvcException } from "./base-mvc.exception";

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
