# 🌦️ FSD 아키텍쳐를 따르는 간단한 날씨 서비스 - A Simple Weather App

**사용자의 현재 위치와 검색을 통해 대한민국 지역별 날씨 정보를 실시간으로 확인하고, 자주 찾는 지역을 즐겨찾기로 관리하는 서비스입니다.**

최신 **Next.js 16**과 **FSD (Feature-Sliced Design)** 아키텍처를 도입하여 유지보수성과 확장성을 극대화했으며, **React 19** 및 **Tanstack Query**를 활용해 매끄러운 사용자 경험을 제공합니다.

---

## 🚀 프로젝트 실행 방법 (Getting Started)

이 프로젝트는 추후 **Vercel**을 통해 배포되어 웹에서 즉시 이용 가능하도록 구성되었습니다. 로컬 환경에서 실행하려면 아래 절차를 따라주세요.

### 1. 레포지토리 클론 및 설치

```bash
git clone https://github.com/your-repo/weather-app.git
cd weather-app
npm install
```

### 2. 환경 변수 설정

최상위 경로에 `.env.local` 파일을 생성하고 다음 키를 설정해야 정상적으로 동작합니다 (예: Kakao API Key 등).

```env
KAKAO_REST_API_KEY=your_kakao_api_key_here
PUBLIC_GOV_DATA_PORTAL_KEY=your_공공데이터포털_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 서비스를 확인하세요.

---

## ✨ 구현 기능 및 사용자 흐름 (Core Features)

본 프로젝트는 단순한 기능 나열이 아닌, 사용자의 행동 흐름에 맞춰 유기적으로 설계되었습니다.

### 1. 현재 위치 기반 날씨 감지

- **User Flow**: 사용자가 앱에 접속 → 브라우저 Geolocation API 통해 현재 위치 경도/위도 감지 → 정규화된 json 데이터 내 행정동 명으로 역지오코딩 → 해당 행정동에 해당하는 경도/위도 지오코딩 → 공공데이터포털에 적합한 격자좌표로 변환 → 공공데이터포털에서 날씨데이터 취득
- **Implementation**:
  - `features/detect-location`: `navigator.geolocation` 통해 위치 권한 확인 후 사용자의 현재 좌표 획득 로직을 수행합니다.
  - `entities/location`: 좌표를 행정동명으로 변환(Reverse Geocoding) 후, `jsonMatcher.ts`를 활용해 `korea_districts.json`의 표준 데이터와 매핑함으로써 데이터 정합성을 확보합니다.
  - `entities/weather`: Lambert Conformal Conic (LCC) 투영법을 적용한 `convertLatLong` 유틸리티로 위/경도를 기상청 격자 좌표(X, Y)로 변환, API 호출 정확도를 높였습니다.

### 2. 행정구역 검색 및 필터링

- **User Flow**: 사용자가 검색창에 지역명(예: "서초") 입력 → 0.4초 디바운싱 후 `korea_districts.json` 데이터셋 내 필터링 → 매칭된 행정동 목록(최대 10개) 렌더링 → 키보드/마우스로 항목 선택 → 선택된 행정동 좌표로 날씨 데이터 조회 및 UI 업데이트
- **Implementation**:
  - `features/location-search`: 대용량 JSON 데이터(`korea_districts.json`)를 다루지만, 클라이언트 사이드에서 필요한 시점에만 필터링하여 서버 부하의 개입 없이 즉각적인 반응성을 제공합니다.
  - `shared/lib/hooks/useDebounce`: 검색어 입력이 완료된 시점에만 필터링 로직을 수행하도록 제어하여 불필요한 연산을 방지하고 렌더링 성능을 최적화했습니다.

### 3. 즐겨찾기 관리

- **User Flow**: 날씨 상세 카드 우측 상단의 별표(⭐) 아이콘 클릭 → 디바운싱 후 브라우저 `localStorage`에 JSON 파싱된 데이터 저장/삭제 → React 상태 업데이트로 UI 즉시 반영 → `StorageEvent` 감지로 여러 탭 내 데이터 동기화 보장
- **Implementation**:
  - `features/manage-favorites`: 즐겨찾기 데이터의 CRUD 및 최대 저장 개수 제한(6개) 등 비즈니스 규칙을 캡슐화하여 관리합니다.
  - `widgets/favorite-list`: 저장된 지역의 별칭(Nickname) 수정 및 삭제 기능을 제공하며, `StorageEvent` 리스너를 통해 멀티 탭 환경에서도 데이터 일관성을 유지하도록 구현했습니다.

---

## 🛠️ 기술적 의사결정 (Technical Decisions)

### 1. 아키텍처: Feature-Sliced Design (FSD)

대규모 프론트엔드 프로젝트에서 발생하는 **"스파게티 의존성"** 문제를 예방하고, 비즈니스 로직의 응집도를 높일 수 있지만 learning-curve가 가파른 편에 속하는 FSD를 깊게 연습해보는 것을 목적으로 FSD 아키텍쳐를 도입했습니다.

|    Layer     | 역할 (Responsibility)                | 활용 예시 (Examples)                                       |
| :----------: | ------------------------------------ | ---------------------------------------------------------- |
|   **App**    | 전역 설정, 라우팅, 프로바이더        | `app/layout.tsx`, `providers`                              |
|  **Views**   | 페이지 단위 조합                     | `views/home`, `views/weather-detail`                       |
| **Widgets**  | 복합 UI 블록 (Feature + Entity)      | `widgets/weather-search-view-container`                    |
| **Features** | 사용자 인터랙션, 비즈니스 유즈케이스 | `features/detect-location`, `manage-favorites`             |
| **Entities** | 도메인 핵심 데이터 모델, 공통 UI     | `entities/weather` (날씨 데이터 모델), `entities/location` |
|  **Shared**  | 재사용 가능한 유틸, 훅, UI 컴포넌트  | `shared/ui`, `shared/lib/hooks/useDebounce`                |

> **Why FSD?**
> 컴포넌트 간의 책임이 명확해져 기능 추가 시 기존 코드에 미치는 영향을 최소화할 수 있었습니다. 특히 `features` 계층 분리를 통해 "검색 기능"과 "즐겨찾기 기능"이 서로 영향을 주지 않고 독립적으로 동작하도록 설계했습니다.

### 2. Next.js App Router & API Routes

- **Server-Side Security**: Kakao Open API 키와 같은 민감 정보가 클라이언트에 노출되지 않도록 `app/api/forwardGeocode`와 같은 **API Route**를 구축하여 서버 간 통신을 프록시 처리했습니다.
- **Routing**: `[locationId]`와 같은 동적 라우팅을 활용하여 지역별 상세 날씨 페이지를 직관적인 URL 구조로 설계했습니다.

### 3. 상태 관리: Tanstack Query (React Query)

- **Server State Management**: 날씨 데이터는 수시로 변하는 "서버 상태"입니다. 이를 일반 state로 관리하거나 전역 상태 관리 라이브러리(Zustand 등)에 담기보단, Tanstack Query를 사용하는 것이 적합하다고 판단했습니다.
- **Benefits**:
  - 자동 캐싱(Caching) 및 백그라운드 갱신(Refetching)을 통해 불필요한 API 호출 감소.
  - 로딩(`isLoading`) 및 에러(`isError`) 상태를 선언적으로 처리하여 UX 효율적 관리 가능.

### 4. 데이터 영속성: Local Storage & Sync

- **Client-Side Persistence**: 즐겨찾기 데이터는 개인화된 정보이므로 서버 DB 대신 접근성이 빠른 Local Storage를 선택했습니다.
- **Cross-Tab Sync**: 단순 저장을 넘어, `window.addEventListener('storage')` 이벤트를 활용해 사용자가 탭 A에서 즐겨찾기를 추가하면 탭 B의 UI에도 즉시 반영되도록 디테일을 챙겼습니다.

---

## 📚 기술 스택 (Tech Stack)

| Category             | Technology                           |
| -------------------- | ------------------------------------ |
| **Framework**        | Next.js 16.1 (App Router)            |
| **Language**         | TypeScript 5 (Strict Mode)           |
| **Styling**          | Tailwind CSS 4, Lucide React (Icons) |
| **State Management** | Tanstack Query v5, React Context API |
| **Deployment**       | Vercel (Scheduled)                   |
| **Linting**          | ESLint 9                             |

---

## 📂 폴더 구조 (Directory Structure)

```bash
src/
├── app/                  # Next.js App Router (Pages & API)
├── views/                # 페이지들의 조합 (Home, Detail...)
├── widgets/              # 독립적인 기능을 수행하는 UI 블록
├── features/             # 비즈니스 로직 (위치 감지, 즐겨찾기...)
├── entities/             # 도메인 모델 (날씨, 위치 정보...)
└── shared/               # 공용 유틸리티, UI, 상수
    ├── data/             # 정적 데이터 (korea_districts.json)
    ├── lib/              # Hooks, Utils
    └── ui/               # Atomic Components
```
