# Hangul Unicode Composer

TypeScript 및 ActionScript 3 기반의 한글 자모 조합 라이브러리 (HUC) 입니다. 
한글 자모를 입력받아 표준 유니코드 한글 음절로 실시간 조합해 주는 알고리즘 엔진과 웹 환경을 위한 가상 키보드 예제를 담고 있습니다.

## 프로젝트 구조 (Repository Directory Structure)

본 프로젝트는 아래와 같이 다중 플랫폼 지원 폴더 구조로 정리되어 있습니다.

```bash
├── as3/                     # 기존 ActionScript 3 소스 및 문서
│   ├── HUC_Lib/             # AS3 한글 조합 엔진 라이브러리
│   └── docs/                # AS3 ASDoc 문서 자료
├── ts-lib/                  # [NEW] TypeScript 기반 한글 조합 라이브러리
│   ├── src/                 # TS 소스 코드 (ESM 포맷 컴파일 지원)
│   └── README.md            # ts-lib 사용성 개별 설명 문서
├── example/                 # [NEW] 웹 브라우저 가상 키보드 데모 웹 앱 (Vite)
│   ├── src/                 # 가상 키보드 레이아웃 및 돔 매핑 코드
│   └── index.html           # 반응형 화상 키보드 데모 페이지
├── LICENSE                  # Apache License V2
└── README.md                # 본 메인 소개 문서
```

---

## 1. TypeScript 라이브러리 (`ts-lib`)

NPM 패키지로 배포하여 브라우저 및 Node.js에서 간편하게 사용할 수 있는 제로 디펜던시 모듈입니다.

### 설치
```bash
npm install hangul-unicode-composer
```

### 기본 사용법
```typescript
import { HangulUnicodeComposer, HangulTextEvent } from 'hangul-unicode-composer';

const composer = new HangulUnicodeComposer();

// 업데이트 시 콜백 연결
composer.onUpdate = (text) => {
  console.log("조합 중인 텍스트:", text); // "한"
};

// 자모 타이핑 시뮬레이션
composer.addJamo('ㅎ');
composer.addJamo('ㅏ');
composer.addJamo('ㄴ');
```
*자세한 API 및 설명은 [ts-lib/README.md](ts-lib/README.md) 문서를 참고해 주세요.*

---

## 2. 웹 화상 키보드 예제 (`example`)

TypeScript 라이브러리를 연동하여, 실제 웹 브라우저에서 동작하는 **가상(화상) 키보드** 데모입니다.
* **글라스모피즘 디자인**: 반투명 블러 패널 스타일 및 다크/라이트 모드 지원.
* **물리 키보드 맵핑**: 컴퓨터 실제 키보드 타이핑 시 화면 키보드가 동기화되어 한글 조합.
* **세션 아카이빙**: 입력 상태를 키값별로 보관하고 자유롭게 복원 기능 탑재.

### 실행 방법
```bash
cd example
npm install
npm run dev
```
이후 브라우저에서 `http://localhost:3000`으로 접속하여 테스트할 수 있습니다.

---

## 라이선스
* Apache License V2
