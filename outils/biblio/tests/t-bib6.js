const {chromium}=require('playwright');const fs=require('fs');
const st=JSON.parse(fs.readFileSync(__dirname+'/etat.json','utf8'));
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());
await ctx.addInitScript(s=>{if(!sessionStorage.getItem('x')){localStorage.setItem('armees40k',s);sessionStorage.setItem('x',1)}},JSON.stringify(st));
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
await p.evaluate(async()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();S.mg=true;await BIB.init()});
console.log('chargement:',await p.evaluate(()=>({v:BIB.D.man.version,units:BIB.D.units.length,wpUnits:BIB.D.units.filter(u=>u.src==='wahapedia').length,withExt:BIB.D.units.filter(u=>u.wp).length,det:BIB.D.dets.length,str:BIB.D.str.length,enh:BIB.D.enh.length,fr:BIB.D.frN,chunks:Object.keys(BIB.D.chunks)})));
// empreinte JS == empreinte Python
console.log('empreinte:',await p.evaluate(()=>{const hh=t=>BIB.sha1(String(t).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim()).slice(0,12);return['That unit.','Your Shooting phase.','That ORKS unit.'].map(hh)}),'attendu: e852fe1a0ccf 34fee80ab79e f45edebf84ab');
console.log('proposition :',JSON.stringify(await p.evaluate(()=>['That unit.','Your Shooting phase.'].map(x=>{const r=BIB.trDesc(x);return r.st+':'+(r.prop||r.t)}))));
// fiche Boyz : options Wahapedia, source, propositions
await p.evaluate(()=>{tab='bib';draw()});await p.waitForTimeout(500);
await p.fill('#bibq','boyz');await p.waitForTimeout(300);await p.evaluate(()=>{const u=BIB.D.units.find(x=>x.n==='Boyz'&&x._c==='orks');document.querySelector('#bibl [data-bib="unit"][data-id="'+u.id+'"]').click()});await p.waitForTimeout(600);
console.log('fiche Boyz contient:',await p.evaluate(()=>{const t=document.querySelector('#bibm').innerText;return{wahapedia:/Wahapedia/.test(t),options:/Options d'équipement/.test(t),loadout:/Équipement de base/.test(t),ledby:/Peut être mené par/.test(t),nonBloquant:/ne bloquent jamais/.test(t)}}));await p.screenshot({path:'bib-wp1.png'});
// stratagèmes : proposition + valider
await p.evaluate(()=>{document.querySelector('[data-bib="x"]').click();document.querySelector('[data-bib="tab"][data-v="str"]').click()});await p.waitForTimeout(400);
await p.evaluate(()=>{const q=document.getElementById('bibq');q.value=BIB.D.str.find(x=>x.tg==='That unit.'&&x.when).n;q.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(300);
await p.evaluate(()=>{const d=document.querySelector('#bibl details');d.open=true});await p.waitForTimeout(200);
console.log('stratagème ouvert, propositions:',await p.evaluate(()=>document.querySelectorAll('#bibl .bib-prop').length),(await p.evaluate(()=>(document.querySelector('#bibl .bib-prop')||{}).innerText||'')).slice(0,120));
await p.screenshot({path:'bib-wp2.png'});
const ok=await p.evaluate(()=>{const b=document.querySelector('#bibl [data-bibtr="ok"]');if(!b)return 'aucun bouton';b.click();return 'cliqué'});console.log('valider:',ok);
console.log('après validation:',await p.evaluate(()=>({tm:Object.values(S.lib.tm).map(x=>x.src+':'+x.en+' => '+x.fr)})));
console.log(errs);await b.close()})();
