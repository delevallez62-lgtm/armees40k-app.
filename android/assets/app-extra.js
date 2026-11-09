<script>
/* ===== Version Android : sauvegarde, restauration et mises à jour ===== */
(function(){
const KEYS=["armees40k","armee40k","dz40k"],A=window.Android,UK="a40k_upd_url";
function dump(){const d={};for(const k of KEYS){const v=localStorage.getItem(k);if(v!=null)d[k]=v}return JSON.stringify({app:"armees40k",v:1,date:new Date().toISOString(),data:d})}
function restore(txt){let o;try{o=JSON.parse(txt)}catch(e){alert("Fichier illisible.");return}
 let d=null;if(o&&o.app==="armees40k"&&o.data)d=o.data;else if(o&&Array.isArray(o.lists))d={armees40k:JSON.stringify(o)};
 if(!d){alert("Ce fichier n'est pas une sauvegarde de Mes armées 40k.");return}
 if(!confirm("Remplacer les données de l'application par celles de cette sauvegarde ?"))return;
 try{localStorage.setItem("armees40k_bak",localStorage.getItem("armees40k")||"")}catch(e){}
 for(const k of Object.keys(d))if(KEYS.includes(k))localStorage.setItem(k,typeof d[k]==="string"?d[k]:JSON.stringify(d[k]));
 location.reload()}
function picker(accept,cb){const i=document.createElement("input");i.type="file";i.accept=accept;i.hidden=true;document.body.appendChild(i);
 i.onchange=()=>{const f=i.files&&i.files[0];i.remove();if(!f)return;const r=new FileReader();r.onload=()=>cb(String(r.result));r.readAsText(f)};i.click()}
function dlg(html,on){const ov=document.createElement("div");ov.className="ov ovd";ov.innerHTML='<div class="pn dlgp">'+html+'</div>';
 ov.onclick=e=>{const x=e.target.closest&&e.target.closest("[data-x]");const k=x&&x.dataset.x;if(e.target===ov||k==="c"){ov.remove();return}if(k)on(k,ov)};document.body.appendChild(ov);return ov}
const B=(k,t,p)=>'<button class="b'+(p?' p':'')+'" data-x="'+k+'">'+t+'</button>';
function backup(){dlg('<h2 style="margin-bottom:6px">Sauvegarde</h2><p class="mu">Tes armées sont enregistrées sur ce téléphone. Exporte une sauvegarde pour les garder en sécurité ou les transférer sur un autre appareil.</p><div style="display:grid;gap:8px;margin-top:12px">'+B("e","⬇ Exporter une sauvegarde",1)+B("i","⬆ Importer une sauvegarde")+B("c","Fermer")+'</div>',(k,ov)=>{ov.remove();
  if(k==="e"){const n="armees40k-"+new Date().toISOString().slice(0,10)+".json";if(A&&A.saveFile)A.saveFile(n,dump());else{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([dump()],{type:"application/json"}));a.download=n;a.click()}}
  if(k==="i")picker(".json,application/json,text/plain,*/*",restore)})}
function inf(){try{return JSON.parse(A.info())}catch(e){return{}}}
function quick(silent){if(!A||!A.updateFromUrl){if(!silent)update();return}const url=localStorage.getItem(UK)||inf().url;if(!url){if(!silent)update();return}
 if(silent){window.a40kUpd=(ok,msg)=>{if(!ok)return;const t=document.createElement("div");t.textContent="✨ Nouvelle version installée";t.style.cssText="position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:80;background:#111;color:#fff;padding:10px 18px;border-radius:20px;font-size:15px";document.body.appendChild(t);setTimeout(()=>location.reload(),1200)};A.updateFromUrl(url);return}
 let t=document.getElementById("a40kts");if(!t){t=document.createElement("div");t.id="a40kts";t.style.cssText="position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:80;background:#111;color:#fff;padding:10px 18px;border-radius:20px;font-size:15px;box-shadow:0 6px 20px rgba(0,0,0,.4);max-width:90vw;text-align:center";document.body.appendChild(t)}
 t.textContent="⟳ Recherche de la dernière version…";clearTimeout(t._h);
 window.a40kUpd=(ok,msg)=>{t.textContent=msg;if(ok)setTimeout(()=>location.reload(),900);else t._h=setTimeout(()=>t.remove(),3500)};A.updateFromUrl(url)}
function update(){if(!A||!A.info){alert("Mise à jour disponible uniquement dans l'application Android.");return}
 const I=inf(),url=localStorage.getItem(UK)||I.url||"";
 const ov=dlg('<h2 style="margin-bottom:6px">Mise à jour</h2><p class="mu">Version utilisée : <b>'+(I.custom?"mise à jour du "+I.date:"version d'origine de l'application")+'</b>. Tes armées et tes réglages sont conservés.</p><div style="display:grid;gap:8px;margin-top:12px">'
  +B("u","⟳ Rechercher la dernière version",1)+'<p class="mu" id="ust" style="margin:0;text-align:center"></p>'+B("f","📄 Mettre à jour depuis un fichier")+(I.custom?B("r","↺ Revenir à la version d'origine"):"")
  +'<details><summary class="mu">Adresse de mise à jour</summary><input id="uurl" style="width:100%;margin-top:6px" placeholder="https://…/index.html" value="'+String(url).replace(/"/g,"&quot;")+'"></details>'+B("c","Fermer")+'</div>',(k)=>{
  const st=ov.querySelector("#ust"),u=ov.querySelector("#uurl").value.trim();
  if(k==="u"){if(!/^https:\/\//.test(u)){st.textContent="Indique d'abord l'adresse de mise à jour (https://…).";ov.querySelector("details").open=true;return}
   localStorage.setItem(UK,u);st.textContent="Téléchargement…";window.a40kUpd=(ok,msg)=>{st.textContent=msg;if(ok)setTimeout(()=>location.reload(),900)};A.updateFromUrl(u)}
  if(k==="f")picker(".html,.htm,text/html,*/*",t=>{const r=A.installHtml(t);if(r==="same"){alert("Cette version est déjà installée.");return}if(r==="ok"){alert("Mise à jour installée !");location.reload()}else alert(r)});
  if(k==="r"&&confirm("Revenir à la version d'origine de l'application ? (tes données sont conservées)")){A.resetBuiltIn();location.reload()}})}
const sy=document.getElementById("sy");
if(sy){sy.textContent="💾";sy.title="Sauvegarde";sy.style.opacity=".9";sy.onclick=backup;
 const up=document.createElement("span");up.textContent="⟳";up.title="Mise à jour";up.setAttribute("role","button");up.id="a40kup";
 up.style.cssText="font-size:15px;font-weight:700;margin-left:6px;cursor:pointer;vertical-align:middle;padding:2px 6px;background:rgba(255,255,255,.18);border-radius:10px";
 up.onclick=quick;let lp;up.addEventListener("touchstart",()=>{lp=setTimeout(()=>{lp=null;update()},650)},{passive:true});up.addEventListener("touchend",e=>{if(lp){clearTimeout(lp)}else e.preventDefault()});up.oncontextmenu=e=>{e.preventDefault();update()};sy.after(up)}
window.a40kBackup=backup;
/* Vérification automatique à chaque ouverture de l'app (une fois par lancement). */
try{if(A&&A.updateFromUrl&&!sessionStorage.getItem("a40kchk")){sessionStorage.setItem("a40kchk","1");setTimeout(()=>quick(true),1500)}}catch(e){}window.a40kUpdate=update;
})();
</script>
