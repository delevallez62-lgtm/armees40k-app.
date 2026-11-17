#!/usr/bin/env python3
"""Ajoute des traductions (statut « à vérifier ») au bloc `fr` de la bibliothèque.
Usage : merge-fr.py <data/biblio> <fichier.json>   (fichier = [{"k":..,"fr":..}] ou {"k":"fr"})
Garde-fous : les nombres doivent être identiques à l'anglais ; une clé inconnue ou une traduction vide est refusée."""
import sys,json,os,re,hashlib,datetime
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from frlib import *
d,f=sys.argv[1],sys.argv[2]
man,ch=load_chunks(d);S=strings(ch)
raw=json.load(open(f,encoding='utf8'))
items=raw.items() if isinstance(raw,dict) else [(x['k'],x['fr']) for x in raw]
fr=ch.get('fr') or {'schema':1,'id':'fr','tr':{}}
ok=0;bad=[]
for k,t in items:
    if k not in S:bad.append((k,'clé inconnue'));continue
    en=S[k][0];t=(t or '').strip()
    if not t:bad.append((k,'vide'));continue
    if sorted(re.findall(r'\d+',en))!=sorted(re.findall(r'\d+',t)):bad.append((k,'nombres différents'));continue
    if (fr['tr'].get(k) or {}).get('ok'):continue  # nom officiel confirmé : jamais écrasé
    fr['tr'][k]={'fr':t,'at':datetime.date.today().isoformat()};ok+=1
fr['count']=len(fr['tr'])
rawj=json.dumps(fr,ensure_ascii=False,separators=(',',':'))
open(os.path.join(d,'fr.json'),'w',encoding='utf8').write(rawj)
man['chunks']=[c for c in man['chunks'] if c['id']!='fr']
man['chunks'].append({'id':'fr','file':'fr.json','sha1':hashlib.sha1(rawj.encode()).hexdigest(),'bytes':len(rawj.encode()),'counts':{'translations':len(fr['tr'])}})
base=re.sub(r'\+fr\d+(\.[0-9a-f]+)?$','',man['version']);man['version']=base+'+fr%d'%len(fr['tr'])
man['generated']=datetime.date.today().isoformat()
open(os.path.join(d,'manifest.json'),'w',encoding='utf8').write(json.dumps(man,ensure_ascii=False,indent=1))
print('ajoutées',ok,'refusées',len(bad),bad[:5],'| total',len(fr['tr']))

import subprocess;subprocess.run([sys.executable,os.path.join(os.path.dirname(os.path.abspath(__file__)),'bump-version.py'),d])
