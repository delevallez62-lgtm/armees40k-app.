#!/usr/bin/env python3
"""Apprend un lexique anglais→français à partir des traductions déjà présentes dans la bibliothèque
(bloc `fr` + textes anglais des blocs). Alignement par co-occurrence (coefficient de Dice), sans IA ni service externe.
Écrit le bloc `lex` (mots + score + effectif) et met à jour le manifeste. Usage : build-lexicon.py <data/biblio>"""
import sys,os,re,json,hashlib,collections
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from frlib import *
D=sys.argv[1]
man,ch=load_chunks(D);S=strings(ch);fr=(ch.get('fr') or {}).get('tr',{})
ET=re.compile(r"[a-z0-9]+(?:['’][a-z0-9]+)*")
FT=re.compile(r"[a-zàâäçéèêëîïôöùûüÿœ0-9]+(?:['’-][a-zàâäçéèêëîïôöùûüÿœ0-9]+)*")
def toks(rx,t):
    t=strip_md(t or '').lower().replace('’',"'");return list(dict.fromkeys(rx.findall(t)))[:80]
pairs=[]
for k,(en,kind,pri) in S.items():
    if k in fr and fr[k].get('fr'):
        e=toks(ET,en);f=toks(FT,fr[k]['fr'])
        if e and f:pairs.append((e,f))
ce=collections.Counter();cf=collections.Counter()
for e,f in pairs:ce.update(e);cf.update(f)
keepE={w for w,c in ce.items() if c>=2 and not w.isdigit()};keepF={w for w,c in cf.items() if c>=2}
co=collections.defaultdict(collections.Counter)
for e,f in pairs:
    fs=[w for w in f if w in keepF]
    for w in e:
        if w in keepE:co[w].update(fs)
words={}
for w,cnt in co.items():
    best=None
    for f,c in cnt.items():
        if c<2:continue
        d=2*c/(ce[w]+cf[f])
        if d>=0.4 and (best is None or (d,c)>(best[1],best[2])):best=(f,d,c)
    if best:words[w]=[best[0],round(best[1],2),best[2]]
body={'schema':1,'id':'lex','updated':man.get('generated',''),'pairs':len(pairs),'words':dict(sorted(words.items()))}
raw=json.dumps(body,ensure_ascii=False,separators=(',',':'))
sha=hashlib.sha1(raw.encode()).hexdigest()
old={c['id']:c for c in man['chunks']}.get('lex')
if old and old['sha1']==sha:print('lexique inchangé',len(words));sys.exit(0)
open(os.path.join(D,'lex.json'),'w',encoding='utf8').write(raw)
man['chunks']=[c for c in man['chunks'] if c['id']!='lex']
man['chunks'].append({'id':'lex','file':'lex.json','sha1':sha,'bytes':len(raw.encode()),'counts':{'words':len(words)}})
open(os.path.join(D,'manifest.json'),'w',encoding='utf8').write(json.dumps(man,ensure_ascii=False,indent=1))
print('lexique',len(words),'mots appris sur',len(pairs),'paires |',len(raw)//1024,'Ko')
