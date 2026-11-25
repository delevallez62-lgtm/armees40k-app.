/* ===== Assistant d'optimisation — diagnostic, recommandations, validation, variantes ===== */
(()=>{
const T=AST,clone=o=>JSON.parse(JSON.stringify(o));
const facKeyOf=(L,libs)=>{const b=L.bld&&L.bld.fac;if(b)return b;const c={};libs.forEach(l=>{if(l)c[l._c]=(c[l._c]||0)+1});return Object.keys(c).sort((a,b)=>c[b]-c[a])[0]||""};
const limitOf=L=>+(L.bld&&L.bld.limit)||0;
const fr=n=>{try{return frName(n)}catch(_){return n}};
/* ---------- diagnostic ---------- */
function analyse(L){const units=L.units||[];if(!units.length)return{ok:false,why:"La liste est vide : ajoute des unités pour lancer l'analyse."};
 if(!(typeof D!=="undefined"&&D.ready))return{ok:false,why:"La bibliothèque V11 n'est pas encore chargée."};
 const R=calc(L),ptsU=units.map((u,i)=>R.lines.filter(l=>l.i===i&&l.pts!=null).reduce((a,l)=>a+l.pts,0)),rows=[],partial=[];
 units.forEach((u,i)=>{const lib=lckLib(u);let P=null;try{P=T.profOfListUnit(u)}catch(e){partial.push(u.name+" : fiche illisible");return}
  const m=T.unitMetrics(P,lib);if(!m.ok)partial.push((u.name||"?")+" : caractéristiques ou armes incomplètes");if(!lib)partial.push((u.name||"?")+" : fiche non reliée à la bibliothèque");
  rows.push({i,u,lib,P,m,pts:ptsU[i]||0,name:fr(u.name)})});
 const ok=rows.filter(r=>r.m.ok&&r.pts>0);if(!ok.length)return{ok:false,why:"Les unités de cette liste n'ont pas assez de données (caractéristiques, armes, points) pour être analysées."};
 const fac=facKeyOf(L,rows.map(r=>r.lib).filter(Boolean)),B=T.bench(fac);if(!B||B.n<5)return{ok:false,why:"Pas assez d'unités de référence dans la bibliothèque pour cette faction."};
 const syn=T.synergy(L,rows.map(r=>({lib:r.lib})));const I=T.indicators(ok,B,syn);
 const total=R.total,lim=limitOf(L),room=lim?lim-total:null;
 /* contributions et lecture */
 const tot=k=>ok.reduce((a,r)=>a+(r.m[k]||0),0),pts=I.pts;
 const strengths=[],weaknesses=[];
 Object.keys(T.NAMES).forEach(k=>{const v=I.ind[k];if(v==null)return;if(v>=65)strengths.push({k,t:T.NAMES[k]+" solide ("+v+"/100)",v});else if(v<=40)weaknesses.push({k,t:T.NAMES[k]+" faible ("+v+"/100)",v})});
 const share=(r,k)=>tot(k)?(r.m[k]||0)/tot(k):0;
 ok.forEach(r=>{const sp=r.pts/pts;["dc","di"].forEach(k=>{if(share(r,k)>0.45&&ok.length>=4)weaknesses.push({k:"dep",t:"Dépendance : "+r.name+" produit "+Math.round(100*share(r,k))+" % de ton "+(k==="dc"?"anti-char":"anti-infanterie")})});
  if(sp>=0.08&&!(r.lib&&isChar(r.lib))&&["dc","di","en","oc"].every(k=>share(r,k)<0.5*sp))weaknesses.push({k:"low",i:r.i,t:r.name+" coûte "+Math.round(100*sp)+" % de la liste pour une contribution faible"})});
 /* fonction dominante par unité (redondance) */
 const fn=r=>{const c={ac:(r.m.dc/r.pts)/B.dc,ai:(r.m.di/r.pts)/B.di,res:(r.m.en/r.pts)/B.en,obj:(r.m.oc/r.pts)/B.oc};const k=Object.keys(c).sort((a,b)=>c[b]-c[a])[0];return c[k]>=1.4?k:null};
 const fc={};ok.forEach(r=>{r.fn=fn(r);if(r.fn)(fc[r.fn]=fc[r.fn]||[]).push(r)});
 Object.keys(fc).forEach(k=>{if(fc[k].length>=3)weaknesses.push({k:"red",t:fc[k].length+" unités remplissent le même rôle ("+T.NAMES[k].toLowerCase()+") : "+fc[k].map(r=>r.name).slice(0,3).join(", ")})});
 const conf=partial.length?"partial":"verified";
 return{ok:true,L,rows,okRows:ok,I,B,fac,total,lim,room,strengths,weaknesses,partial,conf,syn}}
const IKEYS=["ac","ai","res","mob","obj"];
const delta=(a,b)=>{const o={};Object.keys(a).forEach(k=>{o[k]=(a[k]!=null&&b[k]!=null)?b[k]-a[k]:null});return o};
/* indicateurs après remplacement de lignes */
function after(A,drop,add){const rows=A.okRows.filter(r=>!drop.includes(r.i)).concat(add),libs=A.rows.filter(r=>!drop.includes(r.i)).concat(add).map(r=>({lib:r.lib}));return T.indicators(rows,A.B,T.synergy(A.L,libs))}
/* légalité d'une liste modifiée : aucune nouvelle erreur rouge, limite de points respectée */
function legalOf(L,units,tmpUnits){const before=new Set(lckBadOf(L,L.units).map(x=>x.k));let bad=[];try{bad=lckBadOf(L,units.concat(tmpUnits||[])).filter(x=>!before.has(x.k))}catch(e){return{ok:false,notes:["Contrôle impossible : "+(e&&e.message)]}}
 return{ok:bad.length===0,notes:bad.slice(0,3).map(x=>x.t+(x.d?" — "+x.d:""))}}
function entryFor(lib){return catEntries().find(e=>e.key==="u:"+lib.id)||{key:"u:"+lib.id,name:fr(lib.n),lib,coll:null,colls:[]}}
function tmpUnit(lib,size,figs,wg){const e=entryFor(lib);return lckTmpUnit(e,{size,wq:{},wn:{},wg:wg||{},figs:figs||null,enh:null,subs:[]})}
/* ---------- recommandations ---------- */
const PROB={ac:"Ton armée manque de puissance contre les véhicules et les monstres résistants.",ai:"Ton armée manque de puissance contre l'infanterie nombreuse.",res:"Tes unités encaissent mal les tirs adverses pour leur coût.",mob:"Ton armée est lente : elle aura du mal à atteindre les objectifs.",obj:"Ton armée contrôle peu d'objectifs pour son coût."};
const WHYS={ac:"Une unité spécialisée contre les cibles blindées permet de détruire plus vite les véhicules et monstres adverses.",ai:"Plus de tirs à haute cadence permettent de nettoyer les unités nombreuses avant qu'elles ne prennent les objectifs.",res:"Des unités plus résistantes (points de vie, sauvegarde) restent plus longtemps sur la table.",mob:"Des unités plus rapides arrivent plus tôt sur les objectifs et sur les cibles.",obj:"Un contrôle d'objectif plus élevé (CO) permet de tenir plus de points de mission."};
function pm(d){return d==null?0:d}
function proscons(dl){const p=[],c=[];IKEYS.concat(["syn"]).forEach(k=>{const d=dl[k];if(d==null)return;if(d>=2)p.push(T.NAMES[k]+" +"+d);else if(d<=-2)c.push(T.NAMES[k]+" "+d)});return{pros:p,cons:c}}
function mkRec(A,o){const dl=delta(A.I.ind,o.after.ind),pc=proscons(dl);const g=(o.after.ind.glob||0)-(A.I.ind.glob||0);
 return Object.assign({},o,{before:A.I.ind,after:o.after.ind,dl,pros:pc.pros,cons:pc.cons,gain:g,conf:o.conf||A.conf,room:A.room})}
function recommend(A){const recs=[];if(!A||!A.ok)return recs;const L=A.L;
 const weak=IKEYS.filter(k=>A.I.ind[k]!=null).sort((a,b)=>A.I.ind[a]-A.I.ind[b]).slice(0,2);if(!weak.length)return recs;
 const metr={ac:"dc",ai:"di",res:"en",obj:"oc",mob:"M"};
 const used=new Set();(L.units||[]).forEach(u=>{const l=lckLib(u);if(l)used.add(l.id)});
 const cands=A.B.ms.filter(m=>m.pts>0&&!/\[(Legends|Crucible)\]/i.test(m.lib.n));
 /* ---- A. équipement ---- */
 A.rows.forEach(r=>{const u=r.u,lib=r.lib;if(!lib||!u.cfg||u.cfg.lib!==lib.id||u.pm)return;const size=u.cfg.size,M=EQE.model(lib);if(!M||!M.usable||!EQE.counts(M,size))return;
  let figs=u.cfg.figs;if(!figs){try{figs=EQE.fromCounts(M,size,u.cfg.wq||{})}catch(_){figs=null}}if(!figs)return;
  const base=EQE.validate(M,size,figs);if(base.errors.length)return;const f0=T.figsOf(lib,size,figs);if(!f0)return;
  const pr0=A.okRows.find(x=>x.i===r.i);if(!pr0)return;const U0=T.pseudo(lib,size,f0.tot,r.pts);let m0;try{m0=T.unitMetrics(A_.toProfile(U0),lib)}catch(_){return}if(!m0.ok)return;
  const pc=pcOf(lib),wg=(pc&&pc.wg)||[];
  M.rules.forEach(rule=>rule.alts.forEach((alt,ai)=>{if(!rule.types.some(t=>figs.some(f=>f.t===t)))return;
   let nf=clone(figs),n=0;for(let j=0;j<nf.length;j++){const op=EQE.options(M,size,nf,j).find(o=>o.rule.id===rule.id);const a=op&&op.alts.find(x=>x.ai===ai);if(a&&a.ok&&!a.sel){const t=clone(nf);t[j].c=t[j].c||{};t[j].c[rule.id]=[ai];if(EQE.validate(M,size,t).errors.length===0){nf=t;n++}}}
   if(!n)return;const f1=T.figsOf(lib,size,nf);if(!f1||f1.v.errors.length)return;
   let cost=0;const wgAdd={};alt.forEach(x=>{const w=wg.find(g=>nk(g.n)===nk(frName(x.n))||nk(g.n)===nk(x.n));if(w){const q=(x.q||1)*n;cost+=q*w.pts;wgAdd[w.n]=(wgAdd[w.n]||0)+q}});
   const U1=T.pseudo(lib,size,f1.tot,r.pts+cost);let m1;try{m1=T.unitMetrics(A_.toProfile(U1),lib)}catch(_){return}if(!m1.ok)return;
   const nr=Object.assign({},pr0,{m:Object.assign({},pr0.m,{dc:pr0.m.dc+(m1.dc-m0.dc),di:pr0.m.di+(m1.di-m0.di),en:pr0.m.en+(m1.en-m0.en)}),pts:pr0.pts+cost});
   const aft=after(A,[r.i],[nr]);if(!aft)return;const best=weak.reduce((b,k)=>Math.max(b,pm(aft.ind[k])-pm(A.I.ind[k])),-99);const g=pm(aft.ind.glob)-pm(A.I.ind.glob);
   if(best<2||g<1)return;if(A.room!=null&&cost>A.room)return;
   const u2=clone(u);u2.cfg.figs=nf;const lg=legalOf(L,L.units.map((x,i)=>i===r.i?u2:x),[]);
   const txt=EQE.altTxt(alt);recs.push(mkRec(A,{id:"eq-"+r.i+"-"+rule.id+"-"+ai,kind:"equip",unitIdx:r.i,key:"eq|"+r.i+"|"+rule.id+"|"+ai,after:aft,cost,legal:lg,
    title:"Équiper "+n+" figurine"+(n>1?"s":"")+" de « "+txt+" »",unitName:r.name,
    why:[PROB[weak[0]],"Cet équipement augmente la puissance de "+r.name+" ("+T.NAMES[weak[0]].toLowerCase()+") sans changer son rôle.","Effet : "+T.NAMES[weak[0]]+" "+A.I.ind[weak[0]]+" → "+aft.ind[weak[0]]+(cost?" pour "+cost+" pts de plus.":", sans coût supplémentaire.")],
    trace:["Unité : "+r.name+" ("+size+" fig.), équipement validé par le moteur d'options","Dégâts moyens vs char (réf. E10 Sv3+ PV12) : "+Math.round(m0.dc*10)/10+" → "+Math.round(m1.dc*10)/10,"Dégâts moyens vs infanterie (réf. 10× E4 Sv3+ PV2) : "+Math.round(m0.di*10)/10+" → "+Math.round(m1.di*10)/10,"Coût : "+cost+" pts (équipements payants du barème)"],
    apply:{op:"equip",i:r.i,figs:nf,wg:wgAdd}}))}))});
 /* ---- B. ajout et C. remplacement ---- */
 const room=A.room,donors=A.okRows.filter(r=>!(r.lib&&isChar(r.lib))&&r.pts>0).map(r=>{const sp=r.pts/A.I.pts,c=["dc","di","en","oc"].reduce((a,k)=>a+(A.I.raw[{dc:"dc",di:"di",en:"en",oc:"oc"}[k]]?(r.m[k]||0)/A.I.raw[k]:0),0)/4;return{r,sp,c,ratio:c/sp}}).sort((a,b)=>a.ratio-b.ratio).slice(0,3);
 const scored=[];cands.forEach(c=>{const copy=(L.units||[]).filter(u=>{const l=lckLib(u);return l&&l.id===c.lib.id}).length+1,cs=costOf(c.lib,c.size,copy);if(cs.pts==null)return;
  const row={i:-1,u:null,lib:c.lib,m:c,pts:cs.pts,name:fr(c.lib.n)};
  const aftAdd=after(A,[],[row]);if(aftAdd&&(room==null||cs.pts<=room)){const best=weak.reduce((b,k)=>Math.max(b,pm(aftAdd.ind[k])-pm(A.I.ind[k])),-99),g=pm(aftAdd.ind.glob)-pm(A.I.ind.glob);if(best>=3&&g>=1)scored.push({kind:"add",c,row,aft:aftAdd,best,g,cost:cs.pts})}
  donors.forEach(d=>{const aftR=after(A,[d.r.i],[row]);const nt=A.total-d.r.pts+cs.pts;if(!aftR||(A.lim&&nt>A.lim))return;const best=weak.reduce((b,k)=>Math.max(b,pm(aftR.ind[k])-pm(A.I.ind[k])),-99),g=pm(aftR.ind.glob)-pm(A.I.ind.glob);
   if(best>=4&&g>=2&&c.lib.id!==(d.r.lib&&d.r.lib.id))scored.push({kind:"replace",c,row,aft:aftR,best,g,cost:cs.pts-d.r.pts,donor:d.r})})});
 scored.sort((a,b)=>(b.g+b.best/2)-(a.g+a.best/2));
 const per={add:0,replace:0};let tested=0;
 for(const s of scored){if(per[s.kind]>=3||tested>=24)continue;tested++;const lib=s.c.lib,fg=T.figsOf(lib,s.c.size);if(!fg||fg.v.errors.length)continue;
  const tmp=tmpUnit(lib,s.c.size,fg.figs),units=s.kind==="replace"?L.units.filter((u,i)=>i!==s.donor.i):L.units.slice(),lg=legalOf(L,units,[tmp]);if(!lg.ok)continue;
  const nm=fr(lib.n),W=weak[0];
  if(s.kind==="add")recs.push(mkRec(A,{id:"add-"+lib.id,kind:"add",key:"add|"+lib.id,unitIdx:null,after:s.aft,cost:s.cost,legal:lg,title:"Ajouter : "+nm,unitName:nm,
   why:[PROB[W],WHYS[W]+" "+nm+" apporte cette capacité.","Effet : "+T.NAMES[W]+" "+A.I.ind[W]+" → "+s.aft.ind[W]+", pour "+s.cost+" pts de plus ("+(room==null?"aucune limite de points définie":"il te reste "+room+" pts")+")."],
   trace:["Unité candidate : "+nm+" ("+s.c.size+" fig., "+s.cost+" pts, barème Wahapedia 11e)","Dégâts moyens vs char : "+Math.round(s.c.dc*10)/10+" · vs infanterie : "+Math.round(s.c.di*10)/10,"Équipement de base validé ; légalité vérifiée avec la liste complète"],apply:{op:"add",lib:lib.id,size:s.c.size}}));
  else recs.push(mkRec(A,{id:"rep-"+s.donor.i+"-"+lib.id,kind:"replace",key:"rep|"+s.donor.i+"|"+lib.id,unitIdx:s.donor.i,after:s.aft,cost:s.cost,legal:lg,title:"Remplacer "+s.donor.name+" par "+nm,unitName:s.donor.name,
   why:[PROB[W],s.donor.name+" contribue peu à ta liste par rapport à son coût ; "+nm+" répond mieux au besoin ("+T.NAMES[W].toLowerCase()+").","Effet : "+T.NAMES[W]+" "+A.I.ind[W]+" → "+s.aft.ind[W]+" ; "+(s.cost>=0?"+":"")+s.cost+" pts."],
   trace:["Unité retirée : "+s.donor.name+" ("+s.donor.pts+" pts)","Unité ajoutée : "+nm+" ("+s.cost+(s.cost>=0?" pts de plus":" pts de moins")+" que l'unité retirée)","Les autres unités de la liste restent identiques ; légalité vérifiée"],apply:{op:"replace",i:s.donor.i,lib:lib.id,size:s.c.size}}));per[s.kind]++}
 const seen=new Set();return recs.filter(r=>!seen.has(r.key)&&seen.add(r.key)).sort((a,b)=>(b.gain+Math.max(...IKEYS.map(k=>pm(b.dl[k]))))-(a.gain+Math.max(...IKEYS.map(k=>pm(a.dl[k])))))}
const A_=window.ANA;
/* ---------- application : TOUJOURS dans une variante ---------- */
function createUnit(lib,size){const key="u:"+lib.id;let e=catEntries().find(x=>x.key===key);if(!e)return null;const m=ensureSheet(e);const c={key,idx:null,wq:{},wn:{},wg:{},enh:null,subs:[],manual:0,size};
 const keepF=BLD.fig,keepS=BLD.figSheet;defaultWeapons(e,c);figInit(c,e);BLD.fig=keepF;BLD.figSheet=keepS;
 const Wn=weaponsOf(e).filter(w=>(c.wq[w.name]||0)>0).map(w=>{const x=Object.assign({},w);delete x.en;return x});
 const n={ref:m.ref,size:c.size,pts:0,subs:[],man:1};SH.forEach(f=>{n[f]=clone(m[f])});n.weapons=Wn;n.equip=eqLines(c).join(" ; ")||"";n.cfg={lib:lib.id,size:c.size,wq:c.wq,wn:c.wn,wg:c.wg,figs:c.figs||null,enh:null,manual:0,eq:eqLines(c)};return n}
function nextName(L){const base=String(L.name||"Liste").replace(/ — variante \d+$/,"");const n=(S.lists||[]).filter(x=>x.varOf===L.id||(String(x.name||"").indexOf(base+" — variante")===0)).length+1;return base+" — variante "+n}
function applyRec(L,rec){const V=clone(L);V.id="l"+Date.now()+Math.floor(Math.random()*1000);V.varOf=L.varOf||L.id;V.name=nextName(L);V.optLog=(L.optLog||[]).concat([{at:Date.now(),t:rec.title,cost:rec.cost,before:rec.before.glob,after:rec.after.glob,conf:rec.conf}]);
 const a=rec.apply;
 if(a.op==="equip"){const u=V.units[a.i],e=catEntries().find(x=>x.colls.some(m=>m.ref===u.ref))||catEntries().find(x=>x.key==="u:"+u.cfg.lib);const c={key:e.key,idx:a.i,size:u.cfg.size,figs:clone(a.figs),wq:{},wn:clone(u.cfg.wn||{}),wg:clone(u.cfg.wg||{}),enh:u.cfg.enh||null,subs:u.subs||[],manual:u.cfg.manual||0};
  figSync(c,e);const Wn=weaponsOf(e).filter(w=>(c.wq[w.name]||0)>0).map(w=>{const x=Object.assign({},w);delete x.en;return x});
  if(Wn.length)u.weapons=Wn;u.equip=eqLines(c).join(" ; ")||u.equip;u.cfg=Object.assign({},u.cfg,{wq:c.wq,figs:c.figs,eq:eqLines(c)});if(a.wg&&Object.keys(a.wg).length){const w=Object.assign({},u.cfg.wg||{});Object.keys(a.wg).forEach(k=>{w[k]=(w[k]||0)+a.wg[k]});u.cfg.wg=w}}
 else{const lib=D.byId[a.lib],nu=createUnit(lib,a.size);if(!nu)return null;if(a.op==="add")V.units.push(nu);else V.units[a.i]=nu}
 try{applyPts(V)}catch(_){}try{syncPts(V)}catch(_){}S.lists.push(V);try{save()}catch(_){}return V}
/* ---------- outils de test (génèrent des listes réelles à partir de la bibliothèque) ---------- */
function mkList(fac,limit,name){const fl=facList().find(x=>x[0]===fac),l={id:"l"+Date.now()+Math.floor(Math.random()*9999),name:name||"Test "+fac,units:[],dets:[],strats:[],total:"",bld:{fac,facN:fl?fl[1]:fac,fmt:"",limit,pv:ptsVer(),tot:0}};S.lists.push(l);return l}
function fillList(L,seed){const fac=L.bld.fac,lim=L.bld.limit;let r=(seed||1)*9301;const rnd=()=>(r=(r*9301+49297)%233280)/233280;
 const us=D.units.filter(u=>inFac(u,fac)&&!/\[(Legends|Crucible)\]/i.test(u.n)&&sizesOf(u,1).length).sort(()=>rnd()-.5);let tries=0;
 for(const u of us){if(tries++>120)break;const sz=sizesOf(u,1)[0];if(!sz||sz.pts==null)continue;const R=calc(L);if(lim&&R.total+sz.pts>lim)continue;const nu=createUnit(u,sz.n);if(!nu)continue;
  const before=new Set(lckBadOf(L,L.units).map(x=>x.k));L.units.push(nu);applyPts(L);const bad=lckBadOf(L,L.units).filter(x=>!before.has(x.k));if(bad.length)L.units.pop()}
 applyPts(L);return L}
window.BIBAST={analyse,recommend,applyRec,legalOf,IKEYS,PROB,WHYS,T:AST,facKeyOf,benchFor:k=>T.bench(k),test:{allUnits:()=>D.units,dedupe:()=>dedupeAll(),dbg:(lib,size)=>{const e=catEntries().find(x=>x.key==="u:"+lib.id);const fg=T.figsOf(lib,size);return{tot:Object.keys(fg.tot),groups:wgroups(weaponsOf(e)).map(g=>g.name+" => "+lckBase(g.name)),items:fg.v.final.map(f=>f.map(x=>x.n))}},libById:id=>D.byId[id],byName:n=>D.units.find(u=>u.n===n),mkList,fillList,createUnit,facs:()=>[...new Set(D.units.map(u=>u._c))],calc,bad:lckBadOf,applyPts,units:()=>D.units.length}};
})();
