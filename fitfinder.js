(function () {
  const QUESTIONS = [
    { ask: "What does your data look like?",
      ml: "Rows and columns of facts people already understand",
      dl: "Raw images, audio, or free text with no column names" },
    { ask: "Must the answer be explained to the person it affects?",
      ml: "Yes, feature by feature (appeals, audits, denials)",
      dl: "Accuracy matters most; explanation can come from design and review" },
    { ask: "How much labeled data do you have?",
      ml: "Thousands to a few hundred thousand examples",
      dl: "Well over 100,000 labeled examples" },
    { ask: "How will mistakes be caught?",
      ml: "A person needs to trace each error back to its cause",
      dl: "By testing in the real setting with real users" }
  ];
  const PRESETS = { homes: ["ml", "ml", "ml", "ml"], eyes: ["dl", "dl", "dl", "dl"] };
  const answers = [null, null, null, null];
  const fit = document.getElementById("fit");

  QUESTIONS.forEach((q, i) => {
    const box = document.createElement("fieldset");
    box.className = "fit-q";
    box.innerHTML = `<legend><span class="n">${i + 1}</span>${q.ask}</legend>
      <label class="opt opt-ml"><input type="radio" name="q${i}" value="ml"><span><b>Checklist</b>${q.ml}</span></label>
      <label class="opt opt-dl"><input type="radio" name="q${i}" value="dl"><span><b>Trained eye</b>${q.dl}</span></label>`;
    box.querySelectorAll("input").forEach(inp => inp.addEventListener("change", () => { answers[i] = inp.value; clearPresets(); render(); }));
    fit.appendChild(box);
  });

  function clearPresets() { document.querySelectorAll("[data-preset]").forEach(b => b.setAttribute("aria-pressed", "false")); }

  document.querySelectorAll("[data-preset]").forEach(btn => btn.addEventListener("click", () => {
    const key = btn.dataset.preset;
    clearPresets();
    QUESTIONS.forEach((_, i) => {
      answers[i] = key === "clear" ? null : PRESETS[key][i];
      fit.querySelectorAll(`input[name="q${i}"]`).forEach(inp => { inp.checked = inp.value === answers[i]; });
    });
    if (key !== "clear") btn.setAttribute("aria-pressed", "true");
    render();
  }));

  function render() {
    const ml = answers.filter(a => a === "ml").length;
    const dl = answers.filter(a => a === "dl").length;
    const done = ml + dl;
    document.getElementById("bar-ml").style.width = (ml / 4 * 100) + "%";
    document.getElementById("bar-dl").style.width = (dl / 4 * 100) + "%";
    const head = document.getElementById("fit-head");
    const text = document.getElementById("fit-text");
    if (done < 4) {
      head.textContent = done === 0 ? "Answer the four questions to see where your problem leans." : `${done} of 4 answered.`;
      text.textContent = "";
      return;
    }
    if (ml >= 3) {
      head.textContent = `Leans traditional machine learning (${ml} of 4)`;
      text.textContent = "The knowledge lives in the columns. Start with a simpler model such as regression or decision trees, which will be cheaper, faster, and easier to explain. Ask any vendor pitching deep learning what it would catch that a simpler model would miss.";
    } else if (dl >= 3) {
      head.textContent = `Leans deep learning (${dl} of 4)`;
      text.textContent = "The knowledge lives in the raw data, and a checklist won't capture it. Plan for lots of labeled examples and real computing power, and test in the actual setting before going live. Ask how the system's results will be checked or explained.";
    } else {
      head.textContent = "It's a split decision (2 and 2)";
      text.textContent = "Start with the simpler model and measure it. Move to deep learning only if the simpler model misses something important, and you can show it. Some systems use both: deep learning to read the raw data, and a simpler model to make the final, explainable call.";
    }
  }
  render();
})();
