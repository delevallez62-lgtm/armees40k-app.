#!/usr/bin/env python3
"""Intègre dans fr.json la bibliothèque d'armes constituée par recherche (niveaux A, B, C).
 A : traduction officielle GW (documents FR/EN)  -> ok:true  (affichée en français, 🟢), source = URL du document officiel
 B : ALN + document Kill Team concordent         -> ok:false (proposition 🟠 « à vérifier » : l'anglais reste affiché tant que non validée)
 C : ALN seul                                    -> ok:false (proposition 🟠)
Jamais d'écrasement : une traduction déjà confirmée (ok:true avec source) ou fournie par l'utilisateur est conservée ; les désaccords sont listés.
Usage : apply-bibliotheque-armes.py <data/biblio> [--dry]"""
import sys,os,csv,json,re,hashlib,datetime
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from frlib import *
H=os.path.dirname(os.path.abspath(__file__));d=sys.argv[1];dry='--dry' in sys.argv
B=list(csv.DictReader(open(os.path.join(H,'bibliotheque-armes-fr.csv'),encoding='utf-8-sig'),delimiter=';'))
U={r['nom anglais exact']:r for r in csv.DictReader(open(os.path.join(H,'armes-officielles-urls.csv'),encoding='utf-8-sig'),delimiter=';')}
man,ch=load_chunks(d);fr=ch['fr'];t=fr['tr'];today=datetime.date.today().isoformat()
S=lambda n:re.sub(r'^➤\s*','',n).strip()
n={'A':0,'B':0,'C':0};kept=[];confl=[];same=0;skipmode=[]
for r in B:
    en=r['nom anglais exact'];st=r['statut'];f=r['traduction française retenue'].strip()
    if st not in n or not f or not en.strip():continue
    if nk(f)==nk(S(en)):same+=1;continue
    # le nom anglais porte un mode (– standard, (Frag)…) mais le français l'a perdu : on n'applique pas (risque de confusion entre modes)
    if re.search(r'\s(?:[–—-]\s+\S|\()',S(en)) and not re.search(r'\s(?:[–—-]\s+\S|\()',f):skipmode.append(en);continue
    k=hh(S(en));cur=t.get(k)
    if cur and ((cur.get('ok') is True and cur.get('src')) or str(cur.get('src','')).startswith('liste fournie')):
        if nk(cur['fr'])!=nk(f):confl.append((en,cur['fr'],f,st,cur.get('src','')[:60]))
        kept.append(en);continue
    if st=='A':
        u=(U.get(en) or {}).get('URL officielle','').split(' | ')[0] or "document officiel Games Workshop"
        ent={'fr':f,'at':today,'ok':True,'src':u}
    else:
        ent={'fr':f,'at':today,'ok':False,'src':"ALN 40K (armylistnetwork.com, listes publiques CC BY-NC-SA)"+(" + document Kill Team" if st=='B' else "")+" — à vérifier"}
    if not dry:t[k]=ent
    n[st]+=1
print('appliquées',n,'| déjà confirmées / fournies (conservées)',len(kept),'| identiques à l\'anglais (ignorées)',same)
print('ignorées (mode perdu)',len(skipmode))
print('désaccords avec des traductions conservées :',len(confl))
for x in confl[:40]:print('  ',x)
json.dump(confl,open(os.path.join(H,'armes-desaccords.json'),'w'),ensure_ascii=False,indent=0) if not dry else None
if dry:sys.exit()
fr['count']=len(t);raw=json.dumps(fr,ensure_ascii=False,separators=(',',':'))
open(os.path.join(d,'fr.json'),'w',encoding='utf8').write(raw)
man['chunks']=[c for c in man['chunks'] if c['id']!='fr']
man['chunks'].append({'id':'fr','file':'fr.json','sha1':hashlib.sha1(raw.encode()).hexdigest(),'bytes':len(raw.encode()),'counts':{'translations':len(t)}})
open(os.path.join(d,'manifest.json'),'w',encoding='utf8').write(json.dumps(man,ensure_ascii=False,indent=1))
import subprocess;subprocess.run([sys.executable,os.path.join(H,'bump-version.py'),d])
