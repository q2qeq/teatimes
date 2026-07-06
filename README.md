# ☕ TeaTimes (Frontend)

취준생과 N잡 현직자를 AI 커피챗으로 연결하는 풀사이클 커리어 플랫폼

본 레포지토리는 TeaTimes 프로젝트의 프론트엔드(Frontend) 소스코드를 담고 있습니다.

## 📌 서비스 소개

TeaTimes는 지식에 목마른 취업준비생(게스트)과 자신의 경험을 나누고 수익을 창출하려는 현직자(호스트)를 AI 매칭으로 연결하는 서비스입니다. 기존 1회성 대화의 한계와 정보의 휘발성을 극복하고자, 대화 전 AI 질문 추천부터 대화 중 실시간 스크립트, 대화 후 요약 리포트까지 제공하는 'AI 어시스턴트' 기반의 커피챗 플랫폼입니다.

## ✨ 주요 기능 및 UI/UX

- 지능형 호스트 매칭 UI: 게스트의 관심 직무/희망 업종에 기반한 호스트 추천 화면 및 필터링 제공

- 커피챗 예약 및 AI 질문 생성: 직관적인 캘린더(react-day-picker) 예약 시스템 및 AI 기반 사전 질문 추천 인터페이스

- 실시간 커피챗 화상/음성 환경: 브라우저 내장 WebRTC 및 WebSocket API를 활용한 지연 없는 1:1 대화 환경

- 실시간 AI 어시스턴트 패널: Azure STT를 통한 실시간 음성 인식 텍스트 렌더링 및 문맥 맞춤형 추천 질문 팝업

- 대화 요약 리포트 대시보드: 종료 후 AI가 자동 생성한 핵심 요약본, Recharts를 활용한 데이터 시각화 리포트

## 🛠 기술 스택 (Tech Stack)

Core Framework: React 19, TypeScript, Vite 8

Routing: React Router v7

Styling & UI Library:

Tailwind CSS v4 (유틸리티 퍼스트 스타일링)

Radix UI & Material UI (접근성 높은 컴포넌트 시스템)

Framer Motion (부드러운 화면 전환 및 애니메이션)

Data Fetching & State: Axios, React Hook Form (폼 상태 관리 및 검증)

Tools: Recharts (통계 시각화), React Quill New (웹 에디터)

## 🚀 설치 및 실행 방법

1. 저장소 클론
git clone https://github.com/q2qeq/teatimes.git
cd teatimes

2. 패키지 설치
npm install

3. 환경 변수 설정
루트 디렉토리에 .env 파일을 생성하고 백엔드 API URL 등을 입력하세요.
VITE_API_BASE_URL=http://localhost:8000

4. 로컬 서버 실행 (Vite)
npm run dev


Backend 레포지토리는 [여기(https://github.com/sjlee5125/coffee-chat.git)]에서 확인할 수 있습니다.
