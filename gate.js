(function () {
  // A starred question is a stopper: one "No" there blocks the project
  // no matter how good everything else looks. Data readiness isn't an average.
  const SECTIONS = [
    { key: "clean", name: "Clean", sub: "Is the data what you think it is?", qs: [
      { id: "raw", stop: true, q: "Is there an untouched copy of the raw data, with a record of where it came from?",
        fix: "Save the raw data before cleaning and write down each source. Without it, no cleaning mistake can be undone." },
      { id: "labels", stop: true, q: "Have people checked the labels on a sample, instead of assuming they're right?",
        fix: "Hand-check a random sample of labels. Clean data with wrong labels still teaches the model the wrong answers." },
      { id: "dupes", stop: false, q: "Were duplicates removed and related records grouped before the train/test split?",
        fix: "Group duplicates before splitting. Otherwise the test set repeats the training set and the score looks better than it is." },
      { id: "log", stop: false, q: "Is every removal written down, with before-and-after counts by group?",
        fix: "Log every exclusion and compare who is in the data before and after. Cleaning can quietly remove the people the model most needs to serve." }
    ]},
    { key: "fair", name: "Fair", sub: "Does it work for everyone it will touch?", qs: [
      { id: "target", stop: true, q: "Does the label measure what you actually care about?",
        fix: "Check what the label really records. \"Was hired\" or \"was billed\" is a record of past decisions, not proof of what was right." },
      { id: "groups", stop: true, q: "Have error rates been checked for each affected group, with the group sizes shown?",
        fix: "Break results out by group, and show how many people are in each one. A model can be 95% accurate overall and still fail a small group, but with only a handful of cases a gap can also be luck." },
      { id: "local", stop: false, q: "Has it been tested on data from the place and people where it will actually be used?",
        fix: "Test on local data before launch. A good score on yesterday's population is not a passport to a new one." },
      { id: "appeal", stop: false, q: "Can a person challenge a decision and get a human to look again?",
        fix: "Give people a clear way to ask for human review, and track how often appeals win. That number is a count of caught mistakes." }
    ]},
    { key: "safe", name: "Safe", sub: "Is it protected, governed, and watched?", qs: [
      { id: "agree", stop: true, q: "Is there a written agreement on who can use the data, for what, and what happens when the project ends?",
        fix: "Put purpose, ownership, retention, and responsibility in writing before any data moves. If it isn't decided on day one, it becomes a fight on the last day." },
      { id: "minimal", stop: false, q: "Are you using only the fields the model really needs?",
        fix: "Cut fields the model doesn't need. Data you never collect can't leak." },
      { id: "access", stop: false, q: "Is access limited to named people, with a log of who touched what?",
        fix: "Limit access to named people and keep audit logs, so a problem can be traced to a person and a moment." },
      { id: "watch", stop: false, q: "Is there a plan to monitor it after launch, and a rule for when to pause it?",
        fix: "Decide what you'll watch and the exact point where you pause. Launch day is the start of evaluation, not the end." }
    ]}
  ];

  const ALL = SECTIONS.flatMap(s => s.qs.map(q => ({ ...q, section: s.key })));
  const answers = {};

  // Ratings for the course's three practice scenarios as each was first pitched,
  // plus TalentBridge again with the safeguards I proposed in my coaching session.
  const EXAMPLES = {
    review: { label: "ReviewPulse, as pitched", note: "800,000 scraped reviews, star ratings used as labels, and a team in a hurry to train.",
      a: { raw: "unsure", labels: "no", dupes: "no", log: "no", target: "unsure", groups: "no", local: "unsure", appeal: "unsure", agree: "unsure", minimal: "yes", access: "unsure", watch: "no" } },
    talent: { label: "TalentBridge, as pitched", note: "Ten years of one company's hiring decisions, headed to a new country at ten times the volume.",
      a: { raw: "yes", labels: "yes", dupes: "yes", log: "unsure", target: "no", groups: "no", local: "no", appeal: "no", agree: "yes", minimal: "unsure", access: "yes", watch: "no" } },
    talentFixed: { label: "TalentBridge, with my safeguards", note: "Same model after a shadow pilot, group-level testing, appeals, and a pause rule. It moves from Stop to Hold, not Go, because safeguards built around a weak label don't fix the label.",
      a: { raw: "yes", labels: "yes", dupes: "yes", log: "yes", target: "unsure", groups: "yes", local: "yes", appeal: "yes", agree: "yes", minimal: "yes", access: "yes", watch: "yes" } },
    hospital: { label: "Riverbend + Lakeside, as pitched", note: "Two hospitals, sensitive records, different coding habits, and no agreement yet.",
      a: { raw: "yes", labels: "unsure", dupes: "unsure", log: "unsure", target: "yes", groups: "unsure", local: "unsure", appeal: "yes", agree: "no", minimal: "unsure", access: "unsure", watch: "unsure" } }
  };

  const $ = id => document.getElementById(id);
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function build() {
    $("gate-sections").innerHTML = SECTIONS.map((s, si) => `
      <fieldset class="g-sec" data-sec="${s.key}">
        <legend><span class="g-name">${s.name}</span><span class="g-sub">${s.sub}</span><span class="g-chip" id="chip-${s.key}">Not rated</span></legend>
        ${s.qs.map((q, qi) => `
          <div class="g-q" id="row-${q.id}">
            <p><span class="g-num">${si * 4 + qi + 1}</span>${esc(q.q)}${q.stop ? ' <span class="g-star" title="Stopper: a No here blocks the project">Stopper</span>' : ""}</p>
            <div class="g-opts" role="radiogroup" aria-label="${esc(q.q)}">
              ${[["yes", "Yes"], ["unsure", "Not sure"], ["no", "No"]].map(([v, t]) =>
                `<label class="g-opt g-${v}"><input type="radio" name="${q.id}" value="${v}"><span>${t}</span></label>`).join("")}
            </div>
          </div>`).join("")}
      </fieldset>`).join("");

    $("gate-sections").addEventListener("change", e => {
      if (e.target.name) { answers[e.target.name] = e.target.value; $("gate-note").textContent = ""; render(); }
    });

    $("gate-examples").innerHTML = Object.entries(EXAMPLES).map(([k, ex]) =>
      `<button type="button" data-ex="${k}" aria-pressed="false">${ex.label}</button>`).join("") +
      `<button type="button" data-ex="clear">Clear</button>`;
    $("gate-examples").addEventListener("click", e => {
      const k = e.target.closest("button")?.dataset.ex; if (!k) return;
      document.querySelectorAll("#gate-examples button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.ex === k && k !== "clear")));
      ALL.forEach(q => delete answers[q.id]);
      if (k !== "clear") Object.assign(answers, EXAMPLES[k].a);
      document.querySelectorAll("#gate-sections input").forEach(i => { i.checked = answers[i.name] === i.value; });
      $("gate-note").textContent = k === "clear" ? "" : EXAMPLES[k].note;
      render();
    });
  }

  function verdict() {
    const rated = ALL.filter(q => answers[q.id]);
    if (rated.length === 0) return null;
    const stopNo = ALL.filter(q => q.stop && answers[q.id] === "no");
    const stopUnsure = ALL.filter(q => q.stop && answers[q.id] === "unsure");
    const softNo = ALL.filter(q => !q.stop && answers[q.id] === "no");
    const gaps = ALL.filter(q => answers[q.id] && answers[q.id] !== "yes");
    const left = ALL.length - rated.length;

    let v;
    if (stopNo.length) v = { cls: "stop", head: "Stop", text: `${stopNo.length === 1 ? "A stopper is" : stopNo.length + " stoppers are"} marked No. Good answers elsewhere don't cancel it out. Fix ${stopNo.length === 1 ? "it" : "these"} before any training or launch.` };
    else if (stopUnsure.length || softNo.length >= 3) v = { cls: "hold", head: "Hold", text: "Nothing is a hard No on the stoppers, but too much is unknown or missing. Find out before you build on it." };
    else if (left && !gaps.length) v = { cls: "", head: "So far, so good", text: "Nothing blocks you yet. Keep going." };
    else if (gaps.length) v = { cls: "cond", head: "Go, with conditions", text: "The foundations hold. Close the open items below and write down who owns each one." };
    else v = { cls: "go", head: "Go", text: "Every check passes. Keep watching it after launch, because data changes even when the model doesn't." };
    if (left) v.text += ` (${left} question${left === 1 ? "" : "s"} still unanswered.)`;
    return { ...v, gaps: gaps.sort((a, b) => (b.stop - a.stop) || ((answers[b.id] === "no") - (answers[a.id] === "no"))) };
  }

  function render() {
    SECTIONS.forEach(s => {
      const vals = s.qs.map(q => answers[q.id]).filter(Boolean);
      const chip = $("chip-" + s.key);
      const hardStop = s.qs.some(q => q.stop && answers[q.id] === "no");
      chip.className = "g-chip";
      if (!vals.length) chip.textContent = "Not rated";
      else if (hardStop) { chip.textContent = "Blocked"; chip.classList.add("c-stop"); }
      else if (vals.every(v => v === "yes") && vals.length === s.qs.length) { chip.textContent = "Ready"; chip.classList.add("c-go"); }
      else { chip.textContent = "Gaps"; chip.classList.add("c-hold"); }
    });
    ALL.forEach(q => { const r = $("row-" + q.id); r.dataset.a = answers[q.id] || ""; });

    const v = verdict(), out = $("gate-result");
    if (!v) { out.className = "g-result"; out.innerHTML = '<p class="g-head">Answer the questions or load an example</p><p class="g-text">The call updates as you go.</p>'; return; }
    out.className = "g-result" + (v.cls ? " r-" + v.cls : "");
    out.innerHTML = `<p class="g-kicker">The call</p><p class="g-head">${v.head}</p><p class="g-text">${v.text}</p>` +
      (v.gaps.length ? `<p class="g-kicker" style="margin-top:14px">What to fix first</p><ol class="g-fix">${v.gaps.map(q =>
        `<li class="${answers[q.id] === "no" ? "f-no" : "f-unsure"}"><b>${answers[q.id] === "no" ? "No" : "Not sure"}${q.stop ? " · Stopper" : ""}</b>${esc(q.fix)}</li>`).join("")}</ol>` : "");
  }

  build();
  render();
})();
