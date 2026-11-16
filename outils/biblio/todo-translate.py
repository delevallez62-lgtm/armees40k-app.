#!/usr/bin/env python3
"""Liste les textes anglais pas encore traduits (priorité : noms, puis textes courts, puis longs).
Usage : todo-translate.py <data/biblio> [N=120]  → JSON [{k,en,kind}] sur la sortie standard."""
import sys,json,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from frlib import *
d=sys.argv[1];N=int(sys.argv[2]) if len(sys.argv)>2 else 120
man,ch=load_chunks(d);S=strings(ch)
done=set((ch.get('fr') or {}).get('tr',{}).keys())
todo=[(pri,len(t),k,t,kind) for k,(t,kind,pri) in S.items() if k not in done]
todo.sort()
print(json.dumps([{'k':k,'en':t,'kind':kind} for pri,l,k,t,kind in todo[:N]],ensure_ascii=False,indent=1),file=sys.stdout)
print('# restants :',len(todo),'/',len(S),file=sys.stderr)
