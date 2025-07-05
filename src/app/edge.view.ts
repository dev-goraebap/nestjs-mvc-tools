import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

import { randomBytes } from "crypto";
import {
  NEST_MVC_CORE_OPTIONS,
  NestMvcCoreOptions,
} from "../interfaces/nest-mvc-core-options";
import { BaseLogger } from "../shared/base-logger";
import { EdgeHelpers } from "./edge.helper";
import { EdgeRegistry } from "./edge.registry";

/**
 * EdgeJs 뷰 서비스
 *
 * 이 서비스는 요청별로 인스턴스가 생성되는 REQUEST 스코프로 동작합니다.
 * 각 요청마다 독립적인 Edge 렌더러 인스턴스를 생성하여 데이터를 격리하며,
 * 요청 컨텍스트에 접근하여 세션 기반의 플래시 메시지와 쿠키 기반 테마 기능을 지원합니다.
 */
@Injectable({ scope: Scope.REQUEST })
export class EdgeView extends BaseLogger {
  private requestScopedEdge: any;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(NEST_MVC_CORE_OPTIONS) private readonly options: NestMvcCoreOptions,
    private readonly edgeJsRegistry: EdgeRegistry
  ) {
    super(EdgeView.name, options);
    this.init();
  }

  async render(templatePath: string, state?: Record<string, any>) {
    const renderer = this.requestScopedEdge;

    try {
      this.debug(`템플릿 렌더링 시작: ${templatePath}`, state);
      const result = await renderer.render(templatePath, state);
      this.debug(`템플릿 렌더링 완료: ${templatePath}`);
      return result;
    } catch (err) {
      this.logger.error(`템플릿 렌더링 오류: ${templatePath}`, err);
      throw err;
    }
  }

  async share(state: Record<string, any>) {
    this.requestScopedEdge.share(state);
  }

  setFlash(
    type: "notice" | "alert",
    message: string,
    old: Record<string, any> = {}
  ) {
    if (!this.request.session) {
      this.logger.warn("세션이 활성화되지 않았습니다.");
      return;
    }

    this.request.session["flash"] = { type, message, old };
  }

  getFlash() {
    if (!this.request.session) {
      return null;
    }

    const flash = this.request.session["flash"];
    return {
      type: flash?.type,
      message: flash?.message,
      old: flash?.old,
    };
  }

  private init() {
    // EdgeJsRegistry에서 기본 Edge 인스턴스를 가져와,
    // 이로부터 요청별로 독립적인 새 렌더러 인스턴스를 생성합니다.
    // 기본 인스턴스의 모든 설정 (마운트 경로 등) 은 상속됨
    this.requestScopedEdge = this.edgeJsRegistry.getInstance().createRenderer();

    this.debug("EdgeView 인스턴스 생성됨");

    this.initCsrfToken();

    // 요청별 데이터를 이 독립적인 렌더러 인스턴스에 share 합니다.
    // 이 데이터는 현재 요청 내에서 이 렌더러를 통해 렌더링되는 모든 템플릿에
    // 전역적으로 (이 요청 내에서만) 사용 가능합니다.
    const flash = this.getFlash();
    if (flash) {
      this.requestScopedEdge.share({ flash });
    }

    // 현재 요청 URL을 기반으로 링크 활성화 여부를 판단하는 헬퍼 함수 등록
    this.requestScopedEdge.share({
      isActiveLink: EdgeHelpers.createIsActiveLinkHelper(this.request),
    });
  }

  private initCsrfToken() {
    if (!this.request.session) {
      throw new Error(
        "Session middleware must be registered before EdgeMiddleware"
      );
    }

    const isTurboRequest = !!this.request.headers["x-turbo-request-id"];

    // 1. 세션에 CSRF 토큰이 없으면 생성 (터보 요청이 아닐 경우에만)
    if (!this.request.session["csrfToken"] && !isTurboRequest) {
      const csrfToken = randomBytes(32).toString("hex");
      this.debug("새로운 csrfToken 토큰 발급: " + csrfToken);
      this.request.session["csrfToken"] = csrfToken;
    }

    // 2. 뷰에 CSRF 토큰 공유
    const csrfToken = this.request.session["csrfToken"];
    if (csrfToken) {
      this.debug(`CSRF 토큰 사용: ${csrfToken}`);
      this.requestScopedEdge.share({ csrfToken });
    } else if (isTurboRequest) {
      this.debug(
        "CSRF 토큰이 세션에 없지만, 터보 요청이므로 새로 발급하지 않습니다."
      );
    }
  }
}
