(() => {
'use strict';
const $ = (s,p=document)=>p.querySelector(s);
const $$ = (s,p=document)=>[...p.querySelectorAll(s)];
let content=window.STUDIO_CONTENT;
let reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
try { if(localStorage.getItem('mplanit-reduce-motion')==='true') reduce=true; } catch {}
let manuallyPaused=false;
const hero=$('#hero-video'),modal=$('#video-dialog'),stage=$('#video-stage');
function cleanUrl(value){if(!value)return '';try{const u=new URL(value,location.href);return ['http:','https:','blob:','file:'].includes(u.protocol)?value:'';}catch{return '';}}
function embedUrl(url){try{const u=new URL(url);let id;if(['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname)){id=u.searchParams.get('v')||u.pathname.match(/\/(?:embed|shorts)\/([^/]+)/)?.[1];}else if(u.hostname==='youtu.be')id=u.pathname.slice(1);if(id&&/^[\w-]{11}$/.test(id))return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;if(['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(u.hostname)){id=u.pathname.split('/').filter(Boolean).find(v=>/^\d+$/.test(v));if(id)return `https://player.vimeo.com/video/${id}?autoplay=1`;}return null;}catch{return null;}}
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function playSafe(v){const p=v.play();if(p?.catch)p.catch(()=>{});}
function createCard(w,i){
 const article=el('article','work-card'); article.dataset.group=w.category==='BRAND FILM'?'film':w.category==='LIVE ACTION & 3D'?'hybrid':'ai';
 const btn=el('button','media-button');btn.setAttribute('aria-label',`${w.title} ${w.video?'영상 재생':'이미지 보기'}`);
 const img=el('img');img.src=cleanUrl(w.poster);img.alt=w.title;img.loading='lazy';img.decoding='async';btn.append(img);
 if(w.video&&!embedUrl(w.video)){const v=el('video');v.src=cleanUrl(w.video);v.muted=true;v.loop=true;v.playsInline=true;v.preload='none';v.setAttribute('aria-hidden','true');btn.append(v);btn.addEventListener('pointerenter',()=>{if(!reduce)playSafe(v);});btn.addEventListener('pointerleave',()=>v.pause());}
 btn.append(el('div','card-overlay'));btn.append(el('span','card-badge',w.category));btn.append(el('span','card-play',w.video?'▶':'+'));btn.addEventListener('click',()=>openWork(w));
 const meta=el('div','card-meta'),titlewrap=el('div');titlewrap.append(el('h3','',w.title));titlewrap.append(el('p',w.concept?'concept-label':'',w.concept?'CONCEPT PREVIEW':w.kind));meta.append(titlewrap,el('span','',String(i+1).padStart(2,'0')));article.append(btn,meta);return article;
}
function render(){
 document.documentElement.style.setProperty('--blue',/^#[0-9a-f]{6}$/i.test(content.brand.blue)?content.brand.blue:'#0093ff');
 $$('.brand img').forEach(i=>i.src=cleanUrl(content.brand.logo));
 hero.poster=cleanUrl(content.hero.poster);hero.src=cleanUrl(content.hero.video);hero.style.objectPosition=content.hero.mobilePosition||'50% 50%';hero.muted=true;$('#sound-label').textContent='SOUND OFF';
 if(!reduce&&!manuallyPaused)playSafe(hero);else hero.pause();
 $('#work-grid').replaceChildren(...content.works.map(createCard));
 $('#hybrid-image').style.backgroundImage=`url("${cleanUrl(content.works.find(x=>x.id==='automotive')?.poster||content.hero.poster).replace(/["\\\n\r]/g,'')}")`;
 const gallery=$('#ai-gallery');gallery.replaceChildren();
 const candidates=content.works.filter(x=>x.concept||x.category==='AI VISUAL').slice(0,3);
 for(const w of candidates){const b=el('button','portrait-card');b.setAttribute('aria-label',w.title+' 보기');const img=el('img');img.src=cleanUrl(w.poster);img.alt=w.title;img.loading='lazy';b.append(img);const copy=el('span','portrait-copy');copy.append(el('strong','',w.title),el('small','',w.concept?'CONCEPT PREVIEW':w.kind));b.append(copy);b.addEventListener('click',()=>openWork(w));gallery.append(b);}
 $$('.filter-group button').forEach(b=>{b.classList.toggle('active',b.dataset.filter==='all');b.setAttribute('aria-pressed',String(b.dataset.filter==='all'));});
 bindCursor();
}
function openWork(w){
 hero.pause();$$('.work-card video').forEach(v=>v.pause());stage.replaceChildren();$('#video-title').textContent=w.title;$('#video-category').textContent=w.kind||'MPLANIT / SHOWREEL';$('#video-description').textContent=w.description||'';
 const src=cleanUrl(w.video),embed=embedUrl(src);$('#video-original').hidden=!src;$('#video-original').href=src||'#';
 if(embed){const iframe=el('iframe');iframe.src=embed;iframe.title=w.title;iframe.allow='autoplay; fullscreen; picture-in-picture';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';stage.append(iframe);}
 else if(src){const v=el('video');v.src=src;v.poster=cleanUrl(w.poster);v.controls=true;v.autoplay=true;v.playsInline=true;v.preload='metadata';v.addEventListener('error',()=>{const message=el('p','','영상을 불러오지 못했습니다. 원본 영상 링크를 확인해주세요.');message.style.padding='40px';stage.append(message);},{once:true});stage.append(v);playSafe(v);}
 else{const img=el('img');img.src=cleanUrl(w.poster);img.alt=w.title;stage.append(img);$('#video-description').textContent=(w.description||'')+' · 콘셉트 이미지 미리보기';}
 if(!modal.open)modal.showModal();
}
function closeVideo(){modal.close();}
$('#video-close').addEventListener('click',closeVideo);modal.addEventListener('close',()=>{stage.replaceChildren();if(!reduce&&!manuallyPaused)playSafe(hero);});modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeVideo();}});
$$('[data-open-hero]').forEach(b=>b.addEventListener('click',()=>openWork({...content.hero,kind:'MPLANIT / SHOWREEL'})));
$('#sound-toggle').addEventListener('click',()=>{hero.muted=!hero.muted;$('#sound-label').textContent=hero.muted?'SOUND OFF':'SOUND ON';$('#sound-toggle').setAttribute('aria-label',hero.muted?'영상 소리 켜기':'영상 소리 끄기');if(hero.paused){manuallyPaused=false;playSafe(hero);}});
$('#hero-pause').addEventListener('click',()=>{manuallyPaused=!hero.paused;if(hero.paused)playSafe(hero);else hero.pause();});
hero.addEventListener('play',()=>{$('#hero-pause').textContent='Ⅱ';$('#hero-pause').setAttribute('aria-label','배경 영상 일시정지');});hero.addEventListener('pause',()=>{$('#hero-pause').textContent='▶';$('#hero-pause').setAttribute('aria-label','배경 영상 재생');});
hero.addEventListener('timeupdate',()=>{const f=n=>`00:${Math.floor(n).toString().padStart(2,'0')}`;$('#timecode').textContent=f(hero.currentTime)+' / '+f(hero.duration||16);$('#hero-progress').style.width=(hero.currentTime/(hero.duration||16)*100)+'%';});
hero.addEventListener('error',()=>{$('#timecode').textContent='POSTER PREVIEW';$('#hero-pause').textContent='▶';});
$('.filter-group').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('.filter-group button').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});$$('.work-card').forEach(c=>c.hidden=b.dataset.filter!=='all'&&c.dataset.group!==b.dataset.filter);});
const nav=$('#nav-dialog');$('#menu-open').addEventListener('click',()=>{nav.showModal();$('#menu-open').setAttribute('aria-expanded','true');});$('#menu-close').addEventListener('click',()=>nav.close());$$('nav a',nav).forEach(a=>a.addEventListener('click',()=>nav.close()));nav.addEventListener('close',()=>$('#menu-open').setAttribute('aria-expanded','false'));
const expertise=[
 ['CREATIVE STRATEGY','크리에이티브 전략',['브랜드·캠페인 전략 및 콘셉트 기획','광고 아이디어 및 크리에이티브 개발','시나리오·트리트먼트·콘티 기획','비주얼 콘셉트 및 아트 디렉션','브랜드 톤앤매너 및 스타일 설계','캐릭터·세계관·콘텐츠 포맷 개발','매체별 콘텐츠 및 캠페인 구조 설계']],
 ['AI PRODUCTION','AI 프로덕션',['생성형 AI 영상·이미지·모션 제작','AI 기반 광고·브랜드 필름 제작','제품·서비스 비주얼 콘텐츠 제작','AI 애니메이션 및 모션그래픽','AI 캐릭터·디지털 휴먼 제작','AI VFX 및 비주얼 확장','프로젝트 맞춤형 AI 제작 파이프라인 구축']],
 ['HYBRID PRODUCTION','하이브리드 프로덕션',['실사 촬영과 생성형 AI 결합','AI·3D·CGI·VFX 통합 제작','제품 영상 및 3D 비주얼라이징','캐릭터 애니메이션 및 리깅','촬영 기반 AI 비주얼 확장','실사 영상의 배경·공간·오브젝트 생성','AI와 기존 프로덕션 방식의 통합 제작']],
 ['POST-PRODUCTION','포스트 프로덕션',['영상 편집 및 컬러 그레이딩','합성·클린업·VFX 후반 작업','모션그래픽 및 타이포그래피','AI 업스케일링 및 영상 복원','사운드 디자인·믹싱·오디오 마스터링','더빙·립싱크·자막 제작','매체별 버전 및 콘텐츠 리사이징']],
 ['CAMPAIGN CONTENT','캠페인 콘텐츠',['브랜드 캠페인 영상','디지털·소셜 광고 콘텐츠','숏폼·세로형 콘텐츠','제품·서비스 런칭 콘텐츠','광고 소재 베리에이션','퍼포먼스 광고용 크리에이티브','시리즈형 브랜드 콘텐츠']],
 ['AI WORKFLOW','AI 제작 시스템',['프로젝트별 AI 제작 방식 설계','AI 툴 선정 및 제작 프로세스 구축','광고 제작 과정에 AI 워크플로우 적용','반복 제작을 위한 비주얼 일관성 관리','브랜드 맞춤형 AI 활용 가이드 구축','제작 효율화를 위한 파이프라인 설계','AI 활용 범위 및 제작 방식 컨설팅']]
];
expertise.forEach((entry,i)=>{const d=el('details');if(i===0)d.open=true;const s=el('summary');s.append(el('span','',String(i+1).padStart(2,'0')));const t=el('div');t.append(el('h3','',entry[0]),el('p','',entry[1]));s.append(t,el('span','','+'));const ul=el('ul');entry[2].forEach(x=>ul.append(el('li','',x)));d.append(s,ul);$('#expertise-list').append(d);});
$('#contact-form').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;const d=new FormData(f);const body=`이름: ${d.get('name')}\n회사: ${d.get('company')}\n이메일: ${d.get('email')}\n\n${d.get('message')}`;location.href=`mailto:${content.contact.email}?subject=${encodeURIComponent('[영상 제작 문의] '+d.get('subject'))}&body=${encodeURIComponent(body)}`;$('#contact-status').textContent='이메일 앱에서 전송을 완료해주세요. 앱이 열리지 않으면 mplanit@mplanit.co.kr로 보내주세요.';});
let observer;if('IntersectionObserver'in window){document.body.classList.add('motion-ready');observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08});$$('.reveal').forEach(e=>observer.observe(e));const videoObserver=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)hero.pause();else if(!reduce&&!manuallyPaused&&!modal.open)playSafe(hero);}),{threshold:.05});videoObserver.observe(hero);}
let promptIndex=0,charIndex=0,erasing=false,promptTimer;const prompts=['실사인지 AI인지 구분도 안 갈 만큼 정교한 영상 만들어줘','딱 3초 안에 사람들 시선을 사로잡는 광고 만들어줘','단 한 컷으로 브랜드를 각인시키는 비주얼 스토리 기획해줘','실사 촬영, 3D, AI 중 브랜드에 최적화된 솔루션 제안해줘'];
function typePrompt(){if(reduce){$('#prompt-text').textContent=prompts[2];return;}const text=prompts[promptIndex];charIndex+=erasing?-1:1;$('#prompt-text').textContent=text.slice(0,charIndex);let delay=erasing?25:65;if(charIndex>=text.length){erasing=true;delay=2400;}else if(charIndex<=0){erasing=false;promptIndex=(promptIndex+1)%prompts.length;delay=500;}promptTimer=setTimeout(typePrompt,delay);}
function setMotion(){document.body.classList.toggle('reduce-motion',reduce);$('#motion-toggle').setAttribute('aria-pressed',String(reduce));$('#motion-toggle').textContent=reduce?'모션 켜기':'모션 줄이기';clearTimeout(promptTimer);if(reduce){hero.pause();$$('.work-card video').forEach(v=>v.pause());}else if(!manuallyPaused&&!modal.open)playSafe(hero);typePrompt();}
$('#motion-toggle').addEventListener('click',()=>{reduce=!reduce;try{localStorage.setItem('mplanit-reduce-motion',String(reduce));}catch{}setMotion();});
const cursor=$('#cursor-label');function bindCursor(){if(!matchMedia('(pointer:fine)').matches)return;$$('.media-button').forEach(b=>{b.addEventListener('pointermove',e=>{if(reduce)return;cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.style.transform='translate(-50%,-50%) scale(1)';cursor.style.opacity='1';});b.addEventListener('pointerleave',()=>{cursor.style.transform='translate(-50%,-50%) scale(0)';cursor.style.opacity='0';});b.addEventListener('click',()=>cursor.style.opacity='0');});}
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='mplanit-preview')return;const c=event.data.content;if(c?.hero&&Array.isArray(c.works)&&c.brand&&c.contact){content=c;render();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)hero.pause();else if(!reduce&&!manuallyPaused&&!modal.open)playSafe(hero);});
render();setMotion();
})();
