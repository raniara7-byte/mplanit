#!/usr/bin/env python3
"""index.html + assets + fonts → 단일 HTML 파일(로컬 확인·메일 첨부용)."""
import base64, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text(encoding='utf-8')

def data_uri(path: pathlib.Path, mime: str) -> str:
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()

# 폰트 임베드
def font_sub(m):
    name = m.group(1)
    f = root / 'fonts' / name
    return f'url("{data_uri(f, "font/woff2")}") format("woff2")' if f.exists() else m.group(0)
html = re.sub(r'url\("fonts/([^"]+)"\) format\("woff2"\)', font_sub, html)

# 이미지 임베드
def img_sub(m):
    rel = m.group(1)
    f = root / rel
    if not f.exists():
        return m.group(0)
    mime = 'image/webp' if f.suffix == '.webp' else 'image/png'
    return f'src="{data_uri(f, mime)}"'
html = re.sub(r'src="(assets/[^"]+)"', img_sub, html)

out = root / 'mplanit-ai-solution.html'
out.write_text(html, encoding='utf-8')
print(f'{out}  {out.stat().st_size/1024:.0f} KB')
