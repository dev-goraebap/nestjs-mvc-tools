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
    this.debug(`
    ---------------------------------------------------
    | Init EdgeView
    ---------------------------------------------------
    | Note. 
    | - EdgeRegistry에서 템플릿엔진을 가져와 요청별로 렌더러
    | 인스턴스 제공 (해당 요청에 한하여 공유되어야하는 상태를 
    | 다루기위함)
    | - 외부에서 사용할 수 있는 화면에 관련된 여러 인터페이스 제공
    ---------------------------------------------------
    `);
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
    if (!this.isSessionAvailable()) {
      return;
    }

    this.request.session["flash"] = { type, message, old };
  }

  getFlash() {
    if (!this.isSessionAvailable()) {
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

    // GET 요청이 아니면 기본 초기화만 수행
    if (this.request.method !== "GET") {
      this.debug(
        `${this.request.method} 요청이므로 기본 초기화만 수행 (${this.request.path})`
      );
      return;
    }

    // GET 요청일 때만 템플릿 관련 초기화 수행
    const hasSession = this.isSessionAvailable();

    // 세션이 있으면 CSRF 토큰과 플래시 메시지 초기화
    if (hasSession) {
      this.initCsrfToken();
      this.initFlashMessages();
    }

    this.initHelpers();
    this.debug(
      `페이지 렌더링용 초기화 완료 (${this.request.method} ${this.request.path})`
    );
  }

  // 플래시 메시지 공유 (GET 요청에서만, 세션 있을 때만)
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

  // CSRF Token 등록 (GET 요청에서만, 세션 있을 때만)
  private initCsrfToken() {
    // 1. 세션에 CSRF 토큰이 없으면 생성
    if (!this.request.session?.csrfToken) {
      const csrfToken = randomBytes(32).toString("hex");
      this.debug(
        `새로운 csrfToken 토큰 발급: ${csrfToken} (${this.request.method} ${this.request.path})`
      );
      this.request.session.csrfToken = csrfToken;
    }

    // 2. 뷰에 CSRF 토큰 공유
    const csrfToken = this.request.session.csrfToken;
    if (csrfToken) {
      this.debug(
        `CSRF 토큰 템플릿에 공유: ${csrfToken} (${this.request.method} ${this.request.path})`
      );
      this.requestScopedEdge.share({ csrfToken });
    }
  }

  /**
   * express-session 설정 여부를 확인합니다.
   *
   * @description 세션이 설정되지 않으면 다음 기능들이 제한됩니다:
   * - CSRF 토큰 생성 및 검증
   * - 플래시 메시지 (setFlash, getFlash)
   * - 세션 기반 상태 관리
   */
  private isSessionAvailable(): boolean {
    if (!this.request.session) {
      this.logger.warn(`
      ⚠️ express-session이 설정되지 않아 일부 기능이 제한됩니다. (CSRF 토큰, 플래시 메시지 등)
      설정 방법: https://github.com/dev-goraebap
      `);
      return false;
    }
    return true;
  }
}
