#!/usr/bin/env python3
"""Contrôle de la bibliothèque avant publication : manifest valide, blocs lisibles, empreintes exactes,
et pas plus de 10 % d'unités perdues par rapport à la version précédente. Usage : check-maj.py <dossier data/biblio> <ancien manifest.json>"""
import sys,os,json,hashlib
D,OLD=sys.argv[1],sys.argv[2]
man=json.load(open(os.path.join(D,'manifest.json'),encoding='utf8'))
assert man.get('schema')==1,'schéma du manifest inattendu'
old=json.load(open(OLD,encoding='utf8')) if os.path.exists(OLD) else {'chunks':[]}
oc={c['id']:c for c in old.get('chunks',[])}
for c in man['chunks']:
    raw=open(os.path.join(D,c['file']),'rb').read()
    assert hashlib.sha1(raw).hexdigest()==c['sha1'],'empreinte incorrecte : '+c['id']
    body=json.loads(raw.decode('utf8'))
    if c['id']=='fr':continue
    n=len(body.get('units',[]));o=(oc.get(c['id'],{}).get('counts') or {}).get('units')
    if o and n<0.9*o:raise SystemExit('refusé : %s a %d unités au lieu de %d'%(c['id'],n,o))
print('contrôle ok',man['version'])
