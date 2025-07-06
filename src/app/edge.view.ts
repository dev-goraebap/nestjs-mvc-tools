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
    this.requestScopedEdge = this.edgeJsRegistry.getInstance().createRenderer();

    this.debug("EdgeView 인스턴스 생성됨");

    // GET 요청(페이지 렌더링)일 때만 템플릿 관련 초기화 수행
    if (this.request.method === "GET") {
      this.initCsrfToken();
      this.initFlashMessages();
      this.initHelpers();
      this.debug("페이지 렌더링용 초기화 완료");
    } else {
      this.debug(`${this.request.method} 요청이므로 기본 초기화만 수행`);
    }
  }

  // 플래시 메시지 공유 (GET 요청에서만)
  private initFlashMessages() {
    const flash = this.getFlash();
    if (flash) {
      this.requestScopedEdge.share({ flash });
    }
  }

  // 헬퍼 함수들 등록 (GET 요청에서만)
  private initHelpers() {
    this.requestScopedEdge.share({
      isActiveLink: EdgeHelpers.createIsActiveLinkHelper(this.request),
    });
  }

  // CSRF Token 등록 (GET 요청에서만)
  private initCsrfToken() {
    if (!this.request.session) {
      const errMsg = "express-session이 누락되었습니다. 설정 필요.";
      this.logger.warn(errMsg);
      throw new Error(errMsg);
    }

    // 1. 세션에 CSRF 토큰이 없으면 생성
    if (!this.request.session?.csrfToken) {
      const csrfToken = randomBytes(32).toString("hex");
      this.debug("새로운 csrfToken 토큰 발급: " + csrfToken);
      this.request.session.csrfToken = csrfToken;
    }

    // 2. 뷰에 CSRF 토큰 공유
    const csrfToken = this.request.session.csrfToken;
    if (csrfToken) {
      this.debug(`CSRF 토큰 템플릿에 공유: ${csrfToken}`);
      this.requestScopedEdge.share({ csrfToken });
    }
  }
}
