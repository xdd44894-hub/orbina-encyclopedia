/* Žaġręn V0.7 pilot inflection: analogical templates, not generally canonized paradigms. */
export function createZagrenMorphologyPilotV07({dictionary,pilot}) {
 const branches=["N","SE","W"];
 const cases=["NOM","GEN","DAT","ACC","INS","LOC"];
 const numbers=["SG","PL"];
 const persons=["1SG","2SG","3SG","1PL","2PL","3PL"];
 const pastSlots=["M","F","N","PL"];
 const imperatives=["2SG","2PL","1PL"];
 const A={
  N:{SG:["a","ÿ","i","u","oją","e"],PL:["ÿ","","am","ÿ","ami","aħ"]},
  SE:{SG:["a","i","i","u","ojo","e"],PL:["i","","am","i","ami","ah"]},
  W:{SG:["","ÿ","i","u","oj",""],PL:["ÿ","","am","ÿ","ami","aħ"]}
 };
 const O={
  N:{SG:["","a","u",null,"om","e"],PL:["ÿ","oŵ","am",null,"ami","aħ"]},
  SE:{SG:["","a","u",null,"om","e"],PL:["i","ov","am",null,"ami","ah"]},
  W:{SG:["","","u",null,"om",""],PL:["ÿ","oŵ","am",null,"ami","aħ"]}
 };
 const F={
  A:{N:["m","š","t","me","te","jąt"],SE:["m","š","t","me","te","jot"],W:["m","š","t","m","t","jąt"]},
  I:{N:["m","š","t","me","te","ęt"],SE:["m","š","t","me","te","et"],W:["m","š","t","m","t","ęt"]}
 };
 const G={N:["l","la","lo","li"],SE:["l","la","lo","li"],W:["ł","ł","ł","łi"]};
 const IMP={
  A:{N:["j","jte","jme"],SE:["j","jte","jme"],W:["j","jt","jm"]},
  I:{N:["","te","me"],SE:["","te","me"],W:["","t","m"]}
 };
 function validate(branch){if(!branches.includes(branch))throw Error("Unknown dialect: "+branch)}
 function find(gloss,pos){const x=dictionary.entries.find(e=>e.gloss===gloss&&e.pos===pos);if(!x||!x.forms)throw Error("Missing modern headword: "+gloss);return x}
 function pilotNoun(gloss,number,gramCase,branch){
  validate(branch);
  const spec=pilot.nouns.find(e=>e.gloss===gloss);if(!spec)throw Error("Noun not approved for pilot: "+gloss);
  const i=cases.indexOf(gramCase);
  if(i<0||!numbers.includes(number))throw Error("Unknown noun slot");
  const lemma=find(gloss,"noun");
  const nominative=lemma.forms[branch];
  let stem=spec.stemOverride?.[branch]??(spec.class==="A"&&branch!=="W"?nominative.replace(/a$/u,""):nominative);
  if(spec.class==="A"&&branch!=="W"&&!nominative.endsWith("a"))throw Error("A-class must end in -a: "+gloss);
  const suffix=spec.class==="A"?A[branch][number][i]:spec.class==="O"?O[branch][number][i]:null;
  if(suffix===undefined)throw Error("Unsupported noun class");
  if(spec.class==="A")return {form:stem+suffix,lemma:nominative,stem,branch,case:gramCase,number,gloss,class:spec.class,status:"analogical-pilot"};
  const anim=spec.animate===true;
  const selected=suffix===null?(number==="SG"?(anim?(branch==="W"?"":"a"):""):(anim?O[branch].PL[1]:O[branch].PL[0])):suffix;
  // Word-final loss in West is lexicalized in nominatives, not applied to all case forms.
  const form=number==="SG"&&gramCase==="NOM"?nominative:stem+selected;
  return {form,lemma:nominative,stem,branch,case:gramCase,number,gloss,class:spec.class,animate:anim,status:"analogical-pilot"};
 }
 function pilotNounPhrase(gloss,number,gramCase,branch){
  const form=pilotNoun(gloss,number,gramCase,branch);
  const mark=branch==="W"&&gramCase==="ACC"&&number==="SG"&&form.class==="O"&&form.animate;
  return {...form,form:(mark?"za ":"")+form.form,mark:mark?"za":null};
 }
 function pilotVerb(gloss,kind,slot,branch){
  validate(branch);
  const spec=pilot.verbs.find(e=>e.gloss===gloss);if(!spec)throw Error("Verb not approved for pilot: "+gloss);
  const lemma=find(gloss,"verb").forms[branch];
  const terminator=branch==="N"?"ť":branch==="SE"?"t":"þ";
  if(!lemma.endsWith(terminator))throw Error("Unrecognized infinitive ending");
  const root=lemma.slice(0,-terminator.length);
  if(!root.endsWith(spec.class==="A"?"a":"i"))throw Error("Unexpected verb class: "+gloss);
  let form;
  if(kind==="infinitive"){form=lemma;}
  else if(kind==="finite"){const i=persons.indexOf(slot);if(i<0)throw Error("Invalid finite person");form=root+F[spec.class][branch][i];}
  else if(kind==="past"){const i=pastSlots.indexOf(slot);if(i<0)throw Error("Invalid past agreement");form=root+G[branch][i];}
  else if(kind==="imperative"){const i=imperatives.indexOf(slot);if(i<0)throw Error("Invalid imperative");form=root+IMP[spec.class][branch][i];}
  else if(kind==="futureIPFV"){
   if(spec.aspect!=="IPFV")throw Error("Analytic future requires IPFV");
   form=(branch==="W"?"b":"bu")+" "+lemma;
  }else throw Error("Unknown verb kind");
  return {form,branch,gloss,lemma,stem:root,class:spec.class,aspect:spec.aspect,kind,slot,status:"analogical-pilot"};
 }
 function syllableSketch(word,branch){
  validate(branch);
  const graphemes=Array.from(word.normalize("NFC"));
  const vowel=new Set(["a","e","i","o","u","y","ÿ","ë","ę","ą","ӧ","ү","ȯ","A","E","I","O","U"]);
  const nuclei=graphemes.map((g,i)=>vowel.has(g)?i:-1).filter(i=>i>=0);
  if(nuclei.length===0)throw Error("No vowel nucleus: "+word);
  return {word,branch,nuclei:nuclei.length,vowelIndices:nuclei,stress:"unassigned",status:"orthographic-nucleus-count-only"};
 }
 return {pilotNoun,pilotNounPhrase,pilotVerb,syllableSketch,cases,numbers,persons,pastSlots,imperatives};
}
