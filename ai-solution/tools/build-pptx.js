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
// 매체/채널 칩 — 로고 보유 매체는 아이콘, 그 외는 브랜드 컬러 점
function medias(s, x, y, items, maxW){
  const path = require('path');
  let cx = x, cy = y;
  items.forEach(function(it){
    if (it.label){   // 구분 라벨
      const lw = P(it.label.length*7.4 + 8);
      s.addText(it.label, { x:cx, y:cy, w:lw, h:P(22), isTextBox:true, margin:0, valign:'middle',
        fontFace:H, fontSize:7.5, color:TX3 });
      cx += lw + P(4); return;
    }
    const w = P(it.t.length*7.6 + (it.icon ? 30 : 24));
    if (maxW && cx + w > x + maxW){ cx = x; cy += P(28); }
    s.addShape(pres.ShapeType.roundRect, { x:cx, y:cy, w, h:P(22), rectRadius:0.1,
      fill:{ color:'FFFFFF' }, line:{ color:LINE, width:0.75 } });
    if (it.icon){
      s.addImage({ path: path.join(__dirname, '..', 'assets', 'png', 'icon-'+it.icon+'.png'),
        x:cx+P(7), y:cy+P(5.5), w:P(11), h:P(11) });
      s.addText(it.t, { x:cx+P(21), y:cy, w:w-P(26), h:P(22), isTextBox:true, margin:0, valign:'middle',
        fontFace:H, fontSize:7.5, color:TX });
    } else {
      s.addShape(pres.ShapeType.ellipse, { x:cx+P(8), y:cy+P(8), w:P(6), h:P(6),
        fill:{ color:it.c }, line:{ color:it.c } });
      s.addText(it.t, { x:cx+P(18), y:cy, w:w-P(24), h:P(22), isTextBox:true, margin:0, valign:'middle',
        fontFace:H, fontSize:7.5, color:TX });
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
  {t:'11번가',c:'FF0038'},{t:'토스쇼핑',c:'0064FF'},{t:'G마켓·옥션',c:'00A650'},{t:'톡스토어',c:'FFCD00'}];

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
  s.addText('AI LAB 솔루션 소개서 · 2026.09', { x:P(948), y:P(46), w:P(276), h:P(28), isTextBox:true,
    margin:0, align:'center', valign:'middle', fontFace:H, fontSize:8.5, color:NAVY });

  s.addText([{ text:'제작 · 노출 · 판매 · 성과\n', options:{ color:INK } },
             { text:'광고 실무 전 과정의 AI 전환', options:{ color:NAVY } }],
    { x:P(56), y:P(128), w:P(900), h:P(110), isTextBox:true, margin:0, fontFace:H, fontSize:30, lineSpacingMultiple:1.16 });
  s.addText('엠플랜잇 AI LAB 솔루션 6종 — 대행사 실무 기준 설계, 1인 기업까지 사용',
    { x:P(56), y:P(246), w:P(900), h:P(20), isTextBox:true, margin:0, fontFace:B, fontSize:11, color:TX });

  const flow = [['제작','Banner Fit · Reels Studio'],['노출','GEO Metric Care'],['판매','커머스허브'],
                ['성과','애드리포트'],['운영','MI 솔루션']];
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
    ['배너핏','BANNER FIT','배너 시안 생성 · 매체 규격 변형 · 레이어 편집 · 영상 전환','라이트 · 에디터 2모드'],
    ['릴스 스튜디오','REELS STUDIO','한 줄 아이디어 · 기획 노드 · 컷별 프롬프트 · 모델 선택','컷 승인형 렌더'],
    ['지오 메트릭 케어','GEO METRIC CARE','AI 검색 노출 진단 · 점수화 · 개선 가이드 · 정기 재측정','종합 · SEO · GEO'],
    ['커머스허브','COMMERCE HUB','7개 마켓 주문 · 배송 · 정산 · 재고 통합 관리','매시 주문 · 06:30 정산'],
    ['애드리포트','AD REPORT','14개 매체 집행 현황 · 전환 · ROAS · 알림 · 리포트','성과 이상 즉시 알림'],
    ['MI 솔루션','MARKETING INTELLIGENCE','네이버 검색광고 자동입찰 · 다계정 대량 통합 리포트','운영 자동화 · 공수 대체']];
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

  const stats = [['주간 10억 명','ChatGPT 주간 활성 이용자 — 검색 시작점 이동'],
                 ['약 40%','2026년 AI 제작 디지털 광고 비중 전망'],
                 ['0.8~1.3%','AI 검색 클릭률(구글 29%) — 인용 없으면 유입 없음']];
  stats.forEach(function(st, i){
    const x = P(56) + i*P(392);
    s.addShape(pres.ShapeType.rect, { x, y:P(538), w:P(3), h:P(46), fill:{ color:SKY } });
    s.addText(st[0], { x:x+P(12), y:P(534), w:P(360), h:P(26), isTextBox:true, margin:0, fontFace:H, fontSize:14, color:NAVY });
    s.addText(st[1], { x:x+P(12), y:P(560), w:P(360), h:P(26), isTextBox:true, margin:0,
      fontFace:B, fontSize:8, color:TX, lineSpacingMultiple:1.2 });
  });
  medias(s, P(56), P(596), [{label:'연동 광고 매체 14'}].concat(MEDIA_AD)
    .concat([{label:'판매 채널 7'}]).concat(MEDIA_CH), P(1168));
  s.addText('출처 · OpenAI(2026.07), Similarweb AI Search Stats 2026, 국내 광고업계 AI 제작 비중 전망 보도(2025.10) · 매체/채널 표기는 연동 현황 안내용',
    { x:P(56), y:P(652), w:P(1168), h:P(14), isTextBox:true, margin:0, fontFace:B, fontSize:6.5, color:TX3 });
  foot(s, '엠플랜잇 AIU본부 · AI LAB · mplanit.co.kr', '01 / 08');
  s.addNotes('표지 — 솔루션 5종과 시장 근거 3가지. 제작·노출·판매·성과 흐름으로 설명.');
})();

/* ───────── 02 AI LAB 통합 ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, 'AI LAB INTEGRATION', 'AI LAB 통합 구조 — ', '소재에서 매출까지 한 줄로',
       '솔루션 6종 · 단계별 역할 · 데이터 연결 · 적용 대상 요약', '통합 요약 1장');

  const stages = ['01 제작','02 제작','03 노출','04 판매','05 성과','06 운영'];
  const cards = [
    ['배너핏', ['입력 6단계 / 대화형','매체 규격 23종+','레이어 분리 · PSD','모델 2종 선택']],
    ['릴스 스튜디오', ['한 줄 → AI 질문 완성','기획 5단계','컷 승인형 디렉팅','엔진 2종 선택']],
    ['지오 케어', ['점수 3종 진단','엔진 4종 점검','개선 가이드','월 1~2회 재측정']],
    ['커머스허브', ['판매 채널 7개','주문 매시 수집','정산 06:30','SKU 재고 · 원가']],
    ['애드리포트', ['광고 매체 14개','일 · 매체 · 캠페인 · 키워드','ROAS · 목표 진척','알림 · 정기 리포트']],
    ['MI 솔루션', ['네이버 자동입찰','순위 목표 · 시간대 규칙','다계정 통합 리포트','정기 자동 발송']]];
  const cw = P(187), gap = P(9);
  cards.forEach(function(c, i){
    const x = P(56) + i*(cw+gap);
    s.addText(stages[i], { x, y:P(146), w:cw, h:P(16), isTextBox:true, margin:0, align:'center',
      fontFace:H, fontSize:8, color:SKY, charSpacing:1 });
    s.addShape(pres.ShapeType.roundRect, { x, y:P(168), w:cw, h:P(168), rectRadius:0.06,
      fill:{ color:'FFFFFF' }, line:{ color:LINE2, width:0.75 } });
    s.addShape(pres.ShapeType.rect, { x, y:P(168), w:cw, h:P(30), fill:{ color:NAVY } });
    s.addText(c[0], { x:x+P(10), y:P(168), w:cw-P(52), h:P(30), isTextBox:true, margin:0, valign:'middle',
      fontFace:H, fontSize:9.5, color:'FFFFFF' });
    s.addText(i===5 ? '준비' : '운영', { x:x+cw-P(44), y:P(175), w:P(34), h:P(16), isTextBox:true, margin:0,
      align:'center', valign:'middle', fontFace:H, fontSize:6.5, color:'D9E6F6' });
    c[1].forEach(function(t, k){
      s.addText(t, { x:x+P(10), y:P(206)+k*P(30), w:cw-P(20), h:P(22), isTextBox:true, margin:0,
        fontFace:B, fontSize:7.5, color:TX, valign:'middle' });
      if (k < 3) s.addShape(pres.ShapeType.line, { x:x+P(10), y:P(230)+k*P(30), w:cw-P(20), h:0,
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

  const tg = [['브랜드 광고주','캠페인 소재 대량 생성 · 매체별 성과 통합 리포트 · AI 검색 브랜드 노출 관리'],
              ['그로스 · 중소 광고주','소재 제작비 절감 · 채널별 ROAS 비교 · 성과 이상 즉시 알림'],
              ['소상공인 · 1인 기업','디자이너 없이 배너·영상 자체 제작 · 마켓 주문/정산 단일 화면 관리']];
  tg.forEach(function(t, i){
    const x = P(56) + i*P(394);
    s.addShape(pres.ShapeType.roundRect, { x, y:P(444), w:P(382), h:P(80), rectRadius:0.06,
      fill:{ color:'FBFDFF' }, line:{ color:LINE, width:0.75 } });
    s.addText(t[0], { x:x+P(16), y:P(458), w:P(350), h:P(18), isTextBox:true, margin:0, fontFace:H, fontSize:10, color:NAVY });
    s.addText(t[1], { x:x+P(16), y:P(480), w:P(350), h:P(36), isTextBox:true, margin:0,
      fontFace:B, fontSize:8.5, color:TX, lineSpacingMultiple:1.3 });
  });
  quote(s, P(56), P(540), P(1168), '판매와 광고를 한곳에서 — 광고비가 실제로 얼마를 팔았는지 확인',
    '채널마다 접속·다운로드·옮겨적기 없이, 주문과 광고비가 같은 기준으로 합쳐집니다 · 카카오쇼핑 API 연동 신청 자료(2026.09)');
  foot(s, 'AI LAB · 통합 구조 요약', '02 / 08');
  s.addNotes('AI LAB 통합 요약 — 단독 1장으로도 사용 가능. 5개 솔루션의 역할, 데이터 연결, 대상별 활용.');
})();

/* ───────── 03 솔루션 이미지맵 ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, 'SOLUTION MAP', '솔루션 이미지맵 — ', '화면으로 보는 6종',
       '제작 → 노출 → 판매 → 성과 → 운영, 실제 운영 화면 기준', '한 장 요약 · 배포용');
  const path = require('path');
  const tiles = [
    ['제작','배너핏','시안 생성 · 매체 규격 변형 · 레이어 편집 · 영상 전환','banner-fit.mplanit.co.kr','bannerfit-editor'],
    ['제작','릴스 스튜디오','한 줄 아이디어 · 기획 5단계 · 컷 승인형 렌더','reel-studio.mplanit.co.kr','reels-idea'],
    ['노출','지오 메트릭 케어','종합 · SEO · GEO 점수 진단 · 개선 가이드 · 정기 재측정','geo.mplanit.co.kr','geo-result'],
    ['판매','커머스허브','7개 마켓 주문 · 배송 · 정산 · 재고 · 광고비 통합','정산 · 매출 · 재고 · 배송 · 광고비 · 설정',null],
    ['성과','애드리포트','14개 매체 집행 · 목표 진척 · ROAS · 이상 알림','통합 대시보드 · 목표/실시간 현황','adreport-dashboard'],
    ['운영','MI 솔루션','네이버 검색광고 자동입찰 · 다계정 대량 통합 리포트','운영 자동화 · 공수 대체',null]];
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
  head(s, '01 CREATIVE', 'Banner Fit — ', '배너 1장이 아닌 캠페인 한 세트',
       '시안 생성 · 규격 변형 · 레이어 편집 · 영상 전환, 한 도구 안에서', 'banner-fit.mplanit.co.kr');
  const fx = P(56), fw = P(376);
  feature(s, fx, P(160), fw, '01', '입력 6단계', '기본정보 · 이미지 업로드 · 스타일 · 텍스트&폰트 · 출력 옵션 · 생성 모델. 로고 노출 위치 9분할 지정.');
  feature(s, fx, P(238), fw, '02', '2가지 작업 모드', '라이트 — 양식 입력형 / 에디터 — 대화 지시형. 한 줄 요청으로도 시안 생성.');
  feature(s, fx, P(316), fw, '03', '규격 변형 · 레이어 편집', '1:1 · 4:3 · 16:9 · 9:16 기본 비율 + 매체 규격 23종 이상. 레이어 분리 후 브라우저 수정.');
  feature(s, fx, P(394), fw, '04', '생성 모델 선택', '이미지 Gemini(나노 바나나) · ChatGPT 2.0. 완성 시안은 영상 생성 탭으로 연결.');
  chips(s, fx, P(474), [{t:'크리에이티브 생성'},{t:'소재 사이즈 변형'},{t:'영상 생성'}]);
  chips(s, fx, P(504), [{t:'편집하기 · 프로젝트', gray:true}]);
  quote(s, fx, P(536), fw, '한 번 입력으로 즉시 생성', '이미지 업로드와 요청 한 줄 → 배경 · 카피 · 레이아웃 시안 동시 산출');
  s.addText('화면 — 운영 중 Banner Fit 실제 캡처. 편집 화면 시안은 당사 집행 소재.',
    { x:fx, y:P(590), w:fw, h:P(26), isTextBox:true, margin:0, fontFace:B, fontSize:7, color:TX3 });
  shot(s, 'bannerfit-form',   P(470), P(166), P(276), '① 라이트 모드 · 6단계 입력');
  shot(s, 'bannerfit-chat',   P(758), P(160), P(454), '② 에디터 모드 · 한 줄 지시');
  shot(s, 'bannerfit-editor', P(540), P(356), P(600), '③ 레이어 편집 · 사이즈 변형 · 다운로드');
  foot(s, 'Banner Fit · 배너핏', '04 / 08');
})();

/* ───────── 05 Reels Studio ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, '02 VIDEO', 'Reels Studio — ', '프롬프트 대신 질문 응답',
       '한 줄 아이디어 → AI 초안 → 컷 승인 → 렌더, 5단계 진행', 'reel-studio.mplanit.co.kr');
  const fx = P(56), fw = P(376);
  feature(s, fx, P(160), fw, '01', '한 줄 입력', '상황 한 문장 입력 → AI가 질문 자동 완성 → 초안 스토리보드 제시.');
  feature(s, fx, P(238), fw, '02', '기획 5단계', '아이디어 · 의도 · 표현 · 스토리보드 · 완료. 길이 2컷 / 4컷 / 7컷 선택.');
  feature(s, fx, P(316), fw, '03', '표현 선택형', '영상 종류(실사 · 3D · 현실+3D · 웹툰) · 화면 스타일 · 분위기 · 주인공/조연.');
  feature(s, fx, P(394), fw, '04', '컷 승인형 렌더', '컷별 승인 · 재생성 후 VEO 3.1(1080p) 또는 Gemini Omni(720p)로 출력.');
  chips(s, fx, P(474), [{t:'쇼츠 9:16'},{t:'유튜브 16:9'},{t:'인스타 1:1'}]);
  chips(s, fx, P(504), [{t:'배너 영상 · 시작/엔드 프레임', gray:true}]);
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
  head(s, '03 VISIBILITY', 'GEO Metric Care — ', 'AI 답변 내 브랜드 인용 진단',
       'URL 입력 → SEO · GEO 통합 분석 → 점수 · 개선 가이드 · PDF 리포트', 'geo.mplanit.co.kr');
  const fx = P(56), fw = P(376);
  feature(s, fx, P(160), fw, '01', '점수 3종 진단', '종합 · SEO · GEO 동시 산출. 자사 사이트 기준 84 / 95 / 72.');
  feature(s, fx, P(238), fw, '02', '판정 기준', '80점 이상 인용 가능 · 70점대 기본 충족 · 60점 이하 구조 개선 필요.');
  feature(s, fx, P(316), fw, '03', '진단 범위', 'ChatGPT · Gemini · Perplexity · 네이버 AI 브리핑(Yeti · 서치어드바이저).');
  feature(s, fx, P(394), fw, '04', '항목별 현재값 · 권장 기준', '인용 신뢰도(E-E-A-T 70점 이상) · 통계 포함 · 스키마 · 엔티티 연결성.');
  quote(s, fx, P(478), fw, '고객은 AI에게 묻고 있는데, 우리 브랜드는 AI 답변에 등장하고 있나요?',
    '엠플랜잇 AEO·GEO 개선 가이드(2026.09)');
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
  foot(s, 'GEO Metric Care · 지오 메트릭 케어', '06 / 08');
})();

/* ───────── 07 커머스허브 + 애드리포트 ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, '04 COMMERCE · 05 PERFORMANCE', '커머스허브 + 애드리포트 — ', '매출과 광고비 단일 기준',
       '한 계정으로 AD REPORT · AD MONITOR · COMMERCE HUB · SETTINGS 이동 (네이버웍스 SSO)',
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
    const endY = medias(s, x+P(16), p.y+P(88), p.chips, w-P(32));
    p.li.forEach(function(l, i){
      s.addText([{ text:'· ', options:{ color:SKY, fontFace:H } },
                 { text:l[0]+' — ', options:{ color:NAVY, fontFace:H } },
                 { text:l[1], options:{ color:TX, fontFace:B } }],
        { x:x+P(16), y:endY+P(8)+i*P(22), w:w-P(32), h:P(20), isTextBox:true, margin:0, fontSize:8 });
    });
  });
  s.addText('화면 — 운영 중 애드리포트 실제 캡처. 광고주명·금액·건수 마스킹 처리.',
    { x:P(56), y:P(566), w:P(376), h:P(16), isTextBox:true, margin:0, fontFace:B, fontSize:7, color:TX3 });

  shot(s, 'adreport-dashboard', P(466), P(150), P(540), '① 통합 대시보드 — 매체군별 성과 · 목표 진척');
  shot(s, 'adreport-goal',      P(766), P(362), P(442), '② 목표 현황 — 매체별 목표 대비 실적');

  s.addShape(pres.ShapeType.roundRect, { x:P(56), y:P(576), w:P(1168), h:P(62), rectRadius:0.05,
    fill:{ color:NAVY }, line:{ color:NAVY } });
  s.addText('도입 3단계 — 진단 → 연동 세팅 → 운영', { x:P(76), y:P(586), w:P(700), h:P(22), isTextBox:true,
    margin:0, fontFace:H, fontSize:12, color:'FFFFFF' });
  s.addText('광고주 성과 · 대행사 공수 · 1인 기업 인력 대체', { x:P(76), y:P(608), w:P(700), h:P(20), isTextBox:true,
    margin:0, fontFace:B, fontSize:9, color:'D6E6F7' });
  s.addShape(pres.ShapeType.roundRect, { x:P(940), y:P(590), w:P(264), h:P(34), rectRadius:0.1,
    fill:{ color:'FFFFFF' }, line:{ color:'FFFFFF' } });
  s.addText('엠플랜잇 AIU본부 · mplanit.co.kr', { x:P(940), y:P(590), w:P(264), h:P(34), isTextBox:true,
    margin:0, align:'center', valign:'middle', fontFace:H, fontSize:9, color:NAVY });
  foot(s, '출처 · Similarweb AI Search Stats 2026 · OpenAI(2026.07) · 크몽 숏폼 단가 가이드 · 엠플랜잇 운영 자료(2026.09)', '07 / 08');
})();

/* ───────── 08 MI 솔루션 ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, '06 OPERATION', 'MI 솔루션 — ', '네이버 자동입찰 · 대량 통합 리포트',
       '외부 입찰관리 툴(애드몬스터 유형) 기능의 사내 내재화 · 애드리포트 데이터와 동일 기준',
       'Marketing Intelligence');
  const fx = P(56), fw = P(376);
  feature(s, fx, P(160), fw, '01', '네이버 검색광고 자동입찰', '키워드 순위 목표 기반 입찰 조정 · 시간대/요일 규칙 · 예산 소진 제어.');
  feature(s, fx, P(238), fw, '02', '대량 통합 리포트', '다계정 · 다광고주 실적 일괄 수집 · 키워드 단위 대량 추출 · 정기 자동 발송.');
  feature(s, fx, P(316), fw, '03', '운영 공수 대체', '수기 입찰 조정 · 리포트 취합 제거. 외부 입찰관리 툴 구독 대체.');
  feature(s, fx, P(394), fw, '04', '사내 데이터 연동', '애드리포트 성과 · 커머스허브 매출과 같은 기준으로 결합.');
  quote(s, fx, P(470), fw, '입찰은 자동으로, 리포트는 일괄로', '운영자는 전략 판단에만 개입');
  s.addText('기능 범위·오픈 일정은 내부 확정 후 갱신 — 현재 장표는 개발 방향 기준.',
    { x:fx, y:P(524), w:fw, h:P(16), isTextBox:true, margin:0, fontFace:B, fontSize:7, color:TX3 });

  const boxes = [
    { y:P(152), t:'자동입찰 — 목표 기반 반복 조정',
      steps:[['목표 설정','키워드 순위 · 예산'],['현황 수집','순위 · 노출 · 비용'],['입찰 조정','규칙 기반 자동'],['결과 확인','변경 이력 · 성과']] },
    { y:P(276), t:'대량 통합 리포트 — 계정 수와 무관한 산출',
      steps:[['다계정 수집','광고주 N · 매체별'],['통합 집계','키워드 · 캠페인 단위'],['자동 발송','정기 리포트 · 파일']] },
    { y:P(400), t:'연결 구조',
      steps:[['MI','입찰 · 대량 리포트'],['애드리포트','매체 성과 · ROAS'],['커머스허브','채널 매출']] }];
  const bx = P(466), bw = P(758);
  boxes.forEach(function(b){
    s.addShape(pres.ShapeType.roundRect, { x:bx, y:b.y, w:bw, h:P(110), rectRadius:0.05,
      fill:{ color:'FBFDFF' }, line:{ color:LINE, width:0.75 } });
    s.addText(b.t, { x:bx+P(16), y:b.y+P(12), w:bw-P(32), h:P(18), isTextBox:true, margin:0,
      fontFace:H, fontSize:10, color:NAVY });
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

  const tg = [['구독 비용 대체','외부 입찰관리 툴 이용료 없이 사내 계정으로 운영'],
              ['데이터 단절 없음','입찰·리포트·매출이 애드리포트/커머스허브와 같은 기준'],
              ['광고주 단위 권한','사업자·브랜드·담당자 권한 체계 그대로 적용']];
  tg.forEach(function(t, i){
    const x = P(56) + i*P(394);
    s.addShape(pres.ShapeType.roundRect, { x, y:P(548), w:P(382), h:P(74), rectRadius:0.06,
      fill:{ color:'FBFDFF' }, line:{ color:LINE, width:0.75 } });
    s.addText(t[0], { x:x+P(16), y:P(560), w:P(350), h:P(18), isTextBox:true, margin:0, fontFace:H, fontSize:10, color:NAVY });
    s.addText(t[1], { x:x+P(16), y:P(582), w:P(350), h:P(32), isTextBox:true, margin:0,
      fontFace:B, fontSize:8, color:TX, lineSpacingMultiple:1.25 });
  });
  foot(s, 'MI 솔루션 · Marketing Intelligence', '08 / 08');
})();

pres.writeFile({ fileName: path.join(__dirname, '..', 'mplanit-ai-solution.pptx') })
  .then(function(f){ console.log('saved', f); });
