/* Žaġręn V0.7: source-limited syntax composer. Unicode-friendly ES module. */
export function createZagrenSyntaxV07({morphology,nominal,modifier,verbal}){
 const B=["N","SE","W"];
 const valid=b=>{if(!B.includes(b))throw Error("Unknown dialect: "+b)};
 const nounEntry=id=>[...nominal.nouns,...modifier.extended_noun_forms].find(x=>x.id===id&&x.number==="SG"&&x.case==="NOM");
 function nounPhrase({id,branch,gramCase="NOM",number="SG",adjectives=[]}){
  valid(branch);
  const entry=nounEntry(id);
  if(!entry)throw Error("Noun paradigm not attested: "+id);
  if(!["NOM","GEN","DAT","ACC","INS","LOC"].includes(gramCase))throw Error("Invalid case");
  const gender=({阳:"M",阴:"F",中:"N"})[entry.gender];
  if(!gender)throw Error("No noun gender: "+id);
  const animate=entry.animacy==="有生"&&gender==="M"&&number==="SG";
  const modifierGender=number==="PL"?"PL":gender;
  const parts=adjectives.map(a=>morphology.adjective(a,modifierGender,gramCase,branch,{animateAcc:gramCase==="ACC"&&animate?1:0}).form);
  parts.push(morphology.noun(id,number,gramCase,branch).form);
  const westAnimateMarker=branch==="W"&&gramCase==="ACC"&&animate;
  return {form:(westAnimateMarker?"za ":"")+parts.join(" "),case:gramCase,number,gender,animate,mark:westAnimateMarker?"za":null};
 }
 function pronoun(person,gramCase,branch){valid(branch);return morphology.pronoun(person,gramCase,branch).form}
 function preposition(kind,id,branch,{adjectives=[]}={}){
  valid(branch);
  const catalog={inside:{N:"ŵ",SE:"v",W:"ŵ",case:"LOC"},on:{N:"na",SE:"na",W:"na",case:"LOC"},from:{N:"od",SE:"od",W:"od",case:"GEN"},instrument:{N:"s",SE:"s",W:"s",case:"INS"}};
  const p=catalog[kind];if(!p)throw Error("Unattested governed preposition: "+kind);
  return p[branch]+" "+nounPhrase({id,branch,gramCase:p.case,adjectives}).form;
 }
 function verbPhrase(id,branch,{tense="nonpast",person="3SG",pastGender=null,negative=false}={}){
  valid(branch);
  const lex=verbal.lexicon.find(x=>x.id===id);if(!lex)throw Error("Unattested verb: "+id);
  let predicate;
  if(tense==="nonpast")predicate=morphology.verb(id,"finite",person,branch).form;
  else if(tense==="futureIPFV"){
   if(lex.aspect!=="IPFV")throw Error("Only IPFV has analytic future");
   predicate=verbal.auxiliary.future[branch]+" "+morphology.verb(id,"infinitive",null,branch).form;
  }else if(tense==="futurePFV"){
   if(lex.aspect!=="PFV")throw Error("PFV prospective requires perfective aspect");
   predicate=morphology.verb(id,"finite",person,branch).form;
  }else if(tense==="past"||tense==="conditional"){
   if(!["M","F","N","PL"].includes(pastGender))throw Error("Past gender/number required");
   predicate=morphology.verb(id,"past",pastGender,branch).form;
   if(tense==="conditional")predicate=verbal.auxiliary.conditional[branch]+" "+predicate;
  }else if(tense==="imperative"){
   if(!["2SG","2PL"].includes(person))throw Error("Imperative person must be 2SG or 2PL");
   predicate=morphology.verb(id,"imperative",person,branch).form;
  }else throw Error("Unknown tense category "+tense);
  if(negative)predicate=verbal.auxiliary.negative[branch]+" "+predicate;
  return predicate;
 }
 function sentence({branch,subject=null,verbId,tense="nonpast",pastGender=null,recipient=null,object=null,frame=null,frameBeforeVerb=false,negative=false,punctuation=".",imperativePerson="2SG"}){
  valid(branch);
  if(![".","¡","¿","！","？"].includes(punctuation))throw Error("Unsupported clause-final punctuation");
  if(tense!=="imperative"&&!subject)throw Error("Subject is required");
  let person="3SG",subjForm="";
  if(subject?.kind==="pronoun"){
   person=subject.person.replace(/^3SG\..+$/u,"3SG");
   subjForm=pronoun(subject.person,"NOM",branch);
  }else if(subject?.kind==="noun"){
   const entry=nounEntry(subject.id);
   if(!entry)throw Error("Unattested subject noun");
   if(tense==="past"||tense==="conditional"){
    const natural=({阳:"M",阴:"F",中:"N"})[entry.gender];
    if(pastGender!==natural)throw Error("Past agreement mismatch");
   }
   subjForm=nounPhrase({id:subject.id,branch}).form;
  }else if(subject)throw Error("Unknown subject kind");
  if(tense==="imperative")person=imperativePerson;
  const vp=verbPhrase(verbId,branch,{tense,person,pastGender,negative});
  const np=(arg,gramCase)=>arg?arg.kind==="pronoun"?pronoun(arg.person,gramCase,branch):nounPhrase({id:arg.id,branch,gramCase,adjectives:arg.adjectives||[]}).form:null;
  const loc=frame?preposition(frame.kind,frame.id,branch,{adjectives:frame.adjectives||[]}):null;
  const parts=[subjForm];
  if(frameBeforeVerb&&loc)parts.push(loc);
  parts.push(vp);
  if(recipient)parts.push(np(recipient,"DAT"));
  if(object)parts.push(np(object,"ACC"));
  if(!frameBeforeVerb&&loc)parts.push(loc);
  return parts.filter(Boolean).join(" ")+punctuation;
 }
 return {nounPhrase,pronoun,preposition,verbPhrase,sentence};
}
