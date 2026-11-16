#!/usr/bin/env python3
"""Liste les textes anglais pas encore traduits (priorité : noms, puis textes courts, puis longs).
Usage : todo-translate.py <data/biblio> [N=120] [i/n]  → JSON [{k,en,kind}] sur la sortie standard.
  i/n : ne garde que le lot i sur n (répartition par empreinte) pour travailler à plusieurs en parallèle.
Les options d'équipement, équipements de base et compositions sont traduits par les règles de l'application : ils sont exclus ici."""
import sys,json,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from frlib import *
d=sys.argv[1];N=int(sys.argv[2]) if len(sys.argv)>2 else 120
shard=None
if len(sys.argv)>3 and '/' in sys.argv[3]:
    i,n=sys.argv[3].split('/');shard=(int(i),int(n))
SKIP={"option d'équipement","équipement de base","composition"}
man,ch=load_chunks(d);S=strings(ch)
done=set((ch.get('fr') or {}).get('tr',{}).keys())
todo=[(pri,len(t),k,t,kind) for k,(t,kind,pri) in S.items() if k not in done and kind not in SKIP and (shard is None or int(k,16)%shard[1]==shard[0]-1)]
todo.sort()
print(json.dumps([{'k':k,'en':t,'kind':kind} for pri,l,k,t,kind in todo[:N]],ensure_ascii=False,indent=1),file=sys.stdout)
print('# restants :',len(todo),file=sys.stderr)
