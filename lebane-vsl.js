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
var dlg = document.getElementById('trialDlg');
document.addEventListener('click', function (e) { var a = e.target.closest('[data-trial]'); if (!a || !dlg) return; e.preventDefault(); if (dlg.showModal) { dlg.showModal(); setTimeout(function () { tf && tf.elements.p.focus(); }, 50); } else { window.open('https://lebane-ar-prueba.vercel.app/', '_blank'); } });
dlg && dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });
tf && tf.addEventListener('submit', function () { setTimeout(function () { dlg && dlg.open && dlg.close(); tf.reset(); }, 300);
var email = (tf.elements.p.value || '').trim();
track('Trial_Start', { vsl_watched: !!sent[50] });
try { (window._hsq = window._hsq || []).push(['identify', { email: email }]); window._hsq.push(['trackPageView']); } catch (e) {}
});
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
(function(){var mob=matchMedia('(max-width: 880px)').matches,red=matchMedia('(prefers-reduced-motion: reduce)').matches,B=__B+'lebane-bg-scroll-'+(mob?'9x16':'16x9');
var d=document.createElement('div');d.className='bgv';d.setAttribute('aria-hidden','true');var v=document.createElement('video');v.muted=true;v.playsInline=true;v.setAttribute('playsinline','');v.setAttribute('muted','');v.preload='auto';v.poster=B+(red?'-fin.jpg':'-ini.jpg');d.appendChild(v);document.body.insertBefore(d,document.body.firstChild);document.documentElement.classList.add('dk');
if(red)return;v.src=B+'.mp4';
var goal=mob?document.getElementById('card'):(document.querySelector('.form-zone')||document.getElementById('card')),tk,last=-1,primed=false;
function upd(){if(!v.duration)return;var end=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight)-innerHeight;var p=Math.min(1,Math.max(0,scrollY/Math.max(1,end)));var t=p*(v.duration-.05);if(Math.abs(t-last)>.03){last=t;try{v.currentTime=t}catch(e){}}}
function prime(){if(primed)return;primed=true;var p=v.play();if(p&&p.then)p.then(function(){v.pause();upd()}).catch(function(){});else v.pause()}
v.addEventListener('loadedmetadata',upd);
addEventListener('scroll',function(){prime();if(!tk)tk=requestAnimationFrame(function(){tk=0;upd()})},{passive:true});
addEventListener('touchstart',prime,{passive:true,once:true});addEventListener('resize',upd)})();

}
