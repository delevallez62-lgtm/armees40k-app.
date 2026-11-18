const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--use-file-for-fake-video-capture='+process.cwd()+'/bc.y4m']});
const ctx=await b.newContext({viewport:{width:360,height:780},permissions:['camera']});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));const ev=(f,a)=>p.evaluate(f,a);
await ev(async()=>{await BIB.init();window.__majPop=1;document.querySelectorAll('#encov,.bib-ov').forEach(e=>e.remove());tab='paint';draw()});await p.waitForTimeout(400);
await ev(()=>{const t=[...document.querySelectorAll('button,[data-x]')].find(x=>/Mes peintures/i.test(x.innerText));t&&t.click()});await p.waitForTimeout(300);
await ev(()=>document.querySelector('[data-pscan]').click());await p.waitForTimeout(300);
await ev(()=>{window.BarcodeDetector=undefined;try{delete window.BarcodeDetector}catch(_){}});
await ev(()=>document.querySelector('[data-psc="start"]').click());
let found=false;for(let i=0;i<20&&!found;i++){await p.waitForTimeout(500);found=await ev(()=>!!document.getElementById('pspot')&&/Administratum Grey/.test(document.getElementById('pspot').innerText))}
ok('caméra (flux vidéo simulé) : code lu et pot affiché',found,await ev(()=>document.getElementById('psmsg')&&document.getElementById('psmsg').innerText));
await ev(()=>{const c=document.querySelector('[data-psc="stop"]');c&&c.click()});
await b.close()})();
