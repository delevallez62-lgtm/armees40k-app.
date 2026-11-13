/* ===== HAMMER · Suivi des dégâts et statistiques de parties — moteur (sans interface, hors ligne) =====
   Les dégâts enregistrés sont des RÉSULTATS RÉELS saisis par le joueur ; ils ne sont jamais mélangés
   aux estimations du simulateur (ANA). */
(function(root){
"use strict";
const nk=s=>String(s==null?"":s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[’']/g,"'").replace(/[^a-z0-9' ]+/g," ").replace(/\s+/g," ").trim();
const hsh=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h.toString(36)};
const VER="V11";

/* ---------- identifiants stables d'unités ---------- */
function equipSig(u){return String(u.equip||"").split(",").map(x=>nk(x.replace(/\(\d+\)/g,""))).filter(Boolean).sort().join("+")}
function weaponsSig(u){return(u.weapons||[]).map(w=>[nk(w.name),w.range,w.a,w.hit,w.f,w.pa,w.d,nk(w.caps)].join(":")).sort().join(";")}
function statsSig(u){const s=u.stats||{};return[s.E,s.SV,s.PV].map(x=>String(x==null?"":x)).join("/")}
/* faction : première faction déclarée (mot-clé de faction) */
function facOfUnit(u){return String(u.fkw||u.fac||"").split(",")[0].trim()}
/* unit : fiche importée ; renvoie {uid, name, fac, label, parts}. Pour une unité saisie à la main : {man:true,n,f} */
function uidOf(unit,opts){opts=opts||{};
 if(unit&&unit.man){const fac=nk(unit.f||""),name=nk(unit.n||"");return{uid:"m_"+hsh(fac+"|"+name),name:String(unit.n||"?"),fac:String(unit.f||""),man:true,parts:{fac,name}}}
 const fac=nk(opts.fac||facOfUnit(unit)),name=nk(unit.name),eq=equipSig(unit),st=statsSig(unit),wp=hsh(weaponsSig(unit)),ver=opts.ver||VER;
 const key=[fac,name,eq,st,wp,ver].join("|");
 return{uid:"u_"+hsh(key),name:String(unit.name||"?"),fac:String(opts.fac||facOfUnit(unit)),man:false,parts:{fac,name,eq,st,wp,ver}}}

/* ---------- statistiques de dégâts réels ---------- */
/* rec : [{id,gid,d,rd,ty,a:{uid,n,f,pts},b:{uid,n,f},v,k}] ; v = dégâts (PV), k = figurines éliminées (facultatif) */
const num=x=>{const v=parseFloat(x);return Number.isFinite(v)?v:null};
function aggregate(list){const n=list.length,tot=list.reduce((a,r)=>a+(num(r.v)||0),0),ks=list.filter(r=>num(r.k)!=null),kt=ks.reduce((a,r)=>a+num(r.k),0),games=new Set(list.map(r=>r.gid||"-")).size;
 const vs=list.map(r=>num(r.v)||0);return{n,games,total:tot,mean:n?tot/n:null,min:n?Math.min(...vs):null,max:n?Math.max(...vs):null,killsTracked:ks.length,killsTotal:kt,killsMean:ks.length?kt/ks.length:null}}
function byGame(list){const m={};list.forEach(r=>{const k=r.gid||("d"+r.d);const o=m[k]||(m[k]={gid:r.gid||"",d:r.d,sum:0,n:0,kills:0,kn:0});o.sum+=num(r.v)||0;o.n++;if(num(r.k)!=null){o.kills+=num(r.k);o.kn++}if(r.d<o.d)o.d=r.d});
 return Object.values(m).sort((a,b)=>a.d-b.d)}
/* tendance : moyenne par partie, 2e moitié contre 1re moitié */
function trendOf(series){if(series.length<2)return{delta:null,first:null,last:null,dir:0};const h=Math.floor(series.length/2),a=series.slice(0,h||1),b=series.slice(h||1),ma=a.reduce((x,y)=>x+y,0)/a.length,mb=b.reduce((x,y)=>x+y,0)/b.length;
 return{first:ma,last:mb,delta:mb-ma,dir:Math.abs(mb-ma)<1e-9?0:(mb>ma?1:-1)}}
function matchup(rec,aUid,bUid){const list=rec.filter(r=>r.a&&r.b&&r.a.uid===aUid&&r.b.uid===bUid),ag=aggregate(list),bg=byGame(list);
 return{...ag,byGame:bg,trend:trendOf(bg.map(g=>g.sum)),last:list.slice().sort((x,y)=>y.d-x.d).slice(0,5),byType:byType(list)}}
function byType(list){const o={};list.forEach(r=>{const k=r.ty||"autre";const x=o[k]||(o[k]={n:0,total:0});x.n++;x.total+=num(r.v)||0});Object.values(o).forEach(x=>x.mean=x.n?x.total/x.n:null);return o}
const keyFac=r=>nk(r.b&&r.b.f)||"?";
function unitProfile(rec,uid){const list=rec.filter(r=>r.a&&r.a.uid===uid),ag=aggregate(list);
 const grp=(f)=>{const m={};list.forEach(r=>{const k=f(r);(m[k.k]||(m[k.k]={k:k.k,name:k.name,fac:k.fac,list:[]})).list.push(r)});return Object.values(m).map(g=>({k:g.k,name:g.name,fac:g.fac,...aggregate(g.list)})).sort((a,b)=>b.mean-a.mean)};
 const pts=list.length?num(list[list.length-1].a.pts):null,perGame=byGame(list);
 return{...ag,pts,perPoint:pts&&ag.games?ag.total/ag.games/pts:null,perGame,trend:trendOf(perGame.map(g=>g.sum)),byTarget:grp(r=>({k:r.b.uid,name:r.b.n,fac:r.b.f})),byFaction:grp(r=>({k:keyFac(r),name:r.b.f||"Non renseignée",fac:r.b.f})),byType:byType(list)}}
/* classement de toutes les unités ayant des données */
function ranking(rec,filter){filter=filter||{};let list=rec.filter(r=>r.a&&r.a.uid);if(filter.fac)list=list.filter(r=>keyFac(r)===nk(filter.fac));if(filter.from)list=list.filter(r=>r.d>=filter.from);
 const m={};list.forEach(r=>{(m[r.a.uid]||(m[r.a.uid]={uid:r.a.uid,name:r.a.n,fac:r.a.f,pts:null,list:[]})).list.push(r);if(num(r.a.pts))m[r.a.uid].pts=num(r.a.pts)});
 return Object.values(m).map(x=>{const g=aggregate(x.list),pg=byGame(x.list);return{uid:x.uid,name:x.name,fac:x.fac,pts:x.pts,...g,perGame:g.games?g.total/g.games:null,perPoint:x.pts&&g.games?g.total/g.games/x.pts:null}}).sort((a,b)=>b.mean-a.mean)}
/* comparaison de plusieurs unités (mêmes filtres) : une ligne par unité */
function compare(rec,uids,filter){const r=ranking(rec,filter);return uids.map(u=>r.find(x=>x.uid===u)).filter(Boolean)}
/* efficacité contre une faction : classement des unités selon la faction cible */
function bestAgainst(rec,fac){return ranking(rec,{fac}).filter(x=>x.n>0)}
/* matchups : meilleurs et moins bons */
function matchupsTable(rec){const m={};rec.forEach(r=>{if(!(r.a&&r.b))return;const k=r.a.uid+">"+r.b.uid;(m[k]||(m[k]={a:r.a,b:r.b,list:[]})).list.push(r)});
 return Object.values(m).map(x=>({a:x.a.n,af:x.a.f,b:x.b.n,bf:x.b.f,auid:x.a.uid,buid:x.b.uid,...aggregate(x.list)})).sort((x,y)=>y.mean-x.mean)}

/* ---------- résultats de parties ---------- */
const resOf=(s1,s2)=>s1>s2?"V":s1<s2?"D":"E";
/* normalise : parties terminées de l'appli + saisies manuelles (sans doublon) ; J1 = moi */
function results(games,ash,meta){meta=meta||{};const out=[],have=new Set();
 (games||[]).forEach(g=>{if(!g||g.fin===false||!g.tot)return;const s1=num(g.tot[0]),s2=num(g.tot[1]);if(s1==null||s2==null)return;
  const m=meta[g.id]||{},manual=(ash||[]).find(x=>x.src===g.id);have.add(g.id);
  out.push({id:g.id,d:g.d,f1:(g.f&&g.f[0])||(manual&&manual.f1)||"",f2:(g.f&&g.f[1])||(manual&&manual.f2)||"",d1:(g.p&&g.p[0]&&g.p[0].det)||(manual&&manual.d1)||"",d2:(g.p&&g.p[1]&&g.p[1].det)||(manual&&manual.d2)||"",
   s1,s2,res:resOf(s1,s2),first:m.first||(manual&&manual.first)||0,src:"app"})});
 (ash||[]).forEach(x=>{if(x.src&&have.has(x.src))return;const s1=num(x.s1),s2=num(x.s2);if(s1==null||s2==null)return;out.push({id:x.id,d:typeof x.d==="string"?Date.parse(x.d):x.d,f1:x.f1||"",f2:x.f2||"",d1:x.d1||"",d2:x.d2||"",s1,s2,res:resOf(s1,s2),first:+x.first||0,src:"manuel"})});
 return out.sort((a,b)=>a.d-b.d)}
function filterResults(rs,f){f=f||{};return rs.filter(r=>(!f.fac||nk(r.f2)===nk(f.fac))&&(!f.det||nk(r.d1)===nk(f.det))&&(!f.from||r.d>=f.from)&&(!f.to||r.d<=f.to))}
/* pourcentages entiers dont la somme vaut exactement 100 (méthode du plus fort reste) */
function pct3(V,D,E){const n=V+D+E;if(!n)return{V:0,D:0,E:0,n:0};const raw=[V,D,E].map(x=>x/n*100),fl=raw.map(Math.floor);let rest=100-fl.reduce((a,b)=>a+b,0);
 raw.map((x,i)=>({i,r:x-fl[i]})).sort((a,b)=>b.r-a.r).forEach(o=>{if(rest>0){fl[o.i]++;rest--}});return{V:fl[0],D:fl[1],E:fl[2],n}}
function tally(rs){const c={V:0,D:0,E:0};rs.forEach(r=>c[r.res]++);const n=rs.length;return{n,V:c.V,D:c.D,E:c.E,win:n?c.V/n*100:null,loss:n?c.D/n*100:null,draw:n?c.E/n*100:null,round:pct3(c.V,c.D,c.E),avg1:n?rs.reduce((a,r)=>a+r.s1,0)/n:null,avg2:n?rs.reduce((a,r)=>a+r.s2,0)/n:null}}
function groupBy(rs,key){const m={};rs.forEach(r=>{const k=key(r)||"Non renseigné";(m[k]||(m[k]=[])).push(r)});return Object.entries(m).map(([k,l])=>({k,...tally(l)})).sort((a,b)=>b.n-a.n)}
/* évolution : taux de victoire cumulé après chaque partie, et mois par mois */
function evolution(rs){let v=0;const cum=rs.map((r,i)=>{if(r.res==="V")v++;return{i:i+1,d:r.d,win:v/(i+1)*100,res:r.res}});
 const mo={};rs.forEach(r=>{const dt=new Date(r.d),k=dt.getFullYear()+"-"+String(dt.getMonth()+1).padStart(2,"0");(mo[k]||(mo[k]=[])).push(r)});
 const months=Object.keys(mo).sort().map(k=>({k,...tally(mo[k])}));
 const h=Math.floor(rs.length/2),a=tally(rs.slice(0,h||1)),b=tally(rs.slice(h||1));
 return{cum,months,trend:rs.length>=4?{first:a.win,last:b.win,delta:b.win-a.win}:null}}
function resultStats(games,ash,meta,filter){const all=results(games,ash,meta),rs=filterResults(all,filter);const t=tally(rs);
 return{...t,all:all.length,results:rs,byFaction:groupBy(rs,r=>r.f1),byOpponent:groupBy(rs,r=>r.f2),byDetachment:groupBy(rs,r=>r.d1),byFirst:groupBy(rs,r=>r.first===1?"Je commence":r.first===2?"L'adversaire commence":"Non renseigné"),evolution:evolution(rs)}}
/* dégâts moyens infligés par partie (par moi, J1) sur les parties filtrées */
function damagePerGame(rec,rs,mine){const ids=new Set(rs.map(r=>r.id));const per={};rec.forEach(r=>{if(!r.gid||!ids.has(r.gid))return;if(mine&&!mine(r))return;per[r.gid]=(per[r.gid]||0)+(num(r.v)||0)});
 const v=Object.values(per);return{games:v.length,total:v.reduce((a,b)=>a+b,0),mean:v.length?v.reduce((a,b)=>a+b,0)/v.length:null,perGame:per}}
function periodFrom(code,now){now=now||Date.now();const d=86400000;return code==="30"?now-30*d:code==="90"?now-90*d:code==="365"?now-365*d:0}

root.TRK={VER,nk,hsh,uidOf,facOfUnit,aggregate,byGame,trendOf,matchup,unitProfile,ranking,compare,bestAgainst,matchupsTable,results,filterResults,pct3,tally,groupBy,evolution,resultStats,damagePerGame,periodFrom,resOf};
if(typeof module!=="undefined")module.exports=root.TRK;
})(typeof window!=="undefined"?window:globalThis);
