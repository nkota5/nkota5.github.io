(function () {
  const LANES = [
    { key: "ideas", name: "Ideas", color: "#4338ca" },
    { key: "chips", name: "Chips & Cloud", color: "#e8590c" },
    { key: "data", name: "Data", color: "#0e9f6e" },
    { key: "money", name: "Money & Companies", color: "#c0266d" },
  ];
  // [year, lane, short label, title, description, setback?]
  const EVENTS = [
    [1950, "ideas", "Turing test", "Turing asks, \"Can machines think?\"", "Alan Turing proposes the imitation game, now called the Turing Test, and turns a philosophy question into something you can test."],
    [1956, "ideas", "Dartmouth", "AI gets its name", "John McCarthy, Marvin Minsky, Nathaniel Rochester, and Claude Shannon hold a summer workshop at Dartmouth. Artificial intelligence becomes a field."],
    [1958, "ideas", "Perceptron", "The Perceptron learns from examples", "Frank Rosenblatt's machine adjusts itself after each mistake. Newspapers predict it will soon walk, talk, and know it exists. It was about 54 years early."],
    [1963, "money", "DARPA funds", "Government money pours in", "Through the 1960s, U.S. defense funding supports AI labs at places like MIT, Stanford, and Carnegie Mellon, often with few strings attached."],
    [1966, "ideas", "ELIZA", "ELIZA, the first chatbot", "Joseph Weizenbaum's MIT program only matches patterns in your words. People still confide in it, which troubled him deeply."],
    [1969, "ideas", "Limits shown", "The doubt arrives", "Minsky and Papert's book Perceptrons shows what simple one-layer networks can't learn. Neural network research loses favor.", true],
    [1971, "chips", "Microprocessor", "A computer on one chip", "Intel's 4004 starts hardware's long climb. For now, it is nowhere near fast enough for AI's promises."],
    [1973, "money", "Lighthill cuts", "Britain pulls back", "The Lighthill Report concludes AI hasn't delivered what it promised. Funding cuts follow, and the first AI winter begins.", true],
    [1980, "money", "XCON pays", "Expert systems pay off", "XCON configures computer orders at Digital Equipment Corporation and saves an estimated $25 million a year by 1986."],
    [1986, "ideas", "Backprop", "Backpropagation", "Rumelhart, Hinton, and Williams show how layered networks can learn from their own errors. It is still the core of modern AI."],
    [1987, "money", "Market crash", "The AI hardware market collapses", "Cheaper desktop computers catch up with expensive AI machines. Expert systems prove brittle and costly to update. The second winter begins.", true],
    [1989, "data", "ZIP codes", "LeNet reads handwriting", "Yann LeCun's convolutional network at Bell Labs reads ZIP codes for the Postal Service. By 2001, similar systems read about 10% of U.S. checks."],
    [1997, "chips", "Deep Blue", "Deep Blue beats Kasparov", "IBM's chess computer wins with raw speed and search, not learning. It shows what enough computing power can do."],
    [1998, "data", "The web", "The web becomes the world's dataset", "Google is founded and the web grows fast. For the first time, there is more text and images online than anyone can label by hand."],
    [2006, "chips", "AWS cloud", "Amazon rents out computers", "Amazon Web Services launches cloud storage and servers by the hour. A small team can now rent power that once needed a whole lab."],
    [2007, "chips", "CUDA GPUs", "Nvidia opens up the GPU", "CUDA lets programmers use gaming graphics cards for general math. They turn out to be perfect for training neural networks."],
    [2009, "data", "ImageNet", "ImageNet", "Fei-Fei Li's team at Princeton labels millions of photos, later over 14 million. About 49,000 online workers in 167 countries did the labeling."],
    [2012, "ideas", "AlexNet", "AlexNet: all four ingredients line up", "Krizhevsky, Sutskever, and Hinton combine 1986 ideas, ImageNet data, and two gaming GPUs. Error drops to 15.3% while the next best is 26.2%."],
    [2014, "money", "DeepMind", "Google buys DeepMind", "After buying Hinton's startup in 2013, Google adds Demis Hassabis's London lab for a reported $500 million or more."],
    [2016, "chips", "Google TPU", "Google builds its own AI chip", "Google reveals the TPU, a chip made only for neural networks. Its cloud later rents TPUs to anyone."],
    [2017, "ideas", "Transformer", "The Transformer", "Google researchers publish \"Attention Is All You Need.\" This design powers nearly every modern chatbot."],
    [2020, "data", "GPT-3", "GPT-3 learns from the web", "OpenAI trains a 175-billion-parameter model on huge amounts of web text, using a supercomputer Microsoft built in its Azure cloud."],
    [2022, "money", "ChatGPT", "ChatGPT", "Released November 30. About 100 million people use it within roughly two months."],
    [2023, "chips", "Nvidia $1T", "Chips become the prize", "Nvidia passes a $1 trillion market value as demand for AI chips explodes."],
    [2023.4, "money", "$10B bet", "Microsoft bets $10 billion", "After $1 billion in 2019, Microsoft commits a reported $10 billion to OpenAI, and Google, Meta, and Anthropic race with their own models."],
  ];
  const svg = document.getElementById("tl");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  const W = 1100, X0 = 150, XW = 930, TOP = 54, LH = 88;
  const X = (y) => y <= 2000 ? X0 + (y - 1950) / 50 * XW * 0.55 : X0 + XW * 0.55 + (y - 2000) / 26 * XW * 0.45;
  const H = TOP + LH * 4 + 64;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const el = (tag, attrs, text) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (text != null) n.textContent = text; svg.appendChild(n); return n; };

  el("rect", { x: X(1956), y: 10, width: X(1993) - X(1956), height: 26, rx: 6, fill: "#eef0f6" });
  el("text", { x: X(1956) + 10, y: 28, "font-size": 12, "font-weight": 700, fill: "#5b6475" }, "RULES ERA: people write the rules");
  el("rect", { x: X(2006), y: 10, width: X(2026) - X(2006), height: 26, rx: 6, fill: "#eef0f6" });
  el("text", { x: X(2006) + 10, y: 28, "font-size": 12, "font-weight": 700, fill: "#5b6475" }, "LEARNING ERA: machines learn from data");

  LANES.forEach((l, i) => {
    const y = TOP + i * LH;
    if (i % 2 === 0) el("rect", { x: 0, y, width: X(2026), height: LH, fill: "#f8f9fc" });
    el("circle", { cx: 12, cy: y + LH / 2, r: 7, fill: l.color });
    el("text", { x: 26, y: y + LH / 2 + 5, "font-size": 14, "font-weight": 700, fill: l.color }, l.name);
  });
  [[1974, 1980, "Winter 1"], [1987, 1993, "Winter 2"]].forEach(([a, b, t]) => {
    el("rect", { x: X(a), y: TOP, width: X(b) - X(a), height: LH * 4, fill: "#dce2ea", opacity: 0.85 });
    el("text", { x: (X(a) + X(b)) / 2, y: TOP + LH * 4 + 18, "font-size": 12, "font-weight": 700, fill: "#4a5568", "text-anchor": "middle" }, t);
  });
  el("line", { x1: X(2012), x2: X(2012), y1: TOP - 4, y2: TOP + LH * 4 + 4, stroke: "#151b2e", "stroke-width": 1.5, "stroke-dasharray": "5 4" });
  const ay = TOP + LH * 4 + 36;
  el("line", { x1: X(1950), x2: X(2026), y1: ay, y2: ay, stroke: "#c9d0db" });
  [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020].forEach(y => {
    el("line", { x1: X(y), x2: X(y), y1: ay - 4, y2: ay + 4, stroke: "#c9d0db" });
    el("text", { x: X(y), y: ay + 20, "font-size": 12, fill: "#5b6475", "text-anchor": "middle" }, y);
  });

  const laneY = (k) => TOP + LANES.findIndex(l => l.key === k) * LH + LH / 2;
  const counter = {};
  const dots = [];
  EVENTS.forEach((e, idx) => {
    const [yr, lane, short, , , setback] = e;
    const color = LANES.find(l => l.key === lane).color;
    const cx = X(yr), cy = laneY(lane);
    counter[lane] = (counter[lane] || 0) + 1;
    const above = counter[lane] % 2 === 1;
    const g = document.createElementNS(NS, "g"); g.setAttribute("data-lane", lane); svg.appendChild(g);
    const shift = Math.floor(yr) === 2012 ? -10 : 0, anchor = shift ? "end" : "middle";
    const lbl = (y, txt, bold) => { const t = document.createElementNS(NS, "text"); t.setAttribute("x", cx + shift); t.setAttribute("y", y); t.setAttribute("font-size", 11); t.setAttribute("text-anchor", anchor); t.setAttribute("fill", "#2b3343"); if (bold) t.setAttribute("font-weight", 700); t.textContent = txt; g.appendChild(t); };
    const yy = String(Math.floor(yr) === 1963 ? "1960s" : Math.floor(yr));
    if (above) { lbl(cy - 28, yy, true); lbl(cy - 15, short); } else { lbl(cy + 24, yy, true); lbl(cy + 37, short); }
    const c = document.createElementNS(NS, "circle");
    Object.entries({ cx, cy, r: 7.5, fill: setback ? "#fff" : color, stroke: color, "stroke-width": 2.5, class: "dot", tabindex: 0, role: "button", "aria-label": `${yy}: ${e[3]}` }).forEach(([k, v]) => c.setAttribute(k, v));
    c.addEventListener("click", () => show(idx));
    c.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); show(idx); } });
    g.appendChild(c); dots.push(c);
  });

  const d = document.getElementById("detail");
  function show(i) {
    const [yr, lane, , title, text] = EVENTS[i];
    const L = LANES.find(l => l.key === lane);
    dots.forEach((c, j) => c.classList.toggle("on", j === i));
    d.innerHTML = `<div><div class="yr" style="color:${L.color}">${Math.floor(yr) === 1963 ? "1960s" : Math.floor(yr)}</div><div class="lane" style="color:${L.color}">${L.name}</div></div><div><h4></h4><p></p></div>`;
    d.querySelector("h4").textContent = title;
    d.querySelector("p").textContent = text;
  }
  show(EVENTS.findIndex(e => e[0] === 2012));

  document.querySelectorAll(".filters button").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.lane;
    document.querySelectorAll(".filters button").forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
    svg.querySelectorAll("g[data-lane]").forEach(g => { g.style.opacity = (k === "all" || g.dataset.lane === k) ? 1 : 0.12; });
  }));

  // Four-ingredient check
  const boxes = document.querySelectorAll(".check input");
  const out = document.getElementById("verdict-text"), sc = document.getElementById("verdict-score");
  const msgs = {
    4: "All four are in place. This is what 2012 looked like. Run a small pilot and measure it against a clear goal.",
    3: "One ingredient is missing. Find it and fix it before you scale. Every AI stall in history was missing at least one.",
    2: "Two are missing. This is how the 1970s felt: a good idea waiting on everything else. Keep it in the research stage.",
    1: "Most of the recipe is missing. History says wait, or start by building the missing pieces first.",
    0: "Nothing is in place yet. Start with the problem and the data, not the tool.",
  };
  function update() { const n = [...boxes].filter(b => b.checked).length; sc.textContent = `${n}/4`; out.textContent = msgs[n]; }
  boxes.forEach(b => b.addEventListener("change", update));
  if (sc) update();
})();
