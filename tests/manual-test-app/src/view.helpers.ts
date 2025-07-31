import { Request } from 'express';
import { ViewHelperFactory } from 'nestjs-mvc-tools';

/**
 * 현재 라우트인지 확인하는 헬퍼
 * 템플릿에서 {{ isCurrentRoute('/home') }} 형태로 사용
 */
export const isCurrentRouteHelper: ViewHelperFactory = (req: Request) => {
  return {
    key: 'isCurrentRoute',
    fn: (routePath: string) => {
      return req.originalUrl === routePath || req.path === routePath;
    }
  };
};