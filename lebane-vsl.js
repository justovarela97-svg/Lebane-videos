var __s=document.currentScript,__B=(__s&&/lebane-vsl\.js/.test(__s.src))?__s.src.replace(/lebane-vsl\.js.*$/,''):'https://cdn.jsdelivr.net/gh/justovarela97-svg/Lebane-videos@main/';
if(!window.__lbvsl){window.__lbvsl=1;
(function(){var t=document.getElementById(`logoTrack`),m=document.getElementById(`logoTrackMob`);if(!t)return;var orig=Array.prototype.slice.call(t.children);if(m)orig.forEach(function(c){m.appendChild(c.cloneNode(!0))});[t,m].forEach(function(tr){if(!tr)return;Array.prototype.slice.call(tr.children).forEach(function(c){var d=c.cloneNode(!0);d.setAttribute(`aria-hidden`,`true`);var i=d.querySelector(`img`);i&&i.setAttribute(`alt`,``);tr.appendChild(d)})})})();
(function(){var host=document.querySelector(`.hs-form-html`),wrap=document.getElementById(`formProgress`),stepEl=document.getElementById(`fpStep`),dotsEl=document.getElementById(`fpDots`);if(!host||!wrap||!stepEl||!dotsEl)return;function buildDots(total,current){dotsEl.innerHTML=``;for(var i=1;i<=total;i++){var d=document.createElement(`div`);d.className=`fp-dot-seg`+(i<=current?` active`:``),dotsEl.appendChild(d)}}function update(){var pb=host.querySelector(`[role="progressbar"]`);if(!pb){wrap.hidden=!0;return}var now=parseInt(pb.getAttribute(`aria-valuenow`),10)||1,max=parseInt(pb.getAttribute(`aria-valuemax`),10)||2;stepEl.textContent=`Paso `+now+` de `+max,buildDots(max,now),wrap.hidden=!1}new MutationObserver(update).observe(host,{childList:!0,subtree:!0,attributes:!0,attributeFilter:[`aria-valuenow`,`aria-valuemax`]}),update(),setTimeout(update,600),setTimeout(update,1500),setTimeout(update,3e3)})();
/* VSL: reproducción, barra de progreso, CTA al final y eventos de seguimiento */
(function(){
var CTA_AT = 60;               // segundo en que aparece la placa "Agendá una demo"
var MARKS = [25, 50, 75, 95];  // % del video que se reportan al píxel
var box = document.getElementById('vsl'), v = document.getElementById('vslVideo');
if (!box || !v) return;
var ov = document.getElementById('vslOv'), ovTxt = document.getElementById('vslOvTxt'),
bar = document.getElementById('vslBar'), replay = document.getElementById('vslReplay'),
sticky = document.getElementById('stickyCta'), card = document.getElementById('card');
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
var live = false, ctaShown = false, sent = {}, inView = false, heroOut = false, cardIn = false;
function track(name, params, standard) {
params = params || {};
try { if (window.fbq) fbq(standard ? 'track' : 'trackCustom', name, params); } catch (e) {}
(window.dataLayer = window.dataLayer || []).push(Object.assign({ event: name }, params));
}
var desk = box.dataset.srcDesktop && matchMedia('(min-width: 881px)').matches;
v.poster = (desk && box.dataset.posterDesktop) || box.dataset.posterMobile;
v.src = desk ? box.dataset.srcDesktop : box.dataset.srcMobile;
if (desk) { box.classList.add('is-wide'); var hg = box.closest('.hero-grid'); hg && hg.classList.add('has-wide'); }
v.muted = true; v.loop = true;
var KEY = 'lb_vsl_done', seen = false;
try { seen = localStorage.getItem(KEY) === '1'; } catch (e) {}
function markSeen() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }
if (seen) { live = true; box.classList.add('is-live', 'is-ended', 'is-paused'); bar.style.width = '100%'; }
if (reduce) ovTxt.textContent = 'Ver video · 70 s';
function startWithSound() {
live = true; box.classList.add('is-live'); box.classList.remove('is-ended', 'is-paused');
v.loop = false; v.muted = false; v.currentTime = 0;
var p = v.play(); p && p.catch && p.catch(function () { v.muted = true; v.play(); });
track('VSL_Play');
}
ov.addEventListener('click', function (e) { e.stopPropagation(); startWithSound(); });
document.addEventListener('click', function (e) { var a = e.target.closest('[data-play-vsl]'); if (!a) return; e.preventDefault(); box.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); startWithSound(); });
replay.addEventListener('click', function (e) { e.stopPropagation(); startWithSound(); });
box.addEventListener('click', function (e) {
if (!live || box.classList.contains('is-ended') || e.target.closest('a,button')) return;
if (v.paused) { v.play(); } else { v.pause(); }
});
v.addEventListener('play', function () { box.classList.remove('is-paused'); });
v.addEventListener('pause', function () { box.classList.add('is-paused'); });
v.addEventListener('timeupdate', function () {
if (!live || !v.duration) return;
var p = v.currentTime / v.duration;
bar.style.width = ((1 - Math.pow(1 - p, 1.4)) * 100) + '%';   // avanza un poco más rápido al principio
MARKS.forEach(function (m) { if (!sent[m] && p * 100 >= m) { sent[m] = 1; track('VSL_' + m); } });
if (!ctaShown && v.currentTime >= CTA_AT) { showCta(); markSeen(); }
});
v.addEventListener('ended', function () {
if (!live) return;
box.classList.add('is-ended'); bar.style.width = '100%';
if (!sent.done) { sent.done = 1; track('VSL_Complete'); }
showCta();
});
function showCta() {
ctaShown = true; card && card.classList.add('is-hl');
setTimeout(function () { card && card.classList.remove('is-hl'); }, 2400);
syncSticky();
}
function syncSticky() { sticky && sticky.classList.toggle('is-on', (ctaShown || heroOut) && !cardIn); }
if ('IntersectionObserver' in window) {
new IntersectionObserver(function (en) {
inView = en[0].isIntersecting;
if (live || reduce) return;
if (inView) { var p = v.play(); p && p.catch && p.catch(function () {}); } else v.pause();
}, { threshold: .4 }).observe(box);
new IntersectionObserver(function (en) { heroOut = !en[0].isIntersecting && en[0].boundingClientRect.top < 0; syncSticky(); }).observe(box);
card && new IntersectionObserver(function (en) { cardIn = en[0].isIntersecting; syncSticky(); }, { threshold: .15 }).observe(card);
} else if (!reduce) { v.play(); }
document.addEventListener('click', function (e) {
var a = e.target.closest('[data-cta]'); if (a) track('VSL_CTA_Click', { cta: a.dataset.cta });
});
(function(){var c=document.querySelector('.hd-ctas');if(c&&!c.querySelector('.hd-trial')){var t=document.createElement('a');t.className='hd-trial';t.href='#probar';t.setAttribute('data-trial','');t.setAttribute('data-cta','trial-hero');t.textContent='Probar gratis →';c.appendChild(t)}})();
(function(){var ic=['<svg viewBox="0 0 24 24" fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>','<svg viewBox="0 0 24 24" fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><rect x=2 y=6 width=20 height=13 rx=2 /><path d="M2 10h20M6 15h4"/></svg>','<svg viewBox="0 0 24 24" fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 003.4 0"/></svg>'];
var it=document.querySelectorAll('.ld-item');for(var i=0;i<it.length;i++){if(!it[i].querySelector('.ld-ico')&&ic[i]){var s=document.createElement('span');s.className='ld-ico';s.setAttribute('aria-hidden','true');s.innerHTML=ic[i];it[i].insertBefore(s,it[i].firstChild)}}
var l=document.querySelector('.ld-list');if(l&&!l.querySelector('.ld-cta')){var d=document.createElement('div');d.className='ld-cta';d.innerHTML='<div><b>¿Lo vemos con tu operación?</b><small>Demo de 30 min · <a href=#probar data-trial data-cta=trial-lena>o probala vos</a></small></div><a class=ld-cta-btn href=#card data-cta=lena-card>Agendá tu demo</a>';l.appendChild(d)}})();
(function(){var e=document.querySelector('.hd-eyebrow');if(e&&!e.querySelector('b'))e.innerHTML='<span class=hd-dot></span><span>Para constructoras y desarrolladoras</span>';var s=document.querySelector('.hd-sub');if(s)s.innerHTML='El sistema <b>N°1 para desarrollos inmobiliarios.</b> Tu obra y tus finanzas, con IA, desde el celular.'})();
(function(){var M=[["Endeavor", "https://www.endeavor.org.ar/de-vender-un-contrato-sin-producto-a-mover-us1-500-millones-al-ano", "@prensa-endeavor.jpg", "De vender un contrato sin producto a mover US$1.500 millones al año"], ["La Nación", "https://www.lanacion.com.ar/economia/negocios/boom-de-inversiones-en-startups-senales-de-deshielo-en-el-ecosistema-emprendedor-argentino-nid02042026/", "6abd712de76283fcf5e7ff95_6abd709f2610d65715e941ae_6abd709dd6acef40210d4d0c_prensa-card-lanacion.png", "Señales de deshielo para el sector proptech"], ["Forbes Argentina", "https://www.forbesargentina.com/negocios/mas-us-427-millones-startups-argentinas-2026-se-reactivo-capital-n88093", "@prensa-forbes.jpg", "Lebane, entre las startups que lideraron rondas en 2026"], ["El Cronista", "https://www.cronista.com/negocios/crearon-una-startup-que-quiere-ser-la-billetera-virtual-de-la-construccion-y-levantaron-us-4-millones/", "6ace2a2d8a554a2707a486ff_6ace2a0de6c00bce47dcd2d0_prensa-card-el-cronista.png", "La billetera virtual de la construcción"], ["Emprende Argentino", "https://www.emprendeargentino.com.ar/negocios/lebane-invierte-us-4-millones-y-se-prepara-para-financiar-obras-quiere-ser-la-infraestructura-financiera-de-la-construccion", "@prensa-emprende.jpg", "Lebane invierte US$ 4 millones para dar crédito a la obra"], ["iProfesional", "https://www.iprofesional.com/negocios/431953-nunca-pusieron-un-ladrillo-pero-crearon-startup-furor-en-rubro-construccion", "6abd708c4b593f67e6904e13_6abd708839ce356d3c472c96_prensa-card-iprofesional.png", "Nunca pusieron un ladrillo y crearon una startup furor"], ["iProUP", "https://www.iproup.com/startups/70296-argentinos-lanzan-ia-para-la-construccion-que-apunta-a-financiar-obras-en-todo-el-pais", "@prensa-iproup.jpg", "Lebane va por su propia infraestructura financiera"], ["Fortuna (Perfil)", "https://fortuna.perfil.com/noticias/real-estate/lebane-invirtio-us-4-millones-para-integrar-pagos-cobranzas-e-inteligencia-artificial-al-real-estate.phtml", "6abd71481a760de625e4612f_6abd706765c597ac715cd048_6abd7063d56895840e8b4233_prensa-card-fortuna.png", "Pagos, cobranzas e IA para el real estate"], ["The Startup Journal", "https://www.startupjournal.io/article/lebane-invierte-4-millones-pagos-cobranzas-constructoras-lena-agentes-ia", "@prensa-startupjournal.jpg", "Pagos, cobranzas e IA por WhatsApp para constructoras"], ["elEconomista", "https://eleconomista.com.ar/negocios/endeavor-desembarca-workplace-by-irsa-silicon-valley-argentino-concentra-startups-inversion-talento-n93485", "6abd71304e41a074ce4716e8_6abd709c089124e0e90841d3_6abd709ac30b03d532e2b5cd_prensa-card-eleconomista_ar.png", "Lebane en el Silicon Valley argentino"]],B='https://cdn.prod.website-files.com/68859252af72390465a82c40/';var card=document.getElementById('card');if(!card||document.querySelector('.press'))return;var anchor=document.querySelector('.form-zone')||card.parentNode;var h=M.map(function(m){return '<a class=press-card href="'+m[1]+'" target=_blank rel=noopener data-cta=press>'+(m[2].charAt(0)==='@'?'<span class=press-ph><img src="'+__B+m[2].slice(1)+'" alt="Equipo de Lebane en '+m[0]+'" loading=lazy width=320 height=200><i class=press-badge>'+m[0]+'</i></span>':'<img src="'+B+m[2]+'" alt="'+m[0]+'" loading=lazy width=320 height=200>')+'<span class=press-src>'+m[0]+'</span><b>'+m[3]+'</b><span class=press-go>Leer nota →</span></a>'}).join('');var s=document.createElement('section');s.className='press';s.setAttribute('aria-labelledby','pressTitle');s.innerHTML='<div class=press-head><span class=sec-tag>Lebane en los medios</span><h2 id=pressTitle>Lo que dice la prensa de nosotros</h2></div><div class=press-wrap><div class=press-track>'+h+h+'</div></div>';anchor.parentNode.insertBefore(s,anchor);var dup=s.querySelectorAll('.press-card');for(var i=M.length;i<dup.length;i++){dup[i].setAttribute('aria-hidden','true');dup[i].tabIndex=-1}})();
(function(){var mb=document.querySelector('.mob-bridge');if(!mb||mb.querySelector('.lr2'))return;var bl=mb.querySelector('.bridge-lead');if(bl)bl.innerHTML='<b class=n470>+470</b><span>constructoras y desarrolladoras ya ordenan sus obras con Lebane</span>';
var w=mb.querySelector('.logo-track-wrap'),tr=w&&w.querySelector('.logo-track');if(!tr)return;var base=Array.prototype.slice.call(tr.children).filter(function(c){return !c.hasAttribute('aria-hidden')});var n=base.length;if(n<3)return;
[[Math.round(n/3),'lr2'],[Math.round(2*n/3),'lr3']].forEach(function(o){var nw=document.createElement('div');nw.className='logo-track-wrap '+o[1];var nt=document.createElement('div');nt.className='logo-track';for(var r=0;r<2;r++)for(var i=0;i<n;i++){var c=base[(i+o[0])%n].cloneNode(!0),ci=c.querySelector('img');if(ci)ci.loading='eager';if(r){c.setAttribute('aria-hidden','true');var im=c.querySelector('img');im&&im.setAttribute('alt','')}nt.appendChild(c)}nw.appendChild(nt);w.parentNode.insertBefore(nw,(mb.querySelector('.lr2')||w).nextSibling)});w.classList.add('lr1')})();
var tf = document.getElementById('trialForm');
var dlg = document.getElementById('trialDlg');
document.addEventListener('click', function (e) { var a = e.target.closest('[data-trial]'); if (!a || !dlg) return; e.preventDefault(); if (dlg.showModal) { dlg.showModal(); setTimeout(function () { tf && tf.elements.p.focus(); }, 50); } else { window.open('https://lebane-ar-prueba.vercel.app/', '_blank'); } });
dlg && dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
tf && tf.addEventListener('submit', function () { setTimeout(function () { dlg && dlg.open && dlg.close(); tf.reset(); }, 300);
var email = (tf.elements.p.value || '').trim();
track('Trial_Start', { vsl_watched: !!sent[50] });
try { (window._hsq = window._hsq || []).push(['identify', { email: email }]); window._hsq.push(['trackPageView']); } catch (e) {}
});
var ldItems = document.querySelectorAll('.ld-item'), ldConvs = document.querySelectorAll('.wa-conv'), ldI = 0, ldT, ldVis = false;
function ldShow(i) {
ldI = i; clearTimeout(ldT);
for (var j = 0; j < ldItems.length; j++) { var on = j === i; ldItems[j].classList.toggle('is-act', on); ldItems[j].setAttribute('aria-selected', on); ldConvs[j].classList.toggle('is-act', on); ldConvs[j].classList.remove('is-on'); }
void ldConvs[i].offsetWidth; ldConvs[i].classList.add('is-on');
var it = ldItems[i]; it.classList.remove('is-act'); void it.offsetWidth; it.classList.add('is-act');
if (ldVis && !reduce) ldT = setTimeout(function () { ldShow((ldI + 1) % ldItems.length); }, 6500);
}
Array.prototype.forEach.call(ldItems, function (b) { b.addEventListener('click', function () { ldShow(+b.dataset.i); }); });
if (ldItems.length) {
if (reduce) { document.querySelector('.lena-demo').style.setProperty('--dur', '0s'); }
ldShow(0);
if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { ldVis = en[0].isIntersecting; if (ldVis) ldShow(ldI); else clearTimeout(ldT); }, { threshold: .4 }).observe(document.querySelector('.lena-demo'));
}
if (desk && !reduce && 'IntersectionObserver' in window) {
var fc = document.querySelectorAll('.feat-card');
var fio = new IntersectionObserver(function (en) {
en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-on'); fio.unobserve(e.target); } });
}, { threshold: .45 });
Array.prototype.forEach.call(fc, function (c, i) { c.style.setProperty('--d', (i * .35) + 's'); c.classList.add('anim'); fio.observe(c); });
}
function lead() { if (window.__lbLead) return; window.__lbLead = 1; track('Lead', { form: 'demo-vsl', vsl_watched: !!sent[50] }, true); }
window.addEventListener('hs-form-event:on-submission:success', lead);
window.addEventListener('message', function (e) {
if (e.data && e.data.type === 'hsFormCallback' && e.data.eventName === 'onFormSubmitted') lead();
});
})();
(function(){var mob=matchMedia('(max-width: 880px)').matches,red=matchMedia('(prefers-reduced-motion: reduce)').matches,qs=location.search,root=document.documentElement;
// tema: ?bg=light|dark fuerza; utm_source=google -> oscuro; si no, celular claro / compu oscuro
var theme=/[?&]bg=light/.test(qs)?'light':'dark';
var LT=theme==='light';
var d=document.createElement('div');d.className='bgv';d.setAttribute('aria-hidden','true');document.body.insertBefore(d,document.body.firstChild);root.classList.add('dk');if(LT)root.classList.add('lt');
if(/[?&]bg=clean/.test(qs)){d.className='bgv bgv-clean';d.innerHTML='<i class="bgv-blob b1"></i><i class="bgv-blob b2"></i><i class="bgv-blob b3"></i><i class=bgv-floor></i><i class=bgv-beam></i>';return}
var cv=document.createElement('canvas');d.appendChild(cv);
var g=cv.getContext('2d');if(!g)return;
var W=0,H=0,DPR=1,L,A=0,SC=1,lw=1,GLOW=!mob&&!LT;
var BLUE=LT?[41,107,254]:[18,91,255],LIGHT=LT?[41,107,254]:[120,160,255],WHITE=LT?[79,134,255]:[245,247,255],FLASH=LT?[30,84,224]:[245,247,255],BX=2,BY=1.5,FH=.62,NF=11,EL=.52,T=12;
var K=LT?{bg0:'#f5f7fc',bg1:'#e9eef7',glow:'rgba(41,107,254,0.10)',grid:.24,line:1.15,glass:'rgba(228,236,252,',gA:'rgba(41,107,254,',gB:'rgba(120,165,255,',roofT:[255,255,255],roofS:[200,212,236],roofE:[41,107,254],slabT:[226,226,222],slabS:[196,196,190],core:[206,206,200],steel:[214,118,58],colC:[186,186,180],sh:'rgba(30,60,140,',part:.25,sweep:'rgba(255,255,255,'}
 :{bg0:'#161922',bg1:'#161922',glow:'rgba(18,91,255,0.16)',grid:.30,line:1,glass:'rgba(20,28,56,',gA:'rgba(18,91,255,',gB:'rgba(120,170,255,',roofT:[248,250,255],roofS:[245,247,255],roofE:[245,247,255],slabT:[132,134,140],slabS:[92,95,104],core:[110,112,120],steel:[240,150,82],colC:[118,121,130],sh:'rgba(0,0,0,',part:.35,sweep:'rgba(170,200,255,'};
function cl(x){return x<0?0:x>1?1:x}
function ease(x){x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
function rgba(c,a){return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'}
function rnd(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function P(x,y,z){var ca=Math.cos(A),sa=Math.sin(A),rx=x*ca-y*sa,ry=x*sa+y*ca;return {x:L.cx+rx*L.s*SC,y:L.by+ry*L.s*SC*Math.sin(EL)-z*L.s*SC*Math.cos(EL),d:ry}}
function seg(a,b,f,col,al,w){if(f<=0||al<=.003)return;al*=K.line;var p=P(a[0],a[1],a[2]),r=P(b[0],b[1],b[2]);var da=.38+.62*cl(((p.d+r.d)/2+2.6)/5.2);
 g.strokeStyle=rgba(col,al*da);g.lineWidth=w*SC*.85;var gl=GLOW&&col!==BLUE&&al>.3;if(gl){g.shadowColor=col===WHITE?rgba(WHITE,al*da):rgba([90,140,255],al*da);g.shadowBlur=9*SC*L.s/78}
 g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+(r.x-p.x)*f,p.y+(r.y-p.y)*f);g.stroke();if(gl)g.shadowBlur=0}
function quad(pts,fill){g.fillStyle=fill;g.beginPath();for(var i=0;i<pts.length;i++){var s=P(pts[i][0],pts[i][1],pts[i][2]);i?g.lineTo(s.x,s.y):g.moveTo(s.x,s.y)}g.closePath();g.fill()}
var CO=[[-BX,-BY],[BX,-BY],[BX,BY],[-BX,BY]];
function rect(z,f,col,al,w){for(var k=0;k<4;k++){var a=CO[k],b=CO[(k+1)%4];seg([a[0],a[1],z],[b[0],b[1],z],cl(f*4-k),col,al,w)}}
function face(a,b){var nx=b[1]-a[1],ny=-(b[0]-a[0]);return (nx*Math.sin(A)+ny*Math.cos(A))/Math.hypot(nx,ny)}
function size(){var w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return false;DPR=Math.min(window.devicePixelRatio||1,mob?2:1.5);W=w;H=h;cv.width=Math.round(w*DPR);cv.height=Math.round(h*DPR);
 var vert=h>w;L=vert?{cx:w*.5,by:h*.86,s:Math.min(h*.046,w*.085)}:{cx:w*.76,by:h*.9,s:Math.min(h*.06,w*.038)};return true}
// t = avance de obra (scroll), a = tiempo ambiente (grua, camara, luces, particulas)
function render(t,a){
 A=(40+5*Math.sin(2*Math.PI*a/T))*Math.PI/180;SC=1+.015*Math.sin(2*Math.PI*a/T);lw=Math.max(1.2,L.s*.035);
 g.setTransform(DPR,0,0,DPR,0,0);var bgG=g.createLinearGradient(0,0,0,H);bgG.addColorStop(0,K.bg0);bgG.addColorStop(1,K.bg1);g.fillStyle=bgG;g.fillRect(0,0,W,H);
 var rg=g.createRadialGradient(L.cx,L.by-L.s*3,0,L.cx,L.by-L.s*3,L.s*9);rg.addColorStop(0,K.glow);rg.addColorStop(1,'rgba(18,91,255,0)');g.fillStyle=rg;g.fillRect(0,0,W,H);
 var w2=2*Math.PI*a/T/2.2,am=LT?.5:1,au=H>W?[[.45+.12*Math.cos(w2),.62+.06*Math.sin(w2),[18,91,255],.20,.45],[.85+.06*Math.sin(w2),.90+.04*Math.cos(w2),[40,150,255],.14,.4],[.20+.10*Math.sin(w2+1),.85+.05*Math.cos(w2+2),[70,110,255],.10,.35]]:[[.66+.08*Math.cos(w2),.35+.10*Math.sin(w2),[18,91,255],.20,.45],[.92+.05*Math.sin(w2),.85+.08*Math.cos(w2),[40,150,255],.14,.45],[.50+.08*Math.sin(w2+1),.95+.04*Math.cos(w2+2),[70,110,255],.10,.35]];
 au.forEach(function(o){var R=Math.max(W,H)*o[4],r=g.createRadialGradient(o[0]*W,o[1]*H,0,o[0]*W,o[1]*H,R);r.addColorStop(0,rgba(o[2],o[3]*am));r.addColorStop(1,rgba(o[2],0));g.fillStyle=r;g.fillRect(0,0,W,H)});
 for(var i=-9;i<=9;i++){var fa=K.grid*(1-Math.abs(i)/10);for(var j=-9;j<9;j++){var al=fa*(1-(Math.abs(j)+.5)/9);seg([i,j,0],[i,j+1,0],1,LIGHT,al,1.3);seg([j,i,0],[j+1,i,0],1,LIGHT,al,1.3)}}
 rect(0,ease((t-.2)/.8),LIGHT,.9,lw*1.4);
 var bh=cl((t-1.6)/(NF*.5));if(bh>0){var sx=1.4+bh*1.6,sy=.9+bh*1.1;quad([[-BX,-BY,0],[BX,-BY,0],[BX+sx,-BY+sy,0],[BX+sx,BY+sy,0],[-BX+sx,BY+sy,0],[-BX,BY,0]],K.sh+(.28*bh)+')')}
 // pasto organico con textura (al final)
 var gz=ease((t-9.0)/.9);if(gz>0){var NP=34,GP=[];for(var gi=0;gi<NP;gi++){var an=gi/NP*Math.PI*2,nr=.78+.22*Math.sin(an*3+1.3)+.14*Math.sin(an*7+.4)+.1*(rnd(gi+400)-.5);GP.push([Math.cos(an)*(BX+.6+2.4*gz)*nr,Math.sin(an)*(BY+.6+2.2*gz)*nr,.01])}
  quad(GP.map(function(p){return [p[0]*1.06,p[1]*1.06,.01]}),LT?'rgba(110,180,120,'+(.25*gz)+')':'rgba(44,112,74,'+(.3*gz)+')');quad(GP,LT?'rgba(110,180,120,'+(.5*gz)+')':'rgba(44,112,74,'+(.62*gz)+')');
  for(var tf=0;tf<300;tf++){var ra=rnd(tf+700)*Math.PI*2,rr2=Math.sqrt(rnd(tf+900))*.92,ex=Math.cos(ra)*(BX+.6+2.4*gz)*rr2*(.78+.22*Math.sin(ra*3+1.3)),ey=Math.sin(ra)*(BY+.6+2.2*gz)*rr2*(.78+.22*Math.sin(ra*3+1.3));if(Math.abs(ex)<BX+.1&&Math.abs(ey)<BY+.1)continue;
   var tp2=P(ex,ey,0),sh2=rnd(tf+50),gcol=sh2<.3?[86,170,108]:sh2<.6?[120,196,124]:sh2<.85?[60,140,90]:[150,210,130];g.fillStyle=rgba(LT?[gcol[0]+30,gcol[1]+30,gcol[2]+20]:gcol,(.35+.4*rnd(tf+60))*gz);g.beginPath();g.ellipse(tp2.x,tp2.y,(2+3.4*rnd(tf+70))*SC*L.s/60,(1.2+1.8*rnd(tf+80))*SC*L.s/60,0,0,7);g.fill()}}
 // grua: aparece al principio y se va cuando el edificio esta listo
 var out=ease((t-8.6)/1.1),cg=ease((t-.6)/1.1)*(1-out*.0),MX=BX+1.1+out*7,MY=-BY-.6,MH=NF*FH+2.4,mh=MH*cg,mw=.22;
 if(cg>0&&out<1){g.save();g.globalAlpha=1-out;seg([MX-mw,MY,0],[MX-mw,MY,MH],cg,LIGHT,.75,lw);seg([MX+mw,MY,0],[MX+mw,MY,MH],cg,LIGHT,.75,lw);
  for(var z=0;z<mh-.4;z+=.4){seg([MX-mw,MY,z],[MX+mw,MY,z+.4],1,BLUE,.55,lw*.6);seg([MX+mw,MY,z+.4],[MX-mw,MY,z+.4],1,BLUE,.35,lw*.5)}
  var jf=ease((t-1.5)/.8);
  if(jf>0){var JL=6.2,CJ=1.6,ph=.32*Math.sin(2*Math.PI*a/T)-.1,dx=-Math.cos(ph),dy=-Math.sin(ph);var J=function(q,z){return [MX+dx*q,MY+dy*q,z]};
   seg(J(0,MH),J(JL,MH),jf,LIGHT,.8,lw);seg(J(0,MH+.3),J(JL,MH),jf,LIGHT,.5,lw*.7);seg(J(0,MH),J(-CJ,MH),jf,LIGHT,.8,lw);
   seg(J(0,MH+1),J(JL*.7,MH),jf,BLUE,.45,lw*.6);seg(J(0,MH+1),J(-CJ,MH),jf,BLUE,.45,lw*.6);seg(J(0,MH),J(0,MH+1),jf,LIGHT,.7,lw);
   for(var k=0;k<JL-.4;k+=.4)seg(J(k,MH),J(k+.4,MH+.25),cl(jf*JL/.4-k/.4),BLUE,.4,lw*.5);
   var c1=J(-CJ+.1,MH),c2=J(-CJ+.6,MH),cw1=P(c1[0],c1[1],c1[2]),cw2=P(c2[0],c2[1],c2[2]);g.strokeStyle=rgba(LIGHT,.7*jf*K.line);g.lineWidth=lw*3*SC;g.beginPath();g.moveTo(cw1.x,cw1.y);g.lineTo(cw2.x,cw2.y);g.stroke();
   var fl=cl((t-1.4)/(NF*.4)),cur=Math.min(NF,Math.floor(fl*NF)+1),td=2.6+1.4*Math.sin(a*.55),topz=cur*FH+.2+.6*Math.abs(Math.sin(a*.9));
   var hz=t<1.4?MH-.3:Math.min(MH-.3,topz+.5);if(t>7.8)hz=Math.max(hz,NF*FH+.9+1.1*ease((t-7.8)/.8));
   if(jf>=1){seg(J(td,MH),J(td,hz),1,LIGHT,.6,lw*.6);var h3=J(td,hz),hp=P(h3[0],h3[1],h3[2]);g.fillStyle=rgba(LIGHT,.9);g.fillRect(hp.x-3*SC,hp.y-2,6*SC,6*SC);
    // carga colgando (viga) mientras se arma la estructura
    if(t>1.6&&t<5.6){var bm1=J(td-.5,hz-.25),bm2=J(td+.5,hz-.25);seg(bm1,bm2,1,K.steel,.9,lw*2.2);seg(J(td,hz),bm1,1,LIGHT,.4,lw*.5);seg(J(td,hz),bm2,1,LIGHT,.4,lw*.5)}}
   var tip=J(JL,MH+.05),tp=P(tip[0],tip[1],tip[2]),bl=.5+.5*Math.sin(a*3.2);g.fillStyle='rgba(255,90,90,'+(.35+.55*bl)*jf+')';g.beginPath();g.arc(tp.x,tp.y,2.2*SC*L.s/60,0,7);g.fill()}
  g.restore()}
 var yb=P(0,0,0).y,yt=P(0,0,NF*FH).y,faces=[[[-BX,BY],[BX,BY],[0,1]],[[BX,-BY],[BX,BY],[1,0]],[[-BX,-BY],[BX,-BY],[0,-1]],[[-BX,-BY],[-BX,BY],[-1,0]]];
 for(var f=1;f<=NF;f++){var s=1.4+(f-1)*.4,cf=ease((t-s)/.3),c0=s+1.2,sf=ease((t-c0)/.35),z0=(f-1)*FH,z1=f*FH;
  // 1) hierro: columnas y vigas de acero
  if(cf>0){for(var ci=0;ci<=4;ci++)for(var cj=0;cj<=3;cj++){var x=-BX+ci,y=-BY+cj,edge=(ci===0||ci===4||cj===0||cj===3);seg([x,y,z0],[x,y,z1],cf,K.steel,edge?.85:.5,lw*(edge?1.2:.8))}
   var bf=ease((t-s-.2)/.3);if(bf>0){rect(z1,bf,K.steel,.8,lw);for(var ii=1;ii<4;ii++)seg([-BX+ii,-BY,z1],[-BX+ii,BY,z1],bf,K.steel,.35,lw*.6);for(var jj=1;jj<3;jj++)seg([-BX,-BY+jj,z1],[BX,-BY+jj,z1],bf,K.steel,.35,lw*.6)}}
  // 2) hormigon: nucleo, columnas y losa
  if(sf>0){var cz=z0+(z1-z0)*sf,CR=[[-.55,-.45],[.55,-.45],[.55,.45],[-.55,.45]];for(var ce=0;ce<4;ce++){var ca=CR[ce],cb=CR[(ce+1)%4],cr2=face(ca,cb);if(cr2<=0)continue;var cs=.55+.45*cr2;quad([[ca[0],ca[1],z0],[cb[0],cb[1],z0],[cb[0],cb[1],cz],[ca[0],ca[1],cz]],rgba([Math.round(K.core[0]*cs),Math.round(K.core[1]*cs),Math.round(K.core[2]*cs)],.95))}
   for(var ci2=0;ci2<=4;ci2++)for(var cj2=0;cj2<=3;cj2++){var x2=-BX+ci2,y2=-BY+cj2;if(!(ci2===0||ci2===4||cj2===0||cj2===3))continue;seg([x2,y2,z0],[x2,y2,z1],sf,K.colC,.95,lw*2.6)}
   var fd=t-c0-.5,flash=fd>0?Math.exp(-fd*5):0,th=.15,zs=z1-th;
   for(var se=0;se<4;se++){var sa=CO[se],sb=CO[(se+1)%4],sr=face(sa,sb);if(sr<=0)continue;var ss=.6+.4*sr;quad([[sa[0],sa[1],zs],[sb[0],sb[1],zs],[sb[0],sb[1],z1],[sa[0],sa[1],z1]],rgba([Math.round(K.slabS[0]*ss),Math.round(K.slabS[1]*ss),Math.round(K.slabS[2]*ss)],.97*sf))}
   quad(CO.map(function(c){return [c[0],c[1],z1]}),rgba(K.slabT,.97*sf));
   rect(z1,sf,flash>.02?FLASH:LIGHT,.75,lw*(1.1+flash*1.2));if(flash>.02)rect(z1,1,FLASH,flash*.9,lw*3);rect(zs,sf,LIGHT,.3,lw*.7)}
  // 3) vidrios que llegan volando y se encastran
  var gs=4.4+(f-1)*.32,gf=ease((t-gs)/.55);
  if(gf>0)faces.forEach(function(F,fi){var a2=F[0],b=F[1],n=F[2],ry=n[0]*Math.sin(A)+n[1]*Math.cos(A);if(ry<=0)return;var dd=(1-gf),ox=n[0]*dd*1.8,oy=n[1]*dd*1.8,oz=dd*1.4;
   var Q=[[a2[0]+ox,a2[1]+oy,z0+oz],[b[0]+ox,b[1]+oy,z0+oz],[b[0]+ox,b[1]+oy,z1+oz],[a2[0]+ox,a2[1]+oy,z1+oz]];quad(Q,K.glass+(.82*gf)+')');
   var gg=g.createLinearGradient(0,yb,0,yt);gg.addColorStop(0,K.gA+((.08+.06*ry)*gf)+')');gg.addColorStop(1,K.gB+((.30+.12*ry)*gf)+')');quad(Q,gg);
   seg(Q[0],Q[3],1,LIGHT,.85*gf,lw);seg(Q[1],Q[2],1,LIGHT,.85*gf,lw);seg(Q[3],Q[2],1,LIGHT,.8*gf,lw*1.1);seg(Q[0],Q[1],1,LIGHT,.6*gf,lw*.8);
   var n2=Math.round(Math.hypot(b[0]-a2[0],b[1]-a2[1])/.5);for(var k=1;k<n2;k++){var u=k/n2,xx=a2[0]+(b[0]-a2[0])*u+ox,yy=a2[1]+(b[1]-a2[1])*u+oy;seg([xx,yy,z0+.05+oz],[xx,yy,z1-.05+oz],gf,LIGHT,.28,lw*.5)}
   // ventanas encendidas cuando el edificio esta terminado
   var on=ease((t-9.6-(NF-f)*.04)/.8);if(on>0){for(var k3=0;k3<n2;k3++){var id=f*31+fi*7+k3,slot=Math.floor(a/(5+rnd(id+9)*9)+rnd(id)*9);if(rnd(id*13+slot)>.6)continue;var tw=.8+.2*Math.sin(a*(.6+rnd(id+5))+id),warm=rnd(id+21)<.75;var u0=k3/n2+.08/n2,u1=(k3+1)/n2-.08/n2;
     var p0=[a2[0]+(b[0]-a2[0])*u0,a2[1]+(b[1]-a2[1])*u0],p1=[a2[0]+(b[0]-a2[0])*u1,a2[1]+(b[1]-a2[1])*u1];
     quad([[p0[0],p0[1],z0+.12],[p1[0],p1[1],z0+.12],[p1[0],p1[1],z1-.12],[p0[0],p0[1],z1-.12]],LT?'rgba(41,107,254,'+(.24*on*tw)+')':(warm?'rgba(255,190,105,'+(.78*on*tw)+')':'rgba(255,226,170,'+(.6*on*tw)+')'))}}})}
 var rf=ease((t-7.8)/.5);
 if(rf>0){var zr=NF*FH,zt=zr+.42,o=.12,C=[[-BX-o,-BY-o],[BX+o,-BY-o],[BX+o,BY+o],[-BX-o,BY+o]],wf=ease((t-8.1)/.6);
  for(var e=0;e<4;e++){var a3=C[e],b3=C[(e+1)%4],ry3=face(a3,b3);if(ry3<=0)continue;var sh=.80+.18*cl(ry3);quad([[a3[0],a3[1],zr],[b3[0],b3[1],zr],[b3[0],b3[1],zt],[a3[0],a3[1],zt]],'rgba('+Math.round(K.roofS[0]*sh)+','+Math.round(K.roofS[1]*sh)+','+Math.round(K.roofS[2]*Math.min(1,sh+.1))+','+(.95*wf)+')')}
  quad(C.map(function(c){return [c[0],c[1],zt]}),rgba(K.roofT,.97*wf));
  // logo Lebane pintado en el techo (plano del techo = transformacion afin)
  if(wf>.05){var O=P(0,0,zt),ex=P(1,0,zt),ey=P(0,1,zt);g.save();g.setTransform(DPR*(ex.x-O.x)/100,DPR*(ex.y-O.y)/100,DPR*(ey.x-O.x)/100,DPR*(ey.y-O.y)/100,DPR*O.x,DPR*O.y);
   g.globalAlpha=wf;g.fillStyle='#296BFE';g.translate(-105,-105);g.scale(210/98,210/98);g.fill(new Path2D('M25.786 72.2105V0H0V98L97.9869 98V72.2105H25.786Z M98 0H36.1135V25.7895H98V0Z M98 36.1058H36.1135V61.8952H98V36.1058Z'));g.restore()}
  for(var k2=0;k2<4;k2++){var ff=cl(rf*4-k2),p1=C[k2],p2=C[(k2+1)%4];seg([p1[0],p1[1],zt],[p2[0],p2[1],zt],ff,K.roofE,.9,lw*1.2);seg([p1[0],p1[1],zr],[p2[0],p2[1],zr],ff,K.roofE,.7,lw)}}
 var sw=(t-9.5)/1.1;
 if(sw>0&&sw<1){var top=P(0,0,NF*FH+.5),bot=P(0,0,0),xc=L.cx-L.s*4+L.s*8*ease(sw),gr=g.createLinearGradient(xc-L.s*1.2,top.y,xc+L.s*1.2,bot.y);
  gr.addColorStop(0,K.sweep+'0)');gr.addColorStop(.5,K.sweep+((LT?.55:.30)*Math.sin(sw*Math.PI))+')');gr.addColorStop(1,K.sweep+'0)');
  var pts=[];CO.forEach(function(c){pts.push(P(c[0],c[1],0));pts.push(P(c[0],c[1],NF*FH+.42))});pts.sort(function(p,q){return p.x-q.x||p.y-q.y});
  var cr=function(O,p,q){return (p.x-O.x)*(q.y-O.y)-(p.y-O.y)*(q.x-O.x)},lo=[],up=[];
  pts.forEach(function(p){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)});pts.slice().reverse().forEach(function(p){while(up.length>1&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)});
  var hull=lo.slice(0,-1).concat(up.slice(0,-1));g.save();g.beginPath();hull.forEach(function(p,i){i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)});g.closePath();g.clip();g.globalCompositeOperation=LT?'source-over':'lighter';g.fillStyle=gr;g.fillRect(0,0,W,H);g.restore()}
 var li=cl((t-2.2)/1.8);if(li>0){var tg=P(0,0,NF*FH*.55),SRC=[[3.8,3.4],[-1.8,4.2],[5.2,-.8]];g.save();g.globalCompositeOperation=LT?'source-over':'lighter';
  SRC.forEach(function(sc,si){var bp=P(sc[0],sc[1],0),ang=Math.atan2(tg.y-bp.y,tg.x-bp.x)+.42*Math.sin(t*.85+si*2.1)+.05*Math.sin(a*.6+si),len=Math.hypot(tg.x-bp.x,tg.y-bp.y)*1.9,hw=.075;
   var gr2=g.createLinearGradient(bp.x,bp.y,bp.x+Math.cos(ang)*len,bp.y+Math.sin(ang)*len);gr2.addColorStop(0,LT?'rgba(41,107,254,'+(.14*li)+')':'rgba(150,190,255,'+(.26*li)+')');gr2.addColorStop(1,'rgba(150,190,255,0)');
   g.fillStyle=gr2;g.beginPath();g.moveTo(bp.x,bp.y);g.lineTo(bp.x+Math.cos(ang-hw)*len,bp.y+Math.sin(ang-hw)*len);g.lineTo(bp.x+Math.cos(ang+hw)*len,bp.y+Math.sin(ang+hw)*len);g.closePath();g.fill();
   var lg=g.createRadialGradient(bp.x,bp.y,0,bp.x,bp.y,L.s*.5);lg.addColorStop(0,'rgba(200,220,255,'+(.8*li)+')');lg.addColorStop(1,'rgba(200,220,255,0)');g.fillStyle=lg;g.beginPath();g.arc(bp.x,bp.y,L.s*.5,0,7);g.fill()});g.restore()}
 for(var pi=0;pi<46;pi++){var sp=.5+rnd(pi+99)*.5,uu=((a/T/2.5)*Math.round(1+sp*2)+rnd(pi))%1,pp=P(-5+rnd(pi+7)*10,-4+rnd(pi+13)*8,uu*10);
  g.fillStyle=rgba(pi%5===0?WHITE:LIGHT,K.part*Math.sin(uu*Math.PI)*(.4+rnd(pi+3)*.6));g.beginPath();g.arc(pp.x,pp.y,(1+rnd(pi+5)*1.6)*SC*(L.s/70),0,7);g.fill()}
}
var T0=1.9,T1=10.9,target=red?1:0,cur=target,tk=0,amb=0,last=0,vis=true,pg=null,pgN,pgBar,pgSteps;
if(!mob&&innerWidth>=1280){pg=document.createElement('div');pg.className='prog';pg.setAttribute('aria-hidden','true');pg.innerHTML='<span class=prog-l>Avance de obra</span><b class=prog-n>0%</b><div class=prog-bar><i></i></div><ul class=prog-steps><li>Cimientos<li>Estructura<li>Cerramiento<li>Entrega</ul><span class=prog-ok><svg width=14 height=14 viewBox="0 0 24 24" fill=none stroke=currentColor stroke-width=3 stroke-linecap=round stroke-linejoin=round><path d="M20 6L9 17l-5-5"/></svg>Presupuesto en orden</span>';document.body.appendChild(pg);pgN=pg.querySelector('.prog-n');pgBar=pg.querySelector('.prog-bar i');pgSteps=pg.querySelectorAll('.prog-steps li')}
function paint(p){if(!pg)return;var n=Math.round(p*100);pgN.textContent=n+'%';pgBar.style.width=n+'%';for(var k=0;k<pgSteps.length;k++)pgSteps[k].classList.toggle('on',p>=k*.25+.02);pg.classList.toggle('done',n>=99)}
function draw(){if(W)render(T0+(T1-T0)*cur,amb)}
function prog(){var end=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight)-innerHeight;return Math.min(1,Math.max(0,scrollY/Math.max(1,end)))}
// un solo loop: el avance sigue al scroll con suavizado y el ambiente se mueve despacio (~30 fps)
function frame(now){requestAnimationFrame(frame);if(!vis)return;if(!last){last=now;return}var dt=Math.min(.1,(now-(last||now))/1000);if(dt<.03&&cur===target)return;last=now;if(!red)amb+=dt;var df=target-cur;cur=Math.abs(df)<.0005?target:cur+df*Math.min(1,dt*9.6);draw()}
function upd(){var p=prog();paint(p);if(!red)target=p}
var lw0=0;function rs(){if(mob&&cv.clientWidth===lw0&&W)return;lw0=cv.clientWidth;if(size())draw()}
rs();cur=target=red?1:prog();paint(cur);draw();if(!red)requestAnimationFrame(frame);
document.addEventListener('visibilitychange',function(){vis=!document.hidden;last=0});
addEventListener('scroll',function(){if(!tk)tk=requestAnimationFrame(function(){tk=0;upd()})},{passive:true});
addEventListener('resize',function(){rs();upd()});
window.__lbBg=function(p,a){cur=target=p;if(a!=null)amb=a;draw()};
})();

}
