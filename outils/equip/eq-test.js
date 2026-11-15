const EQ=require("./eq-engine.js");let ok=0,ko=0;const t=(n,c,x)=>{if(c){ok++}else{ko++;console.log("ÉCHEC",n,x===undefined?"":JSON.stringify(x))}};
const W=n=>({name:n,range:"12",a:"1",hit:"3+",f:"4",pa:"0",d:"1",caps:""});
// parseEquip
t("parseEquip",JSON.stringify(EQ.parseEquip("Eclateur Gauss (10), Arme de corps à corps (10)"))===JSON.stringify([{name:"Eclateur Gauss",n:10},{name:"Arme de corps à corps",n:10}]));
// 10 figurines : 9 épées + 1 marteau, marteau réservé au sergent
const U={name:"Intercessors d'assaut",size:10,equip:"Épée énergétique (9), Marteau tonnerre (1), Pistolet (10)",weapons:[W("Épée énergétique"),W("Marteau tonnerre"),W("Pistolet")]};
const role={id:"r1",t:"role",w:"Marteau tonnerre",role:"Sergent",n:1,st:"off"};
let d=EQ.derive(U,[role]);t("sergent role",d.m[0].r==="Sergent"&&d.m[0].w.includes("Marteau tonnerre"),d.m[0]);
let s=EQ.summaryW(d.m);t("résumé compact",s.some(l=>l.t==="9 × Épée énergétique")&&s.some(l=>l.t==="1 × Marteau tonnerre — Sergent")&&s.some(l=>l.t==="10 × Pistolet"),s.map(l=>l.t));
t("pas 10 lignes",s.length<=3,s);
let v=EQ.validate(U,[role]);t("valide marteau sergent",!v.issues.some(i=>i.lvl==="red"),v.issues);
// marteau sur un non-sergent => rouge
const U2=JSON.parse(JSON.stringify(U));U2.eq={m:Array.from({length:10},(_,i)=>({r:i===0?"Sergent":"",w:i===3?["Marteau tonnerre","Pistolet"]:["Épée énergétique","Pistolet"]}))};
v=EQ.validate(U2,[role]);t("marteau interdit hors sergent",v.st==="red"&&v.issues.some(i=>/réservé à la figurine « Sergent »/.test(i.msg)&&i.m.includes(3)),v.issues);
// deux marteaux, un sergent
U2.eq.m[0].w=["Marteau tonnerre","Pistolet"];U2.eq.m[3].w=["Marteau tonnerre","Pistolet"];
v=EQ.validate(U2,[role]);t("2e marteau interdit",v.st==="red");
// Terminators max 1 lance-missiles
const T={name:"Terminators",size:5,equip:"Poing (5), Lance-missiles (2)",weapons:[W("Poing"),W("Lance-missiles")]};
const mx={id:"m1",t:"max",w:"Lance-missiles",n:1,st:"off"};
v=EQ.validate(T,[mx]);t("terminators max",v.st==="red"&&v.issues[0].msg==="Terminators : 2 × Lance-missiles sélectionnés, maximum autorisé : 1.",v.issues[0]&&v.issues[0].msg);
T.equip="Poing (5), Lance-missiles (1)";v=EQ.validate(T,[mx]);t("terminators 1 ok",v.st==="green",v);
// restriction non confirmée => orange, pas rouge
v=EQ.validate({...T,equip:"Poing (5), Lance-missiles (2)"},[{...mx,st:"pdf"}]);t("pdf non confirmée = orange",v.st==="orange"&&v.issues.some(i=>/à vérifier/.test(i.msg)));
v=EQ.validate({...T,equip:"Poing (5), Lance-missiles (2)"},[{...mx,st:"pdf",ok:1}]);t("pdf confirmée par l'utilisateur = rouge",v.st==="red");
// inconnu
v=EQ.validate(T,[]);t("aucune restriction = orange inconnu",v.st==="orange"&&v.issues[0].unk===1);
v=EQ.validate(T,[{id:"f",t:"fixed",st:"off"}]);t("équipement fixe confirmé = vert",v.st==="green"||v.issues.every(i=>i.asm),v.issues);
// excl vanguard
const V={name:"Vanguard",size:1,equip:"Bouclier (1), Pistolet plasma (1)",weapons:[W("Bouclier"),W("Pistolet plasma")]};
const ex={id:"e1",t:"excl",ws:["Bouclier","Pistolet plasma"],st:"sec"};
v=EQ.validate(V,[ex]);t("incompatibles",v.st==="red"&&/ne peuvent pas être portés par la même figurine/.test(v.issues[0].msg),v.issues);
// extraction
const L1=["Jusqu'à une figurine peut être équipée de lance-missiles.","Le sergent peut remplacer son pistolet par un marteau tonnerre.","Cette unité peut inclure. Une seule figurine peut être équipée d'un fusil à fusion.","Une figurine peut remplacer son bolter par une lance-flammes ou un fuseur.","Une figurine ne peut pas être équipée simultanément de bouclier et de pistolet plasma."];
const ex1=EQ.extract(L1,["Lance-missiles","Marteau tonnerre","Fusil à fusion"],"Test");
const has=(t,w,x)=>ex1.some(c=>c.t===t&&EQ.same(c.w||"",w)&&(x==null||(c.n||c.role)===x||c.role===x));
t("extract jusqu'à une",has("max","lance-missiles",1),ex1);
t("extract sergent",ex1.some(c=>c.t==="role"&&/marteau tonnerre/i.test(c.w)&&/sergent/i.test(c.role)),ex1);
t("extract une seule",has("max","fusil à fusion",1),ex1);
t("extract une figurine remplace A par B ou C",ex1.some(c=>c.t==="max"&&/lance-flammes/i.test(c.w))&&ex1.some(c=>c.t==="max"&&/fuseur/i.test(c.w)),ex1);
t("statut pdf + passage",ex1.every(c=>c.st==="pdf"&&c.src&&c.src.passage),ex1[0]);
t("pas d'invention",EQ.extract(["Les aptitudes de cette unité sont décrites ci-dessous. Elle se déplace de 6 pouces."],[],"x").length===0);
// regroupement non destructif
const S={coll:{a:{ref:"a",name:"Guerriers Nécrons",weapons:[W("Eclateur Gauss")],equip:"Eclateur Gauss (10)",text:[]},b:{ref:"b",name:"Guerriers Nécrons",weapons:[W("Faucheuse Gauss")],equip:"Faucheuse Gauss (10)",var:1,vd:"Faucheuse Gauss",text:["Jusqu'à une figurine peut être équipée de faucheuse gauss."]},c:{ref:"c",name:"Autre",weapons:[W("Bolter")]}}};
const before=JSON.stringify([S.coll.a.weapons,S.coll.b.weapons]);
const n=EQ.regroup(S);t("1 groupe fusionné",n===1);
t("prim a, b fusionnée",S.coll.a.prim===1&&S.coll.b.mrg==="a"&&!S.coll.c.mrg);
t("armes d'origine inchangées",JSON.stringify([S.coll.a.weapons,S.coll.b.weapons])===before);
t("pool union",S.coll.a.eqw.length===2&&S.coll.a.cfgs.length===2&&/Faucheuse/.test(S.coll.a.cfgs[1].name)&&/Eclateur/.test(S.coll.a.cfgs[0].name),S.coll.a.cfgs);
t("restriction extraite du texte (pdf)",(S.eqc["guerriers nécrons"]||[]).some(c=>c.t==="max"&&c.st==="pdf"));
EQ.regroup(S);t("idempotent",S.eqc["guerriers nécrons"].length===1&&S.coll.a.cfgs.length===2);
EQ.rejectCons(S,{name:"Guerriers Nécrons"},S.eqc["guerriers nécrons"][0].id);EQ.regroup(S);t("rejet mémorisé",S.eqc["guerriers nécrons"].length===0);
t("groupRefs",EQ.groupRefs(S,"b").sort().join()==="a,b");
// applyModels
const AU={name:"Terminators",size:3,weapons:[W("Poing")],equip:"Poing (3)"};EQ.applyModels(AU,[{r:"",w:["Poing"]},{r:"",w:["Poing"]},{r:"",w:["Poing","Lance-missiles"]}],[W("Lance-missiles")]);
t("applyModels",AU.equip==="Poing (3), Lance-missiles (1)"&&AU.weapons.length===2&&AU.eq.cust===1,AU);
// armée
const ar=EQ.validateArmy([T,V],u=>u===T?[mx]:[ex]);t("armée rouge",ar.st==="red"&&ar.n.red===1);
// unité lue avec équipement par figurine (mdl)
const MU={name:"Intercessors d'assaut",size:10,equip:"Épée énergétique (9), Marteau tonnerre (1), Pistolet (10)",weapons:[W("Épée énergétique"),W("Marteau tonnerre"),W("Pistolet")],mdl:[{n:"Sergent",eq:"Marteau tonnerre, Pistolet"}]};
let dm=EQ.derive(MU,[]);t("mdl : sergent porte le marteau",dm.m[0].r==="Sergent"&&dm.m[0].w.includes("Marteau tonnerre")&&!dm.m[0].w.includes("Épée énergétique"),dm.m[0]);
t("mdl : 9 autres avec épée",dm.m.slice(1).every(m=>m.w.includes("Épée énergétique")&&!m.w.includes("Marteau tonnerre")&&m.w.includes("Pistolet")),dm.m);
t("mdl : résumé",EQ.summaryW(dm.m).some(l=>l.t==="1 × Marteau tonnerre — Sergent")&&EQ.summaryW(dm.m).some(l=>l.t==="9 × Épée énergétique"),EQ.summaryW(dm.m).map(l=>l.t));
t("mdl : pas de répartition supposée",EQ.validate(MU,[role]).issues.every(i=>!i.asm));
// données officielles (Packs de Faction)
const DATA=JSON.parse(require("fs").readFileSync(__dirname+"/data/eq-official.json","utf8"));
const W2=n=>({name:n,range:"12",a:"1",hit:"3+",f:"4",pa:"0",d:"1",caps:""});
const SD={coll:{m1:{ref:"m1",name:"macrocytes canopteks",weapons:[W2("Scalpel Gauss"),W2("Griffes"),W2("Faisceau atomiseur"),W2("Projecteur Tesla")],text:[]},e1:{ref:"e1",name:"écharde c'tan du dragon du néant",weapons:[W2("Lance du Dragon du Néant"),W2("Tempête voltaïque")],text:[]},x1:{ref:"x1",name:"Unité inconnue",weapons:[W2("Bolter")],text:[]}},lists:[]};
EQ.EQ_DATA=undefined;global.EQ_DATA=DATA;const nEnr=EQ.enrich(SD,DATA);
t("enrichissement : contraintes ajoutées",nEnr>0&&SD.eqc["macrocytes canopteks"].length>0,SD.eqc);
t("enrichissement : source officielle",SD.eqc["macrocytes canopteks"].every(c=>c.st==="off"&&c.src.p>0&&!c.src.passage.includes("■")));
t("enrichissement : unité inconnue ignorée",!SD.eqc["unité inconnue"]);
t("sans option confirmé officiellement",(SD.eqc["écharde c'tan du dragon du néant"]||[]).some(c=>c.t==="fixed"),SD.eqc["écharde c'tan du dragon du néant"]);
const MC={name:"macrocytes canopteks",size:5,equip:"Scalpel Gauss (3), Griffes (5), Faisceau atomiseur (2)",weapons:[W2("Scalpel Gauss"),W2("Griffes"),W2("Faisceau atomiseur")]};
let vm=EQ.validate(MC,SD.eqc["macrocytes canopteks"]);t("2 faisceaux : rouge officiel",vm.st==="red"&&vm.issues.some(i=>/Faisceau atomiseur/.test(i.msg)&&/maximum autorisé : 1/.test(i.msg)),vm.issues.map(i=>i.msg));
MC.equip="Scalpel Gauss (4), Griffes (5), Faisceau atomiseur (1)";vm=EQ.validate(MC,SD.eqc["macrocytes canopteks"]);t("1 faisceau : pas de rouge",vm.st!=="red",vm.issues.map(i=>i.msg));
const EC={name:"écharde c'tan du dragon du néant",size:2,equip:"Lance du Dragon du Néant (1)",weapons:[W2("Lance du Dragon du Néant")]};const ve=EQ.validate(EC,SD.eqc["écharde c'tan du dragon du néant"]);t("effectif hors règle (officiel)",ve.issues.some(i=>/doit compter 1/.test(i.msg)&&i.lvl==="red"),ve.issues.map(i=>i.msg));
// armes incompatibles => rien d'appliqué
const SD2={coll:{m1:{ref:"m1",name:"macrocytes canopteks",weapons:[W2("Arme inventée")],text:[]}},lists:[]};EQ.enrich(SD2,DATA);t("version incompatible : rien d'appliqué",!SD2.eqc["macrocytes canopteks"]&&SD2.eqd["macrocytes canopteks"].nocompat===1,SD2.eqd);
// idempotent + rejet
const c0=SD.eqc["macrocytes canopteks"].length;EQ.enrich(SD,DATA);t("enrichissement idempotent",SD.eqc["macrocytes canopteks"].length===c0);
EQ.rejectCons(SD,{name:"macrocytes canopteks"},SD.eqc["macrocytes canopteks"][0].id);EQ.enrich(SD,DATA);t("rejet respecté",SD.eqc["macrocytes canopteks"].length===c0-1);
const eo=EQ.officialFor(DATA,"macrocytes canopteks",[W2("Scalpel Gauss")]);t("officialFor",!!eo&&!EQ.officialFor(DATA,"macrocytes canopteks",[W2("Arme inventée")]));
t("ruleText",eo.opt.map(EQ.ruleText).some(x=>/remplacer Scalpel Gauss ou projecteur Tesla par Faisceau atomiseur \+ Projecteur de nanoscarabées/i.test(x)&&/1 figurine au maximum/.test(x)),eo.opt.map(EQ.ruleText));
console.log(ok+" OK, "+ko+" échec(s)");process.exit(ko?1:0);
