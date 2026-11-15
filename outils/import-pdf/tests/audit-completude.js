// audit de complétude : mots du PDF (items bruts) vs mots conservés par parse()
const fs=require('fs');
const items=JSON.parse(fs.readFileSync('liste-items.json','utf8'));
const r=JSON.parse(fs.readFileSync('liste-parse.json','utf8'));
const tok=s=>String(s||'').normalize('NFC').split(/\s+/).map(x=>x.replace(/^[\s]+|[\s]+$/g,'')).filter(Boolean);
const bag=a=>{const m=new Map();a.forEach(t=>m.set(t,(m.get(t)||0)+1));return m};
const src=[];items.forEach(p=>p.forEach(i=>{if(/armylistnetwork|^©/.test(i.str))return;tok(i.str).forEach(t=>src.push(t))}));
const out=[];const add=o=>{if(o==null)return;if(typeof o==='string'||typeof o==='number')tok(o).forEach(t=>out.push(t));else if(Array.isArray(o))o.forEach(add);else Object.values(o).forEach(add)};
add(r.units);add(r.dets);add(r.strats);add(r.optis);
const A=bag(src),B=bag(out);const miss=[],extra=[];
for(const [t,n] of A){const m=B.get(t)||0;if(m<n)miss.push(t+' ×'+(n-m))}
for(const [t,n] of B){const m=A.get(t)||0;if(m<n)extra.push(t+' ×'+(n-m))}
console.log('mots PDF',src.length,'conservés',out.length);console.log('MANQUANTS',miss.join(' | '));console.log('EN TROP',extra.join(' | '));
