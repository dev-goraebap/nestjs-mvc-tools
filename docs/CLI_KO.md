# CLI 명령어 가이드

## `nestjs-mvc-tools init`

프로젝트에 MVC 템플릿과 리소스 구조를 생성합니다. 템플릿 옵션을 통해 필요한 라이브러리만 선택할 수 있습니다.

```bash
# 기본 사용 (minimal 템플릿 - Vite만)
nestjs-mvc-tools init

# 템플릿별 선택
nestjs-mvc-tools init --template=minimal           # Vite만 (기본값)
nestjs-mvc-tools init --template=tailwind          # TailwindCSS만  
nestjs-mvc-tools init --template=hotwired          # Hotwired만
nestjs-mvc-tools init --template=hotwired-tailwind # Hotwired + TailwindCSS

# 짧은 옵션 사용
nestjs-mvc-tools init -t minimal
```

## 사용 가능한 템플릿

- `minimal`: Vite만 포함한 기본 구성 (기본값)
- `tailwind`: TailwindCSS + Vite 구성  
- `hotwired`: Hotwired (Turbo + Stimulus) + Vite 구성
- `hotwired-tailwind`: TailwindCSS + Hotwired + Vite 완전 구성

## 생성되는 구조

선택한 템플릿에 따라 다른 구조가 생성됩니다.

```
resources/
├── package.json        # 템플릿별 의존성
├── vite.config.js      # Vite 설정 (템플릿별 플러그인)
├── src/
│   ├── app.js         # 프론트엔드 엔트리 (템플릿별 import)
│   ├── style.css      # 스타일 (minimal, hotwired)
│   └── controllers/   # Stimulus 컨트롤러 (hotwired, hotwired-tailwind만)
├── views/
│   ├── components/    # 재사용 컴포넌트
│   └── pages/         # 페이지 템플릿
└── public/
    └── builds/        # 빌드된 에셋
```

## 템플릿별 차이점

### minimal
- 기본 CSS, Vite만 포함
- 가장 간단한 구성으로 프로젝트 시작
- 추가 라이브러리 없이 순수한 HTML/CSS/JS 개발

### tailwind
- TailwindCSS import, Tailwind 플러그인 포함
- 유틸리티 우선 CSS 프레임워크 사용
- 빠른 스타일링과 일관된 디자인 시스템

### hotwired
- Hotwired import, Stimulus 컨트롤러 폴더 포함
- HTML-over-the-wire 접근 방식
- SPA와 같은 사용자 경험을 서버 사이드 렌더링으로 구현

### hotwired-tailwind
- TailwindCSS + Hotwired 모든 기능 포함
- 완전한 모던 웹 개발 환경
- 디자인 시스템과 인터랙티브 기능 모두 제공

## 템플릿별 패키지 의존성

### minimal
```json
{
  "dependencies": {},
  "devDependencies": {
    "vite": "^6.3.5"
  }
}
```

### tailwind
```json
{
  "dependencies": {
    "@tailwindcss/vite": "^4.1.10",
    "tailwindcss": "^4.1.10"
  },
  "devDependencies": {
    "vite": "^6.3.5"
  }
}
```

### hotwired
```json
{
  "dependencies": {
    "@hotwired/stimulus": "^3.2.2",
    "@hotwired/turbo": "^8.0.13"
  },
  "devDependencies": {
    "vite": "^6.3.5"
  }
}
```

### hotwired-tailwind
```json
{
  "dependencies": {
    "@hotwired/stimulus": "^3.2.2",
    "@hotwired/turbo": "^8.0.13",
    "@tailwindcss/vite": "^4.1.10",
    "tailwindcss": "^4.1.10"
  },
  "devDependencies": {
    "vite": "^6.3.5"
  }
}
```

## 추가 CLI 명령어

### `nestjs-mvc-tools list-templates`

사용 가능한 모든 템플릿과 상세 정보를 확인할 수 있습니다.

```bash
# 템플릿 목록 보기
nestjs-mvc-tools list-templates

# 또는 짧은 명령어
nestjs-mvc-tools list
```

이 명령어는 각 템플릿의 이름, 설명, 포함된 기술, 사용 사례를 컬러풀한 형태로 표시합니다.

## 참고사항

- 프로젝트 root 경로에 resources 디렉토리를 생성하고 선택한 템플릿에 따라 필요한 의존성을 다운로드합니다
- resources 폴더가 이미 존재하는 경우 기존 파일을 덮어쓰지 않습니다
- 재초기화를 원한다면 resources 디렉토리를 삭제한 후 다시 실행하세요
- 템플릿 초기화 후 `.gitignore` 파일이 자동으로 생성되어 `node_modules`와 `public/builds` 디렉토리를 제외합니다