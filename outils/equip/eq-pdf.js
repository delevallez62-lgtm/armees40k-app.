/* ===== HAMMER · Lecture des fiches d'unité officielles (PDF anglais ou français) ===== */
(function(root){
"use strict";
const nk=s=>String(s==null?"":s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const NUMW={un:1,une:1,one:1,deux:2,two:2,trois:3,three:3,quatre:4,four:4,cinq:5,five:5,six:6,seven:7,eight:8,nine:9,ten:10};
const num=s=>{s=String(s||"").toLowerCase().trim();return NUMW[s]!=null?NUMW[s]:(/^\d+$/.test(s)?+s:null)};
const q=s=>String(s||"").replace(/[’‘`]/g,"'").replace(/[­\u0000-\u0008\u000b-\u001f]/g,"").replace(/\s+/g," ").trim();
const title=s=>String(s||"").toLowerCase().replace(/(^|[\s(\-])(\p{L})/gu,(m,a,b)=>a+b.toUpperCase());
const HDR_COMP=/^(UNIT COMPOSITION|COMPOSITION D'UNITÉ)$/i,HDR_OPT=/^(WARGEAR OPTIONS|OPTIONS D'ÉQUIPEMENT)$/i,STOP=/^(FACTION )?(KEYWORDS|MOTS-CLÉS)/i;
function clean(s){s=q(s).replace(/■/g," ").replace(/\([^)]*\)/g," ").replace(/\s+/g," ");s=s.replace(/^(?:\d+|an?|the|one|un|une)\s+/i,"").replace(/^(?:its|their|his|her|this model's|son|sa|ses|leur|leurs|le|la|les|l'|du|de la|des|d')\s*/i,"");return s.replace(/^\d+\s+/,"").replace(/[.;*\s]+$/,"").trim()}
function alts(s){s=q(s).replace(/\.$/,"");const ch=/^(?:\d+|one|un) (?:of the following|des choix suivants)\s*:?\s*/i.test(s)||/\|/.test(s)&&/(?:of the following|choix suivants)/i.test(s);
 const body=s.replace(/^.*?(?:of the following|des choix suivants)\s*:?\s*/i,"");const parts=body.replace(/^\|\s*/,"").split(/\s*\|\s*|,\s*(?=\d+\s)/).map(x=>x.split(/\s+and\s+|\s+et\s+/i).map(clean).filter(Boolean)).filter(a=>a.length);
 return ch&&parts.length>1?parts:null}
function tos(s){s=q(s).replace(/\.$/,"").replace(/^(?:\d+|one) of the following\s*:?\s*/i,"").replace(/^\d+ des choix suivants\s*:?\s*/i,"");
 return s.replace(/^\|\s*/,"").split(/\s*\|\s*|,\s*(?=\d+\s)|\s*;\s*|\s+and\s+(?=\d+\s|an?\s)|\s+et\s+(?=\d+\s|une?\s)|\s+or\s+(?=\d+\s)|\s+ou\s+(?=\d+\s)/i).map(clean).filter(Boolean)}
const NS="(\\d+|one|two|three|four|five|six|un|une|deux|trois|quatre|cinq)";
function build(rest,who,n,per,role){
 let m=/^replace (?:its|their|his|her)?\s*(.+?) with (.+)$/i.exec(rest)||/^remplacer (?:leur|leurs|son|sa|ses)?\s*(.+?) par (.+)$/i.exec(rest);
 if(m)return[{t:"repl",who,role:role||undefined,from:m[1].split(/\s+or\s+|\s+ou\s+|\s+and\s+|\s+et\s+/i).map(clean).filter(Boolean),to:tos(m[2]),alt:alts(m[2])||undefined,n:n||undefined,per:per||undefined}];
 m=/^(?:each\s+)?have (?:their|its|his|her)\s+(.+?) (?:be )?replaced with (.+)$/i.exec(rest);
 if(m)return[{t:"repl",who,role:role||undefined,from:m[1].split(/\s+or\s+|\s+and\s+/i).map(clean).filter(Boolean),to:tos(m[2]),alt:alts(m[2])||undefined,n:n||undefined,per:per||undefined}];
 m=/^(?:be equipped with|have|être équipée?s?\s+(?:de|d')|avoir)\s*(.+)$/i.exec(rest);
 if(m)return[{t:"add",who,role:role||undefined,to:tos(m[1]),n:n||undefined,per:per||undefined}];
 return null}
const BAD=/\b(can|replace|replaced|following|models?|unit|units|this|that|your|leader|attached|ability)\b/i;
const okNames=r=>(r.from||[]).concat(r.to||[]).every(x=>x&&x.length<=48&&!BAD.test(x));
function parseItem(t0){const[r,u]=parseItem0(t0);if(r&&r!=="none"){const g=r.filter(okNames);return g.length===r.length?[r,null]:[null,q(t0).slice(0,140)]}return[r,u]}
function parseItem0(t0){let t=q(t0).replace(/\*/g,"");if(!t)return[null,null];
 if(/^(none|aucune?)\b/i.test(t))return["none",null];
 t=t.replace(/\s*◦\s*/g," | ");t=t.replace(/^If this unit contains \d+ models?\s*:\s*/i,"").replace(/^Si cette unité contient \d+ figurines?\s*:\s*/i,"");
 t=t.split(/\s(?:ATTACHED UNIT|UNITÉ ATTACHÉE|ORDERS|ORDRES|OTHER OPTIONS|AUTRES OPTIONS)\b/)[0].trim();
 let per=null,m=/^(?:For every|Par tranche de) (\d+) (?:models?|figurines?)(?: in (?:this|the) unit| dans (?:cette|l')unité| de cette unité)?,\s*(.*)$/i.exec(t);if(m){per=+m[1];t=m[2]}
m=/^Any number of (?:[\w' -]+? )?(?:models?|[A-Z][\w' -]*?) can (?:each )?(.+)$/i.exec(t);if(m){const r=build(m[1],"all",null,per,null);if(r)return[r,null]}
 m=new RegExp("^(?:(?:up to|jusqu'à)\\s+)?"+NS+"\\s+([^.|]*?)\\s+(?:can|peuvent|peut)\\s+(?:each\\s+|chacune?\\s+)?(.+)$","i").exec(t);
 if(m&&!/^(this|the|cette)\b/i.test(m[2])&&!/model's/i.test(m[2])){const r=build(m[3],"any",num(m[1]),per,null);if(r)return[r,null]}
 m=/^(?:every|each|all) models?(?: in this unit)? can (?:each )?(.+)$/i.exec(t)||/^Toutes? les figurines de cette unité peuvent chacune (.+)$/i.exec(t)||/^Chaque figurine(?: \([^)]*\))? peut (.+)$/i.exec(t);
 if(m){const r=build(m[1],"all",null,per,null);if(r)return[r,null]}
 m=/^All [\w' -]+? models? in this unit can (?:each )?(.+)$/i.exec(t);if(m){const r=build(m[1],"all",null,per,null);if(r)return[r,null]}
 m=/^This unit can (.+)$/i.exec(t);if(m){const r=build(m[1],"unit",null,per,null);if(r)return[r,null]}
 m=/^This model can (.+)$/i.exec(t)||/^Cette figurine peut (.+)$/i.exec(t);if(m){const r=build(m[1],"role",1,per,"cette figurine");if(r)return[r,null]}
 m=/^This model's (.+?) can (?:be )?replaced with (.+)$/i.exec(t);if(m)return[[{t:"repl",who:"role",role:"cette figurine",from:m[1].split(/\s+and\s+/i).map(clean),to:tos(m[2]),alt:alts(m[2])||undefined,n:1}],null];
 m=/^The ([\w' -]+?)'s (.+?) can be replaced with (.+)$/i.exec(t);if(m)return[[{t:"repl",who:"role",role:m[1].toLowerCase(),from:m[2].split(/\s+and\s+/i).map(clean),to:tos(m[3]),alt:alts(m[3])||undefined,n:1}],null];
 m=/^(?:The|Le|La) ([\w' -]+?) (?:can|peut) (.+)$/i.exec(t);if(m&&!/^(unit|model|army)$/i.test(m[1])){const r=build(m[2],"role",1,per,m[1].toLowerCase());if(r)return[r,null]}
 m=new RegExp("^"+NS+"\\s+([\\w' -]+?)\\s+that is not equipped with (.+?) can be equipped with (.+)$","i").exec(t);
 if(m)return[[{t:"add",who:"any",to:tos(m[4]),n:num(m[1]),not:[clean(m[3])]}],null];
 return[null,t]}
function rejoin(arr,def){if(!arr||arr.length<2||!def||!def.length)return arr;const D=def.map(nk);const out=[];for(let i=0;i<arr.length;i++){let done=false;for(let j=arr.length-1;j>i;j--){const jn=arr.slice(i,j+1).join(" and ");if(D.includes(nk(jn))){out.push(jn);i=j;done=true;break}}if(!done)out.push(arr[i])}return out}
function fixRules(rules,def){rules.forEach(r=>{if(r.from)r.from=rejoin(r.from,def);if(r.to)r.to=rejoin(r.to,def);if(r.alt)r.alt=r.alt.map(a=>rejoin(a,def))});return rules}
function lineText(its){return q(its.slice().sort((a,b)=>a.x-b.x).map(i=>i.s).join(" "))}
function groupLines(its){const L=[];its.slice().sort((a,b)=>b.y-a.y||a.x-b.x).forEach(i=>{const l=L.find(z=>Math.abs(z.y-i.y)<2.2);if(l)l.its.push(i);else L.push({y:i.y,its:[i]})});L.sort((a,b)=>b.y-a.y);return L}
function bullets(lines){const out=[];let cur=null;lines.forEach(l=>{const t=lineText(l.its);if(!t)return;if(/^■/.test(t)){if(cur)out.push(cur);cur=t.replace(/^■\s*/,"")}else if(cur!=null)cur+=" "+t;else cur=t});if(cur)out.push(cur);return out}
function sheetsOfPage(items){const W=items.map(i=>({s:q(i.str),x:i.transform?i.transform[4]:i.x,y:i.transform?i.transform[5]:i.y})).filter(i=>i.s);const sheets=[];
 W.filter(i=>HDR_COMP.test(i.s)).forEach(h=>{const colX=h.x,all=W.filter(i=>i.y<h.y-1.5);
  const stops=W.filter(i=>STOP.test(i.s)&&i.y<h.y-1.5).map(i=>i.y);const yStop=stops.length?Math.max(...stops):-1e9;
  const body=all.filter(i=>i.y>yStop+1);const left=body.filter(i=>i.x<colX-4),right=body.filter(i=>i.x>=colX-4);
  const optH=W.some(i=>HDR_OPT.test(i.s)&&Math.abs(i.y-h.y)<3&&i.x<colX-4);
  /* nom : ligne en majuscules la plus proche au-dessus de l'en-tête */
  let name="";const above=groupLines(W.filter(i=>i.y>h.y+3));
  for(let k=above.length-1;k>=0;k--){const t=lineText(above[k].its).replace(/\s*W\s*A\s*R\s*H\s*A\s*M\s*M\s*E\s*R.*$/i,"").trim();if(t.length>=4&&t===t.toUpperCase()&&/[A-ZÀ-Ý]/.test(t)&&!/WARHAMMER|LEGENDS|KEYWORDS|MOTS-CL/i.test(t)&&!/^(M|T|E|SV|W|PV|LD|CD|OC|CO)(\s|$)/.test(t)){name=t;break}}
  name=name.replace(/\s*W\s*A\s*R\s*H\s*A\s*M\s*M\s*E\s*R.*$/i,"").trim();sheets.push({name,optH,left:groupLines(left),right:groupLines(right)})});
 return sheets}
function parseSheet(sh,page,meta){if(!sh.name)return null;const opts=sh.optH?bullets(sh.left):[];const rules=[],unk=[];let none=false;
 opts.forEach(t=>{const[r,u]=parseItem(t);if(r==="none")none=true;else if(r)r.forEach(x=>rules.push(x));else if(u)unk.push(u.slice(0,140))});
 const comp=[],def=[];bullets(sh.right).forEach(t=>{
  if(/(?:is|are|est|sont) (?:equipped with|équipée?s? de)/i.test(t)||/équipée? de ?:/i.test(t)){const e=t.split(/equipped with\s*:|équipée? de\s*:/i)[1]||"";e.split(/\.\s/)[0].split(/\s*;\s*/).forEach(x=>{x=q(x).replace(/\.$/,"");if(x&&x.length<=60)def.push(x.toLowerCase())});const pre=/^(\d+)(?:\s*-\s*(\d+))?\s+(.+?)\s+(?:Every|Each|This|Chaque|Cette)\b/i.exec(t);if(pre)comp.push([+pre[1],+(pre[2]||pre[1])]);return}
  const m=/^(\d+)(?:\s*[-–]\s*(\d+))?\s+([^:]+)$/.exec(t);if(m&&!/can be attached|peut être attachée/i.test(t))comp.push([+m[1],+(m[2]||m[1])])});
 fixRules(rules,def);const w=new Set(def);rules.forEach(r=>(r.from||[]).concat(r.to||[]).forEach(x=>w.add(String(x).toLowerCase())));
 return{key:nk(sh.name),e:{n:title(sh.name),fac:meta.fac||"",doc:meta.file,p:page,none:none||!sh.optH,x:unk.length,opt:rules,comp:comp.slice(0,4),def:[...new Set(def)],w:[...w]}}}
function parsePages(pages,meta){const units={};pages.forEach((items,i)=>{sheetsOfPage(items).forEach(sh=>{const r=parseSheet(sh,i+1,meta||{});if(r&&!units[r.key])units[r.key]=r.e})});return units}
root.EQPDF={fixRules,parsePages,parseItem,sheetsOfPage,nk};
if(typeof module!=="undefined")module.exports=root.EQPDF;
})(typeof window!=="undefined"?window:globalThis);
