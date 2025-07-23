import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestAppAsyncModule } from './test-app-async.module';

describe('NestMVC Async Configuration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppAsyncModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('forRootAsync 설정 방식', () => {
    test('GET / - forRootAsync로 설정된 모듈이 정상 동작', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200);

      // forRootAsync 방식으로도 동일하게 동작해야 함
      expect(response.headers['content-type']).toMatch(/html/);
      expect(response.text).toContain('Hello from v2');
      expect(response.text).toContain('v2-working');
      expect(response.text).toContain('<!DOCTYPE html>');
    });

    test('GET /data-binding - 복잡한 데이터도 정상 렌더링', async () => {
      const response = await request(app.getHttpServer())
        .get('/data-binding')
        .expect(200);

      expect(response.text).toContain('Name: John');
      expect(response.text).toContain('<li>apple</li>');
    });

    test('옵션 팩토리가 제대로 동작하는지 확인', async () => {
      // 옵션 팩토리에서 설정한 템플릿 디렉토리가 제대로 작동하는지 확인
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200);
      
      // 템플릿이 정상적으로 찾아지고 렌더링되면 성공
      expect(response.text).toContain('<h1>Hello from v2</h1>');
    });
  });
});