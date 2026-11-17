const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [w,label] of [[360,'360'],[320,'320']]){const ctx=await b.newContext({viewport:{width:w,height:740},isMobile:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(1500);
// 1er lancement : fenêtre (journal de l'application non lu)
await p.waitForTimeout(3500);
const first=await p.evaluate(()=>{const e=document.querySelector('#bibp');return e&&e.innerText?e.innerText.replace(/\n/g,' | ').slice(0,200):null});
if(label==='360')console.log('1er lancement:',first);
// on ferme, on recharge : plus de fenêtre
await p.evaluate(()=>{const x=document.querySelector('#bibp [data-bib="popx"]');if(x)x.click()});await p.waitForTimeout(300);
await p.reload();await p.waitForTimeout(5000);
if(label==='360')console.log('2e lancement (rien de neuf):',await p.evaluate(()=>{const e=document.querySelector('#bibp');return e&&e.innerText?e.innerText.slice(0,80):'aucune fenêtre'}));
await p.evaluate(()=>{tab='news';S.mg=true;draw()});await p.waitForTimeout(400);
console.log('onglet Nouveautés',label,JSON.stringify(await p.evaluate(()=>({sw:document.documentElement.scrollWidth,vw:innerWidth}))),errs);await ctx.close()}
await b.close()})();
