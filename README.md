# PSD → Figma 변환 플러그인 (Mplanit 내부)

포토샵 배너 PSD를 레이어·텍스트·마스크 그대로 Figma로 변환하는 사내 플러그인.

- **가이드(웹)**: GitHub Pages 활성화 시 https://raniara7-byte.github.io/mplanit/
- **플러그인 다운로드**: 가이드 페이지의 "ZIP 파일 다운로드" 버튼 또는 releases/psd2figma-plugin_v1.8.zip
- 설치: Figma → Plugins → Development → Import plugin from manifest

© Mplanit AIU본부 | v1.8 | 2026.07

---

## 엠플랜잇 AI 솔루션 소개서 (8장)

광고주·클라이언트 제안용 AI 솔루션 소개 장표 — AI LAB 통합 · 솔루션 이미지맵 · Banner Fit · Reels Studio · GEO Metric Care · 커머스허브/애드리포트 · MI 솔루션

- **웹(장표)**: `ai-solution/index.html` → https://raniara7-byte.github.io/mplanit/ai-solution/
  - 이동: 화면 클릭(오른쪽 다음 / 왼쪽 이전) · ←/→ 키 · 스크롤 · 하단 인디케이터
  - 전체보기: 하단 "전체보기" 버튼 또는 G 키 → 썸네일 클릭으로 해당 장표 이동 (ESC 닫기)
  - 인쇄(Ctrl/Cmd+P) 시 장표당 1페이지 PDF
- **단일 HTML(로컬 확인용)**: `ai-solution/mplanit-ai-solution.html` — 이미지·폰트 내장, 파일 하나만 열면 됨
  (생성: `python3 ai-solution/tools/build-standalone.py`)
- **PPT·PDF는 저장소에 두지 않습니다** — 필요할 때 아래로 생성합니다
  - PPT: `node ai-solution/tools/build-pptx.js` (pptxgenjs 필요)
  - PDF: 브라우저로 `ai-solution/index.html`을 열고 인쇄(Ctrl/Cmd+P) → 장표당 1페이지
- **서체**: `ai-solution/fonts/` — 페이퍼로지 4/7/8 (사내 PPT 테마와 동일)
- **이미지**: `ai-solution/assets/` — 사내 PPT(2026.09)에서 추출한 실제 제품 화면과 정식 로고
- **제작 규칙**: `.claude/skills/mplanit-deck/SKILL.md` — 서체(페이퍼로지)·컬러(네이비 #1B468B / 스카이 #399BC1)·
  장표 구조·문구 규칙을 정리한 사내 장표 스킬. 다음 장표도 이 규칙으로 만든다.
