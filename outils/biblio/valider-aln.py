#!/usr/bin/env python3
"""Valide (ok:true) les propositions de noms d'armes issues d'ALN 40K, sur DEMANDE EXPLICITE de l'utilisateur. Ne touche à rien d'autre.
Usage : valider-aln.py <data/biblio>"""
import sys,os,json,hashlib,datetime
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from frlib import *
H=os.path.dirname(os.path.abspath(__file__));d=sys.argv[1]
man,ch=load_chunks(d);fr=ch['fr'];t=fr['tr'];n=0
for k,e in t.items():
    if str(e.get('src','')).startswith('ALN 40K') and e.get('ok') is False:
        e['ok']=True;e['src']="ALN 40K (armylistnetwork.com, listes publiques CC BY-NC-SA) — validé par l'utilisateur le "+datetime.date.today().isoformat()+(' (avec document Kill Team)' if 'Kill Team' in e['src'] else '');n+=1
print('propositions ALN validées :',n)
fr['count']=len(t);raw=json.dumps(fr,ensure_ascii=False,separators=(',',':'))
open(os.path.join(d,'fr.json'),'w',encoding='utf8').write(raw)
man['chunks']=[c for c in man['chunks'] if c['id']!='fr']
man['chunks'].append({'id':'fr','file':'fr.json','sha1':hashlib.sha1(raw.encode()).hexdigest(),'bytes':len(raw.encode()),'counts':{'translations':len(t)}})
open(os.path.join(d,'manifest.json'),'w',encoding='utf8').write(json.dumps(man,ensure_ascii=False,indent=1))
import subprocess;subprocess.run([sys.executable,os.path.join(H,'bump-version.py'),d])
