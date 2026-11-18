const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());tab='paint';draw()});await wait(400);
await ev(()=>{const t=[...document.querySelectorAll('button,[data-x]')].find(x=>/Mes peintures/i.test(x.innerText));t&&t.click()});await wait(300);
await ev(()=>{document.getElementById('gxadd').open=true;document.querySelector('[data-pscan]').click()});await wait(300);
// EAN valide fictif (test uniquement)
const code=await ev(()=>{let d='843556831104';let s=0;for(let i=0;i<12;i++)s+=(+d[i])*(i%2?3:1);return d+((10-s%10)%10)});
await ev(c=>BIBPSC.onCode(c),code);await wait(300);
ok('code inconnu : message vers la recherche',await ev(()=>/Cherche ta peinture/.test(document.getElementById('psc').innerText)),1);
await ev(()=>{const i=document.querySelector('#psc input[type=search],#psc input[data-psq],#psc input#psq');if(i){i.value='AK11044';i.dispatchEvent(new Event('input',{bubbles:true}))}});await wait(400);
const html=await ev(()=>document.getElementById('psc').innerText);
ok('recherche par référence AK11044 trouve Yellow',/Yellow/.test(html),html.slice(-300));
await ev(()=>{const x=[...document.querySelectorAll('#psc [data-psc="addp"]')][0];x&&x.click()});await wait(300);
ok('code associé à la peinture ajoutée',await ev(c=>__hob.hob().paints.some(x=>x.ean===c&&/Yellow/.test(x.n)),code),await ev(()=>document.getElementById('psmsg').innerText));
await ev(c=>BIBPSC.onCode(c),code);await wait(300);
ok('re-scan : reconnu, déjà dans la liste',await ev(()=>/Dans ta liste|Tu en as/.test(document.getElementById('pspot').innerText)),1);
await b.close()})();
