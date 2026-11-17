const {chromium}=require('playwright');
const N=+process.argv[3]||600;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext();await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3000);
const r=await p.evaluate(async N=>{await BIB.init();const D=BIB.D;
const cand=[];const add=t=>{t=String(t||'').trim();if(t.length>25)cand.push(t)};
D.units.forEach(u=>(u.ab||[]).forEach(a=>add(a.d)));D.dets.forEach(d=>{if(d.ab)add(d.ab.description);(d.abx||[]).forEach(x=>add(x.description))});D.enh.forEach(e=>add(e.d));D.str.forEach(x=>["when","tg","fx","rs"].forEach(k=>add(x[k])));
const uniq=[...new Set(cand)].filter(t=>{const o=D.fr[BIB.hh(t)];return o&&o.fr});
let seed=12345;const rnd=()=>(seed=(seed*1103515245+12345)&0x7fffffff)/0x7fffffff;
const smp=[];const pool=uniq.slice();while(smp.length<N&&pool.length){smp.push(pool.splice(Math.floor(rnd()*pool.length),1)[0])}
const gold=smp.map(t=>D.fr[BIB.hh(t)].fr);smp.forEach(t=>{delete D.fr[BIB.hh(t)]});
BIB.kpReset();const strip=s=>String(s).replace(/\*\*(.+?)\*\*/g,'$1').replace(/\*(.+?)\*/g,'$1').replace(/■/g,'•');
for(let i=0;i<200;i++){BIB.autoTr(smp[0]);if(BIB.kpInfo().ready)break;await new Promise(r=>setTimeout(r,200))}
const SY={modèle:'figurine',modèles:'figurines',lorsque:'quand',lorsqu:'quand',peut:'peut',pouvez:'peut',tant:'tant'};const W=s=>(strip(s).toLowerCase().replace(/’/g,"'").match(/[a-zàâäçéèêëîïôöùûüÿœ0-9]+/g)||[]).map(w=>SY[w]||w);
const sim=(a,b)=>{a=W(a);b=W(b);const n=a.length,m=b.length;if(!n&&!m)return 1;const d=Array.from({length:n+1},(_,i)=>[i].concat(new Array(m).fill(0)));for(let j=1;j<=m;j++)d[0][j]=j;for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return 1-d[n][m]/Math.max(n,m)};
let cov=0,sum=0,ge95=0,ex=0;const bad=[];
smp.forEach((t,i)=>{const o=BIB.autoTr(t);if(o){cov++;const s=sim(o,gold[i]);sum+=s;if(s>=.95)ge95++;if(s>=.999)ex++;if(s<.95&&bad.length<14)bad.push([t.slice(0,230),o.slice(0,230),gold[i].slice(0,230),s.toFixed(2)])}});
return{N:smp.length,cov,covPct:(100*cov/smp.length).toFixed(1),simCovered:(100*sum/Math.max(1,cov)).toFixed(1),simAll:(100*sum/smp.length).toFixed(1),ge95:ge95,exact:ex,bad}},N);
console.log(JSON.stringify(r,null,1));await b.close()})();
