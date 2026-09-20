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
  s.addText('엠플랜잇 AI LAB 운영 솔루션 5종 — 대행사 실무 기준 설계, 1인 기업까지 사용',
    { x:P(56), y:P(246), w:P(900), h:P(20), isTextBox:true, margin:0, fontFace:B, fontSize:11, color:TX });

  const flow = [['제작','Banner Fit · Reels Studio'],['노출','GEO Metric Care'],['판매','커머스허브'],['성과','애드리포트']];
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
    ['애드리포트','AD REPORT','14개 매체 집행 현황 · 전환 · ROAS · 알림 · 리포트','성과 이상 즉시 알림']];
  const cw = P(228), gap = P(12);
  sols.forEach(function(so, i){
    const x = P(56) + i*(cw+gap);
    s.addShape(pres.ShapeType.roundRect, { x, y:P(334), w:cw, h:P(180), rectRadius:0.06,
      fill:{ color:'FBFDFF' }, line:{ color:LINE, width:0.75 } });
    s.addShape(pres.ShapeType.roundRect, { x:x+P(14), y:P(350), w:P(24), h:P(24), rectRadius:0.1,
      fill:{ color:NAVY }, line:{ color:NAVY } });
    s.addText(String(i+1), { x:x+P(14), y:P(350), w:P(24), h:P(24), isTextBox:true, margin:0,
      align:'center', valign:'middle', fontFace:H, fontSize:9, color:'FFFFFF' });
    s.addText(so[0], { x:x+P(46), y:P(350), w:cw-P(58), h:P(22), isTextBox:true, margin:0,
      fontFace:H, fontSize:11.5, color:INK, valign:'middle' });
    s.addText(so[1], { x:x+P(14), y:P(380), w:cw-P(28), h:P(14), isTextBox:true, margin:0,
      fontFace:H, fontSize:7.5, color:SKY, charSpacing:1 });
    s.addText(so[2], { x:x+P(14), y:P(400), w:cw-P(28), h:P(66), isTextBox:true, margin:0,
      fontFace:B, fontSize:8.5, color:TX, lineSpacingMultiple:1.3 });
    s.addShape(pres.ShapeType.line, { x:x+P(14), y:P(478), w:cw-P(28), h:0, line:{ color:LINE2, width:0.5, dashType:'dash' } });
    s.addText(so[3], { x:x+P(14), y:P(484), w:cw-P(28), h:P(18), isTextBox:true, margin:0,
      fontFace:H, fontSize:8, color:NAVY });
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
  s.addText('출처 · OpenAI(2026.07), Similarweb AI Search Stats 2026, 국내 광고업계 AI 제작 비중 전망 보도(2025.10)',
    { x:P(56), y:P(596), w:P(1100), h:P(16), isTextBox:true, margin:0, fontFace:B, fontSize:7, color:TX3 });
  foot(s, '엠플랜잇 AIU본부 · AI LAB · mplanit.co.kr', '01 / 06');
  s.addNotes('표지 — 솔루션 5종과 시장 근거 3가지. 제작·노출·판매·성과 흐름으로 설명.');
})();

/* ───────── 02 AI LAB 통합 ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, 'AI LAB INTEGRATION', 'AI LAB 통합 구조 — ', '소재에서 매출까지 한 줄로',
       '솔루션 5종 · 단계별 역할 · 데이터 연결 · 적용 대상 요약', '통합 요약 1장');

  const stages = ['01 제작','02 제작','03 노출','04 판매','05 성과'];
  const cards = [
    ['배너핏', ['입력 6단계 / 대화형','매체 규격 23종+','레이어 분리 · PSD','모델 2종 선택']],
    ['릴스 스튜디오', ['한 줄 → AI 질문 완성','기획 5단계','컷 승인형 디렉팅','엔진 2종 선택']],
    ['지오 케어', ['점수 3종 진단','엔진 4종 점검','개선 가이드','월 1~2회 재측정']],
    ['커머스허브', ['판매 채널 7개','주문 매시 수집','정산 06:30','SKU 재고 · 원가']],
    ['애드리포트', ['광고 매체 14개','일 · 매체 · 캠페인 · 키워드','ROAS · 목표 진척','알림 · 정기 리포트']]];
  const cw = P(230), gap = P(11);
  cards.forEach(function(c, i){
    const x = P(56) + i*(cw+gap);
    s.addText(stages[i], { x, y:P(146), w:cw, h:P(16), isTextBox:true, margin:0, align:'center',
      fontFace:H, fontSize:8, color:SKY, charSpacing:1 });
    s.addShape(pres.ShapeType.roundRect, { x, y:P(168), w:cw, h:P(168), rectRadius:0.06,
      fill:{ color:'FFFFFF' }, line:{ color:LINE2, width:0.75 } });
    s.addShape(pres.ShapeType.rect, { x, y:P(168), w:cw, h:P(30), fill:{ color:NAVY } });
    s.addText(c[0], { x:x+P(12), y:P(168), w:cw-P(60), h:P(30), isTextBox:true, margin:0, valign:'middle',
      fontFace:H, fontSize:10.5, color:'FFFFFF' });
    s.addText('운영', { x:x+cw-P(48), y:P(175), w:P(36), h:P(16), isTextBox:true, margin:0, align:'center',
      valign:'middle', fontFace:H, fontSize:7, color:'D9E6F6' });
    c[1].forEach(function(t, k){
      s.addText(t, { x:x+P(12), y:P(206)+k*P(30), w:cw-P(24), h:P(22), isTextBox:true, margin:0,
        fontFace:B, fontSize:8.5, color:TX, valign:'middle' });
      if (k < 3) s.addShape(pres.ShapeType.line, { x:x+P(12), y:P(230)+k*P(30), w:cw-P(24), h:0,
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
  foot(s, 'AI LAB · 통합 구조 요약', '02 / 06');
  s.addNotes('AI LAB 통합 요약 — 단독 1장으로도 사용 가능. 5개 솔루션의 역할, 데이터 연결, 대상별 활용.');
})();

/* ───────── 03 Banner Fit ───────── */
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
  s.addText('화면 — 운영 중인 Banner Fit 실제 캡처. 편집 화면 시안은 당사 집행 소재.',
    { x:fx, y:P(548), w:fw, h:P(30), isTextBox:true, margin:0, fontFace:B, fontSize:7.5, color:TX3 });
  shot(s, 'bannerfit-form',   P(470), P(166), P(276), '① 라이트 모드 · 6단계 입력');
  shot(s, 'bannerfit-chat',   P(758), P(160), P(454), '② 에디터 모드 · 한 줄 지시');
  shot(s, 'bannerfit-editor', P(540), P(356), P(600), '③ 레이어 편집 · 사이즈 변형 · 다운로드');
  foot(s, 'Banner Fit · 배너핏', '03 / 06');
})();

/* ───────── 04 Reels Studio ───────── */
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
  s.addText('참고 — 국내 숏폼 외주 단가 15만~200만원, 기간 2~3주(크몽 단가 가이드 기준).',
    { x:fx, y:P(548), w:fw, h:P(30), isTextBox:true, margin:0, fontFace:B, fontSize:7.5, color:TX3 });
  shot(s, 'reels-idea',  P(470), P(168), P(300), '① 한 줄 아이디어 + 5단계');
  shot(s, 'reels-style', P(790), P(160), P(422), '② 표현 · 스타일 선택');
  shot(s, 'reels-video', P(530), P(384), P(520), '③ 배너 영상 · VEO 3.1 / Gemini Omni');
  foot(s, 'Reels Studio · 릴스 스튜디오', '04 / 06');
})();

/* ───────── 05 GEO Metric Care ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, '03 VISIBILITY', 'GEO Metric Care — ', 'AI 답변 내 브랜드 인용 진단',
       'URL 입력 → SEO · GEO 통합 분석 → 점수 · 개선 가이드 · PDF 리포트', 'geo.mplanit.co.kr');
  const fx = P(56), fw = P(376);
  feature(s, fx, P(160), fw, '01', '점수 3종 진단', '종합 · SEO · GEO 동시 산출. 자사 사이트 기준 84 / 95 / 72.');
  feature(s, fx, P(238), fw, '02', '판정 기준', '80점 이상 인용 가능 · 70점대 기본 충족 · 60점 이하 구조 개선 필요.');
  feature(s, fx, P(316), fw, '03', '진단 범위', 'ChatGPT · Gemini · Perplexity · 네이버 AI 브리핑(Yeti · 서치어드바이저).');
  feature(s, fx, P(394), fw, '04', '항목별 현재값 · 권장 기준', '인용 신뢰도(E-E-A-T 70점 이상) · 통계 포함 · 스키마 · 엔티티 연결성.');
  const st = [['76% → 53%','생성형 AI 방문 점유율 중 ChatGPT 비중(Gemini 27% · Claude 9%)'],
              ['85%','브랜드 언급 중 외부 콘텐츠 발생 비율']];
  st.forEach(function(t, i){
    const x = fx + i*P(196);
    s.addShape(pres.ShapeType.rect, { x, y:P(486), w:P(3), h:P(56), fill:{ color:SKY } });
    s.addText(t[0], { x:x+P(12), y:P(482), w:P(172), h:P(22), isTextBox:true, margin:0, fontFace:H, fontSize:12, color:NAVY });
    s.addText(t[1], { x:x+P(12), y:P(506), w:P(172), h:P(46), isTextBox:true, margin:0,
      fontFace:B, fontSize:7.5, color:TX, lineSpacingMultiple:1.25 });
  });
  shot(s, 'geo-landing', P(490), P(160), P(470), '① URL 입력 → 분석 시작');
  shot(s, 'geo-result',  P(600), P(350), P(560), '② 분석 결과 — 자사 진단(종합 84 / SEO 95 / GEO 72)');
  foot(s, 'GEO Metric Care · 지오 메트릭 케어', '05 / 06');
})();

/* ───────── 06 커머스허브 + 애드리포트 ───────── */
(function(){
  const s = pres.addSlide(); base(s);
  head(s, '04 COMMERCE · 05 PERFORMANCE', '커머스허브 + 애드리포트 — ', '매출과 광고비 단일 기준',
       '한 계정으로 AD REPORT · AD MONITOR · COMMERCE HUB · SETTINGS 이동 (네이버웍스 SSO)',
       '운영 중 · 카카오쇼핑 승인 대기');

  const panels = [
    { y:P(158), t:'커머스허브', en:'COMMERCE HUB',
      mini:[['판매 채널','7개'],['주문 수집','매시'],['정산 수집','06:30']],
      li:[['메뉴','정산 · 매출 · 재고 · 배송 · 광고비 · 설정'],
          ['정산','채널별 금액 · 월별 추이 · 전월 동기간 비교'],
          ['연동','오픈마켓 · 네이버 광고 API · 사업자/브랜드 권한']] },
    { y:P(352), t:'애드리포트', en:'AD REPORT',
      mini:[['광고 매체','14개'],['실적 수집','매시'],['리포트 유형','2가지']],
      li:[['리포트','통합 대시보드 · 목표 현황 · 배분 현황 · 실시간 현황'],
          ['분석','소재 · 키워드 · 광고주 코드 · UTM 생성/현황'],
          ['알림','CPA 급등 · 전환 급감 메신저 통보 · 정시 실적 보고']] }];

  panels.forEach(function(p){
    const x = P(56), w = P(376);
    s.addShape(pres.ShapeType.roundRect, { x, y:p.y, w, h:P(180), rectRadius:0.06,
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
    p.li.forEach(function(l, i){
      s.addText([{ text:'· ', options:{ color:SKY, fontFace:H } },
                 { text:l[0]+' — ', options:{ color:NAVY, fontFace:H } },
                 { text:l[1], options:{ color:TX, fontFace:B } }],
        { x:x+P(16), y:p.y+P(92)+i*P(28), w:w-P(32), h:P(24), isTextBox:true, margin:0, fontSize:8.5 });
    });
  });
  s.addText('화면 — 운영 중 애드리포트 실제 캡처. 광고주명·금액·건수 마스킹 처리.',
    { x:P(56), y:P(544), w:P(376), h:P(16), isTextBox:true, margin:0, fontFace:B, fontSize:7.5, color:TX3 });

  shot(s, 'adreport-dashboard', P(466), P(158), P(560), '① 통합 대시보드 — 매체군별 성과 · 목표 진척');
  shot(s, 'adreport-goal',      P(748), P(380), P(460), '② 목표 현황 — 매체별 목표 대비 실적');

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
  foot(s, '출처 · Similarweb AI Search Stats 2026 · OpenAI(2026.07) · 크몽 숏폼 단가 가이드 · 엠플랜잇 운영 자료(2026.09)', '06 / 06');
})();

pres.writeFile({ fileName: path.join(__dirname, '..', 'mplanit-ai-solution.pptx') })
  .then(function(f){ console.log('saved', f); });
