/* ===== Peinture : lecture d'un pot par son code-barres (reconnaissance automatique : marque, nom, teinte, type) ===== */
/* Données : catalogue de peintures embarqué dans la bibliothèque (WarHub/warhub-catalog, licence MIT) → fonctionne hors ligne. */
const PS={db:null,eanMap:null,sess:[],auto:true,stream:null,raf:0,last:{code:"",t:0},card:null,q:"",mode:"idle"};
const PSBR={"citadel colour":"Citadel","army painter":"The Army Painter","monument (pro acryl)":"Pro Acryl","kimera kolors":"Kimera","scale75":"Scale75","vallejo":"Vallejo","ak interactive":"AK Interactive","ak real color":"AK Interactive","green stuff world":"Green Stuff World","tamiya":"Tamiya"};
const psBrand=b=>PSBR[String(b||"").toLowerCase()]||String(b||"");
function psType(p){const t=String(p.t||"").toLowerCase(),r=String(p.r||"").toLowerCase(),n=String(p.n||"").toLowerCase();
 if(/contrast|speedpaint|xpress|slap chop/.test(t+" "+r+" "+n))return"Contraste";if(/shade|wash|dipping/.test(t+" "+r+" "+n))return"Lavis (Shade)";if(/dry/.test(t))return"Sec (Dry)";
 if(/technical|technique|effect|texture|medium/.test(t+" "+r))return"Technique";if(/spray/.test(t+" "+r))return"Spray / Sous-couche";if(/primer|sous-couche/.test(t+" "+r+" "+n))return"Spray / Sous-couche";
 if(/varnish|vernis/.test(t+" "+n))return"Vernis";if(/air/.test(t+" "+r))return"Air";if(/layer|highlight/.test(t+" "+r))return"Layer";return"Base"}
function psData(){if(PS.db)return PS.db;const d=D&&D.paintsDB;if(!d||!d.paints)return null;PS.db=d;PS.eanMap=new Map();d.paints.forEach((p,i)=>{p._i=i;(p.e||[]).forEach(c=>PS.eanMap.set(c,p))});return d}
const psNorm=c=>{c=String(c||"").replace(/\D/g,"");if(c.length===12)c="0"+c;return c};
const psCheck=c=>{if(!/^\d{13}$/.test(c))return false;let s=0;for(let i=0;i<12;i++)s+=(+c[i])*(i%2?3:1);return (10-s%10)%10===+c[12]};
function psLookup(code){code=psNorm(code);psData();const own=(typeof window.__hob!=="undefined"?window.__hob.hob().paints:[]).find(p=>p.ean&&psNorm(p.ean)===code);return{code,cat:PS.eanMap&&PS.eanMap.get(code)||null,own:own||null}}
function psDisp(p){const b=psBrand(PS.db.brands[p.b]);return{b,n:p.n,rg:p.r||"",t:psType(p),c:p.h||"#7a5b22",sku:p.c||"",ean:(p.e||[])[0]||"",vol:p.v||0,f:p.f||""}}
function psAdd(p,code){const H=window.__hob;if(!H)return null;const h=H.hob(),d=psDisp(p),nk2=s=>nk(String(s||""));
 let ex=h.paints.find(x=>x.ean&&psNorm(x.ean)===psNorm(code))||h.paints.find(x=>nk2(x.b)===nk2(d.b)&&nk2(x.n)===nk2(d.n));
 if(ex){ex.ean=ex.ean||psNorm(code);if(!ex.rg&&d.rg)ex.rg=d.rg;if(!ex.sku&&d.sku)ex.sku=d.sku;if(p.h&&(!ex.c||ex.c==="#7a5b22"))ex.c=p.h;try{H.commit()}catch(_){}return{p:ex,dup:true}}
 const np={id:"p"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),n:d.n,b:d.b,rg:d.rg,sku:d.sku,ean:psNorm(code)||d.ean,t:d.t,c:d.c,s:"ok"};
 if(d.b&&!(h.brands||[]).some(x=>nk2(x)===nk2(d.b))&&!["Citadel","Vallejo","The Army Painter","AK Interactive","Scale75","Pro Acryl","Green Stuff World","Monument Hobbies","Kimera","Tamiya"].some(x=>nk2(x)===nk2(d.b))){h.brands=h.brands||[];h.brands.push(d.b)}
 h.paints.push(np);try{H.commit()}catch(_){}return{p:np,dup:false}}
/* ----- décodeur EAN-13 / UPC-A hors ligne (secours quand le navigateur n'a pas BarcodeDetector) ----- */
const PSL={"3211":0,"2221":1,"2122":2,"1411":3,"1132":4,"1231":5,"1114":6,"1312":7,"1213":8,"3112":9},PSLA=Object.keys(PSL).map(k=>[k.split("").map(Number),PSL[k]]),PSP={LLLLLL:0,LLGLGG:1,LLGGLG:2,LLGGGL:3,LGLLGG:4,LGGLLG:5,LGGGLL:6,LGLGLG:7,LGLGGL:8,LGGLGL:9};
function psDig(w){const T=w[0]+w[1]+w[2]+w[3];if(T<4)return null;const s=w.map(x=>x*7/T);let best=null,be=1e9;PSLA.forEach(([pt,d])=>{const e=pt.reduce((a,x,i)=>a+(x-s[i])*(x-s[i]),0);if(e<be){be=e;best=d}});return be<1.1?{d:best,e:be}:null}
function psRuns(row,thr){const runs=[];let cur=row[0]<thr,n=1;for(let i=1;i<row.length;i++){const b=row[i]<thr;if(b===cur)n++;else{runs.push(n);n=1;cur=b}}runs.push(n);return{runs,first:row[0]<thr}}
function psDecRuns(R){// R: runs commençant par une barre
 for(let i=0;i+59<=R.length&&i<R.length;i+=2){const g=R.slice(i,i+3),m=(g[0]+g[1]+g[2])/3;if(m<1||Math.abs(g[0]-m)>m*.6||Math.abs(g[1]-m)>m*.6||Math.abs(g[2]-m)>m*.6)continue;
  let p=i+3,left=[],par="",ok=true;for(let k=0;k<6;k++){const w=R.slice(p,p+4);if(w.length<4){ok=false;break}const A=psDig(w),Bv=psDig(w.slice().reverse());let r,pc;if(A&&(!Bv||A.e<=Bv.e)){r=A;pc="L"}else if(Bv){r=Bv;pc="G"}else{ok=false;break}par+=pc;left.push(r.d);p+=4}
  if(!ok||!(par in PSP))continue;const mid=R.slice(p,p+5);if(mid.length<5)continue;const mm=(mid[0]+mid[1]+mid[2]+mid[3]+mid[4])/5;if(mid.some(x=>Math.abs(x-mm)>mm*.7))continue;p+=5;
  let right=[];for(let k=0;k<6;k++){const w=R.slice(p,p+4);if(w.length<4){ok=false;break}const r=psDig(w);if(!r){ok=false;break}right.push(r.d);p+=4}if(!ok)continue;
  const code=PSP[par]+left.join("")+right.join("");if(psCheck(code))return code}return null}
function psSmooth(row){const n=row.length,o=new Uint8Array(n);for(let i=0;i<n;i++){const a=row[i>0?i-1:i],b=row[i],c=row[i<n-1?i+1:i];o[i]=(a+2*b+c)>>2}return o}
function psScanRow(row0){const row=psSmooth(row0);let mn=255,mx=0;for(let i=0;i<row.length;i++){if(row[i]<mn)mn=row[i];if(row[i]>mx)mx=row[i]}if(mx-mn<40)return null;const thr=(mn+mx)/2,{runs,first}=psRuns(row,thr),R=first?runs:runs.slice(1);
 let c=psDecRuns(R);if(c)return c;const Rr=R.slice().reverse();c=psDecRuns(Rr);if(c)return c;return psDecRuns(Rr.slice(1))}
function psDecodeImage(img){// img : ImageData ; teste plusieurs lignes horizontales puis verticales
 const W=img.width,H=img.height,g=new Uint8Array(W*H);for(let i=0;i<W*H;i++){g[i]=(img.data[i*4]*77+img.data[i*4+1]*151+img.data[i*4+2]*28)>>8}
 for(let f=.15;f<=.85;f+=.05){const y=Math.floor(H*f),row=g.subarray(y*W,y*W+W),c=psScanRow(row);if(c)return c}
 for(let f=.15;f<=.85;f+=.05){const x=Math.floor(W*f),col=new Uint8Array(H);for(let y=0;y<H;y++)col[y]=g[y*W+x];const c=psScanRow(col);if(c)return c}return null}
/* ----- interface ----- */
function psCss(){if(document.getElementById("pscss"))return;const s=document.createElement("style");s.id="pscss";s.textContent=`#psc{position:fixed;inset:0;z-index:95;background:rgba(5,6,5,.92);display:flex;align-items:flex-end;justify-content:center}
#psc .pp{background:var(--card);color:var(--tx);width:min(560px,100%);max-height:96vh;overflow:auto;border-radius:16px 16px 0 0;padding:14px;padding-bottom:calc(18px + env(safe-area-inset-bottom,0px))}
#psc h3{margin:0}#psc .vw{position:relative;margin:10px 0;border-radius:12px;overflow:hidden;background:#000;aspect-ratio:4/3}#psc video{width:100%;height:100%;object-fit:cover;display:block}
#psc .rt{position:absolute;left:10%;right:10%;top:34%;height:32%;border:2px solid #3ddc97;border-radius:10px;box-shadow:0 0 0 999px rgba(0,0,0,.35)}
#psc .rs{display:flex;gap:10px;align-items:center;border:1px solid var(--bd);border-radius:12px;padding:8px;margin:8px 0;background:var(--bg)}#psc .sw{width:46px;height:46px;border-radius:10px;border:2px solid #fff;flex:none;box-shadow:0 0 0 1px var(--bd)}
#psc .b{min-height:42px}#psc input[type=text],#psc input[type=search]{width:100%;margin:4px 0}#psc .ct{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}`;document.head.appendChild(s)}
const psE=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function psRow(p,code,acts){const d=psDisp(p);return`<div class="rs"><span class="sw" style="background:${psE(d.c)}"></span><span style="flex:1;min-width:0"><b>${psE(d.n)}</b><br><span class="mu">${psE(d.b)}${d.rg&&nk(d.rg)!==nk(d.t)?" · "+psE(d.rg):""} · ${psE(d.t)}${d.vol?" · "+d.vol+" ml":""}</span></span>${acts||""}</div>`}
function psDraw(){const o=document.getElementById("psc");if(!o)return;const db=psData(),H=window.__hob?window.__hob.hob():{paints:[]};
 const cam=PS.mode==="cam";let h=`<div class="pp"><div style="display:flex;justify-content:space-between;align-items:center"><h3>▦ Scanner un pot de peinture</h3><button class="b" data-psc="close" aria-label="Fermer">✕</button></div>`;
 if(!db)h+=`<p class="mu">Le catalogue de peintures n'est pas encore chargé. Ouvre la bibliothèque (ou attends la mise à jour automatique) puis réessaie.</p>`;
 else h+=`<p class="mu" style="margin:6px 0">${db.paints.length} peintures · ${PS.eanMap.size} codes-barres · fonctionne hors ligne.</p>
  <div class="vw" ${cam?"":"hidden"}><video id="psv" playsinline muted></video><div class="rt"></div></div>
  <div class="ct"><button class="b p" data-psc="${cam?"stop":"start"}">${cam?"⏹ Arrêter la caméra":"📷 Activer la caméra"}</button><label class="b" style="display:inline-flex;align-items:center;cursor:pointer">🖼 Photo du code-barres<input type="file" accept="image/*" capture="environment" data-psf="1" style="display:none"></label></div>
  <label style="display:flex;gap:8px;align-items:center;margin:6px 0"><input type="checkbox" data-psc="auto" ${PS.auto?"checked":""}> Ajouter automatiquement les pots reconnus à mes peintures</label>
  <div style="display:flex;gap:6px"><input type="text" id="psman" inputmode="numeric" placeholder="Saisir le code-barres (13 chiffres)" autocomplete="off"><button class="b" data-psc="man">OK</button></div>
  <div id="psmsg" class="mu" style="min-height:22px;margin:6px 0">${PS.msg||""}</div>${PS.card||""}
  <h4 style="margin:12px 0 4px">Chercher dans le catalogue</h4><input type="search" id="psq" placeholder="Nom, marque, référence…" value="${psE(PS.q)}" autocomplete="off"><div id="psres">${psSearchHtml()}</div>
  ${PS.sess.length?`<h4 style="margin:12px 0 4px">Ajoutées pendant cette session (${PS.sess.length})</h4>${PS.sess.map((x,i)=>psRow(x.p,"",`<button class="b" data-psc="undo" data-i="${i}" title="Retirer">✕</button>`)).join("")}`:""}`;
 h+=`<div class="ct" style="margin-top:12px"><button class="b p" data-psc="close" style="flex:1">Terminer</button></div></div>`;o.innerHTML=h;
 if(cam&&PS.stream){const v=document.getElementById("psv");if(v&&v.srcObject!==PS.stream){v.srcObject=PS.stream;v.play().catch(()=>{})}}}
function psSearchHtml(){const db=psData(),q=nk(PS.q||"");if(!db||q.length<2)return PS.q?`<p class="mu">Tape au moins 2 lettres.</p>`:"";const ws=q.split(" ");
 const L=[];for(const p of db.paints){if(ws.every(w=>nk(psBrand(db.brands[p.b])+" "+p.n+" "+(p.r||"")+" "+(p.c||"")).includes(w))){L.push(p);if(L.length>=15)break}}
 return L.length?L.map(p=>psRow(p,"",`<button class="b p" data-psc="addp" data-i="${p._i}">＋</button>`)).join(""):`<p class="mu">Aucune peinture trouvée.</p>`}
function psSay(m){PS.msg=m;const e=document.getElementById("psmsg");if(e)e.innerHTML=m}
function psOnCode(raw,cam){const code=psNorm(raw);if(code.length!==13||!psCheck(code)){psSay("⚠ Code illisible ou invalide : "+psE(raw));return false}
 const now=Date.now();if(cam&&PS.last.code===code&&now-PS.last.t<3000)return true;PS.last={code,t:now};
 const r=psLookup(code);if(r.own&&!r.cat){PS.card=`<div class="rs"><span class="sw" style="background:${psE(r.own.c||"#888")}"></span><span style="flex:1"><b>${psE(r.own.n)}</b><br><span class="mu">Déjà dans ta collection · ${psE(r.own.b||"")}</span></span></div>`;psSay("✅ Déjà dans ta collection");psDraw();return true}
 if(!r.cat){PS.card=`<div class="rs" style="display:block"><b>Code ${psE(code)} inconnu du catalogue</b><p class="mu">Tu peux l'ajouter toi-même : ce code sera reconnu la prochaine fois.</p><input type="text" id="psun" placeholder="Nom de la peinture"><input type="text" id="psub" placeholder="Marque" value="Citadel"><label>Couleur <input type="color" id="psuc" value="#7a5b22"></label><div class="ct"><button class="b p" data-psc="addun" data-code="${psE(code)}">Ajouter</button></div></div>`;psSay("❓ Pot non trouvé dans le catalogue");psDraw();return true}
 const p=r.cat;if(PS.auto){const a=psAdd(p,code);if(a){if(!a.dup)PS.sess.unshift({p,code,id:a.p.id});psSay(a.dup?"✔ Déjà dans ta collection : "+psE(p.n):"✅ Ajouté : "+psE(p.n));PS.card=psRow(p,code);try{toast(a.dup?"Déjà dans ta collection":"Peinture ajoutée ✓")}catch(_){}}}
 else{PS.card=psRow(p,code,`<button class="b p" data-psc="addc" data-code="${psE(code)}">Ajouter</button>`);psSay("✅ Reconnu : "+psE(p.n))}
 psDraw();return true}
async function psStart(){psCss();if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){psSay("⚠ Caméra non disponible ici : utilise « Photo du code-barres » ou saisis le code.");psDraw();return}
 try{PS.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:false});PS.mode="cam";psSay("Place le code-barres dans le cadre…");psDraw();psLoop()}catch(e){psSay("⚠ Caméra refusée ou indisponible : utilise « Photo du code-barres » ou saisis le code.");psDraw()}}
function psStop(){PS.mode="idle";cancelAnimationFrame(PS.raf);clearTimeout(PS.tm);if(PS.stream){PS.stream.getTracks().forEach(t=>t.stop());PS.stream=null}}
let PSBD=null;
function psLoop(){let busy=false;const cv=document.createElement("canvas"),cx=cv.getContext("2d",{willReadFrequently:true});
 try{if("BarcodeDetector"in window)PSBD=new BarcodeDetector({formats:["ean_13","upc_a","ean_8","upc_e"]})}catch(_){PSBD=null}
 const tick=async()=>{if(PS.mode!=="cam")return;const v=document.getElementById("psv");if(v&&v.videoWidth&&!busy){busy=true;try{let code=null;
   if(PSBD){const r=await PSBD.detect(v);if(r&&r.length)code=r[0].rawValue}
   if(!code){const w=Math.min(960,v.videoWidth),h=Math.round(v.videoHeight*w/v.videoWidth);cv.width=w;cv.height=h;cx.drawImage(v,0,0,w,h);code=psDecodeImage(cx.getImageData(0,0,w,h))}
   if(code)psOnCode(code,true)}catch(_){}busy=false}
  PS.tm=setTimeout(()=>{PS.raf=requestAnimationFrame(tick)},180)};tick()}
async function psFromFile(f){if(!f)return;psSay("Analyse de la photo…");try{const bm=await createImageBitmap(f),w=Math.min(1600,bm.width),h=Math.round(bm.height*w/bm.width),cv=document.createElement("canvas");cv.width=w;cv.height=h;const cx=cv.getContext("2d",{willReadFrequently:true});cx.drawImage(bm,0,0,w,h);
  let code=null;try{if("BarcodeDetector"in window){const r=await new BarcodeDetector({formats:["ean_13","upc_a","ean_8","upc_e"]}).detect(cv);if(r&&r.length)code=r[0].rawValue}}catch(_){}
  if(!code)code=psDecodeImage(cx.getImageData(0,0,w,h));if(!code){// plusieurs rotations
   for(const a of [90,270,180]){const c2=document.createElement("canvas");c2.width=a===180?w:h;c2.height=a===180?h:w;const x2=c2.getContext("2d",{willReadFrequently:true});x2.translate(c2.width/2,c2.height/2);x2.rotate(a*Math.PI/180);x2.drawImage(cv,-w/2,-h/2);code=psDecodeImage(x2.getImageData(0,0,c2.width,c2.height));if(code)break}}
  if(code)psOnCode(code);else{psSay("⚠ Aucun code-barres lu sur cette photo : rapproche-toi, évite les reflets, ou saisis le code.");psDraw()}}catch(e){psSay("⚠ Photo illisible.");psDraw()}}
function psOpen(){psCss();let o=document.getElementById("psc");if(!o){o=document.createElement("div");o.id="psc";document.body.appendChild(o)}PS.msg="";PS.card="";PS.q="";psData();psDraw()}
function psClose(){psStop();const o=document.getElementById("psc");if(o)o.remove();try{draw()}catch(_){}}
document.addEventListener("click",e=>{const o=e.target.closest&&e.target.closest("[data-pscan]");if(o){e.preventDefault();e.stopPropagation();psOpen();return}
 const b=e.target.closest&&e.target.closest("[data-psc]");if(!b)return;e.preventDefault();e.stopPropagation();const a=b.dataset.psc;
 if(a==="close")psClose();else if(a==="start")psStart();else if(a==="stop"){psStop();psDraw()}
 else if(a==="auto"){PS.auto=b.checked}
 else if(a==="man"){const i=document.getElementById("psman");psOnCode(i&&i.value)}
 else if(a==="addc"){const r=psLookup(b.dataset.code);if(r.cat){const x=psAdd(r.cat,r.code);if(x&&!x.dup)PS.sess.unshift({p:r.cat,code:r.code,id:x.p.id});PS.card="";psSay(x&&x.dup?"Déjà dans ta collection":"✅ Ajouté");psDraw()}}
 else if(a==="addp"){const p=psData().paints[+b.dataset.i];const x=psAdd(p,(p.e||[])[0]||"");if(x&&!x.dup)PS.sess.unshift({p,code:(p.e||[])[0]||"",id:x.p.id});psSay(x&&x.dup?"Déjà dans ta collection":"✅ Ajouté : "+psE(p.n));psDraw()}
 else if(a==="addun"){const n=(document.getElementById("psun")||{}).value,br=(document.getElementById("psub")||{}).value,c=(document.getElementById("psuc")||{}).value;if(!String(n||"").trim()){psSay("Donne un nom à la peinture");return}
  const H=window.__hob,h=H.hob(),np={id:"p"+Date.now().toString(36),n:n.trim(),b:(br||"").trim(),rg:"",sku:"",ean:b.dataset.code,t:"Base",c:c||"#7a5b22",s:"ok"};h.paints.push(np);try{H.commit()}catch(_){}PS.card="";PS.sess.unshift({p:{n:np.n,b:0,h:np.c,_user:1},code:np.ean,id:np.id,user:np});psSay("✅ Ajouté et mémorisé pour ce code-barres");psDraw()}
 else if(a==="undo"){const x=PS.sess[+b.dataset.i];if(x){const H=window.__hob,h=H.hob();h.paints=h.paints.filter(p=>p.id!==x.id);try{H.commit()}catch(_){}PS.sess.splice(+b.dataset.i,1);psDraw()}}
},true);
document.addEventListener("change",e=>{const i=e.target;if(i&&i.dataset&&i.dataset.psf&&i.files&&i.files[0]){psFromFile(i.files[0]);i.value=""}},true);
document.addEventListener("input",e=>{const t=e.target;if(t&&t.id==="psq"){PS.q=t.value;clearTimeout(PS.qt);PS.qt=setTimeout(()=>{const r=document.getElementById("psres");if(r)r.innerHTML=psSearchHtml()},250)}});
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target&&e.target.id==="psman"){e.preventDefault();psOnCode(e.target.value)}});
window.BIBPSC={open:psOpen,onCode:psOnCode,decode:psDecodeImage,lookup:psLookup,check:psCheck,type:psType,brand:psBrand,add:psAdd,data:psData};
