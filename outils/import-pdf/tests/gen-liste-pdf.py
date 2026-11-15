import random,json,sys
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth
FS=11.4;LH=14.0
def W(s,f='Helvetica',z=FS):return stringWidth(s,f,z)
def wrap(txt,wd,f='Helvetica',z=FS):
    out=[];cur=''
    for w in txt.split(' '):
        t=(cur+' '+w).strip()
        if W(t,f,z)<=wd or not cur:cur=t
        else:out.append(cur);cur=w
    if cur:out.append(cur)
    return out
LAB=['Commandant Suprême','Les Gars du Grand Chef','Waaagh!','Appui','Destruction Néfaste D3','Transport - 12','Pont de Tir 12','Sentier d’la Guerre','Déferlante de Muscles','Jamais Trop Occupé pour Se Battre','Klouez-les','Eul\' Boss','Makai, Lèv\' c\'te Bannière !','Prophète de la Grand\' Waaagh!','Chef de Meute','Furie des Bêtes','Tir de Barrage','Mort ou Gloire','Agent Solitaire','Leader : Boyz','Bouclier Ionique 4+','Défenseur Implacable des Terres Ancestrales','Appui Boyz et Alpagueurs','Bénédiction de l\'Empereur : Gloire']
BOD=['Une fois par bataille, vous pouvez utiliser cette aptitude. Dans ce cas :\n- Sur un jet de 1, cette unité est ébranlée.\n- Placez cette unité en réserve stratégique.\nPlacez un pion à côté de l\'unité et retirez-le une fois cette aptitude utilisée.','Tant que cette unité est à 3ps ou moins d’une autre unité d’INFANTERIE amie, elle a Agent Solitaire.','À la phase de Combat, si cette unité a fait un mouvement de charge à ce tour, ses attaques de mêlée ont [TOUCHES FATALES].','À votre phase de Tir, quand cette unité est choisie pour tirer, vous pouvez utiliser cette aptitude. Dans ce cas, les attaques de tir de cette unité ont +1 aux jets de touche.','Quand cette figurine est détruite, jetez 1 D6. Sur 6, chaque unité à 6ps subit D3 BM.','Cette figurine a une capacité de transport de 12 figurines d\'INFANTERIE ORK. Chaque figurine en MÉGA-ARMURE occupe la place de 2 figurines.','Avant la bataille, doit être attaché à une unité pour former une unité Attachée.','Si Transport tire, choisir 1 arme de jusqu’à 12 figurines embarquées ; ce Transport compte comme étant équipé de ces armes.']
NAMES=['GHAZGHKULL THRAKA','BIZARBOY','BOYZ','KAMION','MOTOCH\'NILL\'','GRANDS ESCORTEURS DE LA MORT','MÉGANOBZ','TRUKK DE GUERRE','NOB AVEC ARME DE KOMBAT','GROTS KOLLECTIFS','SEIGNEUR DE GUERRE NÉCRON','IMMORTELS']
WN=['Lance-rokettes de Siège Kustomisée à Charges Multiples - Mode Kikass','Fling\'','Kalibr\'','Kikoup\'','Kombi-karbo - Fling\'','Kombi-karbo - Karbonizeur','Lanceur Multi-klateur','Rugissement de Mork - Ajusté','Double Gros Fling’','Lance-rokettes - Kiklat’','Pince de Gork','Éclateur gauss','Bâton eud\' Cuivre']
CAP=['Tir Rapide 4, Touches Fatales Non-Monstre/Véhicule, Déflagration 2, Attaques bonus, Blessures dévastatrices, Précision, Abattage 2','Tir Rapide 4, Touches Fatales Non-Monstre/Véhicule','Déflagration 1, Torrent','Attaques bonus, Blessures dévastatrices, Précision','Abattage 2','Combat Rapproché, Torrent','']
KW=['Infanterie','Personnage','Boss de Guerre','Explosifs','Véhicule','Transport','Fondus d\'la Vitess','Psyker']
CATS=['Héros épiques','Personnages','Ligne','Montés','Transports assignés','Véhicules','Infanterie']
def mk(seed):
    R=random.Random(seed);units=[]
    for nm in R.sample(NAMES,R.randint(3,6)):
        u={'name':nm,'pts':R.choice([40,60,85,110,290]),'size':R.choice([None,None,5,10])}
        u['stats']=[str(R.choice([5,6,8,12])),str(R.randint(3,10)),R.choice(['2+','3+/5++','4+','5+']),str(R.randint(1,16)),R.choice(['6+','7+']),str(R.randint(1,4))]
        ws=[]
        for w in R.sample(WN,R.randint(2,5)):
            ws.append({'name':w,'rng':R.choice(['12','18','24','36','Mêlée']),'a':R.choice(['1','2','3','2D6+2','D3+3']),'hit':R.choice(['3+','4+','5+','-']),'f':str(R.randint(3,14)),'pa':R.choice(['0','-1','-2']),'d':R.choice(['1','2','D3','D3+3']),'caps':R.choice(CAP)})
        u['w']=ws
        u['equip']=', '.join(w['name']+(' (%d)'%R.randint(2,9) if R.random()<.5 else '') for w in ws[:3])
        u['abs']=[(R.choice(LAB),' \n'.join(R.sample(BOD,R.randint(1,3)))) for _ in range(R.randint(2,8))]
        seen=set();u['abs']=[a for a in u['abs'] if not(a[0] in seen or seen.add(a[0]))]
        u['kw']=', '.join(R.sample(KW,3));u['cat']=R.choice(CATS)
        if R.random()<.35:
            u['pf']=[(u['name'].title(),u['stats']),('Boss Nob',[u['stats'][0],u['stats'][1],u['stats'][2],str(int(u['stats'][3])+2),u['stats'][4],u['stats'][5]])]
        units.append(u)
    dets=[]
    for d in R.sample(['Bande de Dreds','Dérouilleurs','Boss brutes','Waaagh! Tribal'],R.randint(1,3)):
        dets.append({'name':d,'cost':R.randint(0,30),'rule':' '.join(R.sample(BOD,R.randint(1,3))).replace('\n',' ')})
    strats=[]
    for d in dets:
        for i in range(R.randint(0,3)):
            strats.append({'det':d['name'],'name':R.choice(['Koloss piétineur','Marcheur Vénère','Ravages déments','Armés Jusk\'aux Dents','Trop arrogants pour mourir','Brutes énormes']),'cp':R.choice([1,2]),'body':'À votre phase de Mouvement, quand une unité de MARCHEUR ORK amie est choisie. CIBLE : Cette unité. EFFET : Votre unité a le mot-clé MOBILE.'})
    return {'units':units,'dets':dets,'strats':strats,'fac':'Orks'}
def render(spec,path):
    c=canvas.Canvas(path,pagesize=(595,842));y=[815]
    def np():
        c.setFont('Helvetica',FS);c.drawString(356,19,'© 2026 https://40k.armylistnetwork.com');c.showPage();y[0]=815
    def chk():
        if y[0]<45:np()
    def line(x,s,f='Helvetica',z=FS):c.setFont(f,z);c.drawString(x,y[0],s)
    line(32,'Zektail : [Orks] Test','Helvetica-Bold',12);y[0]-=22
    if spec['dets']:
        line(36,'Détachement','Helvetica-Bold',12);y[0]-=22
        for d in spec['dets']:
            lab=wrap('Orks - %s (%d points)'%(d['name'],d['cost']),88);body=wrap(d['rule'],410)
            n=max(len(lab),len(body))
            for i in range(n):
                if i<len(lab):line(36,lab[i])
                if i<len(body):line(133,body[i])
                y[0]-=LH
        line(36,'Héros épiques','Helvetica-Bold',9.6)
    np()
    for k,u in enumerate(spec['units']):
        line(36,u['name'],'Helvetica-Bold',12);c.setFont('Helvetica',FS);c.drawRightString(543,y[0],str(u['pts'])) ;y[0]-=22
        xs=[49,80,107,152,182,212];c.setFont('Helvetica',FS)
        for i,h in enumerate(['M','E','SV','PV','CD','CO']):c.drawString(xs[i]-2,y[0],h)
        y[0]-=20
        rows=u.get('pf') or [(None,u['stats'])]
        for nm,st in rows:
            for i,v in enumerate(st):c.drawString(xs[i],y[0],v)
            if nm:c.drawString(250,y[0],nm)
            y[0]-=20
        hy=y[0]
        for x,t in [(153,'Portée'),(198,'A'),(215,'C/T'),(241,'F'),(256,'PA'),(279,'D'),(398,'Capacités')]:c.drawString(x,hy,t)
        y[0]-=20
        for w in u['w']:
            nl=wrap(w['name'],150);cl=wrap(w['caps'],185) if w['caps'] else []
            rh=max(len(nl),len(cl),1)*LH;yc=y[0]-rh/2+5
            for i,t in enumerate(nl):c.drawString(38,yc+(len(nl)-1)*LH/2-i*LH,t)
            for x,t in zip([165,199,218,242,259,280],[w['rng'],w['a'],w['hit'],w['f'],w['pa'],w['d']]):c.drawString(x,yc,t)
            for i,t in enumerate(cl):c.drawString(371,yc+(len(cl)-1)*LH/2-i*LH,t)
            y[0]-=rh+12
        y[0]-=8
        def kv(lab,val):
            ls=wrap(val,420);line(36,lab);c.drawString(36+W(lab)+3,y[0],': '+ls[0]) if False else None
            c.setFont('Helvetica',FS);c.drawString(36+W(lab),y[0],' : '+ls[0]);y[0]-=LH
            for t in ls[1:]:line(36,t);y[0]-=LH
        kv('Equipement',u['equip'])
        kv('Aptitudes',', '.join(a[0] for a in u['abs']))
        if u.get('pf'):
            line(36,u['pf'][1][0]);y[0]-=LH;kv('Equipement',', '.join(w['name'] for w in u['w'][-2:]))
        kv('Mots-clés',u['kw']);kv('Mots-clés de faction','Orks')
        y[0]-=6
        for lab,bd in u['abs']:
            ll=wrap(lab,90);bl=[];
            for pi,pp in enumerate(bd.split('\n')):
                bl+=wrap(pp.strip(),410)
                if pi<len(bd.split('\n'))-1 and False:bl.append('')
            for i in range(max(len(ll),len(bl))):
                chk()
                if i<len(ll):line(36,ll[i])
                if i<len(bl):line(134,bl[i])
                y[0]-=LH
            y[0]-=3
        line(36,u['cat'],'Helvetica-Bold',9.6)
        if k==len(spec['units'])-1:
            y[0]-=22;line(36,'Total','Helvetica-Bold',12);y[0]-=16;line(36,'%d points - %d figurines - %d unités - PC'%(sum(x['pts'] for x in spec['units']),20,len(spec['units'])))
        np()
    for s in spec['strats']:
        lab=wrap('Orks - %s : %s'%(s['det'],s['name']),92);bd=wrap(s['body'],410)
        line(36,lab[0]);line(147,'%d PC'%s['cp']);y[0]-=LH
        for i in range(1,max(len(lab),len(bd)+1)):
            if i<len(lab):line(36,lab[i])
            if i-1<len(bd):line(147,bd[i-1])
            y[0]-=LH
        y[0]-=4
    np();c.save()
if __name__=='__main__':
    seed=int(sys.argv[1]);spec=mk(seed);render(spec,'s%d.pdf'%seed);json.dump(spec,open('s%d.json'%seed,'w'),ensure_ascii=False)
