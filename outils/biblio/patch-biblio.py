import sys,os,json,gzip,base64
src,out=sys.argv[1:3]
datadir=sys.argv[3] if len(sys.argv)>3 else os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','data','biblio')
d=os.path.dirname(os.path.abspath(__file__))
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
rep('learn:["book","Apprendre à jouer","#f0b429"],','learn:["book","Apprendre à jouer","#f0b429"],bib:["book","Bibliothèque V11","#7f9cff"],')
# symbole 📚 sur les tuiles de la COLLECTION uniquement
rep('${e.u.var?\'<span class="vb">Variante d’arme</span>\':""}','${csm?"":`<button class="bibb${window.BIBCLS?window.BIBCLS(e.u.ref):""}" data-bib="open" data-r="${e.u.ref}" aria-label="Bibliothèque" title="Bibliothèque V11">📚</button>`}${e.u.var?\'<span class="vb">Variante d’arme</span>\':""}')
rep('${csm?"":`<button class="b p" data-act="fnew">+ Faction</button>','${csm?"":`<button class="b" data-bib="home">📚 Bibliothèque</button> <button class="b p" data-act="fnew">+ Faction</button>')
man=json.load(open(os.path.join(datadir,'manifest.json'),encoding='utf8'))
emb={'manifest':man,'chunks':{}}
for c in man['chunks']:
    raw=open(os.path.join(datadir,c['file']),'rb').read()
    emb['chunks'][c['id']]=base64.b64encode(gzip.compress(raw,9,mtime=0)).decode()
J=open(d+'/biblio.js',encoding='utf8').read()
assert '</script>' not in J
k=s.rindex('</body>')
s=s[:k]+'<!-- ===== Bibliothèque de données V11 (Space Marines + Orks) ===== -->\n<script>window.__BIBLIO='+json.dumps(emb,separators=(',',':'))+';</script>\n<script>\n'+J+'\n</script>\n'+s[k:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
