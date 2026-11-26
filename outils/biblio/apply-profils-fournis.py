#!/usr/bin/env python3
"""Intègre les profils / effets d'équipement fournis (profils-fournis/*.csv) dans equip-effets.json.
Additif : ne remplace jamais un profil déjà présent dans la bibliothèque (ils servent seulement quand la
bibliothèque n'a rien). Les écarts avec la bibliothèque sont listés dans rapports/profils-fournis-ecarts.md."""
import csv,glob,json,re,os,unicodedata
D=os.path.dirname(os.path.abspath(__file__));R=os.path.dirname(os.path.dirname(D))
def nk(s):
    s=unicodedata.normalize('NFD',str(s or '').lower());s=''.join(c for c in s if unicodedata.category(c)!='Mn')
    return re.sub(r'[^a-z0-9]+',' ',s).strip()
def pl(s): return re.sub(r'(?<=\w)s\b','',nk(s))
lib={}
for f in glob.glob(R+'/data/biblio/wp-*.json'):
    for u in json.load(open(f,encoding='utf8')).get('units',[]):
        lib.setdefault(nk(u['n']),[]).append(u)
out=[];ec=[];seen=set()
for f in sorted(glob.glob(D+'/profils-fournis/*.csv')):
    for r in csv.DictReader(open(f,encoding='utf-8-sig'),delimiter=';'):
        if not r.get('element_nom_en'):continue
        if not r['statut_verification'].startswith('Confirmé'):continue
        u=nk(r['unite_nom_source']);en=r['element_nom_en'].strip();t=r['type_profil']
        e={'u':u,'en':en,'fr':r['element_nom_fr'].strip(),'s':r['statut_verification'],'src':r['source_url']}
        if t.startswith('Équipement'):
            e['k']='fx';e['fx']=r['aptitudes_ou_effet'].strip()
        else:
            e['k']='w';e['m']=t.startswith('Corps');e['r']=r['portee'].strip().replace('"','"')
            e['a']=r['attaques'];e['h']=r['CT_CC'];e['f']=r['force'];e['p']=r['PA'];e['d']=r['degats']
            e['caps']=[x.strip() for x in re.split(r';',r['aptitudes_ou_effet']) if x.strip()]
            # comparaison avec la bibliothèque
            for lu in lib.get(u,[]):
                for w in (lu.get('mw') if e['m'] else lu.get('rw')) or []:
                    if pl(w['n'])==pl(en):
                        vals=[str(w.get(k,'')).replace('"','').replace('+','') for k in('a','sk','s','ap','d')]
                        mine=[str(e[k]).replace('"','').replace('+','').replace('—','') for k in('a','h','f','p','d')]
                        vals=[('' if v in('-','—','–') else v) for v in vals];mine=[('' if v in('-','—','–') else v) for v in mine]
                        if vals!=mine: ec.append(f"- {r['unite_nom_source']} · {en} ({t}) : bibliothèque {vals} ≠ fourni {mine}")
        key=(u,nk(en),e['k'],e.get('m'))
        if key in seen:continue
        seen.add(key);out.append(e)
json.dump(out,open(D+'/equip-effets.json','w',encoding='utf8'),ensure_ascii=False,separators=(',',':'))
os.makedirs(D+'/rapports',exist_ok=True)
open(D+'/rapports/profils-fournis-ecarts.md','w',encoding='utf8').write("# Profils fournis : écarts avec la bibliothèque\n\n"+("\n".join(ec) if ec else "Aucun écart : tous les profils fournis correspondent à la bibliothèque.")+"\n")
print(len(out),'entrées ;',len(ec),'écarts')
