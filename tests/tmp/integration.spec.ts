import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { TestAppModule } from "./test-app.module";

describe("NestMVC Integration Tests", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("핵심 렌더링 파이프라인", () => {
    test("GET / - 기본 템플릿 렌더링 및 데이터 바인딩", async () => {
      const response = await request(app.getHttpServer()).get("/").expect(200);

      // 1. HTML 응답 확인
      expect(response.headers["content-type"]).toMatch(/html/);

      // 2. 템플릿 렌더링 확인
      expect(response.text).toContain("Hello from v2");

      // 3. 데이터 바인딩 확인
      expect(response.text).toContain("Rendered at:");

      // 4. v2 마커 확인 (템플릿이 정상 렌더링되었는지)
      expect(response.text).toContain("v2-working");

      // 5. HTML 구조 확인
      expect(response.text).toContain("<!DOCTYPE html>");
      expect(response.text).toContain("<h1>Hello from v2</h1>");
    });

    test("GET /data-binding - 복잡한 데이터 바인딩 테스트", async () => {
      const response = await request(app.getHttpServer())
        .get("/data-binding")
        .expect(200);

      // 객체 데이터 바인딩
      expect(response.text).toContain("Name: John");
      expect(response.text).toContain("Age: 30");

      // 배열 반복 렌더링
      expect(response.text).toContain("<li>apple</li>");
      expect(response.text).toContain("<li>banana</li>");
      expect(response.text).toContain("<li>cherry</li>");
    });
  });

  describe("에러 처리", () => {
    test("GET /missing-template - 존재하지 않는 템플릿 에러 처리", async () => {
      const response = await request(app.getHttpServer())
        .get("/missing-template")
        .expect(500); // 템플릿이 없으면 500 에러 발생

      // 에러 응답인지 확인 (구체적인 에러 메시지는 Edge.js에 의존)
      expect(response.status).toBe(500);
    });
  });
});
