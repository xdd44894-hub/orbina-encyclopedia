/* Žaġręn V0.7 nested-focus / written-citation structural validator.
   Not a Chinese or Žaġręn natural-language parser. */
export function validateZagrenPunctuation(text){
 const stack=[],errors=[],events=[];
 let layer=0;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c==="/"){
   if(stack.some(x=>x.type==="citation"))errors.push({index:i,error:"Nested written citation is not defined"});
   stack.push({type:"citation",index:i,layer});
   events.push({kind:"open-citation",index:i});layer++;
  }else if(c==="\\"){
   const top=stack.at(-1);
   if(!top||top.type!=="citation"){errors.push({index:i,error:"Written citation closes before inner focus or without opening"});continue;}
   if(i===top.index+1)errors.push({index:i,error:"Empty written citation"});
   stack.pop();layer--;events.push({kind:"close-citation",index:i});
  }else if(c==="•"){
   const top=stack.at(-1);
   if(top?.type==="focus"&&top.layer===layer){
    if(i===top.index+1)errors.push({index:i,error:"Empty focus span"});
    stack.pop();events.push({kind:"close-focus",layer,index:i});
   }else{
    if(stack.some(x=>x.type==="focus"&&x.layer===layer))errors.push({index:i,error:"Same-layer focus cannot self-nest"});
    stack.push({type:"focus",index:i,layer});
    events.push({kind:"open-focus",layer,index:i});
   }
  }
 }
 for(const x of stack)errors.push({index:x.index,error:"Unclosed "+x.type});
 const cite=events.filter(x=>x.kind==="open-citation").length;
 const fN=events.filter(x=>x.kind==="open-focus"&&x.layer===0).length;
 const fS=events.filter(x=>x.kind==="open-focus"&&x.layer>0).length;
 return {valid:errors.length===0,errors,focusNarrator:fN,focusSource:fS,citations:cite,doubleFocus:cite>0&&fN>0&&fS>0};
}
