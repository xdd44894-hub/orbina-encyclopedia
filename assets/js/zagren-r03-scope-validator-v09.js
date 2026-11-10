/* Žaġręn V0.9 R03: scope-only checker. Does not approve grammar or generate normative forms. */
export function validateR03Contrast(document, syntaxTests, nominalReview) {
  const errors = [];
  const check = (test, message) => { if (!test) errors.push(message); };
  const controls = document?.currentExamples || [];
  const trials = document?.modernExperimentalExamples || [];
  const corpus = new Map((syntaxTests?.rows || []).map(row => [row.id, row]));
  const nominal = new Map((nominalReview?.rows || []).map(row => [
    [row.lexemeId, row.branch, row.position].join("|"), row
  ]));
  check(controls.length === 5, "Expected 5 inherited context controls");
  check(trials.length === 34, "Expected 34 explicitly unapproved experimental entries");
  check(document?.metrics?.certifiedModernCaseEndingsAdded === 0, "No case ending may be automatically certified");
  check(new Set([...controls, ...trials].map(r => r.id)).size === 39, "Contrast case IDs must be unique");
  check(["A03", "A04", "A06", "A11", "A16"].every(id => controls.some(c => c.reference === id)), "Existing source cases must be present");
  const branches = ["N", "SE", "W"];
  for (const c of controls) {
    const source = corpus.get(c.reference);
    check(!!source, "Missing baseline sentence " + c.reference);
    if (!source) continue;
    check(c.sourceStatus === source.status, "Changed evidence level for " + c.reference);
    for (const b of branches) check(c.forms?.[b] === source.forms?.[b], "Changed controlled example " + c.reference + "/" + b);
  }
  for (const id of ["A06", "A11", "A16"]) {
    const s = corpus.get(id);
    check(!!s && /\bza\b/u.test(s.forms.W), "Known W animate-accusative has za: " + id);
  }
  for (const id of ["A03", "A04"]) {
    const s = corpus.get(id);
    check(!!s && !/\bza\b/u.test(s.forms.W), "Known W inanimate-accusative control must remain unmarked: " + id);
  }
  let westAnimateMarked = 0, westOutsideScope = 0, countedCandidate = 0;
  const westAnimatePairs = new Map();
  for (const trial of trials) {
    const key = [trial.lexemeId, trial.branch, trial.case].join("|");
    const entry = nominal.get(key);
    const lemma = nominal.get([trial.lexemeId, trial.branch, "SG.NOM"].join("|"));
    check(!!entry && !!lemma, "Missing R03 pilot evidence: " + trial.id);
    if (!entry || !lemma) continue;
    check(trial.status !== "official-modern" && trial.independentModernEvidence === false,
      "Invented sentence must never be called attested: " + trial.id);
    check(trial.case === "SG.ACC" && entry.recordedForm === trial.nounCandidate,
      "Candidate noun does not match R03 pilot " + trial.id);
    check(trial.headword === lemma.recordedForm, "Headword mismatch in " + trial.id);
    const words = trial.text.trim().replace(/[.!?！？]$/u, "").split(/\s+/u);
    const last = words[words.length - 1];
    check(last === trial.nounCandidate, "Object must match standalone pilot noun form " + trial.id);
    if (trial.marker === "za") {
      check(trial.branch === "W" && words[words.length - 2] === "za", "za should be standalone pre-nominal marker: " + trial.id);
      if (trial.animacy === "animate") {
        westAnimateMarked++;
        check(trial.kind === "constructed-contrast", "Animate za probe must remain a proposal: " + trial.id);
      } else {
        westOutsideScope++;
        check(trial.kind === "counterexample-scope-control"
          && trial.domainStatus === "outside-adopted-M07-animate-domain-not-certified",
          "Unlicensed inanimate za probe must not be presented as normal grammar: " + trial.id);
      }
    } else {
      check(trial.marker === "bare" && words[words.length - 2] !== "za", "Unexpected za in bare control: " + trial.id);
    }
    if (trial.branch === "W" && trial.animacy === "animate") {
      const k = trial.lexemeId;
      const found = westAnimatePairs.get(k) || new Set();
      found.add(trial.marker);
      westAnimatePairs.set(k, found);
    }
    countedCandidate++;
  }
  check(countedCandidate === 34, "Exactly 34 experimental surface strings must be checked");
  check(westAnimateMarked === 5, "Exactly five West animate marker alternatives");
  check(westOutsideScope === 2, "Exactly two West inanimate out-of-scope probes");
  check(westAnimatePairs.size === 5 && [...westAnimatePairs.values()].every(s => s.has("za") && s.has("bare")),
    "Each of five West animate lexemes needs both za and bare trials");
  return {
    pass: errors.length === 0, errors,
    checked: {controlledContexts: controls.length, experimentalStrings: countedCandidate,
      westAnimatePairLexemes: westAnimatePairs.size, westAnimateMarked,
      westInanimateScopeControls: westOutsideScope},
    scope: "Existing attestations preserved and constructed probes internally consistent; no modern sentence or inflection approved."
  };
}
