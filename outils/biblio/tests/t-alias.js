const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:800}});await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(3500);
const ok=(n,c,x)=>console.log((c?'✅ ':'❌ ')+n,c?'':JSON.stringify(x));
const r=await p.evaluate(async()=>{await BIB.init();const T=BIBAST.test,EQE=BIBLCK.eqe();const u=T.byName('Assault Intercessor Squad'),M=EQE.model(u);
 const tryIt=wq=>{const f=EQE.fromCounts(M,5,wq);const v=EQE.validate(M,5,f);return{err:v.errors.length,final:v.final.map(x=>x.map(i=>i.n).sort().join('+'))}};
 return{aln:tryIt({'Pistolet bolter Lourd':4,'Epée tronçonneuse Astartes':4,'Pistolet à plasma - Standard':1,'Marteau Thunder':1}),fr:tryIt({'Pistolet bolter lourd':4,'Epée tronçonneuse':4,'Pistolet à plasma – standard':1,'Marteau Tonnerre de Wulfen':1}),en:tryIt({'Heavy Bolt Pistol':4,'Chainsword':4,'Plasma Pistol':1,'Thunder Hammer':1}),
  inconnu:tryIt({'Heavy Bolt Pistol':4,'Chainsword':4,'Arme inconnue xyz':1})}});
const sgt=x=>x.final[0],rank=x=>x.final[1];
ok('noms ALN : le Sergent reçoit pistolet à plasma + marteau tonnerre',sgt(r.aln)==='Plasma Pistol+Thunder Hammer'&&r.aln.err===0,r.aln);
ok('noms ALN : les autres gardent épée tronçonneuse + pistolet bolter lourd',[1,2,3,4].every(i=>r.aln.final[i]==='Chainsword+Heavy Bolt Pistol'),r.aln);
ok('noms français officiels : même résultat',JSON.stringify(r.fr.final)===JSON.stringify(r.aln.final),r.fr);
ok('noms anglais : même résultat',JSON.stringify(r.en.final)===JSON.stringify(r.aln.final),r.en);
ok('nom inconnu : ignoré, aucune erreur, équipement de base conservé',r.inconnu.err===0&&rank(r.inconnu)==='Chainsword+Heavy Bolt Pistol',r.inconnu);
await b.close()})();
