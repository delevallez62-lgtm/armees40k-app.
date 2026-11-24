#!/usr/bin/env python3
"""Catalogue de peintures (marque, nom, teinte, type, codes-barres) pour la lecture de pots par code-barres.
Source : WarHub/warhub-catalog (licence MIT) — https://warhub.github.io/warhub-catalog/ (paints.json + barcodes.json).
Usage : build-paints.py <dossier avec paints.json et barcodes.json> <data/biblio>
Ajoute/actualise le fragment `paints` et la version (+paXXXXXX) du manifeste ; ne modifie rien d'autre."""
import sys,json,os,hashlib,re,datetime
src,out=sys.argv[1],sys.argv[2]
P=json.load(open(os.path.join(src,'paints.json'),encoding='utf8'))
B=json.load(open(os.path.join(src,'barcodes.json'),encoding='utf8'))['barcodes']
ean={}
for code,recs in B.items():
    for r in recs:
        if r.get('catalog')=='paint':ean.setdefault(r['id'],[]).append(code)
# Complément : codes-barres des pots listés comme « produits » (ex. AK Interactive), rapprochés par référence (AK11044, RC015…).
# Seuls les rapprochements sûrs sont gardés : code EAN-13 valide, référence retrouvée dans le produit, une seule correspondance.
prod_q={}
pf=os.path.join(src,'products.json')
if os.path.exists(pf):
    def ok13(e):return len(e)==13 and e.isdigit() and (10-sum(int(c)*(3 if i%2 else 1) for i,c in enumerate(e[:12]))%10)%10==int(e[12])
    MAN={'ak-interactive':('AK Interactive','AK Real Color','AMMO by Mig Jimenez')}
    try:
        PR=json.load(open(pf,encoding='utf8'))['products']
    except Exception:
        PR=[]
    byc={}
    for x in PR:
        m=x.get('manufacturer')
        if m not in MAN or x.get('category')!='paint' or not ok13(str(x.get('ean') or '')):continue
        txt=' '.join(str(x.get(k) or '') for k in('productCode','url','imageUrl','id')).upper().replace('-',' ')
        for c in {re.sub(r'\s','',c) for c in re.findall(r'(?<![A-Z0-9])(?:AK|RC)\s?\d{2,5}',txt)}:
            byc.setdefault((m,c),{})[x['ean']]=x.get('eanConfidence')
    taken={c for v in ean.values() for c in v}
    cnt=0
    for p in P['paints']:
        if p['id'] in ean:continue
        for m,bl in MAN.items():
            if p['brand'] in bl:
                k=(m,re.sub(r'[\s-]','',(p.get('productCode') or '').upper()));d=byc.get(k)
                if d and len(d)==1:
                    e,cf=next(iter(d.items()))
                    if e not in taken:
                        ean[p['id']]=[e];taken.add(e);cnt+=1
                        if cf!='confirmed':prod_q[p['id']]=1
    print('codes-barres ajoutés depuis les produits :',cnt,'(dont à confirmer :',len(prod_q),')')
brands=sorted({p['brand'] for p in P['paints']});bi={b:i for i,b in enumerate(brands)}
# Complément : codes relevés sur des pages produit (fichier data/biblio/ak-ean.json), rapprochés par référence ; codes déjà pris ignorés.
xf=os.path.join(out,'ak-ean.json')
if os.path.exists(xf):
    XC=json.load(open(xf,encoding='utf8')).get('codes',{});taken={c for v in ean.values() for c in v};nx=0
    for p in P['paints']:
        k=re.sub(r'[\s-]','',(p.get('productCode') or '').upper())
        if p['id'] not in ean and k in XC and XC[k] not in taken:
            ean[p['id']]=[XC[k]];taken.add(XC[k]);nx+=1
    print('codes-barres ajoutés depuis ak-ean.json :',nx)
# Complément : codes relevés sur des pages produit de revendeur (data/biblio/shop-ean.json), rangés par marque puis par référence.
sf=os.path.join(out,'shop-ean.json')
if os.path.exists(sf):
    SC=json.load(open(sf,encoding='utf8')).get('codes',{});taken={c for v in ean.values() for c in v};ns=0
    for p in P['paints']:
        e=(SC.get(p['brand']) or {}).get(p.get('productCode') or '')
        if p['id'] not in ean and e and e not in taken and len(e)==13 and e.isdigit():
            ean[p['id']]=[e];taken.add(e);ns+=1
    print('codes-barres ajoutés depuis shop-ean.json :',ns)
rows=[]
for p in sorted(P['paints'],key=lambda x:(x['brand'],x.get('range') or '',x['name'])):
    hx=(p.get('hex') or '').lower();hx=hx if re.match(r'^#[0-9a-f]{6}$',hx) else ''
    if not hx and p['id'] not in ean:continue
    r={'b':bi[p['brand']],'n':p['name'],'h':hx}
    if p.get('type'):r['t']=p['type']
    if p.get('range'):r['r']=p['range']
    if p.get('finish') and p['finish']!='Matte':r['f']=p['finish']
    if p.get('volumeMl'):r['v']=p['volumeMl']
    if p.get('productCode'):r['c']=p['productCode']
    if p['id'] in ean:r['e']=sorted(set(ean[p['id']]))
    if p['id'] in prod_q:r['q']=1
    if p.get('status') and p['status']!='current':r['s']=p['status']
    rows.append(r)
n_ean=sum(len(r.get('e',[])) for r in rows)
if len(rows)<5000 or n_ean<3000:sys.exit(f"Catalogue de peintures incomplet ({len(rows)} peintures, {n_ean} codes) : mise à jour refusée")
body={'schema':1,'id':'paints','source':'WarHub/warhub-catalog (MIT) — catalogue de peintures et codes-barres','catalogVersion':P.get('version'),'brands':brands,'paints':rows}
raw=json.dumps(body,ensure_ascii=False,separators=(',',':'))
mp=os.path.join(out,'manifest.json');man=json.load(open(mp,encoding='utf8'))
fp=os.path.join(out,'paints.json');old=open(fp,encoding='utf8').read() if os.path.exists(fp) else ''
if old==raw and any(c['id']=='paints' for c in man['chunks']):print('inchangée (peintures)');sys.exit(0)
open(fp,'w',encoding='utf8').write(raw)
h=hashlib.sha1(raw.encode()).hexdigest()
man['chunks']=[c for c in man['chunks'] if c['id']!='paints']
man['chunks'].append({'id':'paints','file':'paints.json','sha1':h,'bytes':len(raw.encode()),'counts':{'paints':len(rows),'barcodes':n_ean,'brands':len(brands)}})
v=re.sub(r'\+pa[0-9a-f]+','',man['version']);tag='+pa'+h[:6]
v=v.replace('+wp',tag+'+wp',1) if '+wp' in v else (v.replace('+fr',tag+'+fr',1) if '+fr' in v else v+tag)
man['version']=v;man['source']['paints']={'source':'WarHub/warhub-catalog (MIT)','version':P.get('version'),'synchronised':datetime.date.today().isoformat()}
open(mp,'w',encoding='utf8').write(json.dumps(man,ensure_ascii=False,indent=1))
print(f"peintures : {len(rows)} ({n_ean} codes-barres, {len(brands)} marques) · version {v}")
