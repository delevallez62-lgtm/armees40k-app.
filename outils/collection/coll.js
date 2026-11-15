/* Armes d'une unité : fiche unique en collection + choix des armes à l'ajout dans une liste (100 % local) */
(function(){
"use strict";
var W=null;
const wk=w=>String(w&&w.name||"").toLowerCase().trim();
// ajoute/actualise les armes de src dans dst, par nom, sans rien retirer
window.mergeW=function(dst,src){
 dst.weapons=Array.isArray(dst.weapons)?dst.weapons:[];
 (src.weapons||[]).forEach(function(w){
  const k=wk(w),i=dst.weapons.findIndex(function(x){return wk(x)===k});
  if(i<0)dst.weapons.push(clone(w));else dst.weapons[i]=clone(w);
 });
};
// ajoute seulement les armes absentes (ne modifie pas les existantes)
window.addMissingW=function(dst,src){
 dst.weapons=Array.isArray(dst.weapons)?dst.weapons:[];
 (src.weapons||[]).forEach(function(w){
  if(!dst.weapons.some(function(x){return wk(x)===wk(w)}))dst.weapons.push(clone(w));
 });
};
// regroupe les anciennes « variantes » et supprime l'ancien système d'équipements
window.mergeSame=function(){
 Object.keys(S).forEach(function(k){if(/^eq[a-z]*$/.test(k))delete S[k]});
 const g={};
 Object.values(S.coll).forEach(function(m){(g[nn(m.name)]=g[nn(m.name)]||[]).push(m)});
 const mp={};
 Object.values(g).forEach(function(a){
  if(a.length<2)return;
  const used=function(m){return S.lists.reduce(function(n,l){return n+l.units.filter(function(u){return u.ref===m.ref}).length},0)};
  const p=a.find(function(m){return m.prim})||a.find(function(m){return !m.var})||a[0];
  a.forEach(function(o){
   if(o===p)return;
   mergeW(p,o);
   if(!S.imgs[p.ref]&&S.imgs[o.ref])S.imgs[p.ref]=S.imgs[o.ref];
   if(!p.fac&&o.fac)p.fac=o.fac;
   if(!(p.nb>0)&&o.nb>0)p.nb=o.nb;
   mp[o.ref]=p.ref;delete S.coll[o.ref];
  });
 });
 const fix=function(u){if(u&&mp[u.ref])u.ref=mp[u.ref];(u&&u.subs||[]).forEach(fix)};
 if(Object.keys(mp).length)S.lists.forEach(function(l){l.units.forEach(fix)});
 Object.values(S.coll).forEach(function(m){["var","vd","prim","mrg","cfgs","eqw"].forEach(function(k){delete m[k]})});
 S.lists.forEach(function(l){l.units.forEach(function(u){delete u.eq;(u.subs||[]).forEach(function(s){delete s.eq})})});
};
// ===== choix des armes =====
const esc2=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
function box(){let b=document.getElementById("wpk");if(!b){b=document.createElement("div");b.id="wpk";document.body.appendChild(b)}return b}
function draw(){
 const b=box();
 if(!W){b.innerHTML="";return}
 const m=S.coll[W.ref];if(!m){W=null;b.innerHTML="";return}
 const n=W.sel.size;
 b.innerHTML='<div class="ov ovd" style="z-index:45" data-act="wpx"><div class="pn dlgp"><div class="top"><h3 style="margin:0 0 8px">Armes de « '+esc2(m.name)+' »</h3><button class="b cx" data-act="wpx" aria-label="Fermer">✕</button></div>'
 +'<p class="mu">Coche les armes que cette unité aura dans la liste. Seules les armes validées seront visibles.</p>'
 +'<div class="wpl">'+m.weapons.map(function(w,i){
   const on=W.sel.has(i),ds=[w.range,w.a?"A "+w.a:"",w.hit,w.f?"F "+w.f:"",w.pa?"PA "+w.pa:"",w.d?"D "+w.d:""].filter(Boolean).join(" · ");
   return'<button type="button" class="wpr'+(on?" on":"")+'" data-act="wpt" data-i="'+i+'"><span class="wpc">'+(on?"✔":"")+'</span><span><b>'+esc2(w.name)+'</b><span class="mu" style="display:block;font-size:12px">'+esc2(ds)+'</span></span></button>'}).join("")+'</div>'
 +'<div class="row" style="margin-top:10px"><button class="b" data-act="wpa">'+(n===m.weapons.length?"Tout décocher":"Tout cocher")+'</button></div>'
 +'<p><button class="b p" data-act="wpok" style="width:100%;padding:10px"'+(n?"":" disabled")+'>Valider ('+n+' arme'+(n>1?"s":"")+')</button></p></div></div>';
}
window.WPK={
 ask:function(ref,lead){
  const m=S.coll[ref];if(!m)return false;
  if(!m.weapons||m.weapons.length<2)return false;
  W={ref:ref,lead:!!lead,sel:new Set(m.weapons.map(function(_,i){return i}))};
  draw();return true;
 },
 btn:function(u){
  try{if(ctx!=="list"||edit||!u||!S.coll[u.ref]||!(S.coll[u.ref].weapons||[]).length)return"";
   return'<div style="margin:8px 0"><button class="b" data-act="wpe" style="width:100%;padding:10px">⚔ Choisir les armes de cette unité ('+(u.weapons||[]).length+')</button></div>'}catch(_){return""}
 },
 act:function(a,d){
  if(a.indexOf("wp")!==0)return false;
  if(a==="wpe"){
   const u=ed,m=u&&S.coll[u.ref];if(!m)return true;
   const have=new Set((u.weapons||[]).map(wk));
   W={ref:m.ref,lead:false,edit:true,sel:new Set(m.weapons.map(function(w,i){return have.has(wk(w))?i:-1}).filter(function(i){return i>=0}))};
   draw();return true;
  }
  if(a==="wpx"){W=null;draw();return true}
  if(!W)return true;
  const m=S.coll[W.ref];
  if(a==="wpt"){const i=+d.i;if(W.sel.has(i))W.sel.delete(i);else W.sel.add(i);draw();return true}
  if(a==="wpa"){if(W.sel.size===m.weapons.length)W.sel.clear();else m.weapons.forEach(function(_,i){W.sel.add(i)});draw();return true}
  if(a==="wpok"){
   if(!W.sel.size)return true;
   const ws=m.weapons.filter(function(_,i){return W.sel.has(i)}).map(clone),lead=W.lead,isEdit=W.edit;
   W=null;draw();
   if(isEdit){
    const u=ed;if(!u)return true;
    const mine={};(u.weapons||[]).forEach(function(w){mine[wk(w)]=w});
    const inColl=new Set(m.weapons.map(wk));
    u.weapons=ws.map(function(w){return clone(mine[wk(w)]||w)}).concat((u.weapons||[]).filter(function(w){return !inColl.has(wk(w))}));
    save();draw_();toast("Armes mises à jour ✓");return true;
   }
   if(lead){if(ed){ed.subs=ed.subs||[];const s={label:"Meneur",ref:m.ref};SH.forEach(function(f){s[f]=clone(m[f])});s.weapons=ws;ed.subs.push(s)}pk=null;pkDraw();save();draw_();toast("Meneur ajouté ✓");return true}
   const L=cl(),c=L.units.find(function(x){return x.ref===m.ref})||S.lists.flatMap(function(l){return l.units}).find(function(x){return x.ref===m.ref});
   const n={ref:m.ref,size:c?c.size:null,pts:m.pts||0};SH.forEach(function(f){n[f]=clone(m[f])});n.weapons=ws;n.subs=[];n.man=1;L.units.push(n);save();
   const r=document.getElementById("pr");if(r)r.innerHTML=pkRes();toast("Ajouté avec "+ws.length+" arme"+(ws.length>1?"s":"")+" ✓");return true;
  }
  return true;
 }
};
try{mergeSame();save();draw()}catch(e){console.error(e)}
function draw_(){try{window.draw&&window.draw()}catch(_){}}
})();
