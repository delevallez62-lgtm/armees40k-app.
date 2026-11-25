/* ===== HAMMER · Assistant d'optimisation — moteur (hors ligne, sans IA) =====
   Inséré dans le module Bibliothèque : il réutilise ANA (calculs), EQE (équipements), listcheck (légalité), calc/costOf (points).
   Principe : chaque score est une COMPARAISON À LA MÉDIANE DE LA FACTION (50 = médiane des unités de la bibliothèque de cette faction).
   Aucune valeur inventée : sans données suffisantes le moteur répond « données insuffisantes ». */
const AST=(()=>{
const A=window.ANA;
const CTX={half:false,cover:false,charged:false,still:false};
const REFT={char:{n:1,E:10,SV:"3+",PV:12,kw:"vehicule, monstre"},inf:{n:10,E:4,SV:"3+",PV:2,kw:"infanterie"}};
const REFW={F:8,PA:-2,D:2,hit:3};            /* arme de référence pour la résistance : F 8, PA -2, D 2, touche 3+ */
const W={ac:.2,ai:.2,res:.2,mob:.1,obj:.2,syn:.1};
const NAMES={ac:"Anti-char",ai:"Anti-infanterie",res:"Résistance",mob:"Mobilité",obj:"Objectifs",syn:"Synergies"};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const med=a=>{a=a.filter(x=>Number.isFinite(x)).sort((x,y)=>x-y);if(!a.length)return null;const m=a.length>>1;return a.length%2?a[m]:(a[m-1]+a[m])/2};
const num=x=>{const m=/-?\d+(\.\d+)?/.exec(String(x==null?"":x));return m?+m[0]:null};
const san=s=>String(s||"").replace(/,/g," ");
/* ---- cibles de référence ---- */
const TG={};const target=k=>TG[k]||(TG[k]=A.toProfile({name:"Cible "+k,size:REFT[k].n,stats:{M:'6"',E:String(REFT[k].E),SV:REFT[k].SV,PV:String(REFT[k].PV),CD:"7+",CO:"1"},kw:REFT[k].kw,weapons:[],equip:""}));
function dmgVs(P,k){let t=0;try{const T=target(k);["shoot","melee"].forEach(m=>{const r=A.theory(P,T,m,CTX);if(r&&Number.isFinite(r.eff))t+=r.eff})}catch(_){return null}return t}
/* durée de vie : nombre d'attaques de référence nécessaires pour détruire l'unité (plus c'est grand, plus elle est résistante) */
function endur(P){try{const g=P.groups.filter(x=>!x.isLeader).reduce((b,x)=>(!b||x.n>b.n)?x:b,null)||P.groups[0];const E=g.stats.E,sv=g.stats.SV,inv=g.stats.INV;if(E==null)return null;
 const wp=A.woundProbs({ct:REFW.hit,hitMod:0,woundMod:0,anti:null,sustained:0,fatal:false,deva:false,torrent:false,reroll:false},REFW.F,E),pw=wp.pc+wp.pn;
 const pf=A.saveFailProb(g.stats.SV,g.stats.INV!=null?g.stats.INV:null,REFW.PA);const pHit=(7-REFW.hit)/6;const per=pHit*pw*pf*REFW.D;if(!(per>0))return null;
 return A.totalWounds(P)/per}catch(_){return null}}
/* ---- profils ---- */
function equipOf(u){/* force les quantités d'armes depuis la configuration (le texte « 4 × arme » n'est pas lu par ANA) */
 const wq=u.cfg&&u.cfg.wq;if(!wq||!Object.keys(wq).length)return u;const names=new Set((u.weapons||[]).map(w=>w.name));
 const o=Object.assign({},u);o.weapons=(u.weapons||[]).filter(w=>wq[w.name]>0).map(w=>Object.assign({},w,{name:san(w.name)}));
 o.equip=Object.entries(wq).filter(([n,q])=>q>0&&names.has(n)).map(([n,q])=>san(n)+" ("+q+")").join(", ");return o}
function profOfListUnit(u){const x=equipOf(u);return A.toProfile(x)}
function unitMetrics(P,lib){const dc=dmgVs(P,"char"),di=dmgVs(P,"inf"),en=endur(P);const g=P.groups[0];
 return{dc,di,en,M:num(g&&g.stats&&g.stats.M),oc:P.groups.reduce((a,x)=>a+x.n*(num(x.stats&&x.stats.CO)||0),0),models:P.models,role:lib?(typeof roleOf==="function"?roleOf(lib):""):"",ok:dc!=null&&di!=null&&en!=null&&g&&g.stats&&g.stats.E!=null}}
/* ---- bibliothèque : pseudo-unité depuis une fiche, avec équipement de base ---- */
function figsOf(lib,size,figs){const M=EQE.model(lib);if(!M||!M.usable||!EQE.counts(M,size))return null;const f=figs||EQE.newFigs(M,size);if(!f)return null;const v=EQE.validate(M,size,f);return{M,figs:f,v,tot:EQE.totals(v.final)}}
function pseudo(lib,size,tot,pts){const pr=lib.pr||[],pi=Math.max(0,pr.findIndex(p=>nk(p.n)===nk(lib.n))),p=profOf(lib,pi),stats={};["M","E","SV","PV","CD","CO"].forEach(k=>{stats[k]=statOf(p,k)||""});
 const ws=[],eq=[];[...(lib.rw||[]).map(w=>[w,false]),...(lib.mw||[]).map(w=>[w,true])].forEach(([w,m])=>{const k=lckBase(String(w.n).replace(/^➤\s*/,"")),t=tot?tot[k]:null;if(tot&&!(t&&t.q>0))return;const a=wToApp(w,m);a.name=san(a.name);ws.push(a);eq.push(a.name+" ("+(t?t.q:1)+")")});
 return{name:frName(lib.n),size,pts:pts==null?0:pts,stats,weapons:ws,equip:eq.join(", "),kw:(lib.kw||[]).map(k=>tKW(k).t).join(", "),fkw:(lib.f||[]).join(", "),subs:[],apt:""}}
/* ---- bancs d'essai par faction (médianes de la bibliothèque) ---- */
const BENCH={};
function minSize(lib,copy){const s=sizesOf(lib,copy||1);return s.length?s[0]:null}
function libMetric(lib){const sz=minSize(lib,1);if(!sz||sz.pts==null)return null;const fg=figsOf(lib,sz.n);if(!fg)return null;const U=pseudo(lib,sz.n,fg.tot,sz.pts);let P;try{P=A.toProfile(U)}catch(_){return null}const m=unitMetrics(P,lib);if(!m.ok)return null;return Object.assign(m,{lib,pts:sz.pts,size:sz.n,P,eqOk:fg.v.errors.length===0})}
function bench(facKey){if(BENCH[facKey])return BENCH[facKey];const us=D.units.filter(u=>inFac(u,facKey)&&!/\[(Legends|Crucible)\]/i.test(u.n));const ms=[];us.forEach(u=>{const m=libMetric(u);if(m&&m.pts>0)ms.push(m)});
 const b={n:ms.length,ms,dc:med(ms.map(m=>m.dc/m.pts)),di:med(ms.map(m=>m.di/m.pts)),en:med(ms.map(m=>m.en/m.pts)),M:med(ms.map(m=>m.M)),oc:med(ms.map(m=>m.oc/m.pts))};return BENCH[facKey]=b}
/* ---- indicateurs d'une liste à partir des métriques d'unités ---- */
function indicators(rows,B,syn){const pts=rows.reduce((a,r)=>a+(r.pts||0),0);if(!pts)return null;const S=k=>rows.reduce((a,r)=>a+(r.m[k]||0),0);
 const sc=(v,ref)=>ref>0&&v!=null?clamp(Math.round(50*v/ref),0,100):null;
 const mob=rows.reduce((a,r)=>a+(r.m.M||0)*r.pts,0)/pts;
 const ind={ac:sc(S("dc")/pts,B.dc),ai:sc(S("di")/pts,B.di),res:sc(S("en")/pts,B.en),mob:sc(mob,B.M),obj:sc(S("oc")/pts,B.oc),syn:syn==null?null:clamp(Math.round(syn),0,100)};
 let wt=0,s=0;Object.keys(W).forEach(k=>{if(ind[k]!=null){wt+=W[k];s+=W[k]*ind[k]}});ind.glob=wt?Math.round(s/wt):null;return{ind,pts,raw:{dc:S("dc"),di:S("di"),en:S("en"),mob,oc:S("oc")}}}
/* synergies : part des unités de ligne ayant un personnage compatible présent dans la liste (analyse partielle) */
function synergy(L,libs){const ch=[],un=[];libs.forEach((x,i)=>{if(!x||!x.lib)return;(isChar(x.lib)?ch:un).push(x)});if(!un.length)return null;if(!ch.length)return 0;
 const leads=new Set();ch.forEach(c=>{((c.lib.wp&&c.lib.wp.leads)||[]).forEach(n=>leads.add(nk(n)));});const ok=un.filter(u=>leads.has(nk(u.lib.n))||((u.lib.wp&&u.lib.wp.ledby)||[]).some(n=>ch.some(c=>nk(c.lib.n)===nk(n)))).length;return 100*ok/un.length}
return{CTX,REFT,REFW,W,NAMES,clamp,med,num,san,target,dmgVs,endur,equipOf,profOfListUnit,unitMetrics,figsOf,pseudo,bench,libMetric,minSize,indicators,synergy}
})();
