(function () {
  const CLUES = [
    { key: "warm", label: "Warm night" },
    { key: "rival", label: "Rival game" },
    { key: "night", label: "Night kickoff" },
    { key: "home", label: "Homecoming" }
  ];
  const START = { warm: 2, rival: 3, night: 1, home: 0 };
  const BAR = 4;
  // Practice games for the demo only (made up, not real sales data).
  const GAMES = [
    { n: 1, warm: 1, rival: 1, night: 0, home: 0, busy: true },
    { n: 2, warm: 0, rival: 0, night: 1, home: 0, busy: false },
    { n: 3, warm: 0, rival: 0, night: 1, home: 1, busy: true },
    { n: 4, warm: 1, rival: 0, night: 0, home: 0, busy: false },
    { n: 5, warm: 0, rival: 1, night: 1, home: 0, busy: true },
    { n: 6, warm: 1, rival: 0, night: 1, home: 1, busy: true },
    { n: 7, warm: 0, rival: 1, night: 0, home: 0, busy: false },
    { n: 8, warm: 1, rival: 1, night: 1, home: 1, busy: true }
  ];
  let dials = { ...START };
  let rounds = 0;
  const test = { warm: 0, rival: 0, night: 0, home: 0 };
  const $ = id => document.getElementById(id);

  const score = g => CLUES.reduce((s, c) => s + (g[c.key] ? dials[c.key] : 0), 0);
  const guess = g => score(g) >= BAR;
  const clueText = g => CLUES.filter(c => g[c.key]).map(c => c.label.toLowerCase()).join(", ") || "nothing special";

  function renderDials() {
    $("dials").innerHTML = CLUES.map(c =>
      `<div class="dial"><span>${c.label}</span><b>${dials[c.key] >= 0 ? "+" : ""}${dials[c.key]}</b>
       <i style="width:${Math.max(0, Math.min(100, dials[c.key] * 18))}%"></i></div>`).join("");
  }
  function renderGames() {
    const right = GAMES.filter(g => guess(g) === g.busy).length;
    $("games").innerHTML = GAMES.map(g => {
      const ok = guess(g) === g.busy;
      return `<tr class="${ok ? "ok" : "miss"}"><td>Game ${g.n}</td><td>${clueText(g)}</td>
        <td>${score(g)}</td><td>${guess(g) ? "Busy" : "Quiet"}</td><td>${g.busy ? "Busy" : "Quiet"}</td>
        <td>${ok ? "Right" : "Wrong"}</td></tr>`;
    }).join("");
    $("score").textContent = `${right} of ${GAMES.length} right`;
    $("rounds").textContent = rounds === 0 ? "Before any training" : `After ${rounds} round${rounds > 1 ? "s" : ""} of checking receipts`;
    $("train").disabled = right === GAMES.length;
    $("train").textContent = right === GAMES.length ? "All games right. The dials have settled." : "Check the receipts (train one round)";
  }
  function renderTest() {
    const s = score(test);
    $("test-total").textContent = s;
    $("test-call").textContent = s >= BAR ? "Busy!" : "Quiet";
    $("test-call").className = s >= BAR ? "call busy" : "call";
  }
  function train() {
    rounds += 1;
    const notes = [];
    GAMES.forEach(g => {
      const said = guess(g);
      if (said === g.busy) return;
      const step = g.busy ? 1 : -1;
      const changed = CLUES.filter(c => g[c.key]);
      changed.forEach(c => { dials[c.key] += step; });
      notes.push(`Game ${g.n}: the volunteer said ${said ? "Busy" : "Quiet"}, but it was ${g.busy ? "Busy" : "Quiet"}. ` +
        `Turned ${step > 0 ? "up" : "down"} ${changed.map(c => c.label.toLowerCase()).join(" and ")} by 1.`);
    });
    $("log").innerHTML = (notes.length ? notes : ["No mistakes this round. Nothing to fix."])
      .map(t => `<li>${t}</li>`).join("") ;
    renderAll();
  }
  function reset() {
    dials = { ...START }; rounds = 0;
    $("log").innerHTML = "<li>Dials reset to where my discussion post started them.</li>";
    renderAll();
  }
  function renderAll() { renderDials(); renderGames(); renderTest(); }

  $("test").innerHTML = CLUES.map(c =>
    `<label class="tog"><input type="checkbox" data-k="${c.key}"><span>${c.label}?</span></label>`).join("");
  $("test").querySelectorAll("input").forEach(i => i.addEventListener("change", () => { test[i.dataset.k] = i.checked ? 1 : 0; renderTest(); }));
  $("train").addEventListener("click", train);
  $("reset").addEventListener("click", reset);
  renderAll();
})();
