#!/usr/bin/env node
/* Lit les exports CSV de Wahapedia (V11, « powered by Wahapedia ») et produit des restrictions d'équipement structurées.
   Usage : node build-wahapedia.js <dossier des CSV> . Aucune IA : mêmes règles de lecture que pour les PDF. */
const fs=require("fs"),path=require("path"),P=require("./eq-pdf.js");
const dir=process.argv[2]||".";
function csv(f){const t=fs.readFileSync(path.join(dir,f),"utf8").replace(/^﻿/,"");const rows=[];let cur=[],val="",i=0;
 for(;i<t.length;i++){const c=t[i];if(c==="|"){cur.push(val);val=""}else if(c==="\n"){cur.push(val);val="";rows.push(cur);cur=[]}else if(c!=="\r")val+=c}
 if(val||cur.length){cur.push(val);rows.push(cur)}const h=rows[0].filter((x,j)=>x!==""||j<rows[0].length-1);return rows.slice(1).filter(r=>r.length>=h.length).map(r=>Object.fromEntries(h.map((k,j)=>[k,r[j]])))}
const txt=s=>String(s||"").replace(/<br\s*\/?>/gi," ").replace(/<ul[^>]*>/gi," | ").replace(/<\/li>\s*<li>/gi," | ").replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/&nbsp;/g," ").replace(/&#?\w+;/g," ").replace(/\s+/g," ").trim();
const fac=Object.fromEntries(csv("Factions.csv").map(r=>[r.id,r.name])),src=Object.fromEntries(csv("Source.csv").map(r=>[r.id,r]));
const D=csv("Datasheets.csv"),O=csv("Datasheets_options.csv"),C=csv("Datasheets_unit_composition.csv"),upd=csv("Last_update.csv")[0].last_update;
const by=(a)=>{const m={};a.forEach(r=>(m[r.datasheet_id]=m[r.datasheet_id]||[]).push(r));return m};
const O2=by(O),C2=by(C);const units={},sources={};let n=0,withOpt=0,unk=0,none=0;
D.forEach(d=>{const s=src[d.source_id];if(!s||s.edition!=="11"||d.virtual==="true")return;if(!d.name)return;
 const rules=[];let x=0,isNone=false;(O2[d.id]||[]).sort((a,b)=>+a.line-+b.line).forEach(o=>{const t=txt(o.description);const[r,u]=P.parseItem(t);if(r==="none")isNone=true;else if(r)r.forEach(z=>rules.push(z));else if(u)x++});
 const comp=[];(C2[d.id]||[]).forEach(c=>{const t=txt(c.description),m=/^(\d+)(?:\s*[-–]\s*(\d+))?\s+/.exec(t);if(m)comp.push([+m[1],+(m[2]||m[1])])});
 const lo=txt(d.loadout).replace(/^Every model is equipped with:?/i,"").replace(/^[^:]*equipped with:?/i,"");const def=[...new Set(lo.split(/\s*;\s*/).map(z=>z.trim().replace(/^\d+\s+/,"").replace(/\.$/,"").trim().toLowerCase()).filter(z=>z&&z.length<=60))];
 P.fixRules(rules,def);const w=new Set(def);rules.forEach(r=>(r.from||[]).concat(r.to||[]).forEach(z=>w.add(String(z).toLowerCase())));
 const key=P.nk(d.name);if(units[key]&&units[key].comp&&units[key].comp.length&&!comp.length)return;
 const sid="wp"+d.source_id;sources[sid]=sources[sid]||{file:sid,doc:"Wahapedia V11 — "+s.name+" (v"+s.version+")",date:(s.errata_date||"").slice(0,10)};
 units[key]={n:d.name,fac:fac[d.faction_id]||"",doc:sid,st:"sec",none:isNone||!(O2[d.id]||[]).length,x,opt:rules,comp:comp.slice(0,4),def,w:[...w]};
 n++;if(rules.length)withOpt++;unk+=x;if(units[key].none)none++});
const out={meta:{ver:"V11",credit:"powered by Wahapedia",updated:upd,sources:Object.values(sources)},units};
const js=JSON.stringify(out);fs.mkdirSync(path.join(__dirname,"data"),{recursive:true});
fs.writeFileSync(path.join(__dirname,"data","eq-wahapedia.json"),js);fs.writeFileSync(path.join(__dirname,"data","eq-wp.js"),"window.EQ_WP="+js+";\n");
console.log(n,"fiches V11,",withOpt,"avec options lues,",none,"sans option,",unk,"phrases non lues,",Math.round(js.length/1024),"Ko, export du",upd);
