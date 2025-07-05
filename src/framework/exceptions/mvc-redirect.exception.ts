import { MvcException } from "./base-mvc.exception";

/**
 * 리다이렉트를 위한 예외
 * 주로 폼 검증 실패 후 이전 페이지로 돌아갈 때 사용
 */
export class MvcRedirectException extends MvcException {
  public readonly redirectUrl: string;
  public readonly flashType: 'notice' | 'alert';

  constructor(
    redirectUrl: string,
    message: string,
    flashType: 'notice' | 'alert' = 'alert',
    oldData?: Record<string, any>
  ) {
    super(message, 303, oldData);
    this.redirectUrl = redirectUrl;
    this.flashType = flashType;
  }
}
