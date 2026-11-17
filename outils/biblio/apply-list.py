#!/usr/bin/env python3
"""Enregistre une liste « anglais| français » fournie par l'utilisateur : noms non sourcés = « à vérifier » (ok:false), jamais confirmés ;
un nom officiel déjà confirmé n'est pas écrasé (la variante fournie est gardée dans `alt`). Usage : apply-list.py <data/biblio> <liste.txt> [nom_anglais_a_ne_pas_enregistrer;...]"""
import sys,json,os,re,hashlib,datetime
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from frlib import *
DIRECT='--direct' in sys.argv;args=[a for a in sys.argv if a!='--direct']
d,f=args[1],args[2];skip={nk(x) for x in (args[3].split(';') if len(args)>3 else [])}
man,ch=load_chunks(d);S=strings(ch);fr=ch['fr']
byn={}
for k,(t,kind,p) in S.items():
    if kind=="nom d'unité":byn.setdefault(nk(re.sub(r'\s*\[.*?\]','',t)),[]).append((k,t))
today=datetime.date.today().isoformat();n_new=n_alt=n_pend=0
for l in open(f,encoding='utf8'):
    if '|' not in l:continue
    en,t=[x.strip() for x in l.split('|',1)]
    if nk(en) in skip:continue
    hits=byn.get(nk(en)) or [(hh(en),en)]
    inlib=nk(en) in byn
    for k,real in hits:
        suf=re.search(r'\s*\[[^\]]*\]\s*$',real);t2=t+(' '+suf.group(0).strip() if suf and not re.search(r'\[',t) else '')
        cur=fr['tr'].get(k)
        if cur and cur.get('ok') and not DIRECT:
            if nk(cur['fr'])!=nk(t):cur.setdefault('alt',[]);(t not in cur['alt']) and cur['alt'].append(t);n_alt+=1
            continue
        e={'fr':t2,'at':today,'ok':bool(DIRECT),'src':"liste fournie par l'utilisateur"+('' if DIRECT else ' (non sourcée)')}
        if DIRECT and cur and cur.get('ok') and nk(cur['fr'])!=nk(t2):e['alt']=[cur['fr']]  # ancien nom officiel gardé
        fr['tr'][k]=e
        n_new+=inlib;n_pend+=(not inlib)
fr['count']=len(fr['tr'])
raw=json.dumps(fr,ensure_ascii=False,separators=(',',':'))
open(os.path.join(d,'fr.json'),'w',encoding='utf8').write(raw)
man['chunks']=[c for c in man['chunks'] if c['id']!='fr']
man['chunks'].append({'id':'fr','file':'fr.json','sha1':hashlib.sha1(raw.encode()).hexdigest(),'bytes':len(raw.encode()),'counts':{'translations':len(fr['tr'])}})
open(os.path.join(d,'manifest.json'),'w',encoding='utf8').write(json.dumps(man,ensure_ascii=False,indent=1))
print('à vérifier enregistrés (unités de la bibliothèque)',n_new,'| en attente (unités absentes)',n_pend,'| variantes gardées en alt',n_alt)
