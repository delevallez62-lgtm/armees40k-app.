const {chromium}=require('playwright');const fs=require('fs');
const pdf=fs.readFileSync('/root/.claude/uploads/23af94af-db82-542e-90e8-f7f093cb9b4f/9b52e551-liste_2108977.pdf').toString('base64');
const W=390;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:W,height:780},isMobile:true,hasTouch:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>{const u=r.request().url();if(/pdf(?:\.min|\.worker\.min)\.js$/.test(u))return r.fulfill({path:'/tmp/pdfjs/node_modules/pdfjs-dist/build/'+u.split('/').pop(),contentType:'text/javascript'});r.abort()});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2200);
await p.evaluate(()=>{const c=document.querySelector('#encov [data-enc="ovclose"]');if(c)c.click();S.mg=true;tab='imp';draw()});await p.waitForTimeout(300);
await p.evaluate(async b64=>{await readPdf(new File([Uint8Array.from(atob(b64),c=>c.charCodeAt(0))],'l.pdf'))},pdf);await p.waitForTimeout(2500);
await p.evaluate(()=>{const d=document.querySelector('#dg [data-act="dgno"]');if(d)d.click();tab='learn';draw()});await p.waitForTimeout(400);
await p.evaluate(()=>document.querySelector('.tt-card [data-tt="start"]').click());await p.waitForTimeout(700);
console.log('départ :',await p.evaluate(()=>{const o=document.getElementById('ttp');return o&&o.innerText?o.innerText.replace(/\n+/g,' | ').slice(0,160):null}));await p.evaluate(()=>{const e=document.querySelector('#ttp [data-tt2="px"]');if(e)e.click()});
for(let i=0;i<6;i++){const r=await p.evaluate(()=>{const w=document.querySelector('#gpo');if(!w)return 'fermé';const mo=w.querySelector('.mpk .mo:not(.on)')||w.querySelector('.mo');const g=w.querySelector('[data-gp="go"]');if(g){g.click();return 'go'}if(mo&&!w.querySelector('.mo.on'))mo.click();const n=w.querySelector('[data-gp="wnext"]');if(n)n.click();return 'next'});await p.waitForTimeout(600);if(r==='go')break}
await p.waitForTimeout(1500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
const pop=()=>p.evaluate(()=>{const o=document.getElementById('ttp');return o&&o.innerText?o.innerText.replace(/\n+/g,' | ').slice(0,200):null});
await p.screenshot({path:'tt5-a.png'});
const P1=await pop();console.log('après lancement :',P1);
ok('une fenêtre de guide s\'ouvre au lancement',!!P1,P1);
// parcourir les fenêtres de l'étape courante jusqu'à "J'ai compris"
async function finishStep(){let n=0;while(n++<10){const t=await p.evaluate(()=>{const b=document.querySelector('#ttp [data-tt2="pn"],#ttp [data-tt2="pd"]');if(!b)return 'none';const k=b.dataset.tt2;b.click();return k});await p.waitForTimeout(250);if(t==='pd'||t==='none')return t}}
const titles=[];
for(let i=0;i<6;i++){const h=await p.evaluate(()=>{const o=document.querySelector('#ttp .tt2-k span');return o?o.innerText:null});if(!h)break;titles.push(h);if(i===5){await p.screenshot({path:'tt5-shoot.png'})}
 if(/Comparer/.test(h)){await p.screenshot({path:'tt5-force.png'});}
 await finishStep();await p.waitForTimeout(300)}
console.log(titles.join('\n'));
ok('6 étapes parcourues',titles.length===6,titles.length);
ok('pastille d\'étape présente',await p.evaluate(()=>!!document.getElementById('ttpill')),1);
await p.evaluate(()=>{tab='play';draw()});await p.waitForTimeout(400);
await p.evaluate(()=>{const e=document.querySelector('#ttp .tt2-x');if(e)e.click()});
await p.evaluate(()=>document.querySelector('.puh').click());await p.waitForTimeout(500);
ok('pastilles 🎓 sur la fiche ouverte',await p.evaluate(()=>document.querySelectorAll('.tt-uhint .tt-chip').length>=6),0);
await p.screenshot({path:'tt5-chips.png'});
await p.evaluate(()=>document.querySelector('.tt-chip[data-c^="s:E"]').click());await p.waitForTimeout(250);console.log('chip E :',await pop());await p.screenshot({path:'tt5-chip.png'});
await p.evaluate(()=>document.querySelector('[data-tt2="sx"]').click());
await p.evaluate(()=>{const c=document.querySelector('.tt-chip[data-c="force"]');if(c)c.click()});await p.waitForTimeout(250);console.log('force :',(await pop()||'').slice(0,160));
await p.evaluate(()=>document.querySelector('[data-tt2="sx"]').click());
// classique : sans tuto, rien
await p.evaluate(()=>{S.tut.on=false;draw()});await p.waitForTimeout(400);
ok('hors tutoriel : plus de pastille ni de 🎓',await p.evaluate(()=>!document.getElementById('ttpill')&&!document.querySelector('.tt-uhint')&&!document.getElementById('ttp').innerText),1);
console.log(errs);await b.close()})();
