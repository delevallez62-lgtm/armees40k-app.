const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);const wait=t=>p.waitForTimeout(t);
await ev(async()=>{await BIB.init();window.__majPop=1;const nw=BIB.D.units.find(x=>x.n==='Necron Warriors');
S.coll.q1={ref:'q1',name:'Zorglub inconnu',stats:{},weapons:[],equip:'',apt:'',text:[],kw:'',fkw:'',pts:1,nb:1,subs:[]};
S.coll.q2={ref:'q2',name:'Necron Warrior',stats:{},weapons:[],equip:'',apt:'',text:[],kw:'',fkw:'',pts:1,nb:1,subs:[]};
tab='bib';draw()});await wait(500);
const tabTxt=await ev(()=>[...document.querySelectorAll('[data-bib="tab"]')].map(x=>x.innerText).join('|'));ok('onglet « À vérifier » présent avec compteur',/À vérifier \(\d+\)/.test(tabTxt),tabTxt);
await ev(()=>document.querySelector('[data-bib="tab"][data-v="chk"]').click());await wait(500);
const t=await ev(()=>document.body.innerText);ok('sections : noms à confirmer + fiches à lier',/Noms français à confirmer/.test(t)&&/Fiches de collection à lier/.test(t)&&/Zorglub inconnu/.test(t),t.slice(0,300));
// valider un nom
const nm=await ev(()=>{const i=document.querySelector('[id^="chk-"]');if(!i)return null;const id=i.id.slice(4);const u=BIB.D.byId[id];i.value='Nom corrigé test';document.querySelector('[data-uni="nmsave"][data-id="'+id+'"]').click();return u.n});await wait(400);
ok('correction + enregistrement d\'un nom',nm&&await ev(n=>BIB.tName(n).t==='Nom corrigé test'&&BIB.tName(n).st==='ok',nm),nm);
// lier une fiche à la main
const l=await ev(()=>{const b=document.querySelector('[data-uni="linkto"][data-r="q2"]');if(!b)return null;b.click();return 1});await wait(600);
ok('lien manuel depuis l\'onglet',l&&await ev(()=>!!S.lib.links.q2&&S.lib.links.q2.st==='manual'),l);
// valider un nom proposé tel quel (autre) / garder en anglais
const kp=await ev(()=>{const b=document.querySelector('[data-uni="nmkeep"]');if(!b)return null;const u=BIB.D.byId[b.dataset.id];b.click();return u.n});await wait(300);
ok('garder en anglais',kp&&await ev(n=>BIB.tName(n).st==='ok'&&BIB.tName(n).t===n,kp),kp);
const dec=await ev(()=>/Zorglub inconnu/.test(document.body.innerText));ok('fiche non liée reste proposée',dec,dec);
await b.close()})();
