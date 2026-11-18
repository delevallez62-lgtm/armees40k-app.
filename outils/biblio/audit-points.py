#!/usr/bin/env python3
"""Contrôle automatique : les points par nombre de figurines de la bibliothèque correspondent-ils au fichier Datasheets_models_cost.csv de Wahapedia ?
Usage : audit-points.py <dossier CSV Wahapedia> <data/biblio>   → code 1 si moins de 97 % des fiches sont conformes (la publication est alors bloquée)."""
import csv,re,sys,os,collections
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from frlib import load_chunks
wp,d=sys.argv[1],sys.argv[2];man,ch=load_chunks(d)
D=collections.defaultdict(list)
for r in list(csv.reader(open(os.path.join(wp,'Datasheets_models_cost.csv'),encoding='utf-8-sig'),delimiter='|'))[1:]:
    if len(r)>=4 and r[0].strip().isdigit():D[r[0].zfill(9)].append((int(r[1]) if r[1].isdigit() else 0,r[2].strip(),r[3].strip()))
def expected(lines):
    lines.sort();tiers={};cur=None;wg=[];mode=None
    for ln,desc,cost in lines:
        up=desc.upper();m=re.match(r'YOUR (?:UNIT COSTS|(\d+)(?:ST|ND|RD|TH)(\+)? UNITS?(?: COSTS?)?|(\d+)(?:ST|ND|RD|TH) TO (\d+)(?:ST|ND|RD|TH) UNITS? COSTS?)',up)
        if m:
            if up.startswith('YOUR UNIT COSTS'):a,b=1,None
            elif m.group(3):a,b=int(m.group(3)),int(m.group(4))
            else:a=int(m.group(1));b=None if m.group(2) else a
            cur=tiers.setdefault((a,b),{'a':a,'b':b,'sz':[]});mode='u';continue
        if up=='WARGEAR OPTIONS':mode='w';continue
        if up.startswith('PER ') and cost.isdigit():wg.append(int(cost));continue
        mm=re.match(r'(\d+)(?:-(\d+))? MODELS?$',up)
        if mm and cost.isdigit() and cur is not None and mode=='u':
            x=(int(mm.group(1)),int(cost),int(mm.group(2)) if mm.group(2) else None)
            if not any(y[0]==x[0] and y[2]==x[2] for y in cur['sz']):cur['sz'].append(x)
    t=sorted(tiers.values(),key=lambda x:x['a'])
    for x in t:x['sz'].sort(key=lambda y:y[0])
    return [x for x in t if x['sz']],wg
def key(tiers):return [(t['a'],t['b'],[(z['n'],z['pts'],z.get('m')) for z in t['sz']]) for t in tiers]
def exk(ex):return [(t['a'],t['b'],[tuple(z) for z in t['sz']]) for t in ex]
tot=ok=0;bad=[];seen=set()
for cid,c in ch.items():
    for u in c.get('units',[]):
        wpd=u.get('wp') or {};did=u['id'][2:] if str(u['id']).startswith('w-') else None;pc=wpd.get('pc')
        if not did and 'ext' in c:pass
        if not did or did not in D:continue
        seen.add(did);tot+=1;ex,_=expected(list(D[did]))
        got=key(pc['tiers']) if pc else []
        if got==exk(ex):ok+=1
        else:bad.append(u['n'])
# unités BSData fusionnées avec Wahapedia (ext)
for cid,c in ch.items():
    for k,e in (c.get('ext') or {}).items():
        did=str(e.get('id',''))[2:]
        if did not in D or did in seen:continue
        tot+=1;ex,_=expected(list(D[did]));pc=e.get('pc')
        if pc and key(pc['tiers'])==exk(ex):ok+=1
        else:bad.append(e.get('n',k))
pct=100*ok/max(1,tot)
print(f"points par effectif : {ok}/{tot} fiches conformes à Wahapedia ({pct:.1f} %)")
for n in bad[:25]:print("  écart :",n)
sys.exit(0 if pct>=97 and tot>1000 else 1)
