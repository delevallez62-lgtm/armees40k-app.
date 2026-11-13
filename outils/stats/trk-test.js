const T=require('./trk-engine.js');let pass=0,fail=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('ÉCHEC :',m)}};const near=(a,b,e,m)=>ok(Math.abs(a-b)<=e,`${m} : ${a} ≠ ${b}`);
// --- identifiants stables
const mk=(o)=>Object.assign({name:'Dragon du Néant',fkw:'Nécrons',equip:'Lance (1), Tempête (1)',stats:{E:'11',SV:'3+/4++',PV:'16',M:'10'},weapons:[{name:'Lance',range:'12',a:'D3',hit:'2+',f:'8',pa:'-3',d:'D6+2',caps:'Anti-Véhicule 2+'}]},o||{});
const a=T.uidOf(mk()),b=T.uidOf(mk());ok(a.uid===b.uid,'même fiche ⇒ même identifiant');
ok(T.uidOf(mk({name:'DRAGON  du néant'})).uid===a.uid,'casse et espaces ignorés');
ok(T.uidOf(mk({fkw:'Orks'})).uid!==a.uid,'faction différente ⇒ identifiant différent');
ok(T.uidOf(mk({equip:'Lance (1)'})).uid!==a.uid,'équipement différent ⇒ identifiant différent');
ok(T.uidOf(mk({stats:{E:'11',SV:'3+/4++',PV:'18'}})).uid!==a.uid,'caractéristiques différentes ⇒ identifiant différent');
ok(T.uidOf(mk({weapons:[{name:'Lance',range:'12',a:'D3',hit:'2+',f:'9',pa:'-3',d:'D6+2',caps:''}]})).uid!==a.uid,'profil d\'arme différent ⇒ identifiant différent');
ok(T.uidOf(mk(),{ver:'V12'}).uid!==a.uid,'version des règles différente ⇒ identifiant différent');
ok(T.uidOf(mk({equip:'Tempête (3), Lance (9)'})).uid===a.uid,'les quantités d\'équipement ne changent pas l\'identifiant');
const m1=T.uidOf({man:true,n:'Intercessors',f:'Space Marines'}),m2=T.uidOf({man:true,n:' intercessors ',f:'space marines'});ok(m1.uid===m2.uid&&m1.man,'unité manuelle stable');
// --- statistiques de dégâts
const D=86400000,t0=Date.UTC(2026,0,1);
const A=T.uidOf(mk()).uid,I=T.uidOf({man:true,n:'Intercessors',f:'Space Marines'}).uid,C=T.uidOf({man:true,n:'Custodes',f:'Adeptus Custodes'}).uid;
const R=(i,gid,d,v,k,b,ty)=>({id:'r'+i,gid,d,rd:1,ty:ty||'tir',a:{uid:A,n:'Dragon du Néant',f:'Nécrons',pts:300},b:{uid:b,n:b===I?'Intercessors':'Custodes',f:b===I?'Space Marines':'Adeptus Custodes'},v,k});
const rec=[R(1,'g1',t0,12,3,I),R(2,'g1',t0+1,8,2,I,'combat'),R(3,'g2',t0+10*D,20,5,I),R(4,'g3',t0+20*D,30,null,I),R(5,'g3',t0+21*D,5,1,C)];
const mu=T.matchup(rec,A,I);
ok(mu.n===4&&mu.games===3,'match-up : rencontres et parties');near(mu.total,70,1e-9,'match-up : total');near(mu.mean,17.5,1e-9,'match-up : moyenne');ok(mu.max===30&&mu.min===8,'min / max');
near(mu.killsTotal,10,1e-9,'figurines éliminées (suivies)');ok(mu.killsTracked===3,'figurines : seulement les enregistrements renseignés');near(mu.killsMean,10/3,1e-9,'figurines éliminées : moyenne');
ok(mu.byGame.length===3&&mu.byGame[0].sum===20,'évolution par partie');ok(mu.trend.dir===1&&mu.trend.delta>0,'tendance à la hausse');ok(mu.byType.combat.n===1&&mu.byType.tir.n===3,'répartition par type d\'attaque');
const up=T.unitProfile(rec,A);ok(up.n===5&&up.byTarget.length===2,'profil unité : cibles');near(up.perPoint,(75/3)/300,1e-9,'dégâts par point (par partie)');
ok(up.byFaction.find(x=>x.name==='Adeptus Custodes').n===1,'par faction cible');
// séparation de deux profils portant le même nom
const A2=T.uidOf(mk({stats:{E:'11',SV:'3+/4++',PV:'18'}})).uid;const rec2=rec.concat([{...R(9,'g4',t0+30*D,99,1,I),a:{uid:A2,n:'Dragon du Néant',f:'Nécrons',pts:300}}]);
ok(T.matchup(rec2,A,I).total===70&&T.matchup(rec2,A2,I).total===99,'deux profils de même nom ne se mélangent pas');
const rk=T.ranking(rec2);ok(rk.length===2&&rk[0].uid===A2,'classement par dégâts moyens');ok(T.ranking(rec2,{fac:'Adeptus Custodes'}).length===1,'filtre faction cible');ok(T.ranking(rec2,{from:t0+25*D}).length===1,'filtre période');
ok(T.compare(rec2,[A,A2]).length===2,'comparaison de plusieurs unités');ok(T.matchupsTable(rec2)[0].mean===99,'tableau des match-ups');
// --- résultats
const games=[{id:'a',d:t0,fin:true,tot:[80,60],f:['Nécrons','Orks'],p:[{det:'Hôte'},{det:'Waaagh'}]},{id:'b',d:t0+D,fin:true,tot:[50,50],f:['Nécrons','Orks'],p:[{det:'Hôte'},{}]},{id:'c',d:t0+2*D,fin:true,tot:[30,70],f:['Nécrons',"T'au"],p:[{det:'Légion'},{}]},{id:'x',d:t0+3*D,fin:false,tot:[0,0],f:['Nécrons','Orks'],p:[]},{id:'y',d:t0+4*D,fin:true,tot:[90,10],f:['Nécrons','Orks'],p:[{det:'Hôte'},{}]}];
const ash=[{id:'m1',d:t0+5*D,f1:'Nécrons',f2:'Orks',d1:'Hôte',s1:60,s2:61,first:2},{id:'m2',src:'a',d:t0,s1:80,s2:60,first:1}];
const rs=T.resultStats(games,ash,{b:{first:1}});
ok(rs.n===5&&rs.V===2&&rs.D===2&&rs.E===1,'parties abandonnées exclues, doublons évités : V/D/É');near(rs.win,40,1e-9,'taux de victoire = V/N×100');near(rs.loss,40,1e-9,'taux de défaite');near(rs.draw,20,1e-9,'taux d\'égalité');
ok(rs.round.V+rs.round.D+rs.round.E===100,'les trois pourcentages font 100');
ok(T.pct3(1,1,1).V+T.pct3(1,1,1).D+T.pct3(1,1,1).E===100&&T.pct3(2,3,5).V===20,'arrondi : somme exacte à 100');ok(T.pct3(0,0,0).n===0,'aucune partie');
ok(rs.byOpponent.find(x=>x.k==='Orks').n===4,'résultats contre chaque faction');near(rs.byOpponent.find(x=>x.k==='Orks').win,50,1e-9,'taux de victoire contre les Orks');
ok(rs.byDetachment.find(x=>x.k==='Hôte').n===4,'par détachement');ok(rs.byFirst.find(x=>x.k==='Je commence').n===2&&rs.byFirst.find(x=>x.k==='L\'adversaire commence').n===1,'selon qui commence');
ok(rs.evolution.cum.length===5&&rs.evolution.months.length===1,'évolution');
const f=T.resultStats(games,ash,{},{fac:'Orks'});ok(f.n===4,'filtre faction');ok(T.resultStats(games,ash,{},{det:'Légion'}).n===1,'filtre détachement');ok(T.resultStats(games,ash,{},{from:t0+3*D}).n===2,'filtre période');
ok(T.resultStats([],[],{}).n===0&&T.resultStats([],[],{}).win===null,'aucune partie : pas de division par zéro');
const dg=T.damagePerGame([{gid:'a',v:30},{gid:'a',v:10},{gid:'b',v:20},{gid:'zz',v:999}],rs.results);near(dg.mean,30,1e-9,'dégâts moyens par partie (parties concernées seulement)');
console.log(`\n${pass} vérifications réussies, ${fail} échec(s)`);process.exit(fail?1:0);
