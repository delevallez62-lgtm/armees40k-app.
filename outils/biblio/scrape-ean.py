#!/usr/bin/env python3
"""Relève des codes-barres (GTIN/EAN-13) de peintures sur les pages produit d'un revendeur (balisage « sku » + « gtin »).
Usage : scrape-ean.py <fichier d'URL, une par ligne> <sortie.json> [simultanés=6]
Courtois : un en-tête honnête, peu de requêtes en parallèle, rien n'est stocké hors du couple référence → code."""
import sys,re,json,time,urllib.request,concurrent.futures as cf
src,out=sys.argv[1],sys.argv[2];par=int(sys.argv[3]) if len(sys.argv)>3 else 6
urls=[u.strip() for u in open(src) if u.strip()]
def ok13(e):return len(e)==13 and e.isdigit() and (10-sum(int(c)*(3 if i%2 else 1) for i,c in enumerate(e[:12]))%10)%10==int(e[12])
def one(u):
    for k in range(2):
        try:
            r=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0 (compatible; catalogue-peintures-perso)'})
            h=urllib.request.urlopen(r,timeout=30).read().decode('utf8','ignore')
            sku=re.search(r'"sku"\s*:\s*"([^"]+)"',h);g=re.search(r'"gtin(?:13|12|8)?"\s*:\s*"?(\d{8,14})"?',h);nm=re.search(r'<title>([^<|–-]+)',h)
            if sku and g:
                e=g.group(1).zfill(13) if len(g.group(1))<13 else g.group(1)
                return {'u':u,'sku':sku.group(1).strip(),'gtin':e,'n':(nm.group(1).strip() if nm else '')}
            return None
        except Exception as ex:
            time.sleep(1.5)
    return None
res=[]
with cf.ThreadPoolExecutor(par) as ex:
    for i,r in enumerate(ex.map(one,urls)):
        if r and ok13(r['gtin']):res.append(r)
        if i%100==0:print(i,len(res),flush=True)
json.dump(res,open(out,'w'),ensure_ascii=False,indent=0)
print('relevés',len(res),'sur',len(urls))
