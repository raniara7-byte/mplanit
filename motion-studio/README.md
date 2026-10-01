# MPLANIT Motion Studio

프리뷰·임시배포 사이트: https://mplanit-motion-studio.vercel.app/

현재 화면: `MPLANIT_20261001_R10.html` 수정본을 원본 그대로 `index.html`에 반영했습니다. 문서의 `mplanit-revision` 값은 `20261001-R10`입니다.

## 배포

- GitHub 저장소: `raniara7-byte/mplanit`
- 운영 브랜치: `mplanit`
- Vercel 프로젝트: `mplanit-motion-studio`
- Vercel Root Directory: `motion-studio`
- Framework Preset: `Other`
- 별도 설치·빌드 명령 없이 정적 파일을 배포합니다.

이 폴더의 변경 사항을 `mplanit` 브랜치에 커밋하고 푸시하면 Vercel이 자동 배포합니다. ZIP 파일을 추가로 올릴 필요는 없습니다.

## 수정할 파일

- 현재 화면의 디자인·스크립트·콘텐츠: `index.html`
- R10은 이미지·영상·Paperlogy 글꼴을 HTML 안에 내장한 단일 파일입니다. 일부 웹 글꼴은 외부 CDN에서 불러옵니다.
- 다음 수정본도 `index.html`을 교체한 뒤 `mplanit` 브랜치에 커밋·푸시하면 됩니다.

기존 `style.css`, `app.js`, `content.js`, `content.json`, `assets/`, `edit.html` 및 편집기 파일은 이전 버전 자료입니다. 현재 R10 첫 화면은 이 파일들을 읽지 않습니다. 기존 편집기에서 저장해도 R10 화면에는 자동 반영되지 않습니다.

문의 폼은 메일 앱을 여는 `mailto:` 방식입니다. 별도 서버 전송 기능은 없습니다.
