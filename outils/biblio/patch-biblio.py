import sys,os,json,gzip,base64
src,out=sys.argv[1:3]
datadir=sys.argv[3] if len(sys.argv)>3 else os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','data','biblio')
d=os.path.dirname(os.path.abspath(__file__))
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
rep('learn:["book","Apprendre à jouer","#f0b429"],','learn:["book","Apprendre à jouer","#f0b429"],bib:["book","Bibliothèque V11","#7f9cff"],news:["star","Nouveautés","#f0b429"],trw:["flag","À traduire","#e0a030"],lore:["book","Lore","#c9a227"],bld:["shield","Constructeur d\'armée","#55c46e"],')
rep('const prof=p=>`<div class="encu" data-encr="${esc(p.ref||"")}" data-encn="${esc(p.name||"")}">`','const prof=p=>`<div class="encu" data-encr="${esc(p.ref||"")}" data-encn="${esc(p.name||"")}">${window.BIBSYNC?window.BIBSYNC(p):""}`')
rep('function cres(){','function cres(){const _r=cres0();return _r+(window.BIBCS?window.BIBCS(q):"")}function cres0(){')
rep('function doImport(r,items,o){','function doImport(r,items,o){if(window.BIBMERGE&&!o.bm&&window.BIBMERGE.ask(r,items,o,doImport))return;')
rep('syncAll(r.units);','syncAll(r.units);window.BIBMERGE&&window.BIBMERGE.post(o);window.BIBCLEAN&&window.BIBCLEAN();setTimeout(()=>{try{window.BIBUNI&&window.BIBUNI()}catch(_){}},300);',2)
rep('function pkRes(){if(pk.mode==="d")return pkResD();','function pkRes(){if(pk.mode==="d")return pkResD();if(!pk.lead&&window.BIBPK){const _h=window.BIBPK(pk);if(_h!==null)return _h}')
rep('["tab","learn","learn",SEC.learn[1],"Les bases pour ta première partie",""],','["tab","learn","learn",SEC.learn[1],"Les bases pour ta première partie",""],["tab","news","news",SEC.news[1],"Mises à jour de la bibliothèque et de l\'application",""],')
rep('["tab","news","news",SEC.news[1],','["tab","bld","bld",SEC.bld[1],"Créer une armée avec le catalogue visuel et les points V11",""],["tab","lore","lore",SEC.lore[1],"Histoire, personnages, organisations et héraldique",""],...(window.BIBTRW&&BIBTRW.n()?[["tab","trw","trw","⚠ "+SEC.trw[1]+" ("+BIBTRW.n()+")","Textes non traduits : touche pour les corriger",""]]:[]),["tab","news","news",SEC.news[1],')
rep('<button class="b p" data-act="nlist">+ Nouvelle liste</button></div>`+(S.lists.length?','<span><button class="b p" data-tab="bld">🛠 Créer une armée</button> <button class="b" data-act="nlist">+ Liste simple</button></span></div>`+(S.lists.length?')
# lien discret dans « Modifier » (fiche de collection uniquement)
rep('${co?"":`<label>Optimisation (visible uniquement','${co&&window.BIBLNK?window.BIBLNK(u):""}${co?"":`<label>Optimisation (visible uniquement')
rep('${csm?"":`<button class="b p" data-act="fnew">+ Faction</button>','${csm?"":`<button class="b" data-bib="home">📚 Bibliothèque</button> <button class="b p" data-act="fnew">+ Faction</button>')
rep('+(window.encXtra?window.encXtra(p):"")+`</div>`;','+(window.encXtra?window.encXtra(p):"")+(window.BIBDRW?window.BIBDRW(p):"")+`</div>`;')
man=json.load(open(os.path.join(datadir,'manifest.json'),encoding='utf8'))
emb={'manifest':man,'chunks':{}}
for c in man['chunks']:
    raw=open(os.path.join(datadir,c['file']),'rb').read()
    emb['chunks'][c['id']]=base64.b64encode(gzip.compress(raw,9,mtime=0)).decode()
J=open(d+'/biblio.js',encoding='utf8').read().replace('/*__RULES__*/',open(d+'/trrules.js',encoding='utf8').read()).replace('/*__MAJ__*/',open(d+'/maj.js',encoding='utf8').read()).replace('/*__BLD__*/',open(d+'/build.js',encoding='utf8').read()).replace('/*__LCHK__*/',open(d+'/listcheck.js',encoding='utf8').read()).replace('/*__EQE__*/',open(d+'/equip.js',encoding='utf8').read()).replace('/*__UNI__*/',open(d+'/unify.js',encoding='utf8').read()).replace('/*__PSCAN__*/',open(d+'/paintscan.js',encoding='utf8').read()).replace('/*__LORE__*/',open(d+'/lore.js',encoding='utf8').read().replace('/*__LOREIMG__*/',open(d+'/lore-img.js',encoding='utf8').read()))
assert '</script>' not in J
rep('(e.u.name+" "+e.u.kw+" "+e.u.equip+" "+e.in.join(" ")).toLowerCase().includes(s)','(e.u.name+" "+(window.BIBAL?BIBAL(e.u.ref):"")+" "+e.u.kw+" "+e.u.equip+" "+e.in.join(" ")).toLowerCase().includes(s)',2)
rep('p.l=(S.lists.some(l=>l.id===S.cur)?S.cur:S.lists[0].id);\n if(!p.me)','p.l=(S.lists.some(l=>l.id===S.cur)?S.cur:S.lists[0].id);\n {const L0=S.lists.find(l=>l.id===p.l);if(L0&&L0.mission){p.m1="";p.i1=L0.mid||""}}\n if(!p.me)')
# --- lanceur de dés : aptitude Torrent (toutes les touches réussissent après le premier jet) ---
rep('<button data-z="xd" title="Blessures dévastatrices">💥 Dévastatrices</button></div></div>','<button data-z="xd" title="Blessures dévastatrices">💥 Dévastatrices</button><button data-z="xt" title="Torrent : toutes les touches réussissent automatiquement">🌊 Torrent</button></div></div>')
rep('map(d=>({v:d.v|0,k:!!d.k}))','map(d=>({v:d.v|0,k:!!d.k,au:!!d.au}))',2)
rep('function paint(){','function torrent(){if(busy||D.st!==0||!D.dice.length)return;const on=!D.dice.every(d=>d.au);D.dice.forEach(d=>{if(on)d.au=true;else delete d.au;d.dm=false});if(on)D.act="keep";save();paint();stats();play(on?"keep":"click")}\nfunction paint(){')
rep('e.classList.toggle("x",!busy&&D.act==="keep"&&d.v<D.thr);e.classList.toggle("s",!busy&&d.v>=D.thr)','e.classList.toggle("x",!busy&&D.act==="keep"&&!d.au&&d.v<D.thr);e.classList.toggle("s",!busy&&(d.au||d.v>=D.thr))')
rep('const ok=D.dice.filter(d=>d.v>=T).length,c=D.dice.filter(d=>d.v>=cr&&d.v>=T).length,o=','const ok=D.dice.filter(d=>d.au||d.v>=T).length,c=D.dice.filter(d=>!d.au&&d.v>=cr&&d.v>=T).length,o=')
rep('ok=D.dice.filter(d=>d.v>=D.thr).length,m=D.dice.filter(match).length,k=D.dice.filter(d=>d.v<D.thr).length','ok=D.dice.filter(d=>d.au||d.v>=D.thr).length,m=D.dice.filter(match).length,k=D.dice.filter(d=>!d.au&&d.v<D.thr).length')
rep('else if(D.act==="keep"){const ok=D.dice.filter(d=>d.v>=D.thr).length,f=fx();','else if(D.act==="keep"){const ok=D.dice.filter(d=>d.au||d.v>=D.thr).length,f=fx();')
rep('b[2].textContent="💥 Dévastatrices : "+(D.xd?"oui":"non");','b[2].textContent="💥 Dévastatrices : "+(D.xd?"oui":"non");{const tw=n>0&&D.dice.every(d=>d.au);b[3].hidden=!(D.st===0&&n>0&&!busy);b[3].textContent="🌊 Torrent"+(tw?" : oui":"");b[3].classList.toggle("sel",tw)}')
rep('else if(D.act==="rr")tx=`<b>Relance.</b>','else if(D.st===0&&D.dice.every(d=>d.au))tx="<b>Torrent.</b> Toutes les touches réussissent automatiquement : valide pour passer à la blessure.";\n    else if(D.act==="rr")tx=`<b>Relance.</b>')
rep('else if(z==="xd"){D.xd=!D.xd;save();stats();play("click")}','else if(z==="xd"){D.xd=!D.xd;save();stats();play("click")}\n  else if(z==="xt"){torrent()}')
rep('["coll","Collection","coll"],["ana","Centre de commandement","ana"],["learn","Apprendre à jouer","learn"]','["coll","Collection","coll"],["lore","Lore","lore"],["ana","Centre de commandement","ana"],["learn","Apprendre à jouer","learn"]')
# Listes d'armée : figurines et points toujours visibles ; modification à la volée dans la liste
rep('<div class="mu">${lcount(l)} unité${lcount(l)>1?"s":""}${lpts(l)?" · "+lpts(l)+" pts":""} · ${l.dets.length} détachement(s)</div>','${window.BIBLP?BIBLP.badges(l):""}<div class="mu">${lcount(l)} unité${lcount(l)>1?"s":""} · ${l.dets.length} détachement(s)</div>')
rep('<span class="mu">${lpts(L)?" · "+lpts(L)+" pts":""}${L.mission?','<span class="mu">${window.BIBLP?" · "+BIBLP.txt(L):(lpts(L)?" · "+lpts(L)+" pts":"")}${L.mission?')
rep('</span></div><div class="chips">${K.map(k=>`<span>${k} <b>${esc(u.stats[k])}</b></span>`).join("")}</div></div>`).join("")}</div>`}','</span>${window.BIBLP?BIBLP.card(u,i):""}</div><div class="chips">${K.map(k=>`<span>${k} <b>${esc(u.stats[k])}</b></span>`).join("")}</div></div>`).join("")}</div>`}')

# Vérification de liste : boutons
rep('<button class="b" data-act="open" data-id="${l.id}">Gérer</button>','<button class="b" data-chk="${l.id}">✅ Vérifier</button> <button class="b" data-act="open" data-id="${l.id}">Gérer</button>')
rep('<span><button class="b" data-act="ledit">Modifier la liste</button>','<span><button class="b p" data-chk="${L.id}">✅ Vérifier la liste</button> <button class="b" data-act="ledit">Modifier la liste</button>')

# Pots de peinture : fiche avec pot (quantité + / −) et état du pot ; libellés dans la liste
rep('<label>Nom<input data-f="n" value="${e2(p.n)}" autofocus></label><label>Marque','${window.BIBPOT?BIBPOT.sheet(p,cur.isNew):""}<label>Nom<input data-f="n" value="${e2(p.n)}" autofocus></label><label>Marque')
rep('<label>Stock<select data-f="s"><option value="ok"${p.s==="ok"?" selected":""}>En stock</option><option value="bas"${p.s==="bas"?" selected":""}>Presque vide</option><option value="achat"${p.s==="achat"?" selected":""}>À racheter</option></select></label>\n','')
rep('<span class="tx"><b>${e2(p.n)}</b><small>${e2([p.b,p.rg||p.t,p.sku?"réf. "+p.sku:""].filter(Boolean).join(" · "))}','<span class="tx"><b>${e2(p.n)}${(p.q||1)>1?` <span class="mu">×${p.q}</span>`:""}</b><small>${e2([p.b,p.rg||p.t,p.sku?"réf. "+p.sku:""].filter(Boolean).join(" · "))}')
rep('<span class="stk ${p.s||"ok"}">${p.s==="bas"?"Presque vide":p.s==="achat"?"À racheter":"En stock"}</span>','<span class="stk ${p.s||"ok"}">${p.s==="vide"?"Vide":p.s==="bas"?"Presque vide":p.s==="achat"?"Achat à prévoir":"En stock"}</span>')

rep('${hTab==="pt"?`<button class="b p" data-x="ptnew">+ Peinture</button><button class="b" data-camgo="1">🎥 Lire un pot</button><button class="b" data-x="ocr">📷 Depuis une capture</button>`:""}</div>','</div>${hTab==="pt"?`<details class="card" id="gxadd" style="margin:8px 0"><summary style="cursor:pointer;min-height:44px;display:flex;align-items:center"><b>➕ Ajouter une nouvelle peinture</b></summary><div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px"><button class="b p" data-pscan="1">▦ Scanner un code-barres</button><button class="b" data-x="ptnew">+ Peinture à la main</button><button class="b" data-camgo="1">🎥 Lire un pot</button><button class="b" data-x="ocr">📷 Depuis une capture</button><button class="b" data-x="pstarter">30 peintures Citadel courantes</button></div></details>`:""}')
rep('<div class="gadd2"><button class="b p" data-camgo="1">🎥 Lire un pot avec la caméra</button><button class="b p" data-x="ocr">📷 Importer depuis une capture d\'écran</button><button class="b" data-x="pstarter">Ajouter 30 peintures Citadel courantes</button></div>','<p class="mu">Ouvre « ➕ Ajouter une nouvelle peinture » ci-dessus pour scanner un pot, importer une capture ou ajouter les peintures courantes.</p>')
k=s.rindex('</body>')
s=s[:k]+'<!-- ===== Bibliothèque de données V11 (Space Marines + Orks) ===== -->\n<script>window.__BIBLIO='+json.dumps(emb,separators=(',',':'))+';</script>\n<script>\n'+J+'\n</script>\n'+s[k:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))

