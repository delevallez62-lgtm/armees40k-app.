const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:360,height:780},isMobile:true});
await ctx.route(/^https?:\/\/(?!localhost)/,r=>r.abort());const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/'+process.argv[2]);await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(async()=>{await BIB.init();
 const W=(name,range,a,hit,f,pa,d,caps)=>({name,range,a,hit,f,pa,d,caps});
 const L=W('Big Shoota','36"','3','5+','5','0','1','Tir Rapide 2');
 const T=[
  ['même chiffres, nom proche, caps proches',W('Big Shoot\'','36"','3','5+','5','0','1','Tir Rapide 2'),true],
  ['1 chiffre différent, nom proche',W('Big Shoota kustom','36"','3','5+','5','0','2','Tir Rapide 2'),true],
  ['chiffres proches mais nom sans rapport',W('Pince de Gork','36"','3','5+','5','0','2','Tir Rapide 2'),false],
  ['chiffres proches, nom proche, caps différentes',W('Big Shoota','36"','3','5+','5','0','2','Torrent, Pistolet'),false],
  ['3 chiffres différents',W('Big Shoota','24"','1','4+','8','-1','2','Tir Rapide 2'),false]];
 return T.map(([n,mw,exp])=>[n,BIB.wLike(L,mw,[]),exp])})),errs);await b.close()})();
