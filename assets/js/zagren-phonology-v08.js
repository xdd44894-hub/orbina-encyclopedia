/* Žaġręn V0.8 selected-family history evolver.
 * Existing V0.6 sound laws are not globally applied here.
 * This module only converts exact attested source forms in specified dialects.
 */
export function createZagrenV08FamilyEvolver() {
 const changes=[
  {id:"N13",gloss:"女人",branch:"N",from:"žena",to:"ẑena",family:"*žen-"},
  {id:"N13",gloss:"生活",branch:"N",from:"žiŵeť",to:"ẑiŵeť",family:"*živ-"},
  {id:"V08-STEM-ZYM",gloss:"冬季的",branch:"N",from:"zimnÿ",to:"zÿmnÿ",family:"*zÿm-"},
  {id:"SE12",gloss:"冬季的",branch:"SE",from:"zimni",to:"ẑimni",family:"*zim-"},
  {id:"V08-STEM-ZYM",gloss:"冬季的",branch:"W",from:"zimnÿ",to:"zÿmnÿ",family:"*zÿm-"},
  {id:"N13",gloss:"活体的",branch:"N",from:"žiŵÿ",to:"ẑiŵÿ",family:"*živ-"},
  {id:"N13",gloss:"生活中的",branch:"N",from:"žiŵejącÿ",to:"ẑiŵejącÿ",family:"*živ-"},
  {id:"N13",gloss:"句子",branch:"N",from:"predloženie",to:"predloẑenie",family:"*predložen-"},
  {id:"SE12",gloss:"语言",branch:"SE",from:"jazik",to:"jaẑik",family:"*jazÿk-"}
 ];
 const branches=["N","SE","W"];
 function evolve(form,gloss,branch){
  if(!branches.includes(branch))throw Error("Unknown Žaġręn branch "+branch);
  if(typeof form!=="string")throw Error("Historic form must be a string");
  let result=form;const appliedRules=[];
  for(const x of changes)if(x.gloss===gloss&&x.branch===branch&&result===x.from){
   result=x.to;appliedRules.push(x.id);
  }
  return {form:result,baseForm:form,appliedRules,changed:result!==form};
 }
 function audit(dictionary){
  const old=dictionary.entries.filter(e=>["v08-reviewed","v08-revised","proto-only"].includes(e.stage));
  const rows=old.map(e=>{
   if(!e.forms)return {id:e.id,gloss:e.gloss,coverage:"proto-only",changes:0};
   const base=e.older||e.forms;
   const computed=Object.fromEntries(branches.map(b=>[b,evolve(base[b],e.gloss,b).form]));
   const failures=branches.filter(b=>computed[b]!==e.forms[b]);
   return {id:e.id,gloss:e.gloss,coverage:"historical-form-checked",changes:branches.filter(b=>computed[b]!==base[b]).length,failures};
  });
  return {checked:rows,oldTotal:rows.length,protoOnly:rows.filter(x=>x.coverage==="proto-only").length,modernized:rows.filter(x=>x.changes>0).length,mismatched:rows.filter(x=>x.failures?.length).length};
 }
 return {changes,evolve,audit};
}
