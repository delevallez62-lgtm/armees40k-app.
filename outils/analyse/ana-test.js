const A=require('./ana-engine.js');const fs=require('fs');
let pass=0,fail=0;const ok=(c,m)=>{if(c){pass++}else{fail++;console.log('ÉCHEC :',m)}};
const near=(a,b,e,m)=>ok(Math.abs(a-b)<=e,`${m} : obtenu ${a} attendu ${b} (±${e})`);
// --- dés
let d=A.parseDice('D6+3');ok(d&&d.avg===6.5&&d.min===4&&d.max===9,'D6+3');d=A.parseDice('D3');ok(d.avg===2&&d.max===3,'D3');d=A.parseDice('2D6');ok(d.avg===7&&d.max===12,'2D6');d=A.parseDice('6');ok(d.avg===6,'6');
ok(A.parseDice('')===null&&A.parseDice(null)===null&&A.parseDice('X')===null,'dés absents ⇒ null (donnée manquante)');
// --- tableau de blessure V11
[[8,4,2],[5,4,3],[4,4,4],[3,4,5],[2,4,6],[4,8,6],[9,4,2],[6,3,2],[3,6,6]].forEach(([F,E,r])=>ok(A.woundNeeded(F,E)===r,`blessure F${F} vs E${E} ⇒ ${r}+`));
// --- sauvegardes
near(A.saveFailProb(3,null,-1),.5,1e-9,'Sv3+ PA-1');near(A.saveFailProb(3,4,0),1/3,1e-9,'Sv3+/4++ PA0');near(A.saveFailProb(2,4,-3),3/6,1e-9,'Sv2+ PA-3 inv4');near(A.saveFailProb(null,5,-1),4/6,1e-9,'inv 5 seule');near(A.saveFailProb(2,null,0),1/6,1e-9,'1 naturel échoue toujours');
// --- caps
let c=A.parseCaps('Lourd, Tir Rapide 6, Touches Soutenues 1');ok(c.list.map(x=>x.id).join()==='LOURD,TIR_RAPIDE,TOUCHES_SOUTENUES'&&c.list[1].x===6&&c.list[2].x===1,'caps lourd/rapide/soutenues');
c=A.parseCaps('Anti-Véhicule 2+, Déflagration');ok(c.list[0].id==='ANTI'&&c.list[0].y===2&&c.list[0].kwTarget==='vehicule'&&c.list[1].id==='DEFLAGRATION','caps anti/deflagration');
c=A.parseCaps('Machin Inconnu, Torrent');ok(c.unknown.length===1&&c.list.length===1,'aptitude inconnue signalée');
c=A.parseCaps('Touches Soutenues 1: Infanterie/Bêtes');ok(c.list[0].kw.join()==='infanterie,betes','restriction par mot-clé');
// --- profils fictifs (tests de calcul uniquement)
const mk=(o)=>({name:o.name||'T',qty:1,size:o.size||null,pts:o.pts||100,stats:Object.assign({M:'6',E:'4',SV:'3+',PV:'1',CD:'7+',CO:'1'},o.stats),weapons:o.weapons||[],equip:o.equip||'',apt:o.apt||'',kw:o.kw||'Infanterie',fkw:'X',subs:o.subs||[]});
const W=(a,hit,f,pa,dd,caps,range)=>({name:'Arme',range:range||'24',a,hit,f,pa,d:dd,caps:caps||''});
const att=(w,n)=>A.toProfile(mk({size:n||1,weapons:[w],equip:'Arme ('+(n||1)+')'}));
const tg=(o)=>A.toProfile(mk(o));
const ctx=A.DEFCTX;
// base : 10 attaques CT3+ F4 contre E4 Sv3+ PA0 D1
let a=att(W('10','3+','4','0','1'),1),t=tg({size:30,stats:{PV:'1'}});
let w=a.groups[0].weapons[0];let e=A.expectedWeapon(w,t.groups[0],t,ctx);
near(e.hits,10*4/6,1e-9,'touches');near(e.wounds,10*4/6*3/6,1e-9,'blessures');near(e.damage,10*4/6*3/6*2/6,1e-9,'dégâts moyens base');
// touches soutenues 1
a=att(W('10','3+','4','0','1','Touches Soutenues 1'));w=a.groups[0].weapons[0];e=A.expectedWeapon(w,t.groups[0],t,ctx);
near(e.hits,10*(4/6+1/6),1e-9,'soutenues : touches +1/6');near(e.damage,e.hits*3/6*2/6,1e-9,'soutenues : dégâts');
// touches fatales : touche critique blesse automatiquement
a=att(W('10','3+','4','0','1','Touches Fatales'));w=a.groups[0].weapons[0];e=A.expectedWeapon(w,t.groups[0],t,ctx);
near(e.wounds,(10*3/6)*3/6+10/6,1e-9,'fatales : blessures');
// blessures dévastatrices : blessure critique ⇒ blessures mortelles = D, sans sauvegarde
a=att(W('10','3+','4','0','3','Blessures Dévastatrices'));w=a.groups[0].weapons[0];t=tg({size:30,stats:{PV:'3'}});e=A.expectedWeapon(w,t.groups[0],t,ctx);
const hits=10*4/6,critW=hits*1/6,normW=hits*2/6;near(e.mortal,critW*3,1e-9,'dévastatrices : mortelles');near(e.damage,normW*(2/6)*3+critW*3,1e-9,'dévastatrices : total');
// anti-véhicule 4+ contre véhicule : blessure critique dès 4 non modifié
a=att(W('10','3+','4','0','1','Anti-Véhicule 4+'));w=a.groups[0].weapons[0];let tv=tg({size:1,stats:{E:'8',PV:'12'},kw:'Véhicule'});e=A.expectedWeapon(w,tv.groups[0],tv,ctx);
near(e.wounds,10*4/6*3/6,1e-9,'anti : F4 vs E8 = 6+ normalement ; avec anti 4+ ⇒ 4,5,6');
let tn=tg({size:1,stats:{E:'8',PV:'12'},kw:'Infanterie'});e=A.expectedWeapon(w,tn.groups[0],tn,ctx);near(e.wounds,10*4/6*(1/6),1e-9,'anti inactif hors mot-clé');
// couvert : CT dégradée de 1
a=att(W('10','3+','4','0','1'));w=a.groups[0].weapons[0];t=tg({size:30});e=A.expectedWeapon(w,t.groups[0],t,{...ctx,cover:true});near(e.hits,10*(1/6+2/6),1e-9,'couvert : CT3+→4+');
// couvert ignoré
a=att(W('10','3+','4','0','1','Ignore le Couvert'));w=a.groups[0].weapons[0];e=A.expectedWeapon(w,t.groups[0],t,{...ctx,cover:true});near(e.hits,10*4/6,1e-9,'ignore le couvert');
// lourd immobile : +1 au jet de touche
a=att(W('10','4+','4','0','1','Lourd'));w=a.groups[0].weapons[0];e=A.expectedWeapon(w,t.groups[0],t,{...ctx,still:true});near(e.hits,10*(1/6+3/6),1e-9,'lourd : 4+ devient 3+');
// tir rapide à mi-portée / déflagration / abattage
a=att(W('2','3+','4','0','1','Tir Rapide 1'));w=a.groups[0].weapons[0];near(A.expectedWeapon(w,t.groups[0],t,{...ctx,half:true}).attacks,3,1e-9,'tir rapide mi-portée');near(A.expectedWeapon(w,t.groups[0],t,ctx).attacks,2,1e-9,'tir rapide hors mi-portée');
a=att(W('3','3+','4','0','1','Déflagration'));w=a.groups[0].weapons[0];t=tg({size:12});near(A.expectedWeapon(w,t.groups[0],t,ctx).attacks,3+2,1e-9,'déflagration 12 fig. ⇒ +2');
a=att(W('3','3+','4','0','1','Déflagration 2'));w=a.groups[0].weapons[0];near(A.expectedWeapon(w,t.groups[0],t,ctx).attacks,3+4,1e-9,'déflagration 2 : exemple du livre (7 dés)');
a=att(W('3','3+','4','0','1','Abattage 1'));w=a.groups[0].weapons[0];t=tg({size:16});near(A.expectedWeapon(w,t.groups[0],t,ctx).attacks,6,1e-9,'abattage 16 fig. ⇒ 6 dés (exemple du livre)');
// fusion : +X aux dégâts à mi-portée
a=att(W('1','3+','9','-4','D6','Fusion 2'));w=a.groups[0].weapons[0];t=tg({size:1,stats:{PV:'20',E:'8'}});near(A.expectedWeapon(w,t.groups[0],t,{...ctx,half:true}).damage/A.expectedWeapon(w,t.groups[0],t,ctx).damage,(3.5+2)/3.5,1e-9,'fusion X');
// lance + jumelé
a=att(W('10','3+','4','0','1','Lance','Mêlée'));w=a.groups[0].weapons[0];t=tg({size:30});near(A.expectedWeapon(w,t.groups[0],t,{...ctx,charged:true}).wounds,10*4/6*4/6,1e-9,'lance chargé : blessure 3+');
// torrent : touche automatique
a=att(W('4','-','4','0','1','Torrent'));w=a.groups[0].weapons[0];near(A.expectedWeapon(w,t.groups[0],t,ctx).hits,4,1e-9,'torrent');
// insensible à la douleur
t=A.toProfile(mk({size:30,apt:'Insensible à la Douleur 5+'}));a=att(W('10','3+','4','0','1'));w=a.groups[0].weapons[0];near(A.expectedWeapon(w,t.groups[0],t,ctx).damage,10*4/6*3/6*2/6*(2/3),1e-9,'FNP 5+ : 1/3 des PV ignorés');
// donnée manquante : arme sans F ⇒ non calculée
a=att(W('10','3+','','0','1'));ok(a.groups[0].weapons[0].missing.includes('Force (F)')&&A.expectedWeapon(a.groups[0].weapons[0],t.groups[0],t,ctx).ok===false,'donnée manquante signalée, aucun calcul inventé');
// --- simulation vs théorie (sans perte par excès : cibles nombreuses à 1 PV)
function cmp(label,wp,tp,n,tol,c){const a=att(wp),t=tp;const th=A.theory(a,t,'shoot',c||ctx),si=A.simulate(a,t,'shoot',c||ctx,n,777);near(si.mean/Math.max(th.avg,1e-9),1,tol,label+' : simulation ≈ théorie ('+si.mean.toFixed(3)+' vs '+th.avg.toFixed(3)+')')}
const big=tg({size:200,stats:{PV:'1',SV:'3+/4++'}});
cmp('base',W('20','3+','4','-1','1'),big,40000,.03);
cmp('soutenues',W('20','3+','4','-1','1','Touches Soutenues 1'),big,40000,.03);
cmp('fatales',W('20','3+','4','-1','1','Touches Fatales'),big,40000,.03);
cmp('anti',W('20','3+','4','-1','1','Anti-Infanterie 4+'),big,40000,.03);
cmp('jumelé',W('20','3+','4','-1','1','Jumelé'),big,40000,.04);
cmp('torrent',W('20','-','4','-1','1','Torrent'),big,40000,.03);
cmp('déflagration',W('5','3+','4','-1','1','Déflagration'),big,40000,.03);
cmp('couvert',W('20','3+','4','-1','1'),big,40000,.03,{...ctx,cover:true});
const bigD=tg({size:200,stats:{PV:'6'}});
cmp('dévastatrices',W('20','3+','8','-1','2','Blessures Dévastatrices'),bigD,40000,.05);
cmp('FNP',W('20','3+','4','-1','1'),A.toProfile(mk({size:200,apt:'Insensible à la Douleur 5+'})),40000,.03);
// --- allocation : dégâts perdus par excès (1 attaque D6, cibles 1 PV) ⇒ au plus 1 figurine
const one=att(W('1','2+','14','-6','6'));let r=A.simulate(one,tg({size:5,stats:{PV:'1',SV:'6+'}}),'shoot',ctx,2000,1);ok(r.max<=1&&r.killsMean<=1,'excès de dégâts perdu : au plus 1 figurine par attaque');
// une unité entière détruite ?
const mass=att(W('60','2+','10','-6','3'));r=A.simulate(mass,tg({size:5,stats:{PV:'2',SV:'6+'}}),'shoot',ctx,2000,2);ok(r.wipeProb>.99,'unité détruite : probabilité cohérente');
// maximum théorique
const mx=A.theory(att(W('D6','3+','4','0','D3')),tg({size:30,stats:{PV:'5'}}),'shoot',ctx);ok(mx.max===18&&mx.maxCapped===18,'maximum théorique D6×D3 = 18');
// --- données réelles importées : fournir un export de l'appli via ANA_FIXTURE=chemin/etat.json (non versionné)
let st,L,P,by,imm,dr,dl;const FX=process.env.ANA_FIXTURE||(__dirname+'/../etat.json');
if(!fs.existsSync(FX)){console.log('  (tests sur données réelles ignorés : aucun export fourni)');}else{
st=JSON.parse(fs.readFileSync(FX,'utf8'));L=st.lists[0].units;
P=L.map(u=>A.toProfile(u));
by=n=>P.find(p=>p.name.includes(n));
imm=by('immortels');dr=by('dragon');dl=by('destroyers lourds');
ok(imm.models===10&&imm.groups.length===3&&imm.groups[0].n===8,'Immortels : 10 figurines dont 2 figurines à profil propre');
ok(imm.groups[0].weapons[0].count===8,'Immortels : 8 éclateurs sur les figurines de base');
ok(dr.groups[0].stats.sv===3&&dr.groups[0].stats.inv===4&&dr.fnp===5,'Écharde : Sv 3+, SvIn 4++, FNP 5+');
ok(dr.pts===null,'points absents ⇒ null (pas inventés)');
ok(dl.notes.some(n=>/Exterminateur/.test(n)),'nombre d\'armes non indiqué signalé');
const shoot=A.theory(dl,imm,'shoot',{...ctx,half:true});ok(shoot.avg>0&&shoot.per.length>=2,'destroyers lourds vs immortels calculé');
const sim=A.simulate(dl,imm,'shoot',{...ctx,half:true},4000,5);ok(sim.mean>0&&sim.mean<=A.totalWounds(imm)&&sim.p90>=sim.median,'simulation réelle cohérente');
near(A.theory(dl,imm,'shoot',{...ctx,half:true}).eff/sim.mean,1,.12,'théorie effective ≈ simulation (perte par excès incluse)');
console.log('  destroyers lourds → immortels (mi-portée) : théorie',shoot.avg.toFixed(2),'effectif',A.theory(dl,imm,'shoot',{...ctx,half:true}).eff.toFixed(2),'simulation',sim.mean.toFixed(2),'figurines',sim.killsMean.toFixed(2),'anéantie',(sim.wipeProb*100).toFixed(1)+'%','max',shoot.max);
// --- armées
const Q=P.slice(0,4),Rr=P.slice(4);const m1=A.pairMatrix(Q,Rr,ctx),m2=A.pairMatrix(Rr,Q,ctx);
const s1=A.armyStats(Q,Rr,m1),s2=A.armyStats(Rr,Q,m2);ok(s1.units===4&&s2.units===4&&s1.models>0,'statistiques d\'armée');
const we=A.winEstimate(s1,s2);near(we.pA+we.pB,1,1e-9,'probabilités complémentaires');ok(we.pA>=.15&&we.pA<=.85,'estimation bornée');
const self=A.winEstimate(s1,s1);near(self.pA,.5,1e-9,'armée identique ⇒ 50 %');
const rk=A.unitRanking(Q,Rr,m1,m2);ok(rk.danger.length===4&&rk.vuln.length===4,'classements');
}
// --- duel de figurines (une figurine contre une figurine)
{const a=att(W('4','3+','4','0','1'),5),t2=tg({size:3,stats:{PV:'2',SV:'3+',E:'4'}});
 const d=A.duelFig(a,0,t2,0,ctx,true);const m=d.modes.shoot;
 near(m.rows[0].hit,4/6,1e-9,'duel : % de touche');near(m.rows[0].wound,3/6,1e-9,'duel : % de blessure');near(m.rows[0].fail,2/6,1e-9,'duel : % de sauvegarde ratée');
 near(m.eff,4*(4/6)*(3/6)*(2/6),1e-9,'duel : dégâts moyens par figurine');ok(m.kill>=0&&m.kill<=1&&d.modes.melee===null,'duel : chance de tuer, pas de mêlée sans arme');
 const big=tg({size:1,stats:{PV:'1'}});near(A.duelFig(att(W('20','2+','8','-3','6')),0,big,0,ctx,false).modes.shoot.eff,20*(5/6)*(5/6)*(5/6),1e-6,'duel : dégâts plafonnés aux PV de la figurine cible (D6 contre 1 PV)');}

// --- plusieurs figurines : 10 attaquantes contre 10 cibles
{const a=att(W('2','3+','4','0','1'),10),t2=tg({size:10,stats:{PV:'1',SV:'4+'}});const one=A.duelFig(a,0,t2,0,ctx,false).modes.shoot.eff,gp=A.duelGroup(a,0,10,t2,0,10,ctx,3000).modes.shoot;
 near(gp.eff,one*10,1e-9,'groupe : 10 figurines = 10 × une figurine (théorie)');near(gp.mean/gp.eff,1,.06,'groupe : simulation ≈ théorie');ok(gp.kills<=10&&gp.wipe>=0&&gp.wipe<=1,'groupe : figurines tuées et probabilité d\'anéantir');
 const g1=A.duelGroup(a,0,1,t2,0,1,ctx,500).modes.shoot;near(g1.eff,one,1e-9,'groupe de 1 = duel simple');}

// --- dégâts par arme (simulation) : la somme retrouve le total
{const a=A.toProfile({name:'T',qty:1,size:1,pts:1,stats:{M:'6',E:'4',SV:'3+',PV:'3',CD:'7+',CO:'1'},weapons:[{name:'Canon',range:'24',a:'4',hit:'3+',f:'6',pa:'-1',d:'2',caps:''},{name:'Epée',range:'24',a:'2',hit:'3+',f:'4',pa:'0',d:'1',caps:'Blessures Dévastatrices'}],equip:'Canon, Epée',apt:'',kw:'Infanterie',fkw:'X',subs:[]});
 const tt=tg({size:100,stats:{PV:'3'}});const sm=A.simulate(a,tt,'shoot',ctx,3000,4),sum=Object.values(sm.byWeapon).reduce((x,y)=>x+y,0);near(sum/sm.mean,1,1e-9,'dégâts par arme : somme = total simulé');ok(sm.byWeapon.Canon>0&&sm.byWeapon.Epée>=0,'dégâts par arme : noms des armes');}

// --- effets des aptitudes affichés
{const mkw=(caps)=>att(W('3','3+','4','0','1',caps),1),t0=tg({size:12,stats:{PV:'1'},kw:'Infanterie'});
 const g=(caps,c)=>A.duelGroup(mkw(caps),0,1,t0,0,12,c||ctx,200).modes.shoot.rows[0].fx;
 const f1=g('Déflagration, Tir Rapide 2, Lourd, Touches Soutenues 1: Véhicule');
 ok(f1.find(x=>x.id==='DEFLAGRATION').s==='on'&&/\+2 dé/.test(f1.find(x=>x.id==='DEFLAGRATION').t),'effet : déflagration +2 dés');
 ok(f1.find(x=>x.id==='TIR_RAPIDE').s==='off'&&f1.find(x=>x.id==='LOURD').s==='off','effet : options inactives par défaut');
 ok(f1.find(x=>x.id==='TOUCHES_SOUTENUES').s==='off','effet : restriction par mot-clé (cible infanterie) ⇒ inactive');
 const f2=g('Tir Rapide 2, Lourd, Fusion 2',{...ctx,half:true,still:true});ok(f2.every(x=>x.s==='on'),'effet : options activées ⇒ appliquées');
 const f3=g('Anti-Infanterie 4+, Précision, Machin');ok(f3[0].s==='on'&&f3[1].s==='info'&&f3[2].s==='unk','effet : anti actif, précision sans effet, inconnue signalée');
 const r=A.duelGroup(mkw(''),0,1,t0,0,12,ctx,200).modes.shoot.rows[0];ok(r.need===5||r.need===4,'fiche d\'arme : seuil de blessure');near(r.hit,4/6,1e-9,'fiche d\'arme : touche');
 const d=A.duelGroup(mkw(''),0,1,t0,0,12,ctx,200);ok(d.def.PV===1&&d.def.E===4,'fiche du défenseur');}

// --- historique
const games=[{f1:'Nécrons',f2:'Orks',d1:'Hôte',s1:80,s2:60,first:1},{f1:'Nécrons',f2:'Orks',d1:'Hôte',s1:50,s2:50,first:2},{f1:'Nécrons',f2:'T\'au',d1:'Légion',s1:30,s2:70,first:2},{f1:'Nécrons',f2:'Orks',d1:'Hôte',s1:90,s2:10,first:1}];
const hs=A.histStats(games);ok(hs.n===4&&hs.V===2&&hs.D===1&&hs.E===1,'historique : V/D/E');near(hs.win,50,1e-9,'taux de victoire = V/N×100');near(hs.draw,25,1e-9,'égalités séparées');near(hs.avg1,62.5,1e-9,'moyenne J1');
ok(hs.byOpponent.find(x=>x.k==='Orks').n===3&&Math.abs(hs.byOpponent.find(x=>x.k==='Orks').win-66.666666)<1e-3,'par adversaire');
ok(hs.byFirst.find(x=>x.k==='J1 commence').n===2,'selon qui commence');

if(fs.existsSync(FX)){
// --- compléments : données réelles et déterminisme
const vul=A.toProfile(Object.values(st.coll).find(u=>/vulkan/.test(u.name)));
ok(vul.groups[0].weapons[0].torrent&&!vul.groups[0].weapons[0].missing.length,'Torrent sans CT : aucune donnée manquante');
ok(vul.notes.some(n=>/Aptitudes de l'unité non prises en compte/.test(n)),'aptitudes d\'unité non modélisées signalées');
const nek=by('nekrosor');const selN=A.chooseWeapons(nek,'melee',imm,ctx,{});ok(selN.some(s=>s.w.bonus)&&selN.length===2,'mêlée : Attaques Bonus + une seule autre arme');
const q1=A.simulate(dl,imm,'shoot',ctx,500,9),q2=A.simulate(dl,imm,'shoot',ctx,500,9);ok(q1.mean===q2.mean,'simulation reproductible à graine égale');
const hi=att(W('6','7+','4','0','1'));near(A.expectedWeapon(hi.groups[0].weapons[0],tg({size:30}).groups[0],tg({size:30}),ctx).hits,6/6,1e-9,'CT 7+ : seul le 6 non modifié touche');
const ctxs=A.analyseArmies(L.slice(0,3),L.slice(3,6),ctx,['a','b']);ok(ctxs.strat.length>0&&ctxs.win.pA>=.15&&ctxs.weighting.A,'analyse complète sans erreur');
}
console.log(`\n${pass} vérifications réussies, ${fail} échec(s)`);process.exit(fail?1:0);
