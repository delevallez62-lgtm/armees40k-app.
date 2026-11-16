const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
await p.evaluate(()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click()});
await p.evaluate(async()=>{await BIB.init();tab='coll';draw()});
const st=async()=>p.evaluate(()=>{const r={};document.querySelectorAll('#bibm,#app').forEach(()=>{});return 0});
// compte les badges orange dans l'écran Bibliothèque (unités)
const open=async()=>{await p.evaluate(()=>{tab='coll';draw()});await p.click('text=Bibliothèque');await p.waitForTimeout(500);await p.evaluate(()=>{const t=document.querySelector('[data-bibtab="units"]');t&&t.click()});await p.waitForTimeout(400)};
await open();
const n1=await p.evaluate(()=>(document.body.innerText.match(/À vérifier|à vérifier|proposé/g)||[]).length);
await p.evaluate(()=>{S.lib.vall=Date.now();draw()});await open();
const n2=await p.evaluate(()=>(document.body.innerText.match(/À vérifier|à vérifier|proposé/g)||[]).length);
console.log('marques à vérifier avant/après:',n1,n2,errs);await b.close()})();
