const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780}});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const MODE=process.argv[3]||'';const r=await p.evaluate(async(MODE)=>{await BIB.init();const D=BIB.D,st={M:'6"',E:'4',SV:'3+',PV:'2',CD:'6+',CO:'2'};
 const det=D.dets.find(x=>x.n==='Angelic Inheritors');
 const base=n=>String(n||'').replace(/^➤\s*/,'').replace(/\(.*?\)/g,'').split(/\s+[-–]\s+/)[0].toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 let seed=12345;const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff};
 const units=D.units.filter(u=>u.wp&&u.wp.opt&&u.wp.opt.length&&((u.wp.pc&&u.wp.pc.tiers)||u.sz));
 const stat={units:0,runs:0,bad:0,warn:0,crash:0,over:0,overDetected:0};const fails=[];
 for(const lu of units){
  const pc=lu.wp.pc,sizes=pc?pc.tiers[0].sz.map(x=>x.n):[lu.sz.min];
  const R=BIBLCK.parseOpts(lu);if(!R.rules.length)continue;stat.units++;
  // composantes
  const lo=String(lu.wp.loadout||'').toLowerCase().replace(/[^a-z0-9]+/g,' ');const rules=R.rules.map(r=>({r,own:r.to.filter(t=>!lo.includes(String(t).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim())).map(base)})).filter(x=>x.own.length);
  for(const size of sizes){for(let rep=0;rep<3;rep++){
   const cap=r=>r.r.kind==='per'?Math.floor(size/r.r.per)*r.r.k:(r.r.kind==='fix'||r.r.kind==='add')?r.r.k:size;
   // capacité par composante
   const comps=[];rules.forEach(x=>{const hit=comps.filter(c=>x.own.some(w=>c.w.has(w)));const m={w:new Set(x.own),cap:cap(x),used:0};hit.forEach(c=>{c.w.forEach(w=>m.w.add(w));m.cap+=c.cap;comps.splice(comps.indexOf(c),1)});comps.push(m)});
   const loadout=String(lu.wp.loadout||'').toLowerCase().replace(/[^a-z0-9]+/g,' ');
   const wq={};
   comps.forEach(c=>{const ws=[...c.w].filter(w=>!loadout.includes(w));let left=c.cap;ws.forEach(w=>{if(left<=0)return;const n=Math.min(left,1+Math.floor(rnd()*left));
     // retrouver le nom brut (profil aléatoire ou tous)
     const raws=[...(lu.rw||[]),...(lu.mw||[])].map(x=>x.n).filter(x=>base(x)===w);const names=raws.length?raws:[w];
     names.forEach(nm=>{wq[nm]=Math.max(wq[nm]||0,n)});left-=n})});
   if(MODE==='over'){if(!comps.length)continue;const c=comps[0];const w=[...c.w].filter(w=>!loadout.includes(w))[0];if(!w)continue;const raws=[...(lu.rw||[]),...(lu.mw||[])].map(x=>x.n).filter(x=>base(x)===w);const nm=raws.length?raws[0]:w;Object.keys(wq).forEach(k=>{if(c.w.has(base(k)))delete wq[k]});wq[nm]=c.cap+1;stat.over++}
   const u={name:lu.n,ref:'rf'+lu.id.slice(0,5),size,pts:0,stats:st,weapons:[],subs:[],cfg:{lib:lu.id,size,wq,wn:{},wg:{},subs:[]}};
   const L={id:'f',name:'F',dets:[],strats:[],bld:{limit:2000,facN:'x',dets:[{id:det.id,name:det.n,en:det.n}]},units:[u]};S.lists=[L];
   try{const res=BIBLCK.run(L);const eq=res.sec.find(s=>s.id==='eq').items;stat.runs++;
    const bad=eq.filter(i=>i.lv==='bad'),warn=eq.filter(i=>i.lv==='warn');if(MODE==='over'){if(bad.length||warn.length)stat.overDetected++;else{window.__miss=window.__miss||[];if(window.__miss.length<8)window.__miss.push({miss:lu.n,size,wq,items:eq.map(i=>i.lv+' '+(i.t||i.nodet))})}}if(bad.length){stat.bad++;if(fails.length<12)fails.push({u:lu.n,size,wq,bad:bad.map(i=>i.t)})}if(warn.length)stat.warn++;
   }catch(e){stat.crash++;if(fails.length<12)fails.push({u:lu.n,err:String(e)})}
  }}}
 return{stat,fails:window.__miss||[]}},MODE);
console.log(JSON.stringify(r,null,1).slice(0,5000));await b.close()})();
