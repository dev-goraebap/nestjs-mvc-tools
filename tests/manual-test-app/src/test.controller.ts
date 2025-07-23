import { Controller, Get, Req } from '@nestjs/common';
import { NestMvcReq } from '../../../lib/v2/nest-mvc.type';

@Controller()
export class TestController {
  @Get('/')
  async index(@Req() req: NestMvcReq) {
    return req.view.render('hello', {
      message: 'Hello from NestJS MVC Tools!',
      timestamp: new Date().toISOString(),
      description: 'v2 모듈이 정상적으로 동작하고 있습니다.'
    });
  }

  @Get('/data-binding')
  async dataBinding(@Req() req: NestMvcReq) {
    return req.view.render('data-test', {
      user: { 
        name: 'John Doe', 
        age: 30,
        email: 'john@example.com'
      },
      items: ['사과', '바나나', '오렌지', '포도'],
      isLoggedIn: true,
      roles: ['user', 'editor']
    });
  }

  @Get('/layout')
  async layoutTest(@Req() req: NestMvcReq) {
    return req.view.render('with-layout', {
      title: 'Layout Test Page',
      content: '레이아웃 기능이 정상적으로 동작하는지 테스트합니다.',
      navigation: [
        { name: 'Home', url: '/' },
        { name: 'Data Binding', url: '/data-binding' },
        { name: 'Layout Test', url: '/layout' }
      ]
    });
  }

  @Get('/components')
  async componentsTest(@Req() req: NestMvcReq) {
    return req.view.render('components-test', {
      title: 'Components Test',
      cards: [
        { title: 'Card 1', content: 'First card content' },
        { title: 'Card 2', content: 'Second card content' },
        { title: 'Card 3', content: 'Third card content' }
      ]
    });
  }

  @Get('/error-test')
  async errorTest(@Req() req: NestMvcReq) {
    // 존재하지 않는 템플릿으로 에러 테스트
    return req.view.render('non-existent-template', {});
  }
}