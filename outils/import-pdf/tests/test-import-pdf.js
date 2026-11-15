const {chromium}=require('playwright');const fs=require('fs');
const N=+process.argv[3]||30;const page=process.argv[2]||'promote32.html';
(async()=>{const b=await chromium.launch();const ctx=await b.newContext();
await ctx.route(/^https?:\/\/(?!localhost)/,r=>{const u=r.request().url();if(/pdf(?:\.min|\.worker\.min)\.js$/.test(u))return r.fulfill({path:'/tmp/pdfjs/node_modules/pdfjs-dist/build/'+u.split('/').pop(),contentType:'text/javascript'});r.abort()});
const p=await ctx.newPage();await p.goto('http://localhost:8765/'+page);await p.waitForTimeout(1500);
const norm=s=>String(s||'').replace(/\s+/g,' ').replace(/Non- /g,'Non-').trim();
const bad={};let total=0;const log=(sd,k,a,b)=>{(bad[k]=bad[k]||[]).push(sd+': '+JSON.stringify(a)+' != '+JSON.stringify(b))};
for(let sd=1;sd<=N;sd++){
 const spec=JSON.parse(fs.readFileSync('syn/s'+sd+'.json','utf8'));const pdf=fs.readFileSync('syn/s'+sd+'.pdf').toString('base64');
 const r=await p.evaluate(async(b64)=>{const lib=await pdfLib();const doc=await lib.getDocument({data:Uint8Array.from(atob(b64),c=>c.charCodeAt(0))}).promise;const pages=[];for(let n=1;n<=doc.numPages;n++){const pg=await doc.getPage(n),tc=await pg.getTextContent();pages.push(tc.items)}return JSON.parse(JSON.stringify(parse(pdfText(pages))))},pdf);
 total++;
 if(r.units.length!==spec.units.length){log(sd,'nunits',r.units.length,spec.units.length)}
 spec.units.forEach((u,i)=>{const g=r.units[i];if(!g)return;
  if(g.name!==u.name.toLowerCase())log(sd,'name',g.name,u.name);
  if(g.pts!==u.pts)log(sd,'pts',g.pts,u.pts);
  const st=['M','E','SV','PV','CD','CO'].map(k=>g.stats[k]);if(st.join()!==u.stats.join())log(sd,'stats',st,u.stats);
  if(g.weapons.length!==u.w.length)log(sd,'nweap',g.weapons.map(w=>w.name),u.w.map(w=>w.name));
  u.w.forEach((w,j)=>{const x=g.weapons[j];if(!x)return;
   if(norm(x.name)!==norm(w.name))log(sd,'wname',x.name,w.name);
   const a=[x.range,x.a,x.hit,x.f,x.pa,x.d].join('|'),e=[w.rng,w.a,w.hit,w.f,w.pa,w.d].join('|');if(a!==e)log(sd,'wnum',a,e);
   if(norm(x.caps)!==norm(w.caps))log(sd,'wcaps',x.caps,w.caps)});
  if(norm(g.equip)!==norm(u.equip))log(sd,'equip',g.equip,u.equip);
  const apE=u.abs.map(a=>a[0]).join(', ');if(norm(g.apt).replace(/‚/g,',')!==norm(apE))log(sd,'apt',g.apt,apE);
  if(norm(g.kw)!==norm(u.kw))log(sd,'kw',g.kw,u.kw);
  const exp=norm(u.abs.map(a=>a[0]+' '+a[1].replace(/\n/g,' ')).join(' ')),got=norm((g.text||[]).join(' '));if(got!==exp){let q=0;while(q<got.length&&got[q]===exp[q])q++;log(sd,'text','...'+got.slice(Math.max(0,q-60),q+80),'...'+exp.slice(Math.max(0,q-60),q+80))}
  if(u.pf){const em=((g.mdl||[]).find(x=>/boss nob/i.test(x.n))||{}).eq;if(norm(em)!==norm(u.w.slice(-2).map(w=>w.name).join(', ')))log(sd,'mdleq',em,u.w.slice(-2).map(w=>w.name).join(', '));const m=(g.mdl||[]).map(x=>x.n+':'+(x.st?['M','E','SV','PV','CD','CO'].map(k=>x.st[k]).join(' '):''));const e=u.pf.map(x=>x[0]+':'+x[1].join(' '));if(m.join('|').toLowerCase()!==e.join('|').toLowerCase())log(sd,'pf',m,e)}
 });
 if(r.dets.length!==spec.dets.length)log(sd,'ndets',r.dets,spec.dets.length);
 spec.dets.forEach((d,i)=>{const g=r.dets[i];if(!g)return;if(g.name!==d.name)log(sd,'detname',g.name,d.name);if(String(g.cost)!==String(d.cost))log(sd,'detcost',g.cost,d.cost);if(norm(g.rule)!==norm(d.rule))log(sd,'detrule',g.rule.slice(0,200),d.rule.slice(0,200))});
 if(r.strats.length!==spec.strats.length)log(sd,'nstrats',r.strats.length,spec.strats.length);
 spec.strats.forEach((s,i)=>{const g=r.strats[i];if(!g)return;if(g.name!==s.name)log(sd,'sname',g.name,s.name);if(g.det!==s.det)log(sd,'sdet',g.det,s.det);if(g.cp!==s.cp)log(sd,'scp',g.cp,s.cp);if(norm(g.body)!==norm(s.body))log(sd,'sbody',g.body,s.body)})
}
const ks=Object.keys(bad);console.log('listes',total,'types d\'erreur',ks.length);ks.forEach(k=>{console.log('##',k,bad[k].length);bad[k].slice(0,3).forEach(x=>console.log('   ',x.slice(0,420)))});await b.close()})();
