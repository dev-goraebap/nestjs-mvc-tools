import { Module } from '@nestjs/common';
import { NestMvcModule } from '../../lib';
import { TestOptionsFactory } from './test-options.factory';
import { TestController } from './test.controller';

@Module({
  imports: [
    NestMvcModule.forRootAsync({
      useClass: TestOptionsFactory
    })
  ],
  controllers: [TestController],
})
export class TestAppAsyncModule {}