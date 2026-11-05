/* Žaġręn V0.6: auditable morphology engine. Dependencies: existing V0.2/V0.3 datasets and V0.6 phonology. */
export function createZagrenGrammarV06({nominal,verbal,lexicon,dictionary=null,modifier=null}){
 const branches=["N","SE","W"];
 const dialects={N:"珀璃璐卡",SE:"丽庞萨",W:"雷西尼昂帕"};
 const assertBranch=(b)=>{if(!branches.includes(b))throw new Error("Unknown dialect "+b)};
 function soundShift(base,{branch,gloss,gramCase=null}){
  assertBranch(branch);
  if(typeof base!=="string")throw new Error("Missing V0.5 form");
  let form=base;
  const rules=[];
  const change=(id,eligible,fn)=>{if(eligible){const next=fn(form);if(next!==form){form=next;rules.push(id)}}};
  change("C01",["寒冷","乳"].includes(gloss),s=>s.replace(/([lł])o(?=[kd])/gu,"$1"));
  change("C02",gloss==="边界",s=>s.replace(/nic(?=a?$)/u,"nc"));
  change("C03",gloss==="仍然",s=>s.replace(/^ešče$/u,"še"));
  change("C04",gloss==="风",s=>s.replace(/etr/u,"er"));
  if(branch==="N"){
   change("N11",gloss==="雪",s=>s.replace(/^sneġ/u,"sęġ"));
   change("N12",["火","骨"].includes(gloss),s=>s.replace(/o(?=(?:ġń|śť))/u,"ӧ"));
   change("N13",["铁","生命","铁制的","女人","生活","活体的","生活中的","句子"].includes(gloss),s=>s.replace(/ž(?=[ei])/gu,"ẑ"));



   change("N14",gloss==="管道",s=>s.replace(/^ťr/u,"ṱr"));
   change("N15",gloss==="清晨",s=>s.replace(/^utro$/u,"utr"));
  }else if(branch==="SE"){
   change("SE11",gloss==="雪",s=>s.replace(/^sneg/u,"seg"));
   change("SE12",["冬季","冬季的","语言"].includes(gloss),s=>s.replace(/z(?=i)/gu,"ẑ"));

   change("SE13",["寒冷","乳"].includes(gloss),s=>s.replace(/o(?=[lł])/u,"ȯ"));
   change("SE14",gloss==="火",s=>s.replace(/^ogon/u,"oң").replace(/^ogn/u,"oң"));
   change("SE14",gloss==="羊羔",s=>s.replace(/^jagn/u,"jaң"));
  }else{
   change("W11",["雪","道路"].includes(gloss)||(gloss==="神明"&&(gramCase===null||gramCase==="NOM")),s=>s.replace(/ġ$/u,""));
   change("W12",gloss==="管道",s=>s.replace(/^þr/u,"þř"));
   change("W13",["铁","铁制的"].includes(gloss),s=>s.replace(/^žeł/u,"žł"));
  }
  return {form,baseForm:base,appliedRules:rules};
 }
 function noun(id,number,gramCase,branch){
  assertBranch(branch);
  const row=nominal.nouns.find(x=>x.id===id&&x.number===number&&x.case===gramCase)??modifier?.extended_noun_forms?.find(x=>x.id===id&&x.number===number&&x.case===gramCase);
  if(!row)throw new Error("Unknown noun slot "+id+"/"+number+"/"+gramCase);
  return {id,meaning:row.meaning,number,case:gramCase,branch,...soundShift(row[branch],{branch,gloss:row.meaning,gramCase})};
 }
 function pronoun(person,gramCase,branch){
  assertBranch(branch);
  const row=nominal.pronouns.find(x=>x.person===person&&x.case===gramCase);
  if(!row)throw new Error("Unknown pronoun slot "+person+"/"+gramCase);
  return {person,meaning:row.meaning,case:gramCase,branch,...soundShift(row[branch],{branch,gloss:row.meaning})};
 }
 function verb(id,kind,slot,branch){
  assertBranch(branch);
  const entry=verbal.lexicon.find(x=>x.id===id);
  if(!entry)throw new Error("Unknown verb "+id);
  let row;
  if(kind==="infinitive")row=entry;
  else if(kind==="finite"||kind==="imperative")row=verbal[kind].find(x=>x.id===id&&x.person===slot);
  else if(kind==="past")row=verbal.past.find(x=>x.id===id&&x.gender===slot);
  else throw new Error("Unknown verb category "+kind);
  if(!row)throw new Error("Unknown verb slot "+id+"/"+kind+"/"+slot);
  return {id,meaning:entry.meaning,kind,slot:kind==="infinitive"?null:slot,aspect:entry.aspect,branch,...soundShift(row[branch],{branch,gloss:entry.meaning})};
 }
 function adjective(id,gender,gramCase,branch,opts={}){
  assertBranch(branch);
  if(!modifier)throw new Error("Missing adjective dataset");
  const {degree="POS",animateAcc=0}=opts;
  const entry=modifier.adjectives.find(x=>x.id===id);
  const row=modifier.adjective_forms.find(x=>x.id===id&&x.degree===degree&&x.gender===gender&&x.case===gramCase&&(x.animate_acc??0)===animateAcc);
  if(!entry||!row)throw new Error("Unattested adjective slot: "+id+"/"+gender+"/"+gramCase);
  return {id,meaning:entry.meaning,gender,case:gramCase,degree,branch,...soundShift(row[branch],{branch,gloss:entry.meaning})};
 }
 function participle(id,gender,gramCase,branch,opts={}){
  assertBranch(branch);
  if(!modifier)throw new Error("Missing participle dataset");
  const {animateAcc=0}=opts;
  const entry=modifier.participles.find(x=>x.id===id);
  const row=modifier.participle_forms.find(x=>x.id===id&&x.gender===gender&&x.case===gramCase&&(x.animate_acc??0)===animateAcc);
  if(!entry||!row)throw new Error("Unattested participle slot: "+id+"/"+gender+"/"+gramCase+"/"+animateAcc);
  return {id,meaning:entry.meaning,gender,case:gramCase,branch,...soundShift(row[branch],{branch,gloss:entry.meaning})};
 }
 function future(id,branch){
  const inf=verb(id,"infinitive",null,branch);
  if(inf.aspect!=="IPFV")throw new Error("Analytic future is IPFV only");
  return {id,branch,kind:"future",form:verbal.auxiliary.future[branch]+" "+inf.form,origin:"V0.3 auxiliary + V0.6 infinitive"};
 }
 function lemma(gloss,branch){
  assertBranch(branch);
  const row=lexicon.rows.find(x=>x.gloss===gloss);
  if(!row){
   const registered=dictionary?.entries?.find(x=>x.gloss===gloss);
   if(!registered)throw new Error("Unknown dictionary lexeme "+gloss);
   if(!registered.forms)throw new Error("Only ancestral root exists; no modern forms for "+gloss);
   return {gloss,branch,form:registered.forms[branch],baseForm:registered.older?.[branch]??null,appliedRules:(registered.ruleIds||[]).filter(id=>!id.startsWith("BASE-")||id==="BASE-"+branch),ipa:registered.ipa?.[branch]??null,status:registered.inflectionCoverage==="lemma-only"?"lemma-only":"historical-paradigm"};
  }
  if(!row.v05)return {gloss,branch,form:row.v06[branch],baseForm:null,appliedRules:[],status:"new-root-lemma-only"};
  return {gloss,branch,...soundShift(row.v05[branch],{branch,gloss}),status:"sound-shifted-lemma"};
 }
 function audit(){
  const differences=[];
  let checked=0,changed=0;
  for(const row of lexicon.rows){if(!row.v05)continue;for(const branch of branches){
   const computed=lemma(row.gloss,branch);
   checked++;
   if(computed.form!==computed.baseForm)changed++;
   if(computed.form!==row.v06[branch])differences.push({gloss:row.gloss,branch,expected:row.v06[branch],actual:computed.form});
  }}
  const slots={noun:nominal.nouns.length*3,pronoun:nominal.pronouns.length*3,finite:verbal.finite.length*3,past:verbal.past.length*3,imperative:verbal.imperative.length*3};
  const errors=[];
  for(const row of nominal.nouns)for(const b of branches){try{noun(row.id,row.number,row.case,b)}catch(e){errors.push(String(e))}}
  for(const row of nominal.pronouns)for(const b of branches){try{pronoun(row.person,row.case,b)}catch(e){errors.push(String(e))}}
  for(const kind of ["finite","past","imperative"])for(const row of verbal[kind])for(const b of branches){
   try{verb(row.id,kind,kind==="past"?row.gender:row.person,b)}catch(e){errors.push(String(e))}
  }
  return {status:differences.length||errors.length?"fail":"pass",checkedLemmas:checked,changedLemmas:changed,differences,slots,totalSlots:Object.values(slots).reduce((a,b)=>a+b,0),errors};
 }
 return {dialects,noun,pronoun,verb,adjective,participle,future,lemma,audit};
}
