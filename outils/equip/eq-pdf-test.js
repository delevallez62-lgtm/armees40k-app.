const P=require("./eq-pdf.js");let ok=0,ko=0;const t=(n,c,x)=>{c?ok++:(ko++,console.log("ÉCHEC",n,x===undefined?"":JSON.stringify(x)))};
const pi=s=>P.parseItem(s)[0];
t("none",pi("None")==="none");
let r=pi("Each model can replace its bolt rifle with 1 auto bolt rifle.");t("each model",r&&r[0].t==="repl"&&r[0].who==="all"&&r[0].from[0]==="bolt rifle"&&r[0].to[0]==="auto bolt rifle",r);
r=pi("1 Intercessor can replace its bolt rifle with 1 plasma gun.");t("1 model n=1",r&&r[0].who==="any"&&r[0].n===1&&r[0].to[0]==="plasma gun",r);
r=pi("Up to 2 models can each replace their bolt pistol with 1 plasma pistol.");t("up to 2",r&&r[0].n===2&&r[0].who==="any",r);
r=pi("For every 5 models in the unit, 1 model can replace its boltgun with 1 meltagun.");t("par tranche",r&&r[0].per===5&&r[0].n===1,r);
r=pi("The Sergeant can replace its bolt pistol with 1 plasma pistol.");t("rôle sergent",r&&r[0].who==="role"&&/sergeant/i.test(r[0].role)&&r[0].n===1,r);
r=pi("This model's storm bolter can be replaced with 1 heavy flamer.");t("ce modèle",r&&r[0].who==="role"&&r[0].role==="cette figurine"&&r[0].from[0]==="storm bolter",r);
r=pi("This model can be equipped with 1 smoke launchers.");t("équipé de",r&&r[0].t==="add"&&r[0].to[0]==="smoke launchers",r);
r=pi("Any number of models can each have their bolt pistol replaced with one of the following: | 1 hand flamer | 1 inferno pistol");t("n'importe quel nombre + choix",r&&r[0].who==="all"&&r[0].alt&&r[0].alt.length===2&&r[0].to.length===2,r);
r=pi("This model's heavy frag cannon and Furioso fist can be replaced with one of the following: | 1 Blood Talons | 1 meltagun and 1 twin Furioso fist");t("alternatives avec et",r&&r[0].from.length===2&&r[0].alt.length===2&&r[0].alt[1].length===2,r);
t("phrase illisible refusée",P.parseItem("Long fangs weird text can be boltgun replaced with one of the following: replace")[0]===null);
r=pi("Chaque figurine peut remplacer son scalpel Gauss par 1 projecteur Tesla.");t("français",r&&r[0].who==="all"&&r[0].to[0]==="projecteur Tesla",r);
// page synthétique à deux colonnes
const it=(s,x,y)=>({str:s,transform:[1,0,0,1,x,y]});
const page=[it("MY SQUAD",20,330),it("Flavour text of the unit here.",20,315),it("WARGEAR OPTIONS",28,242),it("■",28,228),it("1 model can replace its bolter with 1 lascannon.",34,228),it("UNIT COMPOSITION",340,242),it("■",340,228),it("5 Marines",346,228),it("Every model is equipped with: bolter; knife.",340,215),it("KEYWORDS: Infantry",28,100)];
const u=P.parsePages([page],{file:"t.pdf"});const e=u["my squad"];t("page synthétique",e&&e.opt.length===1&&e.opt[0].n===1&&e.comp[0][0]===5&&e.def.includes("bolter")&&!e.none,e);
console.log(ok+" OK, "+ko+" échec(s)");process.exit(ko?1:0);
