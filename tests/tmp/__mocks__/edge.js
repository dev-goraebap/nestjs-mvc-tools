/**
 * Edge.js Mock for Testing
 * 
 * Edge.js와 그 의존성들이 ES Module 형태로 배포되어
 * Jest의 CommonJS 환경과 호환되지 않기 때문에 Mock으로 대체합니다.
 * 
 * 실제 Edge.js의 복잡한 템플릿 컴파일 과정 대신, 우리가 테스트하고자 하는 
 * NestMVC 모듈의 핵심 기능(req.view.render 동작, 모듈 등록, 미들웨어 등)에 
 * 집중할 수 있도록 단순한 문자열 치환 방식으로 구현했습니다.
 */
class MockEdgeRenderer {
  render(template, data = {}) {
    // 간단한 템플릿 렌더링 mock
    if (template === 'hello') {
      return `<!DOCTYPE html>
      <html lang="ko">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>NestMVC v2 Test</title>
      </head>
      <body>
          <h1>${data.message || 'Hello'}</h1>
          <p>Rendered at: ${data.timestamp || new Date().toISOString()}</p>
          <div id="v2-marker">v2-working</div>
      </body>
      </html>`;
    }
    
    if (template === 'data-test') {
      const items = data.items || [];
      const itemsHtml = items.map(item => `<li>${item}</li>`).join('\n    ');
      return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Data Binding Test</title>
</head>
<body>
    <h1>User Info</h1>
    <p>Name: ${data.user?.name || 'Unknown'}</p>
    <p>Age: ${data.user?.age || 0}</p>
    
    <h2>Items</h2>
    <ul>
    ${itemsHtml}
    </ul>
</body>
</html>`;
    }
    
    if (template === 'non-existent-template') {
      throw new Error('Template not found: non-existent-template');
    }
    
    return `<html><body>Mock template: ${template}</body></html>`;
  }
}

class MockEdge {
  constructor() {
    this.mountedPaths = [];
  }
  
  static create() {
    return new MockEdge();
  }
  
  mount(path, alias) {
    this.mountedPaths.push({ path, alias });
  }
  
  createRenderer() {
    return new MockEdgeRenderer();
  }
}

module.exports = {
  Edge: MockEdge
};