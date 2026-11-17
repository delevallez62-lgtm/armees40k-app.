import sys,os,json,gzip,base64
src,out=sys.argv[1:3]
datadir=sys.argv[3] if len(sys.argv)>3 else os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','data','biblio')
d=os.path.dirname(os.path.abspath(__file__))
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
rep('learn:["book","Apprendre à jouer","#f0b429"],','learn:["book","Apprendre à jouer","#f0b429"],bib:["book","Bibliothèque V11","#7f9cff"],news:["star","Nouveautés","#f0b429"],trw:["flag","À traduire","#e0a030"],bld:["shield","Constructeur d\'armée","#55c46e"],')
rep('const prof=p=>`<div class="encu" data-encr="${esc(p.ref||"")}" data-encn="${esc(p.name||"")}">`','const prof=p=>`<div class="encu" data-encr="${esc(p.ref||"")}" data-encn="${esc(p.name||"")}">${window.BIBSYNC?window.BIBSYNC(p):""}`')
rep('function cres(){','function cres(){const _r=cres0();return _r+(window.BIBCS?window.BIBCS(q):"")}function cres0(){')
rep('function doImport(r,items,o){','function doImport(r,items,o){if(window.BIBMERGE&&!o.bm&&window.BIBMERGE.ask(r,items,o,doImport))return;')
rep('syncAll(r.units);','syncAll(r.units);window.BIBMERGE&&window.BIBMERGE.post(o);window.BIBCLEAN&&window.BIBCLEAN();setTimeout(()=>{try{window.BIBUNI&&window.BIBUNI()}catch(_){}},300);',2)
rep('function pkRes(){if(pk.mode==="d")return pkResD();','function pkRes(){if(pk.mode==="d")return pkResD();if(!pk.lead&&window.BIBPK){const _h=window.BIBPK(pk);if(_h!==null)return _h}')
rep('["tab","learn","learn",SEC.learn[1],"Les bases pour ta première partie",""],','["tab","learn","learn",SEC.learn[1],"Les bases pour ta première partie",""],["tab","news","news",SEC.news[1],"Mises à jour de la bibliothèque et de l\'application",""],')
rep('["tab","news","news",SEC.news[1],','["tab","bld","bld",SEC.bld[1],"Créer une armée avec le catalogue visuel et les points V11",""],...(window.BIBTRW&&BIBTRW.n()?[["tab","trw","trw","⚠ "+SEC.trw[1]+" ("+BIBTRW.n()+")","Textes non traduits : touche pour les corriger",""]]:[]),["tab","news","news",SEC.news[1],')
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
J=open(d+'/biblio.js',encoding='utf8').read().replace('/*__RULES__*/',open(d+'/trrules.js',encoding='utf8').read()).replace('/*__MAJ__*/',open(d+'/maj.js',encoding='utf8').read()).replace('/*__BLD__*/',open(d+'/build.js',encoding='utf8').read()).replace('/*__UNI__*/',open(d+'/unify.js',encoding='utf8').read())
assert '</script>' not in J
rep('(e.u.name+" "+e.u.kw+" "+e.u.equip+" "+e.in.join(" ")).toLowerCase().includes(s)','(e.u.name+" "+(window.BIBAL?BIBAL(e.u.ref):"")+" "+e.u.kw+" "+e.u.equip+" "+e.in.join(" ")).toLowerCase().includes(s)',2)
k=s.rindex('</body>')
s=s[:k]+'<!-- ===== Bibliothèque de données V11 (Space Marines + Orks) ===== -->\n<script>window.__BIBLIO='+json.dumps(emb,separators=(',',':'))+';</script>\n<script>\n'+J+'\n</script>\n'+s[k:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
