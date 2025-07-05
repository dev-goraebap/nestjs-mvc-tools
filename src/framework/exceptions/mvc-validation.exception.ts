import { MvcException } from "./base-mvc.exception";

/**
 * 유효성 검사 실패를 위한 예외
 * 폼 데이터 검증 실패 시 사용
 */
export class MvcValidationException extends MvcException {
  public readonly errors: Record<string, string[]>;

  constructor(
    message: string = "유효성 검사에 실패했습니다",
    errors: Record<string, string[]> = {},
    oldData?: Record<string, any>
  ) {
    super(message, 400, oldData);
    this.errors = errors;
  }
}
