/* Žaġręn V0.8 diachronic lexeme-family extension.
   Existing 21 V0.6 laws retain their own scope and are NOT reapplied globally.
   All four V0.8 repairs are restricted to a documented family and branch. */
export function createZagrenV08FamilyEvolver() {
 const changes=[
  {id:"N13-F-LIVE",gloss:"生活",branch:"N",sourceLaw:"N13",from:/^ži/u,to:"ẑi",family:"*živ-"},
  {id:"N13-F-LIVE-ADJ",gloss:"活体的",branch:"N",sourceLaw:"N13",from:/^ži/u,to:"ẑi",family:"*živ-"},
  {id:"N13-F-LIVE-PTCP",gloss:"生活中的",branch:"N",sourceLaw:"N13",from:/^ži/u,to:"ẑi",family:"*živ-"},
  {id:"SE12-F-WINTER",gloss:"冬季的",branch:"SE",sourceLaw:"SE12",from:/^zi/u,to:"ẑi",family:"*zim-"}
 ];
 const byId=new Map(changes.map(x=>[x.id,x]));
 function evolve(form,gloss,branch){
  if(typeof form!=="string")throw Error("V0.8 needs an attested historic surface form");
  if(!["N","SE","W"].includes(branch))throw Error("Unknown dialect "+branch);
  let value=form;const applied=[];
  for(const x of changes)if(x.gloss===gloss&&x.branch===branch){
   const result=value.replace(x.from,x.to);
   if(result!==value){value=result;applied.push(x.id)}
  }
  return {form:value,baseForm:form,appliedRules:applied,changed:applied.length>0};
 }
 function audit(dictionary){
  const checked=[];
  const old= dictionary.entries.filter(e=>["legacy","attested","proto-only"].includes(e.stage));
  for(const e of old){
   if(!e.forms){checked.push({id:e.id,gloss:e.gloss,coverage:"proto-only",changes:[]});continue;}
   const effects=Object.fromEntries(["N","SE","W"].map(b=>[b,evolve(e.forms[b],e.gloss,b)]));
   checked.push({id:e.id,gloss:e.gloss,pos:e.pos,coverage:"historical-surface-reviewed",changeCount:Object.values(effects).filter(x=>x.changed).length,effects});
  }
  return {checked,oldTotal:old.length,legacyWithForms:checked.filter(x=>x.coverage==="historical-surface-reviewed").length,protoOnly:checked.filter(x=>x.coverage==="proto-only").length,changedEntries:checked.filter(x=>x.changeCount>0).length};
 }
 return {changes:changes.map(({from,to,...x})=>({...x,matchPrefix:from.source,newPrefix:to})),evolve,audit};
}
