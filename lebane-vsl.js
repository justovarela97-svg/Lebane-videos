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
(function(){var e=document.querySelector('.hd-eyebrow');if(e&&!e.querySelector('b'))e.innerHTML='<span class=hd-dot></span><span>El sistema <b>N°1 de Argentina</b> para constructoras y desarrolladoras</span>'})();
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
(function(){var mob=matchMedia('(max-width: 880px)').matches,red=matchMedia('(prefers-reduced-motion: reduce)').matches;
var d=document.createElement('div');d.className='bgv';d.setAttribute('aria-hidden','true');var cv=document.createElement('canvas');d.appendChild(cv);document.body.insertBefore(d,document.body.firstChild);document.documentElement.classList.add('dk');
var g=cv.getContext('2d');if(!g)return;
var W=0,H=0,DPR=1,L,A=0,SC=1,lw=1,GLOW=!mob;
var BLUE=[18,91,255],LIGHT=[120,160,255],WHITE=[245,247,255],BX=2,BY=1.5,FH=.62,NF=11,EL=.52,T=12;
function cl(x){return x<0?0:x>1?1:x}
function ease(x){x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
function rgba(c,a){return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'}
function rnd(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function P(x,y,z){var ca=Math.cos(A),sa=Math.sin(A),rx=x*ca-y*sa,ry=x*sa+y*ca;return {x:L.cx+rx*L.s*SC,y:L.by+ry*L.s*SC*Math.sin(EL)-z*L.s*SC*Math.cos(EL),d:ry}}
function seg(a,b,f,col,al,w){if(f<=0||al<=.003)return;var p=P(a[0],a[1],a[2]),r=P(b[0],b[1],b[2]);var da=.38+.62*cl(((p.d+r.d)/2+2.6)/5.2);
 g.strokeStyle=rgba(col,al*da);g.lineWidth=w*SC*.85;var gl=GLOW&&col!==BLUE&&al>.3;if(gl){g.shadowColor=col===WHITE?rgba(WHITE,al*da):rgba([90,140,255],al*da);g.shadowBlur=9*SC*L.s/78}
 g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+(r.x-p.x)*f,p.y+(r.y-p.y)*f);g.stroke();if(gl)g.shadowBlur=0}
function quad(pts,fill){g.fillStyle=fill;g.beginPath();for(var i=0;i<pts.length;i++){var s=P(pts[i][0],pts[i][1],pts[i][2]);i?g.lineTo(s.x,s.y):g.moveTo(s.x,s.y)}g.closePath();g.fill()}
var CO=[[-BX,-BY],[BX,-BY],[BX,BY],[-BX,BY]];
function rect(z,f,col,al,w){for(var k=0;k<4;k++){var a=CO[k],b=CO[(k+1)%4];seg([a[0],a[1],z],[b[0],b[1],z],cl(f*4-k),col,al,w)}}
function face(a,b){var nx=b[1]-a[1],ny=-(b[0]-a[0]);return (nx*Math.sin(A)+ny*Math.cos(A))/Math.hypot(nx,ny)}
function size(){var w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return false;DPR=Math.min(window.devicePixelRatio||1,mob?2:1.5);W=w;H=h;cv.width=Math.round(w*DPR);cv.height=Math.round(h*DPR);
 var vert=h>w;L=vert?{cx:w*.5,by:h*.86,s:Math.min(h*.046,w*.085)}:{cx:w*.76,by:h*.9,s:Math.min(h*.06,w*.038)};return true}
function render(t){
 A=(40+5*Math.sin(2*Math.PI*t/T))*Math.PI/180;SC=1+.015*Math.sin(2*Math.PI*t/T);lw=Math.max(1.2,L.s*.035);
 g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle='#161922';g.fillRect(0,0,W,H);
 var rg=g.createRadialGradient(L.cx,L.by-L.s*3,0,L.cx,L.by-L.s*3,L.s*9);rg.addColorStop(0,'rgba(18,91,255,0.16)');rg.addColorStop(1,'rgba(18,91,255,0)');g.fillStyle=rg;g.fillRect(0,0,W,H);
 var w2=2*Math.PI*t/T,au=H>W?[[.45+.12*Math.cos(w2),.62+.06*Math.sin(w2),[18,91,255],.20,.45],[.85+.06*Math.sin(w2),.90+.04*Math.cos(w2),[40,150,255],.14,.4],[.20+.10*Math.sin(w2+1),.85+.05*Math.cos(w2+2),[70,110,255],.10,.35]]:[[.66+.08*Math.cos(w2),.35+.10*Math.sin(w2),[18,91,255],.20,.45],[.92+.05*Math.sin(w2),.85+.08*Math.cos(w2),[40,150,255],.14,.45],[.50+.08*Math.sin(w2+1),.95+.04*Math.cos(w2+2),[70,110,255],.10,.35]];
 au.forEach(function(o){var R=Math.max(W,H)*o[4],r=g.createRadialGradient(o[0]*W,o[1]*H,0,o[0]*W,o[1]*H,R);r.addColorStop(0,rgba(o[2],o[3]));r.addColorStop(1,rgba(o[2],0));g.fillStyle=r;g.fillRect(0,0,W,H)});
 // ground grid
 for(var i=-9;i<=9;i++){var fa=.30*(1-Math.abs(i)/10);for(var j=-9;j<9;j++){var al=fa*(1-(Math.abs(j)+.5)/9);seg([i,j,0],[i,j+1,0],1,LIGHT,al,1.3);seg([j,i,0],[j+1,i,0],1,LIGHT,al,1.3)}}
 // base slab
 rect(0,ease((t-.2)/.8),LIGHT,.9,lw*1.4);
 // crane
 var cg=ease((t-.6)/1.1),MX=BX+1.1,MY=-BY-.6,MH=NF*FH+2.4,mh=MH*cg,mw=.22;
 if(cg>0){seg([MX-mw,MY,0],[MX-mw,MY,MH],cg,LIGHT,.75,lw);seg([MX+mw,MY,0],[MX+mw,MY,MH],cg,LIGHT,.75,lw);
  for(var z=0;z<mh-.4;z+=.4){seg([MX-mw,MY,z],[MX+mw,MY,z+.4],1,BLUE,.55,lw*.6);seg([MX+mw,MY,z+.4],[MX-mw,MY,z+.4],1,BLUE,.35,lw*.5)}
  var jf=ease((t-1.5)/.8);
  if(jf>0){var JL=6.2,CJ=1.6,ph=.32*Math.sin(2*Math.PI*t/T)-.1,dx=-Math.cos(ph),dy=-Math.sin(ph);var J=function(q,z){return [MX+dx*q,MY+dy*q,z]};
   seg(J(0,MH),J(JL,MH),jf,LIGHT,.8,lw);seg(J(0,MH+.3),J(JL,MH),jf,LIGHT,.5,lw*.7);seg(J(0,MH),J(-CJ,MH),jf,LIGHT,.8,lw);
   seg(J(0,MH+1),J(JL*.7,MH),jf,BLUE,.45,lw*.6);seg(J(0,MH+1),J(-CJ,MH),jf,BLUE,.45,lw*.6);seg(J(0,MH),J(0,MH+1),jf,LIGHT,.7,lw);
   for(var k=0;k<JL-.4;k+=.4)seg(J(k,MH),J(k+.4,MH+.25),cl(jf*JL/.4-k/.4),BLUE,.4,lw*.5);
   var c1=J(-CJ+.1,MH),c2=J(-CJ+.6,MH),cw1=P(c1[0],c1[1],c1[2]),cw2=P(c2[0],c2[1],c2[2]);g.strokeStyle=rgba(LIGHT,.7*jf);g.lineWidth=lw*3*SC;g.beginPath();g.moveTo(cw1.x,cw1.y);g.lineTo(cw2.x,cw2.y);g.stroke();
   var fl=cl((t-1.6)/(NF*.5)),cur=Math.min(NF,Math.floor(fl*NF)+1),td=2.6+1.4*Math.sin(t*1.3),topz=cur*FH+.2+.6*Math.abs(Math.sin(t*2.2));
   var hz=t<1.6?MH-.3:Math.min(MH-.3,topz+.5);if(t>7.4)hz=Math.max(hz,NF*FH+.9+1.1*ease((t-7.4)/1));
   if(jf>=1){seg(J(td,MH),J(td,hz),1,LIGHT,.6,lw*.6);var h3=J(td,hz),hp=P(h3[0],h3[1],h3[2]);g.fillStyle=rgba(LIGHT,.9);g.fillRect(hp.x-3*SC,hp.y-2,6*SC,6*SC)}}}
 // floors
 var yb=P(0,0,0).y,yt=P(0,0,NF*FH).y,faces=[[[-BX,BY],[BX,BY],[0,1]],[[BX,-BY],[BX,BY],[1,0]],[[-BX,-BY],[BX,-BY],[0,-1]],[[-BX,-BY],[-BX,BY],[-1,0]]];
 for(var f=1;f<=NF;f++){var s=1.6+(f-1)*.5,cf=ease((t-s)/.3),sf=ease((t-s-.22)/.3),z0=(f-1)*FH,z1=f*FH;
  if(cf>0)for(var ci=0;ci<=4;ci++)for(var cj=0;cj<=3;cj++){var x=-BX+ci,y=-BY+cj,edge=(ci===0||ci===4||cj===0||cj===3);seg([x,y,z0],[x,y,z1],cf,edge?LIGHT:BLUE,edge?.75:.35,lw*(edge?1:.7))}
  if(sf>0){var fd=t-s-.52,flash=fd>0?Math.exp(-fd*5):0;rect(z1,sf,flash>.02?WHITE:LIGHT,.85,lw*(1.2+flash*1.2));if(flash>.02)rect(z1,1,WHITE,flash*.9,lw*3);
   for(var ii=1;ii<4;ii++)seg([-BX+ii,-BY,z1],[-BX+ii,BY,z1],sf,BLUE,.18,lw*.5);for(var jj=1;jj<3;jj++)seg([-BX,-BY+jj,z1],[BX,-BY+jj,z1],sf,BLUE,.18,lw*.5)}
  var gf=ease((t-8-(f-1)*.12)/.35);
  if(gf>0)faces.forEach(function(F){var a=F[0],b=F[1],n=F[2],ry=n[0]*Math.sin(A)+n[1]*Math.cos(A);if(ry<=0)return;
   var Q=[[a[0],a[1],z0],[b[0],b[1],z0],[b[0],b[1],z1],[a[0],a[1],z1]];quad(Q,'rgba(20,28,56,'+(.82*gf)+')');
   var gg=g.createLinearGradient(0,yb,0,yt);gg.addColorStop(0,'rgba(18,91,255,'+((.08+.06*ry)*gf)+')');gg.addColorStop(1,'rgba(120,170,255,'+((.30+.12*ry)*gf)+')');quad(Q,gg);
   seg(Q[0],Q[3],1,LIGHT,.85*gf,lw);seg(Q[1],Q[2],1,LIGHT,.85*gf,lw);seg(Q[3],Q[2],1,LIGHT,.8*gf,lw*1.1);seg(Q[0],Q[1],1,LIGHT,.6*gf,lw*.8);
   var n2=Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/.5);for(var k=1;k<n2;k++){var u=k/n2,xx=a[0]+(b[0]-a[0])*u,yy=a[1]+(b[1]-a[1])*u;seg([xx,yy,z0+.05],[xx,yy,z1-.05],gf,LIGHT,.28,lw*.5)}})}
 // white roof
 var rf=ease((t-7.2)/.5);
 if(rf>0){var zr=NF*FH,zt=zr+.42,o=.12,C=[[-BX-o,-BY-o],[BX+o,-BY-o],[BX+o,BY+o],[-BX-o,BY+o]],wf=ease((t-7.5)/.6);
  for(var e=0;e<4;e++){var a=C[e],b=C[(e+1)%4],ry=face(a,b);if(ry<=0)continue;var sh=.80+.18*cl(ry);quad([[a[0],a[1],zr],[b[0],b[1],zr],[b[0],b[1],zt],[a[0],a[1],zt]],'rgba('+Math.round(245*sh)+','+Math.round(247*sh)+',255,'+(.95*wf)+')')}
  quad(C.map(function(c){return [c[0],c[1],zt]}),'rgba(248,250,255,'+(.97*wf)+')');
  var m=[[-.9,-.6],[.7,-.6],[.7,.6],[-.9,.6]],mz=zt+.38,mf=ease((t-7.9)/.5);
  if(mf>0){for(var e2=0;e2<4;e2++){var a2=m[e2],b2=m[(e2+1)%4];if(face(a2,b2)<=0)continue;quad([[a2[0],a2[1],zt],[b2[0],b2[1],zt],[b2[0],b2[1],mz],[a2[0],a2[1],mz]],'rgba(222,229,248,'+(.95*mf)+')')}quad(m.map(function(c){return [c[0],c[1],mz]}),'rgba(250,251,255,'+(.97*mf)+')')}
  for(var k2=0;k2<4;k2++){var ff=cl(rf*4-k2),p1=C[k2],p2=C[(k2+1)%4];seg([p1[0],p1[1],zt],[p2[0],p2[1],zt],ff,WHITE,.9,lw*1.2);seg([p1[0],p1[1],zr],[p2[0],p2[1],zr],ff,WHITE,.7,lw)}}
 // diagonal light sweep over the facade
 var sw=(t-9.3)/1.1;
 if(sw>0&&sw<1){var top=P(0,0,NF*FH+.5),bot=P(0,0,0),xc=L.cx-L.s*4+L.s*8*ease(sw),gr=g.createLinearGradient(xc-L.s*1.2,top.y,xc+L.s*1.2,bot.y);
  gr.addColorStop(0,'rgba(120,160,255,0)');gr.addColorStop(.5,'rgba(170,200,255,'+(.30*Math.sin(sw*Math.PI))+')');gr.addColorStop(1,'rgba(120,160,255,0)');
  var pts=[];CO.forEach(function(c){pts.push(P(c[0],c[1],0));pts.push(P(c[0],c[1],NF*FH+.42))});pts.sort(function(a,b){return a.x-b.x||a.y-b.y});
  var cr=function(O,a,b){return (a.x-O.x)*(b.y-O.y)-(a.y-O.y)*(b.x-O.x)},lo=[],up=[];
  pts.forEach(function(p){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)});pts.slice().reverse().forEach(function(p){while(up.length>1&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)});
  var hull=lo.slice(0,-1).concat(up.slice(0,-1));g.save();g.beginPath();hull.forEach(function(p,i){i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)});g.closePath();g.clip();g.globalCompositeOperation='lighter';g.fillStyle=gr;g.fillRect(0,0,W,H);g.restore()}
 // particles
 for(var pi=0;pi<46;pi++){var sp=.5+rnd(pi+99)*.5,uu=((t/T)*Math.round(1+sp*2)+rnd(pi))%1,pp=P(-5+rnd(pi+7)*10,-4+rnd(pi+13)*8,uu*10);
  g.fillStyle=rgba(pi%5===0?WHITE:LIGHT,.35*Math.sin(uu*Math.PI)*(.4+rnd(pi+3)*.6));g.beginPath();g.arc(pp.x,pp.y,(1+rnd(pi+5)*1.6)*SC*(L.s/70),0,7);g.fill()}
}
// scroll -> build progress
var T0=1.9,T1=10.5,target=red?1:0,cur=target,raf=0,tk=0,pg=null,pgN,pgBar,pgSteps;
if(!mob&&innerWidth>=1280){pg=document.createElement('div');pg.className='prog';pg.setAttribute('aria-hidden','true');pg.innerHTML='<span class=prog-l>Avance de obra</span><b class=prog-n>0%</b><div class=prog-bar><i></i></div><ul class=prog-steps><li>Cimientos<li>Estructura<li>Cerramiento<li>Entrega</ul><span class=prog-ok><svg width=14 height=14 viewBox="0 0 24 24" fill=none stroke=currentColor stroke-width=3 stroke-linecap=round stroke-linejoin=round><path d="M20 6L9 17l-5-5"/></svg>Presupuesto en orden</span>';document.body.appendChild(pg);pgN=pg.querySelector('.prog-n');pgBar=pg.querySelector('.prog-bar i');pgSteps=pg.querySelectorAll('.prog-steps li')}
function paint(p){if(!pg)return;var n=Math.round(p*100);pgN.textContent=n+'%';pgBar.style.width=n+'%';for(var k=0;k<pgSteps.length;k++)pgSteps[k].classList.toggle('on',p>=k*.25+.02);pg.classList.toggle('done',n>=99)}
function draw(){if(W)render(T0+(T1-T0)*cur)}
function loop(){raf=0;var df=target-cur;cur=Math.abs(df)<.0005?target:cur+df*.16;draw();if(cur!==target)raf=requestAnimationFrame(loop)}
function prog(){var end=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight)-innerHeight;return Math.min(1,Math.max(0,scrollY/Math.max(1,end)))}
function upd(){var p=prog();paint(p);if(red)return;target=p;if(!raf)raf=requestAnimationFrame(loop)}
var lw0=0;function rs(){if(mob&&cv.clientWidth===lw0&&W)return;lw0=cv.clientWidth;if(size())draw()}
rs();cur=target=red?1:prog();paint(cur);draw();
addEventListener('scroll',function(){if(!tk)tk=requestAnimationFrame(function(){tk=0;upd()})},{passive:true});
addEventListener('resize',function(){rs();upd()});
window.__lbBg=function(p){cur=target=p;draw()};
})();

}
