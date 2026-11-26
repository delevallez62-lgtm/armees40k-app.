#!/usr/bin/env python3
"""Intègre et VALIDE (ok:true, sur demande explicite de l'utilisateur) les noms relevés sur ALN 40K : unités, aptitudes, détachements, améliorations.
Jamais d'écrasement d'une traduction déjà confirmée avec une source (officielle ou fournie par l'utilisateur) : les cas listés dans aln-data/desaccords.json.
Usage : apply-aln-complet.py <data/biblio>"""
import sys,os,csv,json,hashlib,datetime,re
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from frlib import *
H=os.path.dirname(os.path.abspath(__file__));A=os.path.join(H,'aln-data');d=sys.argv[1]
man,ch=load_chunks(d);fr=ch['fr'];t=fr['tr'];today=datetime.date.today().isoformat()
SRC="ALN 40K (armylistnetwork.com, listes publiques CC BY-NC-SA) — validé par l'utilisateur le "+today
def rd(f):return list(csv.reader(open(os.path.join(A,f),encoding='utf-8-sig'),delimiter=';'))[1:]
cnt={};confl=[]
def put(kind,en,f,keep=False):
    """keep=True : on conserve le français actuel (confirmation d'une proposition existante)."""
    k=hh(en);cur=t.get(k);c=cnt.setdefault(kind,{'validées':0,'nouvelles':0,'conservées (déjà confirmées)':0})
    if cur and cur.get('ok') is True and cur.get('src'):
        if nk(cur['fr'])!=nk(f):confl.append((kind,en,cur['fr'],f))
        c['conservées (déjà confirmées)']+=1;return
    if cur and nk(cur['fr'])!=nk(en):
        if keep or nk(cur['fr'])==nk(f):cur['ok']=True;cur['src']=SRC;cur['at']=today;c['validées']+=1;return
    if not f or nk(f)==nk(en):return
    t[k]={'fr':f,'at':today,'ok':True,'src':SRC};c['nouvelles' if not cur else 'validées']+=1
for en,frn,st,*_ in rd('aln-aptitudes-fr.csv'):put('aptitudes',en,frn,keep=st.startswith('confirmée'))
# surnoms : un nom d'unité vu dans une seule liste (ou du type : "Surnom") est presque toujours un surnom de joueur -> ignoré
def surnom(frn,n):return int(n or 0)<2 or bool(re.match(r'^\s*:|["“”]',frn or ''))
for en,frn,n,*_ in rd('aln-unites-fr.csv'):
    if surnom(frn,n):cnt.setdefault('unités ignorées (vues 1 fois = surnoms probables)',{'ignorées':0})['ignorées']+=1;continue
    put('unités',en,frn)
for cid,den,cur_fr,ok,lab,*_ in rd('aln-detachements-fr.csv'):put('détachements',den,cur_fr or lab,keep=bool(cur_fr) and nk(cur_fr)==nk(lab))
for cid,den,enh,cur_fr,ok,meth,frn,*_ in rd('aln-ameliorations-fr.csv'):put('améliorations',enh,cur_fr if meth=='confirmée' else frn,keep=(meth=='confirmée'))
for k,v in cnt.items():print(k,v)
print('désaccords avec des traductions confirmées conservées :',len(confl))
json.dump(confl,open(os.path.join(A,'desaccords.json'),'w'),ensure_ascii=False,indent=0)
fr['count']=len(t);raw=json.dumps(fr,ensure_ascii=False,separators=(',',':'))
open(os.path.join(d,'fr.json'),'w',encoding='utf8').write(raw)
man['chunks']=[c for c in man['chunks'] if c['id']!='fr']
man['chunks'].append({'id':'fr','file':'fr.json','sha1':hashlib.sha1(raw.encode()).hexdigest(),'bytes':len(raw.encode()),'counts':{'translations':len(t)}})
open(os.path.join(d,'manifest.json'),'w',encoding='utf8').write(json.dumps(man,ensure_ascii=False,indent=1))
import subprocess;subprocess.run([sys.executable,os.path.join(H,'bump-version.py'),d])
