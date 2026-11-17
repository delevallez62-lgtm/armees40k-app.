#!/usr/bin/env python3
"""Applique des noms français OFFICIELS sourcés au bloc `fr` : confirmés (ok:true, affichés en français) ou à relire (ok:false, proposition).
Usage : apply-names.py <data/biblio> <out.json> [--doubtful "nom en;nom en"] ; out.json = [{en,fr,url,preuve}]"""
import sys,json,os,hashlib,datetime,re
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from frlib import *
d,f=sys.argv[1],sys.argv[2]
doubt=set()
if '--doubtful' in sys.argv:doubt={nk(x) for x in sys.argv[sys.argv.index('--doubtful')+1].split(';')}
man,ch=load_chunks(d);S=strings(ch)
byn={}
for k,(t,kind,p) in S.items():
    if kind=="nom d'unité":byn[nk(t)]=(k,t)
fr=ch.get('fr');n_ok=n_chk=0;miss=[]
for x in json.load(open(f,encoding='utf8')):
    en,t=x['en'].strip(),x['fr'].strip()
    hit=byn.get(nk(en))
    if not hit:miss.append(en);continue
    k,real=hit
    if sorted(re.findall(r'\d+',real))!=sorted(re.findall(r'\d+',t)):miss.append(en+' (nombres)');continue
    cur=fr['tr'].get(k) or {}
    if str(cur.get('src','')).startswith('liste fournie'):continue  # nom fourni par l'utilisateur : jamais remplacé
    ok=nk(en) not in doubt
    fr['tr'][k]={'fr':t,'at':datetime.date.today().isoformat(),'ok':ok,'src':x.get('url','')}
    n_ok+=ok;n_chk+=not ok
fr['count']=len(fr['tr'])
raw=json.dumps(fr,ensure_ascii=False,separators=(',',':'))
open(os.path.join(d,'fr.json'),'w',encoding='utf8').write(raw)
man['chunks']=[c for c in man['chunks'] if c['id']!='fr']
man['chunks'].append({'id':'fr','file':'fr.json','sha1':hashlib.sha1(raw.encode()).hexdigest(),'bytes':len(raw.encode()),'counts':{'translations':len(fr['tr'])}})
open(os.path.join(d,'manifest.json'),'w',encoding='utf8').write(json.dumps(man,ensure_ascii=False,indent=1))
print('confirmés',n_ok,'à relire',n_chk,'sans correspondance dans la bibliothèque',miss)
