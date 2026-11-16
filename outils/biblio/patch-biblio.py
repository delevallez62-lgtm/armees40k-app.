import sys,os,json,gzip,base64
src,out=sys.argv[1:3]
datadir=sys.argv[3] if len(sys.argv)>3 else os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','data','biblio')
d=os.path.dirname(os.path.abspath(__file__))
s=open(src,encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:90]);s=s.replace(a,b)
rep('learn:["book","Apprendre à jouer","#f0b429"],','learn:["book","Apprendre à jouer","#f0b429"],bib:["book","Bibliothèque V11","#7f9cff"],')
# lien discret dans « Modifier » (fiche de collection uniquement)
rep('${co?"":`<label>Optimisation (visible uniquement','${co&&window.BIBLNK?window.BIBLNK(u):""}${co?"":`<label>Optimisation (visible uniquement')
rep('${csm?"":`<button class="b p" data-act="fnew">+ Faction</button>','${csm?"":`<button class="b" data-bib="home">📚 Bibliothèque</button> <button class="b p" data-act="fnew">+ Faction</button>')
rep('+(window.encXtra?window.encXtra(p):"")+`</div>`;','+(window.encXtra?window.encXtra(p):"")+(window.BIBDRW?window.BIBDRW(p):"")+`</div>`;')
man=json.load(open(os.path.join(datadir,'manifest.json'),encoding='utf8'))
emb={'manifest':man,'chunks':{}}
for c in man['chunks']:
    raw=open(os.path.join(datadir,c['file']),'rb').read()
    emb['chunks'][c['id']]=base64.b64encode(gzip.compress(raw,9,mtime=0)).decode()
J=open(d+'/biblio.js',encoding='utf8').read().replace('/*__RULES__*/',open(d+'/trrules.js',encoding='utf8').read())
assert '</script>' not in J
k=s.rindex('</body>')
s=s[:k]+'<!-- ===== Bibliothèque de données V11 (Space Marines + Orks) ===== -->\n<script>window.__BIBLIO='+json.dumps(emb,separators=(',',':'))+';</script>\n<script>\n'+J+'\n</script>\n'+s[k:]
open(out,'w',encoding='utf8').write(s);print('ok',len(s))
