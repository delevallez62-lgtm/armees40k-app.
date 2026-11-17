const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));p.on('dialog',d=>d.accept());await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
await p.evaluate(async()=>{await BIB.init();const x=document.querySelector('#bibp [data-bib="popx"]');if(x)x.click()});
let n0=await p.evaluate(()=>{tab='trw';draw();return BIBTRW.n()});ok('0 sans traduction au départ',n0===0,n0);
// simule 2 textes non traduits (nouvelle mise à jour)
const r=await p.evaluate(async()=>{const D=BIB.D;const ss=D.str.filter(s=>s.fx&&s.fx.length>40).slice(0,2);ss.forEach(s=>{delete D.fr[BIB.hh(s.fx)]});BIB.kpReset();for(let i=0;i<100;i++){BIB.autoTr('x y z w v u');if(BIB.kpInfo().ready)break;await new Promise(r=>setTimeout(r,200))}
window.__ss=ss.map(s=>s.fx);ss.forEach(s=>delete D.fr[BIB.hh(s.fx)]);tab='home';draw();return{n:BIBTRW.n(),h:document.body.innerText.slice(0,300),en:ss.map(s=>s.fx.slice(0,60)),tile:/À traduire \(2\)/.test(document.body.innerText)}});
ok('textes non traduits détectés',r.n>=1,r);ok('avertissement sur le menu',r.tile,r);
await p.evaluate(()=>{tab='trw';draw()});await p.waitForTimeout(300);
await p.screenshot({path:'trw1.png'});
const ta=await p.evaluate(()=>{const t=document.querySelector('[data-trwf]');return !!t});ok('zone de correction affichée',ta,ta);
const k=await p.evaluate(()=>{const t=document.querySelector('[data-trwf]');const d=t.closest('details');d.open=true;const en="";return t.dataset.trwf});
await p.evaluate(()=>{const t=document.querySelector('[data-trwf]');const digits=(window.__ss[0].match(/\d+/g)||[]);t.value='Traduction test '+digits.join(' ')});
const before=await p.evaluate(()=>BIBTRW.n());
await p.evaluate(()=>{const b=document.querySelector('[data-trw="save"]');b.click()});await p.waitForTimeout(400);
const after=await p.evaluate(()=>BIBTRW.n());ok('enregistrement réduit le compteur',after<before,[before,after]);
const lb=await p.evaluate(()=>Object.values(S.lib.tm||{}).some(x=>/Traduction test/.test(x.fr)));ok('traduction mémorisée',lb,lb);
// recherche pour modifier
await p.evaluate(()=>{const i=document.getElementById('trwq');i.value='stratagem';i.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(700);
const sr=await p.evaluate(()=>document.querySelectorAll('[data-trwk]').length);ok('recherche pour corriger',sr>0,sr);
await b.close()})();
