#!/usr/bin/env python3
"""Relève référence → code-barres (EAN) des peintures sur les fiches de railwaymates.com (base collaborative de couleurs).
Usage : scrape-mates.py <sortie.json> ; courtois : 3 requêtes simultanées, en-tête honnête. Ne conserve que (marque, référence, EAN valide)."""
import sys,re,json,time,urllib.request,concurrent.futures as cf
BR={'scale75--683':'Scale75','tamiya--655':'Tamiya','tamiya-color-lacquer-paint--834':'Tamiya','ak-real-colors--799':'AK Real Color','ak-3rd-generation--892':'AK Interactive','ak-3rd-generation-afv--976':'AK Interactive','ak-3rd-generation-air--978':'AK Interactive','ak-3rd-generation-figure--977':'AK Interactive','ak-interactive--677':'AK Interactive','ammo-by-mig-jimenez--682':'AMMO by Mig Jimenez','the-army-painter--674':'Army Painter','citadel--672':'Citadel Colour','humbrol--652':'Humbrol','mission-models--772':'Mission Models','mr-color--657':'Mr Hobby','mr-aqueous-hobby-color--648':'Mr Hobby','vallejo-game-color--804':'Vallejo','vallejo-model-color--827':'Vallejo','vallejo-model-air--763':'Vallejo','vallejo-game-air--805':'Vallejo','vallejo-hobby-paint--869':'Vallejo','vallejo-mecha-colors--831':'Vallejo','vallejo-metal-color--808':'Vallejo','vallejo-model-wash--807':'Vallejo','vallejo-panzer-aces--806':'Vallejo','vallejo-premium-airbrush-colors--829':'Vallejo','vallejo-surface-primer--809':'Vallejo'}
H={'User-Agent':'Mozilla/5.0 (compatible; catalogue-peintures-perso)'}
def get(u):
    for k in range(3):
        try:return urllib.request.urlopen(urllib.request.Request(u,headers=H),timeout=30).read().decode('utf8','ignore')
        except Exception:time.sleep(2)
def ok13(e):return len(e)==13 and e.isdigit() and (10-sum(int(c)*(3 if i%2 else 1) for i,c in enumerate(e[:12]))%10)%10==int(e[12])
def page(a):
    br,u=a;h=get('https://www.railwaymates.com'+u)
    if not h:return None
    t=re.sub(r'<[^>]+>',' ',h[h.find('Facts'):h.find('Facts')+900]);t=re.sub(r'\s+',' ',t)
    m=re.search(r'Name: (.*?) Color: (.*?) EAN: (\d+)',t)
    if m and ok13(m.group(3)):return {'b':br,'n':m.group(1).strip(),'c':m.group(2).strip(),'e':m.group(3)}
if __name__=='__main__':
    jobs=[]
    for slug,br in BR.items():
        h=get('https://www.railwaymates.com/colors/'+slug) or ''
        ls=sorted(set(re.findall(r'href="?(/colors/'+re.escape(slug)+r'/[^" >]+)',h)))
        print(slug,len(ls),flush=True);jobs+=[(br,u) for u in ls]
    res=[]
    with cf.ThreadPoolExecutor(3) as ex:
        for i,r in enumerate(ex.map(page,jobs)):
            if r:res.append(r)
            if i%200==0:print(i,len(jobs),len(res),flush=True)
    json.dump(res,open(sys.argv[1],'w'),ensure_ascii=False)
    print('relevés',len(res),'sur',len(jobs))
