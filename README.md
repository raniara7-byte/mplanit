# 엠플랜잇 AI 솔루션 소개서 — 공개 발행 브랜치

이 브랜치는 **GitHub Pages 발행 전용**입니다. 슬라이드 1개 파일만 들어 있습니다.

- `index.html` — AI 솔루션 소개서 8장 (이미지·폰트 내장, 단일 파일)
- 공개 주소: https://raniara7-byte.github.io/mplanit/

## 갱신 방법

`mplanit` 브랜치에서 `ai-solution/index.html`을 수정한 뒤:

```bash
python3 ai-solution/tools/build-standalone.py          # 단일 HTML 재생성
git checkout gh-pages
cp ai-solution/mplanit-ai-solution.html index.html     # mplanit 브랜치에서 복사
git commit -am "Update deck" && git push origin gh-pages
```

※ 이 브랜치의 내용은 **누구나 볼 수 있습니다.** 소스 저장소(`mplanit` 브랜치)는 비공개로 유지됩니다.
