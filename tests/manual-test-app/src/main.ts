import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  console.log('🚀 NestJS MVC Tools Manual Test App Starting...');
  console.log('');
  console.log('📍 Available Routes:');
  console.log('   GET /                - 기본 페이지 (모듈 동작 확인)');
  console.log('   GET /data-binding    - 데이터 바인딩 테스트');
  console.log('   GET /layout          - 레이아웃 기능 테스트'); 
  console.log('   GET /components      - 컴포넌트 시스템 테스트');
  console.log('   GET /error-test      - 에러 처리 테스트');
  console.log('');
  
  await app.listen(3000);
  
  console.log('✅ Server is running on http://localhost:3000');
  console.log('');
  console.log('💡 Edge.js ES Module 이슈로 인해 Jest 단위 테스트 대신');
  console.log('   실제 NestJS 앱을 실행하여 수동 테스트를 진행합니다.');
  console.log('');
  console.log('🔍 각 경로를 브라우저에서 확인하여 v2 모듈의');
  console.log('   모든 기능이 정상 동작하는지 검증해주세요.');
}

bootstrap().catch(err => {
  console.error('❌ Application failed to start:', err);
  process.exit(1);
});