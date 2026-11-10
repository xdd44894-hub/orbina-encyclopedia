/* R04 Žaġręn V0.9 – source/provenance regression; never approves unattested grammar. */
export function validateR04({review,syntaxTests,earlyModifiers,r03Contrasts,coreSyntax}) {
  const errors=[], assert=(condition,message)=>{if(!condition)errors.push(message)};
  const dialects=["N","SE","W"];
  const corpus=new Map(syntaxTests.rows.map(x=>[x.id,x]));
  const older=new Map(earlyModifiers.phrases.map(x=>[x.id,x]));
  const probes=new Map(r03Contrasts.modernExperimentalExamples.map(x=>[x.id,x]));
  const anchorMap=new Map(review.sourceAnchors.map(x=>[x.id,x]));
  const expectedIds=["A03","A04","A06","A11","A12","A14","A15","A16","C34"];
  assert(review.sourceAnchors.length===9,"R04 must have 9 source anchors");
  assert(new Set(review.sourceAnchors.map(x=>x.id)).size===9,"Source anchor IDs must be distinct");
  assert(expectedIds.every(id=>anchorMap.has(id)),"Source anchor coverage incomplete");
  assert(review.metrics.branchRealizations===27,"Expected 27 anchored dialect realizations");
  assert(review.metrics.selectedZaModel===undefined||review.metrics.selectedZaModel===null,"No za model is selected");
  assert(review.metrics.newCertifiedModernCaseEndings===0,"No new inflections may be promoted");
  const rule=coreSyntax.rules.find(x=>x.id==="M07");
  assert(!!rule && rule.status==="adopted" && rule.template.includes("za +"),"M07 syntax rule changed");
  for (const anchor of review.sourceAnchors) {
    const old=anchor.id.startsWith("C");
    const src=old?older.get(anchor.id):corpus.get(anchor.id);
    assert(!!src,"Original source not found: "+anchor.id);
    if(!src)continue;
    const expectedLevel=old?"early-literary-example":src.status==="verified-v06"?"modern-v06-verified":"historical-reconciled-context";
    assert(anchor.level===expectedLevel,"Source age/status changed: "+anchor.id);
    for(const b of dialects){
      const realization=anchor.branches[b];
      const original=old?src[b]:src.forms[b];
      assert(realization.original===original,"Original dialect surface changed: "+anchor.id+"/"+b);
      const comp=realization.components;
      const phrase=[comp.phraseMarker,...comp.modifierTokens,comp.nounToken].filter(Boolean).join(" ");
      assert(phrase===realization.fragment&&original.includes(phrase),"Invalid morphological segmentation: "+anchor.id+"/"+b);
      if(comp.phraseMarker==="za")assert(b==="W"&&["A06","A11","A16"].includes(anchor.id),"za used outside established example scope: "+anchor.id+"/"+b);
    }
  }
  for(const [newId,oldId] of [["A11","C09"],["A12","C03"]]){
    const newer=corpus.get(newId),olderSource=older.get(oldId),anchor=anchorMap.get(newId);
    assert(!!newer && !!olderSource && anchor?.duplicatesExistingHistoricSource===oldId,"Missing provenance alias "+newId+"/"+oldId);
    if(newer&&olderSource)for(const b of dialects){
      assert(newer.forms[b].replace(/[.!?！？]$/u,"")===olderSource[b],"Duplication must be exact "+newId+"/"+oldId+"/"+b);
    }
  }
  assert(anchorMap.get("A03")?.branches.W.components.modifierTokens.length===2,"Modern two-adjective context must be preserved");
  assert(anchorMap.get("A11")?.branches.W.components.phraseMarker==="za" && anchorMap.get("A11")?.branches.W.components.modifierTokens.length===1,"West za + adjective + noun scope changed");
  assert(anchorMap.get("C34")?.level==="early-literary-example" && anchorMap.get("C34")?.branches.W.components.phraseMarker===null,"Early plural cannot be reclassified as modern absence proof");
  assert(["A06","A11","A16"].every(id=>anchorMap.get(id)?.branches.W.components.phraseMarker==="za"),"Missing West za source phrase");
  assert(review.hypothesisCompatibility.length===3,"Expected three hypotheses");
  for(const h of review.hypothesisCompatibility){
    assert(["H1","H2","H3"].includes(h.model),"Unknown hypothesis");
    assert(h.contradictedByExistingEvidence.length===0&&h.selectableModel===undefined,"No hypothesis is falsified or selected by positives alone");
  }
  assert(review.experimentalTargets.length===5,"Expected five controlled target lexemes");
  for (const t of review.experimentalTargets) {
    const a=probes.get("PROBE-"+t.id+"-W-bare"),b=probes.get("PROBE-"+t.id+"-W-marked");
    assert(!!a&&!!b&&t.bare===a.text&&t.marked===b.text,"Trial pair no longer matches R03: "+t.id);
    assert(t.validity==="both-composed-candidates-unattested","Constructed words must stay unapproved: "+t.id);
  }
  assert(review.judgementMatrix.length===4,"Expected four possible elicitation results");
  assert(review.judgementMatrix.find(x=>x.id==="J4")?.effect.H1==="non-identifying","Both rejected must remain inconclusive");
  return {pass:errors.length===0,errors,checked:{sourceContexts:review.sourceAnchors.length,dialectRealizations:review.sourceAnchors.length*3,
    deduplicatedHistoricalAliases:2,testLexemes:review.experimentalTargets.length,models:review.hypothesisCompatibility.length},
    meaning:"Verified source consistency and provenance; no new modern inflection or model chosen."};
}
