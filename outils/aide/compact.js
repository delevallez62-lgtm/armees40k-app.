/* ===== HAMMER · Menus allégés : les actions secondaires passent dans des tiroirs « ⋯ » (rien n'est retiré) ===== */
(()=>{
if(typeof S==="undefined")return;
const OPEN={};
const css=`<style id="cmpcss">
details.cmp{flex:1 0 100%;width:100%;margin:6px 0 0;border:1px dashed var(--bd);border-radius:12px;background:transparent;box-sizing:border-box}
details.cmp>summary{list-style:none;cursor:pointer;padding:8px 12px;min-height:38px;display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:700;color:var(--mu)}
details.cmp>summary::-webkit-details-marker{display:none}
details.cmp>summary::after{content:"▾";margin-left:auto;transition:transform .15s}details.cmp[open]>summary::after{transform:rotate(180deg)}
details.cmp[open]>summary{color:var(--tx)}
details.cmp>.cmp-b{display:flex;flex-wrap:wrap;gap:8px;padding:2px 10px 10px}
details.cmp>.cmp-b>label{flex:1 0 100%;margin:0}details.cmp>.cmp-b>*{max-width:100%}
</style>`;
const tx=e=>(e.innerText||e.textContent||"").replace(/\s+/g," ").trim();
const by=(root,re,sel)=>[...root.querySelectorAll(sel||"button,label")].filter(e=>!e.closest("details.cmp")&&re.test(tx(e)));
function wrap(nodes,label,key){nodes=nodes.filter(Boolean);if(!nodes.length||nodes[0].closest("details.cmp"))return;
 const d=document.createElement("details");d.className="cmp";d.dataset.k=key;if(OPEN[key])d.open=true;
 d.innerHTML=`<summary>${label}</summary><div class="cmp-b"></div>`;const b=d.lastChild;
 nodes[0].parentNode.insertBefore(d,nodes[0]);nodes.forEach(n=>b.appendChild(n))}
const kOf=(n,p)=>p+":"+(n&&(n.dataset.i||n.dataset.id||n.dataset.l||n.dataset.k)||"");
function apply(){const m=document.getElementById("m");if(!m||typeof tab==="undefined")return;
 if(!document.getElementById("cmpcss"))document.head.insertAdjacentHTML("beforeend",css);
 const t=tab;
 if(t==="lists"){m.querySelectorAll(".card").forEach(c=>{const n=by(c,/^(⇄ Envoyer|Renommer|Supprimer)$/,"button");if(n.length>=2)wrap(n,"⋯ Plus : envoyer, renommer, supprimer",kOf(n[n.length-1],"l"))})}
 if(t==="units"){const n=by(m,/^(Modifier la liste|Renommer|Supprimer la liste|Fiche vide)$/,"button");if(n.length>=2)wrap(n,"⋯ Plus d'actions sur la liste","u")}
 if(t==="coll"){const n=by(m,/^(\+ Faction|Sélectionner|Tout supprimer)$/,"button");if(n.length>=2)wrap(n,"⋯ Gérer la collection (faction, sélection, suppression)","c")}
 if(t==="coll"){m.querySelectorAll(".card,.fh,.fhd").forEach(c=>{if(c.querySelector("details.cmp"))return;const n=by(c,/^(Renommer|Bannière|Supprimer)$/,"button");if(n.length>=2)wrap(n,"⋯ Faction : renommer, bannière, supprimer",kOf(n[0],"f"))})}
 if(t==="mis"||t==="enc"||t==="imp"){const s=document.getElementById("spdcard");if(s&&!s.closest("details.cmp"))wrap([s],"📄 Importer un PDF de règles, missions, layouts","pdf:"+t)}
 if(t==="mis"){const n=by(m,/^(⬆ Exporter mes photos|\+ Dossier de primaires)/,"button").concat(by(m,/Importer des photos/,"label"));if(n.length>=2)wrap(n,"⚙ Outils : photos, dossiers","mis")}
 if(t==="enc"){const n=by(m,/^(Tri :|🕓 Historique|⇅ Import)/,"button");if(n.length>=2)wrap(n,"⋯ Outils : tri, historique, import / export","e1");
  const r=by(m,/(Règles à compléter|Doublons ou variantes|Nouvelles règles à valider)/,"button").filter(x=>x.children.length<5||true);if(r.length>=2)wrap(r,"🔎 À traiter dans l'encyclopédie","e2")}
 if(t==="imp"){const n=by(m,/^(Points de l.armée|Faction des figurines|…ou créer une nouvelle faction|Ajouter seulement les figurines)/,"label");if(n.length>=2)wrap(n,"⚙ Options d'import (points, faction, collection seule)","i")}
}
document.addEventListener("toggle",e=>{const d=e.target;if(d&&d.classList&&d.classList.contains("cmp"))OPEN[d.dataset.k]=d.open},true);
let busy=false,tm=null;const run=()=>{if(busy)return;busy=true;try{apply()}catch(e){}finally{busy=false}};
new MutationObserver(()=>{if(busy)return;clearTimeout(tm);tm=setTimeout(run,60)}).observe(document.body,{childList:true,subtree:true});
run();window.CMPUI={run};
})();
