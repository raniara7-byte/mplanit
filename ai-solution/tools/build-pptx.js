// 엠플랜잇 AI 솔루션 소개서 → PPTX 산출 (HTML 덱과 동일 구성)
// 실행: node tools/build-pptx.js   (ai-solution 디렉터리 기준)
const pptxgen = require('pptxgenjs');
const path = require('path');
const SIZES = require('./image-sizes.json');

const P = (v) => (v * 13.3333) / 1280;           // HTML px → inch
const NAVY='1B468B', SKY='399BC1', INK='0F1B2E', TX='334155', TX2='64748B',
      TX3='94A3B8', LINE='E3EAF4', LINE2='CFDCEE', CHIP='EAF1FC', BG2='F5F8FC';
const H = '페이퍼로지 8 ExtraBold', B = '페이퍼로지 4 Regular';   // 사내 표준 서체

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';                      // 13.3 x 7.5
pres.author = 'Mplanit AIU';
pres.company = 'Mplanit';
pres.title = '엠플랜잇 AI 솔루션 소개서';

const img = (n) => path.join(__dirname, '..', 'assets', 'png', n + '.png');
const ratio = (n) => SIZES[n][1] / SIZES[n][0];

function base(s){
  s.background = { color: 'FFFFFF' };
  s.addShape(pres.ShapeType.rect, { x:0, y:0, w:13.3333, h:P(5), fill:{ color:NAVY } });
  s.addShape(pres.ShapeType.rect, { x:6.5, y:0, w:6.8333, h:P(5), fill:{ color:SKY } });
}
function foot(s, left, no){
  s.addShape(pres.ShapeType.line, { x:P(56), y:P(672), w:P(1168), h:0, line:{ color:LINE, width:0.75 } });
  s.addText(left, { x:P(56), y:P(678), w:P(800), h:P(20), isTextBox:true, margin:0,
    fontFace:B, fontSize:8, color:TX3, valign:'middle' });
  s.addText(no, { x:P(1000), y:P(678), w:P(224), h:P(20), isTextBox:true, margin:0, align:'right',
    fontFace:B, fontSize:8, color:TX3, valign:'middle' });
}
function head(s, kicker, title, titleEm, sub, chip){
  s.addText(kicker, { x:P(56), y:P(44), w:P(700), h:P(16), isTextBox:true, margin:0,
    fontFace:H, fontSize:8.5, color:SKY, charSpacing:2 });
  s.addText([{ text:title, options:{ color:INK } }, { text:titleEm, options:{ color:NAVY } }],
    { x:P(56), y:P(62), w:P(940), h:P(34), isTextBox:true, margin:0, fontFace:H, fontSize:21 });
  s.addText(sub, { x:P(56), y:P(100), w:P(940), h:P(18), isTextBox:true, margin:0,
    fontFace:B, fontSize:10, color:TX2 });
  if (chip){
    s.addShape(pres.ShapeType.roundRect, { x:P(950), y:P(60), w:P(274), h:P(26), rectRadius:0.12,
      fill:{ color:CHIP }, line:{ color:LINE2, width:0.75 } });
    s.addText(chip, { x:P(950), y:P(60), w:P(274), h:P(26), isTextBox:true, margin:0, align:'center',
      valign:'middle', fontFace:H, fontSize:8.5, color:NAVY });
  }
  s.addShape(pres.ShapeType.line, { x:P(56), y:P(126), w:P(1168), h:0, line:{ color:LINE, width:0.75 } });
}
function feature(s, x, y, w, n, title, body){
  s.addShape(pres.ShapeType.roundRect, { x, y, w:P(26), h:P(20), rectRadius:0.1, fill:{ color:NAVY }, line:{ color:NAVY } });
  s.addText(n, { x, y, w:P(26), h:P(20), isTextBox:true, margin:0, align:'center', valign:'middle',
    fontFace:H, fontSize:8, color:'FFFFFF' });
  s.addText(title, { x:x+P(36), y:y-P(2), w:w-P(36), h:P(18), isTextBox:true, margin:0, fontFace:H, fontSize:11, color:INK });
  s.addText(body, { x:x+P(36), y:y+P(18), w:w-P(36), h:P(36), isTextBox:true, margin:0,
    fontFace:B, fontSize:9, color:TX, lineSpacingMultiple:1.25 });
}
function shot(s, name, x, y, w, caption){
  const h = w * ratio(name);
  s.addShape(pres.ShapeType.roundRect, { x:x-P(2), y:y-P(2), w:w+P(4), h:h+P(4), rectRadius:0.06,
    fill:{ color:'FFFFFF' }, line:{ color:LINE, width:0.75 },
    shadow:{ type:'outer', color:'0F1B2E', blur:10, offset:4, angle:90, opacity:0.16 } });
  s.addImage({ path: img(name), x, y, w, h });
  if (caption){
    s.addShape(pres.ShapeType.rect, { x, y:y+h-P(17), w:P(Math.min(430, caption.length*7.4+18)), h:P(17),
      fill:{ color:'FFFFFF' }, line:{ color:LINE, width:0.5 } });
    s.addText(caption, { x:x+P(5), y:y+h-P(17), w:P(Math.min(430, caption.length*7.4+18)), h:P(17),
      isTextBox:true, margin:0, valign:'middle', fontFace:H, fontSize:7.5, color:TX2 });
  }
}
function quote(s, x, y, w, line, sub){
  const h = sub ? P(48) : P(40);
  s.addShape(pres.ShapeType.rect, { x, y, w, h, fill:{ color:BG2 }, line:{ color:BG2 } });
  s.addShape(pres.ShapeType.rect, { x, y, w:P(3), h, fill:{ color:NAVY }, line:{ color:NAVY } });
  s.addText(line, { x:x+P(14), y:y+P(7), w:w-P(26), h:P(18), isTextBox:true, margin:0, fontFace:H, fontSize:10, color:NAVY });
  if (sub) s.addText(sub, { x:x+P(14), y:y+P(26), w:w-P(26), h:P(16), isTextBox:true, margin:0,
    fontFace:B, fontSize:7.5, color:TX2 });
}
// 글자 폭 추정 — 한글/전각은 넓게, 라틴/숫자는 좁게 (칩 줄바꿈 방지)
function textW(t){
  let w = 0;
  for (const ch of t) w += /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF\u3000-\u303F\uFF00-\uFFEF]/.test(ch) ? 10.2 : 5.6;
  return w;
}
// 매체/채널 칩 — 로고 보유 매체는 아이콘, 그 외는 브랜드 컬러 점
function medias(s, x, y, items, maxW){
  const path = require('path');
  let cx = x, cy = y;
  items.forEach(function(it){
    if (it.label){   // 구분 라벨
      const lw = P(textW(it.label) + 8);
      s.addText(it.label, { x:cx, y:cy, w:lw, h:P(22), isTextBox:true, margin:0, valign:'middle',
        fontFace:H, fontSize:7.5, color:TX3 });
      cx += lw + P(4); return;
    }
    const w = P(textW(it.t) + (it.icon ? 32 : 26));
    if (maxW && cx + w > x + maxW){ cx = x; cy += P(28); }
    s.addShape(pres.ShapeType.roundRect, { x:cx, y:cy, w, h:P(22), rectRadius:0.1,
      fill:{ color:'FFFFFF' }, line:{ color:LINE, width:0.75 } });
    if (it.icon){
      s.addImage({ path: path.join(__dirname, '..', 'assets', 'png', 'icon-'+it.icon+'.png'),
        x:cx+P(7), y:cy+P(5.5), w:P(11), h:P(11) });
      s.addText(it.t, { x:cx+P(20), y:cy, w:w-P(22), h:P(22), isTextBox:true, margin:0, valign:'middle',
        fontFace:H, fontSize:7.5, color:TX, wrap:false });
    } else {
      s.addShape(pres.ShapeType.ellipse, { x:cx+P(8), y:cy+P(8), w:P(6), h:P(6),
        fill:{ color:it.c }, line:{ color:it.c } });
      s.addText(it.t, { x:cx+P(17), y:cy, w:w-P(20), h:P(22), isTextBox:true, margin:0, valign:'middle',
        fontFace:H, fontSize:7.5, color:TX, wrap:false });
    }
    cx += w + P(6);
  });
  return cy + P(22);
}
const MEDIA_AD = [{t:'네이버 검색',icon:'naver'},{t:'GFA',c:'03C75A'},{t:'NOSP',c:'03C75A'},
  {t:'카카오모먼트',c:'FFCD00'},{t:'카카오페이',c:'FFCD00'},{t:'Google Ads',icon:'googleads'},
  {t:'메타',icon:'meta'},{t:'틱톡',icon:'tiktok'},{t:'크리테오',c:'F76B15'},{t:'타불라',c:'0B4F8A'},
  {t:'Apple Ads',icon:'apple'},{t:'당근',c:'FF6F0F'},{t:'모비온',c:'6B7A90'},{t:'토스애즈',c:'0064FF'}];
const MEDIA_CH = [{t:'스마트스토어',icon:'naver'},{t:'쿠팡',c:'C4161C'},{t:'카페24',c:'1B5FAA'},
  {t:'11번가',c:'FF0038'},{t:'토스쇼핑',c:'0064FF'},{t:'G마켓·옥션',c:'00A650'},{t:'톡스토어 (승인 대기)',c:'FFCD00'}];

function chips(s, x, y, items){
  let cx = x;
  items.forEach(function(it){
    const w = P(it.t.length * 8.4 + 22);
    s.addShape(pres.ShapeType.roundRect, { x:cx, y, w, h:P(22), rectRadius:0.1,
      fill:{ color: it.gray ? BG2 : CHIP }, line:{ color: it.gray ? LINE : CHIP, width:0.5 } });
    s.addText(it.t, { x:cx, y, w, h:P(22), isTextBox:true, margin:0, align:'center', valign:'middle',
      fontFace:H, fontSize:8, color: it.gray ? TX2 : NAVY });
    cx += w + P(6);
  });
}

/* ───────── 01 표지 ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  s.addImage({ path: img('logo-mplanit'), x:P(56), y:P(44), w:P(115), h:P(115)*ratio('logo-mplanit') });
  s.addShape(pres.ShapeType.roundRect, { x:P(948), y:P(46), w:P(276), h:P(28), rectRadius:0.12,
    fill:{ color:CHIP }, line:{ color:LINE2, width:0.75 } });
  s.addText('AI 솔루션 소개서 · 2026.09', { x:P(948), y:P(46), w:P(276), h:P(28), isTextBox:true,
    margin:0, align:'center', valign:'middle', fontFace:H, fontSize:8.5, color:NAVY });

  s.addText([{ text:'제작 · 노출 · 판매 · 성과\n', options:{ color:INK } },
             { text:'광고 실무 전 과정의 AI 전환', options:{ color:NAVY } }],
    { x:P(56), y:P(128), w:P(900), h:P(110), isTextBox:true, margin:0, fontFace:H, fontSize:30, lineSpacingMultiple:1.16 });
  s.addText([{ text:'AI 솔루션 5종 + 데이터 인프라 1', options:{ fontFace:H, color:NAVY } },
             { text:'  —  M Ai Platform · AI LAB · 커머스허브 · MI', options:{ fontFace:B, color:TX } }],
    { x:P(56), y:P(248), w:P(1160), h:P(22), isTextBox:true, margin:0, fontSize:12 });

  const flow = [['제작','Banner Fit · Reels Studio'],['노출','GEO Metric Care'],['판매','커머스허브'],
                ['성과','애드리포트'],['기반','MI · 데이터 인프라']];
  let fx = P(56);
  flow.forEach(function(f, i){
    const w = P(f[0].length*15 + f[1].length*6.2 + 34);
    s.addShape(pres.ShapeType.roundRect, { x:fx, y:P(286), w, h:P(28), rectRadius:0.1, fill:{ color:CHIP }, line:{ color:CHIP } });
    s.addText([{ text:f[0]+'  ', options:{ fontFace:H, fontSize:8.5, color:NAVY } },
               { text:f[1], options:{ fontFace:B, fontSize:8, color:TX2 } }],
      { x:fx, y:P(286), w, h:P(28), isTextBox:true, margin:0, align:'center', valign:'middle' });
    fx += w;
    if (i < flow.length-1){
      s.addText('›', { x:fx, y:P(286), w:P(18), h:P(28), isTextBox:true, margin:0, align:'center',
        valign:'middle', fontFace:H, fontSize:11, color:LINE2 });
      fx += P(18);
    }
  });

  const sols = [
    ['배너핏','BANNER FIT','배너 생성 · 규격 변형 · 레이어 편집 · 영상','라이트 · 에디터 2모드'],
    ['릴스 스튜디오','REELS STUDIO','한 줄 입력 · 컷 승인형 숏폼 제작','컷 승인형 렌더'],
    ['지오 메트릭 케어','GEO METRIC CARE','AI 검색 노출 진단 · 개선 가이드','종합 · SEO · GEO'],
    ['커머스허브','COMMERCE HUB','7개 마켓 주문 · 정산 · 재고 통합','매시 주문 · 06:30 정산'],
    ['애드리포트','AD REPORT','14개 매체 성과 · ROAS · 알림','성과 이상 즉시 알림'],
    ['MI 솔루션','DATA INFRA · AI 솔루션 아님','자동입찰 · 대량 리포트 · 데이터 인프라','엠플랜잇 기술 기반']];
  const cw = P(186), gap = P(10);
  sols.forEach(function(so, i){
    const x = P(56) + i*(cw+gap);
    s.addShape(pres.ShapeType.roundRect, { x, y:P(334), w:cw, h:P(180), rectRadius:0.06,
      fill:{ color:'FBFDFF' }, line:{ color:LINE, width:0.75 } });
    s.addShape(pres.ShapeType.roundRect, { x:x+P(12), y:P(350), w:P(24), h:P(24), rectRadius:0.1,
      fill:{ color:NAVY }, line:{ color:NAVY } });
    s.addText(String(i+1), { x:x+P(12), y:P(350), w:P(24), h:P(24), isTextBox:true, margin:0,
      align:'center', valign:'middle', fontFace:H, fontSize:9, color:'FFFFFF' });
    s.addText(so[0], { x:x+P(44), y:P(350), w:cw-P(54), h:P(22), isTextBox:true, margin:0,
      fontFace:H, fontSize:10.5, color:INK, valign:'middle' });
    s.addText(so[1], { x:x+P(12), y:P(380), w:cw-P(24), h:P(14), isTextBox:true, margin:0,
      fontFace:H, fontSize:6.5, color:SKY, charSpacing:.6 });
    s.addText(so[2], { x:x+P(12), y:P(400), w:cw-P(24), h:P(70), isTextBox:true, margin:0,
      fontFace:B, fontSize:7.5, color:TX, lineSpacingMultiple:1.3 });
    s.addShape(pres.ShapeType.line, { x:x+P(12), y:P(478), w:cw-P(24), h:0, line:{ color:LINE2, width:0.5, dashType:'dash' } });
    s.addText(so[3], { x:x+P(12), y:P(484), w:cw-P(24), h:P(18), isTextBox:true, margin:0,
      fontFace:H, fontSize:7, color:NAVY });
  });

  medias(s, P(56), P(538), [{label:'연동 광고 매체 14'}].concat(MEDIA_AD)
    .concat([{label:'판매 채널 7'}]).concat(MEDIA_CH), P(1168));
  s.addText([{ text:'공개 프로젝트 ', options:{ fontFace:H, color:TX2 } },
             { text:'삼성전자 DS · AIA생명 · 쿠쿠전자    ', options:{ fontFace:B, color:TX3 } },
             { text:'공식 파트너 ', options:{ fontFace:H, color:TX2 } },
             { text:'네이버 · 카카오 · 크리테오 — 공식 홈페이지 공개 기준', options:{ fontFace:B, color:TX3 } }],
    { x:P(56), y:P(606), w:P(1168), h:P(16), isTextBox:true, margin:0, fontSize:7.5 });
  foot(s, '엠플랜잇 AIU본부 · M Ai Platform · AI LAB · mplanit.co.kr', '01 / 08');
  s.addNotes('표지 — 솔루션 5종과 시장 근거 3가지. 제작·노출·판매·성과 흐름으로 설명.');
})();

/* ───────── 02 AI LAB 통합 ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, 'SOLUTION ARCHITECTURE', '엠플랜잇 AI 솔루션 통합 구조 — ', '소재에서 매출까지 한 줄로',
       'AI 솔루션 5종(M Ai Platform · AI LAB · 커머스허브) + 데이터 인프라 1(MI) — 수집부터 판단까지 단일 기준', '통합 요약 1장');

  const groups = [['만들고','CREATE'],['관리하고','MANAGE'],['운영·성과','OPERATE']];
  groups.forEach(function(g,i){
    const gw = P(383), gx = P(56) + i*(gw+P(11));
    s.addShape(pres.ShapeType.roundRect, { x:gx, y:P(140), w:gw, h:P(22), rectRadius:0.1,
      fill:{ color:CHIP }, line:{ color:CHIP } });
    s.addText([{ text:g[0]+'  ', options:{ fontFace:H, fontSize:9, color:NAVY } },
               { text:g[1], options:{ fontFace:H, fontSize:6.5, color:TX3 } }],
      { x:gx, y:P(140), w:gw, h:P(22), isTextBox:true, margin:0, align:'center', valign:'middle' });
  });
  const stages = ['01 제작','02 제작','03 노출','04 판매','05 성과','기반 · 데이터 인프라'];
  const cards = [
    ['배너핏', ['입력 6단계 / 대화형','매체 규격 23종+','레이어 분리 · PSD','모델 2종 선택']],
    ['릴스 스튜디오', ['한 줄 → AI 질문 완성','기획 5단계','컷 승인형 디렉팅','엔진 2종 선택']],
    ['지오 케어', ['점수 3종 진단','엔진 4종 점검','개선 가이드','월 1~2회 재측정']],
    ['커머스허브', ['판매 채널 7개','주문 매시 수집','정산 06:30','SKU 재고 · 원가']],
    ['애드리포트', ['광고 매체 14개','일 · 매체 · 캠페인 · 키워드','ROAS · 목표 진척','알림 · 정기 리포트']],
    ['MI 솔루션', ['네이버 자동입찰','다계정 통합 리포트','통합 데이터 분석','수집 · 정규화 인프라']]];
  const cw = P(187), gap = P(9);
  cards.forEach(function(c, i){
    const x = P(56) + i*(cw+gap);
    s.addText(stages[i], { x, y:P(168), w:cw, h:P(14), isTextBox:true, margin:0, align:'center',
      fontFace:H, fontSize:7.5, color:SKY, charSpacing:.6 });
    s.addShape(pres.ShapeType.roundRect, { x, y:P(186), w:cw, h:P(158), rectRadius:0.06,
      fill:{ color:'FFFFFF' }, line:{ color:LINE2, width:0.75 } });
    s.addShape(pres.ShapeType.rect, { x, y:P(186), w:cw, h:P(28), fill:{ color: i===5 ? '334155' : NAVY } });
    s.addText(c[0], { x:x+P(10), y:P(186), w:cw-P(52), h:P(28), isTextBox:true, margin:0, valign:'middle',
      fontFace:H, fontSize:9.5, color:'FFFFFF' });
    s.addText(['M Ai','M Ai','AI LAB','Hub','M Ai','Infra'][i], { x:x+cw-P(44), y:P(192), w:P(34), h:P(16), isTextBox:true, margin:0,
      align:'center', valign:'middle', fontFace:H, fontSize:6.5, color:'D9E6F6' });
    c[1].forEach(function(t, k){
      s.addText(t, { x:x+P(10), y:P(222)+k*P(29), w:cw-P(20), h:P(22), isTextBox:true, margin:0,
        fontFace:B, fontSize:7.5, color:TX, valign:'middle' });
      if (k < 3) s.addShape(pres.ShapeType.line, { x:x+P(10), y:P(245)+k*P(29), w:cw-P(20), h:0,
        line:{ color:LINE, width:0.5, dashType:'dash' } });
    });
  });

  s.addShape(pres.ShapeType.roundRect, { x:P(56), y:P(352), w:P(1168), h:P(74), rectRadius:0.05,
    fill:{ color:BG2 }, line:{ color:LINE, width:0.75 } });
  const flow = [['소재','배너 · 영상 산출물'],['노출','매체 집행 + AI 검색 인용'],['주문','7개 채널 매출 집계'],
                ['성과','광고비 + 전환매출 결합'],['판단','ROAS 기준 예산 배분']];
  flow.forEach(function(f, i){
    const x = P(70) + i*P(226);
    s.addShape(pres.ShapeType.roundRect, { x, y:P(366), w:P(206), h:P(46), rectRadius:0.06,
      fill:{ color:'FFFFFF' }, line:{ color:LINE, width:0.75 } });
    s.addText(f[0], { x:x+P(12), y:P(372), w:P(182), h:P(16), isTextBox:true, margin:0, fontFace:H, fontSize:9, color:NAVY });
    s.addText(f[1], { x:x+P(12), y:P(390), w:P(182), h:P(16), isTextBox:true, margin:0, fontFace:B, fontSize:7.5, color:TX2 });
    if (i < 4) s.addText('›', { x:x+P(206), y:P(366), w:P(20), h:P(46), isTextBox:true, margin:0,
      align:'center', valign:'middle', fontFace:H, fontSize:12, color:LINE2 });
  });

  const tg = [['브랜드 · 마케팅팀','배너핏 + 릴스 + GEO 케어 + 애드리포트','캠페인 제작과 성과 관리 강화 · AI 검색 노출 준비'],
              ['그로스 · 커머스팀','커머스허브 + MI + 애드리포트','판매 관리 · 검색광고 운영 · 보고 효율화'],
              ['소상공인 · 1인 기업','확장 방향','쉬운 입력 · 선택형 직접 이용 (출시 시점·요금 별도 확정)']];
  tg.forEach(function(t, i){
    const x = P(56) + i*P(394);
    s.addShape(pres.ShapeType.roundRect, { x, y:P(444), w:P(382), h:P(80), rectRadius:0.06,
      fill:{ color:'FBFDFF' }, line:{ color:LINE, width:0.75 } });
    s.addText(t[0], { x:x+P(16), y:P(458), w:P(350), h:P(18), isTextBox:true, margin:0, fontFace:H, fontSize:10, color:NAVY });
    s.addText(t[1], { x:x+P(16), y:P(480), w:P(350), h:P(36), isTextBox:true, margin:0,
      fontFace:B, fontSize:8.5, color:TX, lineSpacingMultiple:1.3 });
  });
  quote(s, P(56), P(536), P(1168), '판매와 광고를 한곳에서 — 광고비가 실제로 얼마를 팔았는지 확인',
    '채널마다 접속·다운로드·옮겨적기 없이, 주문과 광고비가 같은 기준으로 합쳐집니다\n※ 서비스 포트폴리오 구성도이며 솔루션 간 자동 통합 아키텍처를 뜻하지 않습니다');
  foot(s, 'Solution Architecture · 통합 구조 요약', '02 / 08');
  s.addNotes('AI LAB 통합 요약 — 단독 1장으로도 사용 가능. 5개 솔루션의 역할, 데이터 연결, 대상별 활용.');
})();

/* ───────── 03 솔루션 이미지맵 ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, 'SOLUTION MAP', '솔루션 이미지맵 — ', '화면으로 보는 6종',
       '제작 → 노출 → 판매 → 성과 · AI 솔루션 5종 + 데이터 인프라(MI) 1', '한 장 요약 · 배포용');
  const path = require('path');
  const tiles = [
    ['제작','배너핏','시안 생성 · 매체 규격 변형 · 레이어 편집 · 영상 전환','banner-fit.mplanit.co.kr','bannerfit-editor'],
    ['제작','릴스 스튜디오','한 줄 아이디어 · 기획 5단계 · 컷 승인형 렌더','reel-studio.mplanit.co.kr','reels-idea'],
    ['노출','지오 메트릭 케어','종합 · SEO · GEO 점수 진단 · 개선 가이드 · 정기 재측정','geo.mplanit.co.kr','geo-result'],
    ['판매','커머스허브','7개 마켓 주문 · 배송 · 정산 · 재고 · 광고비 통합','정산 · 매출 · 재고 · 배송 · 광고비 · 설정',null],
    ['성과','애드리포트','14개 매체 집행 · 목표 진척 · ROAS · 이상 알림','통합 대시보드 · 목표/실시간 현황','adreport-dashboard'],
    ['기반','MI 솔루션','자동입찰 · 대량 통합 리포트 · 통합 데이터 분석 · 인프라 구성 (AI 솔루션 아님)','엠플랜잇 자체 기술 기반',null]];
  const tw = P(378), th = P(250), gx = P(16), gy = P(16);
  tiles.forEach(function(t, i){
    const x = P(56) + (i%3)*(tw+gx), y = P(148) + Math.floor(i/3)*(th+gy);
    s.addShape(pres.ShapeType.roundRect, { x, y, w:tw, h:th, rectRadius:0.05,
      fill:{ color:'FFFFFF' }, line:{ color:LINE, width:0.75 },
      shadow:{ type:'outer', color:'0F1B2E', blur:8, offset:3, angle:90, opacity:0.08 } });
    if (t[4]){
      s.addImage({ path: img(t[4]), x, y, w:tw, h:P(148), sizing:{ type:'cover', w:tw, h:P(148) } });
    } else {
      s.addShape(pres.ShapeType.rect, { x, y, w:tw, h:P(148), fill:{ color:'F3F7FC' }, line:{ color:'F3F7FC' } });
      s.addText(t[1] + ' 화면 — 준비 중', { x, y, w:tw, h:P(148), isTextBox:true, margin:0, align:'center',
        valign:'middle', fontFace:H, fontSize:9, color:TX3 });
    }
    s.addShape(pres.ShapeType.line, { x, y:y+P(148), w:tw, h:0, line:{ color:LINE, width:0.75 } });
    s.addShape(pres.ShapeType.roundRect, { x:x+P(14), y:y+P(162), w:P(38), h:P(17), rectRadius:0.1,
      fill:{ color:SKY }, line:{ color:SKY } });
    s.addText(t[0], { x:x+P(14), y:y+P(162), w:P(38), h:P(17), isTextBox:true, margin:0, align:'center',
      valign:'middle', fontFace:H, fontSize:7, color:'FFFFFF' });
    s.addText(t[1], { x:x+P(58), y:y+P(160), w:tw-P(72), h:P(20), isTextBox:true, margin:0, valign:'middle',
      fontFace:H, fontSize:11, color:INK });
    s.addText(t[2], { x:x+P(14), y:y+P(186), w:tw-P(28), h:P(32), isTextBox:true, margin:0,
      fontFace:B, fontSize:8, color:TX, lineSpacingMultiple:1.25 });
    s.addText(t[3], { x:x+P(14), y:y+P(220), w:tw-P(28), h:P(16), isTextBox:true, margin:0,
      fontFace:H, fontSize:7, color:TX3 });
  });
  foot(s, 'Solution Map · 화면 기준 요약', '03 / 08');
  s.addNotes('솔루션 이미지맵 — 단독 1장 배포용. 커머스허브/MI 화면은 확보 후 교체.');
})();

/* ───────── 04 Banner Fit ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, '01 CREATIVE · M AI PLATFORM', 'Banner Fit — ', '배너 1장이 아닌 캠페인 한 세트',
       '시안 생성 · 규격 변형 · 레이어 편집 · 영상 전환, 한 도구 안에서', 'banner-fit.mplanit.co.kr');
  const fx = P(56), fw = P(376);
  feature(s, fx, P(160), fw, '01', '한 번 입력으로 즉시 생성', '이미지 + 요청 한 줄 → 배경 · 카피 · 레이아웃 동시 산출');
  feature(s, fx, P(238), fw, '02', '매체 규격 자동 대응', '23개 이상 매체 규격 · 안전 영역 · 텍스트 비율 내장');
  feature(s, fx, P(316), fw, '03', '디자이너 워크플로 연결', '텍스트 · 로고 · 배경 분리 PSD → 포토샵에서 바로 수정');
  feature(s, fx, P(394), fw, '04', '레이어 분해 편집', '피사체 · 텍스트 자동 분리 → 브라우저에서 재배치');
  chips(s, fx, P(478), [{t:'라이트 · 에디터 2모드'},{t:'Gemini(나노 바나나) · ChatGPT 2.0'}]);
  chips(s, fx, P(508), [{t:'크리에이티브 생성 · 사이즈 변형 · 영상 생성', gray:true}]);
  s.addText('화면 — 운영 중 Banner Fit 실제 캡처. 편집 화면 시안은 당사 집행 소재.',
    { x:fx, y:P(548), w:fw, h:P(26), isTextBox:true, margin:0, fontFace:B, fontSize:7, color:TX3 });
  shot(s, 'bannerfit-form',   P(470), P(166), P(276), '① 라이트 모드 · 6단계 입력');
  shot(s, 'bannerfit-chat',   P(758), P(160), P(454), '② 에디터 모드 · 한 줄 지시');
  shot(s, 'bannerfit-editor', P(540), P(356), P(600), '③ 레이어 편집 · 사이즈 변형 · 다운로드');
  foot(s, 'Banner Fit · 배너핏', '04 / 08');
})();

/* ───────── 05 Reels Studio ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, '02 VIDEO · M AI PLATFORM', 'Reels Studio — ', '프롬프트 대신 질문 응답',
       '한 줄 아이디어 → AI 초안 → 컷 승인 → 렌더, 5단계 진행', 'reel-studio.mplanit.co.kr');
  const fx = P(56), fw = P(376);
  feature(s, fx, P(160), fw, '01', '프롬프트 없이 시작', '대상 · 목적 · 메시지 질문형 대화 → 스타일 · 컷 구성은 AI');
  feature(s, fx, P(238), fw, '02', '초안 스토리보드 자동 생성', '대본 · 키프레임 포함 콘티 전체를 먼저 제안');
  feature(s, fx, P(316), fw, '03', '컷 단위 승인형 디렉팅', '컷 재생성 · 키프레임 교체 · 순서 변경 — 컷 간 일관성 유지');
  feature(s, fx, P(394), fw, '04', '승인한 만큼만 비용', '대본 · 키프레임 무료 · 승인된 성공 컷만 차감');
  chips(s, fx, P(474), [{t:'쇼츠 9:16 · 유튜브 16:9 · 인스타 1:1'}]);
  chips(s, fx, P(504), [{t:'짧게 2컷 · 기본 4컷 · 길게 7컷'},{t:'VEO 3.1 / Gemini Omni', gray:true}]);
  quote(s, fx, P(536), fw, "'만들기'가 아니라 '다듬기'부터", 'AI가 대본·키프레임 포함 콘티 전체를 먼저 제안 · 승인한 컷만 과금');
  s.addText('참고 — 국내 숏폼 외주 단가 15만~200만원, 기간 2~3주(크몽 단가 가이드 기준).',
    { x:fx, y:P(590), w:fw, h:P(26), isTextBox:true, margin:0, fontFace:B, fontSize:7, color:TX3 });
  shot(s, 'reels-idea',  P(470), P(168), P(300), '① 한 줄 아이디어 + 5단계');
  shot(s, 'reels-style', P(790), P(160), P(422), '② 표현 · 스타일 선택');
  shot(s, 'reels-video', P(530), P(384), P(520), '③ 배너 영상 · VEO 3.1 / Gemini Omni');
  foot(s, 'Reels Studio · 릴스 스튜디오', '05 / 08');
})();

/* ───────── 06 GEO Metric Care ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, '03 VISIBILITY · AI LAB', 'GEO Metric Care — ', '브랜드 노출을 진단하고 개선하는 GEO 솔루션',
       'GEO — ChatGPT · 네이버 AI 등 AI 답변에 브랜드가 언급·추천되도록 최적화하는 전략', 'geo.mplanit.co.kr');
  const fx = P(56), fw = P(376);
  feature(s, fx, P(160), fw, '01', 'AI 가독성 진단', 'AI가 읽고 인용하기 쉬운 사이트인지 점검');
  feature(s, fx, P(238), fw, '02', '네이버 AI 브리핑 대응', '국내 고객 접점인 네이버 AI까지 통합 점검');
  feature(s, fx, P(316), fw, '03', '브랜드 신뢰도 분석', '홈페이지 · 블로그 · 카페 등 AI 참조 채널 분석');
  feature(s, fx, P(394), fw, '04', '개선 가이드 제공', '노출 저해 요인 도출 → 개선 방향 제시');
  quote(s, fx, P(478), fw, 'AI가 추천하는 브랜드, 지금 준비하세요',
    '종합 · SEO · GEO 점수 진단 (80↑ 인용 가능 · 70점대 기본 · 60↓ 개선 필요)');
  const risks = [['제로클릭','오가닉 유입 20~30% 급감'],['추천 누락','AI 답변 후보군에서 제외'],['정보 왜곡','잘못된 정보로 신뢰 하락']];
  risks.forEach(function(r, i){
    const x = fx + i*P(128);
    s.addShape(pres.ShapeType.roundRect, { x, y:P(534), w:P(120), h:P(48), rectRadius:0.06,
      fill:{ color:'FFFFFF' }, line:{ color:LINE, width:0.75 } });
    s.addText(r[0], { x:x+P(9), y:P(540), w:P(102), h:P(14), isTextBox:true, margin:0, fontFace:H, fontSize:8, color:'B42318' });
    s.addText(r[1], { x:x+P(9), y:P(554), w:P(102), h:P(24), isTextBox:true, margin:0,
      fontFace:B, fontSize:6.5, color:TX2, lineSpacingMultiple:1.2 });
  });
  shot(s, 'geo-landing', P(490), P(160), P(470), '① URL 입력 → 분석 시작');
  shot(s, 'geo-result',  P(600), P(350), P(560), '② 분석 결과 — 자사 진단(종합 84 / SEO 95 / GEO 72)');
  s.addText('점수는 자체 진단 기준입니다 — 실제 AI 답변 노출·인용률이나 검색순위를 뜻하지 않습니다.',
    { x:fx, y:P(590), w:fw, h:P(16), isTextBox:true, margin:0, fontFace:B, fontSize:7, color:TX3 });
  foot(s, 'AI LAB · GEO Metric Care Solution — 흥국화재 TM 제안 장표(2026.09) 기준', '06 / 08');
})();

/* ───────── 07 커머스허브 + 애드리포트 ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, '04 COMMERCE · 05 PERFORMANCE · M AI PLATFORM', '커머스허브 + 애드리포트 — ', '매출과 광고비 단일 기준',
       '광고 AI 자동 소재 제작 · 실시간 통합 리포트 분석 — AD REPORT · AD MONITOR · COMMERCE HUB · SETTINGS',
       '운영 중 · 카카오쇼핑 승인 대기');

  const panels = [
    { y:P(150), h:P(172), t:'커머스허브', en:'COMMERCE HUB',
      mini:[['판매 채널','7개'],['주문 수집','매시'],['정산 수집','06:30']],
      chips: MEDIA_CH,
      li:[['메뉴','정산 · 매출 · 재고 · 배송 · 광고비 · 설정']] },
    { y:P(340), h:P(216), t:'애드리포트', en:'AD REPORT',
      mini:[['광고 매체','14개'],['실적 수집','매시'],['리포트 유형','2가지']],
      chips: MEDIA_AD,
      li:[['리포트','통합 대시보드 · 목표 현황 · 실시간 현황 · 소재/키워드 분석']] }];

  panels.forEach(function(p){
    const x = P(56), w = P(376);
    s.addShape(pres.ShapeType.roundRect, { x, y:p.y, w, h:p.h, rectRadius:0.06,
      fill:{ color:'FBFDFF' }, line:{ color:LINE, width:0.75 } });
    s.addText([{ text:p.t+'  ', options:{ fontFace:H, fontSize:11, color:INK } },
               { text:p.en, options:{ fontFace:H, fontSize:7, color:SKY } }],
      { x:x+P(16), y:p.y+P(12), w:w-P(32), h:P(20), isTextBox:true, margin:0 });
    p.mini.forEach(function(m, i){
      const mx = x+P(16) + i*P(116);
      s.addShape(pres.ShapeType.roundRect, { x:mx, y:p.y+P(38), w:P(108), h:P(42), rectRadius:0.06,
        fill:{ color:'FFFFFF' }, line:{ color:LINE, width:0.75 } });
      s.addText(m[0], { x:mx+P(10), y:p.y+P(44), w:P(90), h:P(12), isTextBox:true, margin:0, fontFace:B, fontSize:7, color:TX2 });
      s.addText(m[1], { x:mx+P(10), y:p.y+P(56), w:P(90), h:P(18), isTextBox:true, margin:0, fontFace:H, fontSize:10.5, color:NAVY });
    });
    const endY = medias(s, x+P(14), p.y+P(88), p.chips, w-P(28));
    p.li.forEach(function(l, i){
      s.addText([{ text:'· ', options:{ color:SKY, fontFace:H } },
                 { text:l[0]+' — ', options:{ color:NAVY, fontFace:H } },
                 { text:l[1], options:{ color:TX, fontFace:B } }],
        { x:x+P(16), y:endY+P(8)+i*P(22), w:w-P(32), h:P(20), isTextBox:true, margin:0, fontSize:8 });
    });
  });
  s.addText('화면 — 실제 캡처(캡처 시점 수치 · 광고주명·금액 마스킹) · 채널별 연동 범위와 집계 주기 상이 · 판매 매출과 광고 기여 성과 구분',
    { x:P(56), y:P(556), w:P(376), h:P(34), isTextBox:true, margin:0, fontFace:B, fontSize:6.5, color:TX3, lineSpacingMultiple:1.25 });

  shot(s, 'adreport-dashboard', P(466), P(150), P(540), '① 통합 대시보드 — 매체군별 성과 · 목표 진척');
  shot(s, 'adreport-goal',      P(766), P(362), P(442), '② 목표 현황 — 매체별 목표 대비 실적');

  foot(s, '출처 · Similarweb AI Search Stats 2026 · OpenAI(2026.07) · 크몽 숏폼 단가 가이드 · 엠플랜잇 운영 자료(2026.09)', '07 / 08');
})();

/* ───────── 08 MI 솔루션 · 데이터 인프라 ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, 'TECH BASE · 데이터 인프라 (AI 솔루션 아님)', 'MI 솔루션 — ', '자동입찰 · 대량 리포트, 그리고 그 아래 인프라',
       '매체·마켓·전환 데이터를 한 기준으로 모으는 수집·정규화·집계 구조 — 엠플랜잇 자체 구축',
       'MI Solution · Data Infra');
  const fx = P(56), fw = P(376);
  feature(s, fx, P(160), fw, '01', '네이버 검색광고 자동입찰', '순위 목표 기반 입찰 조정 · 시간대 규칙 · 예산 제어');
  feature(s, fx, P(238), fw, '02', '대량 통합 리포트', '다계정 일괄 수집 · 키워드 단위 추출 · 자동 발송');
  feature(s, fx, P(316), fw, '03', '통합 데이터 분석', '광고비 · 매출 · 전환을 단일 지표 체계로 결합');
  feature(s, fx, P(394), fw, '04', '인프라 구성', '수집 · 정규화 · 적재 · 권한 분리 직접 설계·운영');
  quote(s, fx, P(474), fw, 'AI 솔루션이 올라서는 바닥', '데이터를 모으고 맞추는 인프라가 엠플랜잇의 기술 기반입니다');
  s.addText('AI 기능이 아닌 운영 자동화·데이터 기술 영역 · 기능 범위·오픈 일정 내부 확정 후 갱신\n공식 Solution 페이지는 M Ai Platform · MARS로 소개 — MI 명칭·자동입찰은 사내 정보 기준',
    { x:fx, y:P(528), w:fw, h:P(34), isTextBox:true, margin:0, fontFace:B, fontSize:6.5, color:TX3, lineSpacingMultiple:1.3 });

  const boxes = [
    { y:P(152), t:'데이터 파이프라인 — 수집에서 판단까지', tint:'F2F5FA',
      steps:[['수집','광고 14 · 마켓 7 API'],['정규화','매체·채널 기준 통일'],['적재 · 집계','일/캠페인/키워드/SKU'],['활용','리포트 · 입찰 · ROAS']] },
    { y:P(276), t:'자동입찰 — 목표 기반 반복 조정',
      steps:[['목표 설정','키워드 순위 · 예산'],['현황 수집','순위 · 노출 · 비용'],['입찰 조정','규칙 기반 자동'],['결과 확인','변경 이력 · 성과']] },
    { y:P(400), t:'대량 통합 리포트 — 계정 수와 무관한 산출',
      steps:[['다계정 수집','광고주 N · 매체별'],['통합 집계','키워드 · 캠페인 단위'],['자동 발송','정기 리포트 · 파일']] }];
  const bx = P(466), bw = P(758);
  boxes.forEach(function(b){
    s.addShape(pres.ShapeType.roundRect, { x:bx, y:b.y, w:bw, h:P(110), rectRadius:0.05,
      fill:{ color:b.tint || 'FBFDFF' }, line:{ color:LINE, width:0.75 } });
    s.addText(b.t, { x:bx+P(16), y:b.y+P(12), w:bw-P(32), h:P(18), isTextBox:true, margin:0,
      fontFace:H, fontSize:10, color: b.tint ? '334155' : NAVY });
    const n = b.steps.length, sw = (bw - P(32) - P(14)*(n-1)) / n;
    b.steps.forEach(function(st, i){
      const x = bx + P(16) + i*(sw + P(14));
      s.addShape(pres.ShapeType.roundRect, { x, y:b.y+P(40), w:sw, h:P(52), rectRadius:0.06,
        fill:{ color:'FFFFFF' }, line:{ color:LINE, width:0.75 } });
      s.addText(st[0], { x, y:b.y+P(50), w:sw, h:P(16), isTextBox:true, margin:0, align:'center',
        fontFace:H, fontSize:9, color:INK });
      s.addText(st[1], { x, y:b.y+P(66), w:sw, h:P(16), isTextBox:true, margin:0, align:'center',
        fontFace:B, fontSize:7, color:TX2 });
      if (i < n-1) s.addText('›', { x:x+sw, y:b.y+P(40), w:P(14), h:P(52), isTextBox:true, margin:0,
        align:'center', valign:'middle', fontFace:H, fontSize:11, color:LINE2 });
    });
  });

  const tg = [['외부 툴 구독 대체','사내 인프라 운영'],
              ['데이터 단절 없음','애드리포트·커머스허브와 같은 기준'],
              ['확장 기반','수집 계층만 추가하면 전 솔루션 반영']];
  tg.forEach(function(t, i){
    const x = P(56) + i*P(394);
    s.addShape(pres.ShapeType.roundRect, { x, y:P(590), w:P(382), h:P(38), rectRadius:0.06,
      fill:{ color:BG2 }, line:{ color:LINE, width:0.75 } });
    s.addText([{ text:t[0]+'  ', options:{ fontFace:H, color:NAVY } },
               { text:t[1], options:{ fontFace:B, color:TX } }],
      { x:x+P(14), y:P(590), w:P(354), h:P(38), isTextBox:true, margin:0, valign:'middle', fontSize:8 });
  });
  foot(s, 'MI 솔루션 · 데이터 인프라 · 엠플랜잇 자체 기술', '08 / 08');
  s.addNotes('MI는 AI 솔루션이 아닌 데이터 인프라·운영 자동화 영역. 6종 솔루션이 공유하는 수집·정규화·집계 기반이 자체 기술임을 강조.');
})();

pres.writeFile({ fileName: path.join(__dirname, '..', 'mplanit-ai-solution.pptx') })
  .then(function(f){ console.log('saved', f); });
