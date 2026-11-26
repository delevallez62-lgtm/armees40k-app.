const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();await p.addInitScript(()=>{setInterval(()=>document.querySelectorAll('details.bld-dr:not([open])').forEach(d=>d.open=true),40)});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
const click=async sel=>{await p.evaluate(s=>{if(!/figo|figall|figpm|figback|data-bld="fig"/.test(s)){const fb=document.querySelector('[data-bld="figback"]');if(fb)fb.click()}let e=document.querySelector(s);if(!e&&!s.includes('[data-bld="step"]')){for(const n of ['1','2','3','4']){const t=document.querySelector('[data-bld="step"][data-s="'+n+'"]');if(t){t.click();e=document.querySelector(s);if(e)break}}}if(!e)throw new Error('absent '+s);e.click()},sel);await p.waitForTimeout(250)};
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());S.lists=[];tab='bld';draw()});await wait(300);
await ev(()=>{document.getElementById('bldn').value='Sim';const f=document.getElementById('bldfac');f.value=[...f.options].find(o=>/^Space Marines$/.test(o.text)).value;document.getElementById('bldlim').value='2000'});
await click('[data-bld="create"]');await wait(300);
async function open(q,match,size){await click('[data-bld="add"]');await ev(q=>{const i=document.getElementById('bldq');i.value=q;i.dispatchEvent(new Event('input',{bubbles:true}))},q);await wait(250);
 await ev(m=>{const c=[...document.querySelectorAll('#bldm .bld-c')].find(x=>new RegExp(m,'i').test(x.querySelector('b').innerText));c.click()},match);await wait(300);await click('[data-bld="size"][data-v="'+size+'"]');await wait(150)}
const fig=async i=>{await ev(()=>{BLDSTATE.figOpen=true});await ev(()=>{const b=document.querySelector('[data-bld="figback"]');if(b)b.click()});await click('[data-bld="fig"][data-i="'+i+'"]')};
const chips=()=>ev(()=>[...document.querySelectorAll('#bldm .bld-fcw')].map(w=>({t:w.querySelector('.bld-fc').innerText.trim(),on:w.querySelector('.bld-fc').classList.contains('on'),off:w.querySelector('.bld-fc').disabled,why:(w.querySelector('.bld-why')||{}).innerText||''})));
const pick=async re=>{await ev(re=>{const e=[...document.querySelectorAll('#bldm .bld-fc')].find(x=>new RegExp(re,'i').test(x.innerText)&&!x.disabled&&!x.classList.contains('bld-fb'));if(!e)throw new Error('option absente '+re);e.click()},re);await wait(250)};
const pop=()=>ev(()=>{const p=document.getElementById('lckpop');return p?p.innerText.replace(/\n+/g,' | '):null});
// ---- Escouade de Terminators, 5 figurines
await open('terminator','^Escouade de Terminators$',5);
ok('liste des figurines affichée (1 sergent + 4)',await ev(()=>document.querySelectorAll('#bldm .bld-fg').length===5),await ev(()=>document.querySelectorAll('#bldm .bld-fg').length));
await fig(1);
let c1=await chips();console.log('Terminator 1 :',JSON.stringify(c1.map(x=>x.t)));
await pick('lance-flammes|heavy flamer');
ok('arme spéciale choisie pour la figurine 1',await ev(()=>Object.keys(BLDSTATE.cfg.wq).some(k=>/lance-flammes|heavy flamer/i.test(k))),1);
await fig(2);
const c2=await chips();
const sp=c2.filter(x=>/canon d.assaut|heavy flamer|lance-flammes|cyclone/i.test(x.t));
ok('autre figurine : toutes les armes spéciales indisponibles (1 pour 5)',sp.length>=3&&sp.every(x=>x.off),c2);
ok('raison affichée',sp.some(x=>/Maximum 1/.test(x.why)),sp.map(x=>x.why));
// même figurine : changer d'arme spéciale remplace (choix exclusif)
await fig(1);await pick('canon d.assaut|assault cannon');
ok('choix exclusif : le canon d assaut remplace le lance-flammes',await ev(()=>{const k=Object.keys(BLDSTATE.cfg.wq);return k.some(x=>/canon d.assaut|assault cannon/i.test(x))&&!k.some(x=>/lance-flammes|heavy flamer/i.test(x))}),await ev(()=>Object.keys(BLDSTATE.cfg.wq)));
// poing tronçonneur : « n'importe quel nombre »
await fig(2);await pick('tron|chainfist');
ok('poing tronçonneur accepté sur plusieurs figurines',await ev(()=>Object.keys(BLDSTATE.cfg.wq).some(x=>/chainfist/i.test(x))),1);
await fig(3);
const c3=await chips();
ok('figurine 3 : poing tronçonneur encore disponible',c3.some(x=>/tron|chainfist/i.test(x.t)&&!x.off),c3);
// 10 -> 5 : bloqué si 2 armes spéciales
await click('[data-bld="size"][data-v="10"]');await wait(200);
await fig(2);await pick('lance-flammes|heavy flamer');
await click('[data-bld="size"][data-v="5"]');await wait(200);
const m=await pop();
ok('10 → 5 figurines avec 2 armes spéciales : bloqué',/Effectif impossible/.test(m||''),m);
await ev(()=>{const x=document.querySelector('#lckpop [data-lckp="ok"]');x&&x.click()});await wait(150);
// ajout à l'armée : configuration conforme, pas de popup
await click('[data-bld="ok"]');await wait(300);
ok('configuration légale ajoutée sans popup',!(await pop())&&await ev(()=>S.lists[0].units.length===1&&!!S.lists[0].units[0].cfg.figs),await pop());
// ---- Vétérans d'avant-garde à réacteurs dorsaux : le bouclier de combat remplace le pistolet
await open('jump','Vétérans d.Avant-garde|Vanguard Veteran',5);
await fig(0);
let v0=await chips();console.log('Sergent VJ :',JSON.stringify(v0.map(x=>x.t)));
await pick('plasma');
const v1=await chips();
const shield=v1.filter(x=>/bouclier|shield/i.test(x.t));
ok('sergent : pistolet à plasma choisi → bouclier de combat indisponible (même pistolet)',shield.length>=1&&shield.every(x=>x.off),v1);
ok('raison : arme déjà remplacée',shield.some(x=>/plus disponible|déjà remplacé/.test(x.why)),shield.map(x=>x.why));
await fig(1);await pick('bouclier|shield');
const v2=await chips();
ok('figurine 1 : bouclier choisi → pistolet à plasma indisponible',v2.filter(x=>/plasma/i.test(x.t)).every(x=>x.off),v2);
await p.screenshot({path:'fig1.png'});
await b.close()})();
