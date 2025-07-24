import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import session from "express-session";
import { EdgeJsService } from "nestjs-mvc-tools";

import { join } from "path";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  console.debug(`
  -----------------------------------------------------------------------
  🚀 NestJS MVC Tools Manual Test App Starting...
  
  Server is running on http://localhost:3000

    💡 Edge.js ES Module 이슈로 인해 Jest 단위 테스트 대신
      실제 NestJS 앱을 실행하여 수동 테스트를 진행합니다.

    🔍 각 경로를 브라우저에서 확인하여 v2 모듈의
      모든 기능이 정상 동작하는지 검증해주세요.
  -----------------------------------------------------------------------
  `);

  const service = app.get(EdgeJsService);
  const edge = service.getEdgeInstance();
  edge.global("hello", "world");

  app.use(
    session({
      name: "connect.sid",
      secret: "session-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: "auto",
        sameSite: "lax",
      },
    })
  );

  app.useStaticAssets(join(__dirname, "..", "resources", "views"), {
    prefix: "/public",
  });

  await app.listen(3000);
}

bootstrap().catch((err) => {
  console.error("❌ Application failed to start:", err);
  process.exit(1);
});
