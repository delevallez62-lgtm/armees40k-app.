#!/usr/bin/env python3
"""Recalcule la version de la bibliothèque d'après le contenu de fr.json (…+frNNNN.hash) : les appareils qui ont déjà la bibliothèque rechargent ainsi les noms/traductions modifiés même si leur nombre n'a pas changé."""
import sys,json,os,re,hashlib
d=sys.argv[1];mp=os.path.join(d,'manifest.json');man=json.load(open(mp,encoding='utf8'))
raw=open(os.path.join(d,'fr.json'),encoding='utf8').read();fr=json.loads(raw)
h=hashlib.sha1(raw.encode()).hexdigest()[:6]
base=re.sub(r'\+fr\d+(\.[0-9a-f]+)?$','',man['version']);man['version']=base+'+fr%d.%s'%(len(fr['tr']),h)
for c in man['chunks']:
    if c['id']=='fr':c['sha1']=hashlib.sha1(raw.encode()).hexdigest();c['bytes']=len(raw.encode())
open(mp,'w',encoding='utf8').write(json.dumps(man,ensure_ascii=False,indent=1));print(man['version'])
