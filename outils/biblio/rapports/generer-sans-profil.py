#!/usr/bin/env python3
"""Génère armes-sans-profil.md/.csv depuis sp.json (sortie de window.BLDSP() dans l'appli)."""
import json,re,csv,sys
d=json.load(open(sys.argv[1]))['out']
gear=re.compile(r"shield|icon|crest|banner|standard|vox|familiar|drone|augur|spotter|launcher|armour|armor|hull|backpack|pack|beacon|comm|medi|narthecium|reliquary|apothecary|tools?|servo|cloak|helm|field|projector|generator|auspex|trophy|scanner|totem|bell|relic|book|ammo|flag|horn|sensor|talisman|stealth|grenade|bomb|mine|flare|smoke|jump|bike|mount|wheel|tracks|tendril|marker|symbol|lantern|vial|bionic|jammer|optic|sight|data|pennant|censer|chalice|dais|goggle|cog|crown|laurel|scroll",re.I)
rows=[]
for u in d:
  for m in u['miss']:
    k="Équipement (non-arme probable)" if gear.search(m['n']) else "Arme sans profil"
    rows.append((k,u['fac'],u['unit'],m['n'],m['role'],u['stats'],u['loadout'].replace('**',''),' | '.join(u['known'])))
rows.sort(key=lambda r:(r[0]!="Arme sans profil",r[1],r[2],r[3]))
with open('armes-sans-profil.csv','w',newline='',encoding='utf-8-sig') as f:
  w=csv.writer(f,delimiter=';');w.writerow(["Catégorie","Faction","Unité","Élément sans profil","Rôle","Caractéristiques de l'unité","Équipement de base (texte source)","Armes connues de l'unité"]);w.writerows(rows)
A=[r for r in rows if r[0]=="Arme sans profil"];G=[r for r in rows if r[0]!="Arme sans profil"]
md=["# HAMMER — Armes et équipements sans profil","",f"**{len(d)} unités** contiennent au moins un élément sans profil dans les données (après intégration des profils fournis). Aucune caractéristique n'est inventée.","",f"- Armes probables sans profil : **{len(A)}** lignes",f"- Équipements non-armes probables : **{len(G)}** lignes","","Classement arme / équipement automatique (mots-clés), approximatif.",""]
for title,L in (("Armes sans profil",A),("Équipements (non-armes probables)",G)):
  md+=[f"## {title}",""];cur=None;uc=None
  for k,fac,un,n,role,st,lo,kn in L:
    if fac!=cur: md+=[f"### {fac}",""];cur=fac;uc=None
    if un!=uc:
      md+=[f"**{un}** — {st}"]
      if lo: md+=[f"  - Équipement de base (source) : {lo}"]
      if kn: md+=[f"  - Armes avec profil : {kn}"]
      uc=un
    md+=[f"  - ❓ `{n}` ({role})"]
  md+=[""]
open('armes-sans-profil.md','w').write("\n".join(md))
print(len(A),len(G))
