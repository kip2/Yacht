"use strict";

const LANG_KEY = "yacht.lang";

const I18N = {
  ja: {
    gameTitle: "ヨット",
    newGame: "新しいゲーム",
    numPlayers: "プレイヤー人数:",
    playerNamePlaceholder: (n) => `プレイヤー${n} の名前`,
    start: "開始",
    rollFirst: "振る",
    rerollSelected: "選んだダイスを振り直す",
    restart: "やり直す",
    diceHint: "ダイスをクリックすると振り直し対象として選べます。手番の最初は何も選ばずそのまま「振る」を押してください。",
    confirmScore: (cat, sc) => `${cat} に ${sc} 点で確定しますか?`,
    gameOver: "ゲーム終了",
    winnerLine: (name, score) => `勝者: ${name} (${score} 点)`,
    turnStatus: (name, rolls) => `${name} の手番 ― 残り ${rolls} 投`,
    waitingFirstRoll: "(「振る」で開始)",
    needSelection: "振り直すダイスを選んでください。",
    confirmAbandon: "現在のゲームを中断しますか?",
    category: "カテゴリ",
    total: "合計",
    langButton: "EN",
    diceEmpty: "?",
    howToPlayBtn: "遊び方",
    helpTitle: "ヨットの遊び方",
    close: "閉じる",
    loading: "読み込み中...",
    loadFailed: "yacht.wasm の読み込みに失敗しました。ページを再読み込みしてください。",
    categories: {
      "ones": "エース", "twos": "デュース", "threes": "トレイ", "fours": "フォー",
      "fives": "ファイブ", "sixes": "シックス", "full-house": "フルハウス",
      "four-of-a-kind": "フォーダイス", "little-straight": "リトルストレート",
      "big-straight": "ビッグストレート", "choice": "チョイス", "yacht": "ヨット",
    },
    categoryTips: {
      "ones": "1 の目の合計", "twos": "2 の目の合計", "threes": "3 の目の合計",
      "fours": "4 の目の合計", "fives": "5 の目の合計", "sixes": "6 の目の合計",
      "full-house": "3 個揃い + 2 個揃い → 5 個の合計点",
      "four-of-a-kind": "同じ目が 4 個以上 → その目 × 4",
      "little-straight": "1-2-3-4-5 が揃う → 30 点",
      "big-straight": "2-3-4-5-6 が揃う → 30 点",
      "choice": "5 個の合計 (制約なし)",
      "yacht": "5 個すべて同じ目 → 50 点",
    },
    help: {
      intro: "5 個のサイコロを振り、12 のカテゴリそれぞれに点数を記入していくゲームです。",
      flowHeader: "進め方",
      flow: [
        "1 手番につき最大 3 回までダイスを振れます。",
        "最初の投は全 5 個。2 投目以降は残したいダイスをクリックで選び、選ばなかった残りだけを振り直します。",
        "手番の最後にまだ使っていないカテゴリを 1 つ選んで点数を確定します (0 点でも記入可)。",
        "12 カテゴリ全部が埋まったらゲーム終了。合計点が高い人が勝ちです。",
      ],
      rolesHeader: "役一覧",
      roles: [
        ["エース 〜 シックス", "その目の出目の合計 (例: エース [1,1,2,3,4] → 2 点)"],
        ["フルハウス", "3 個揃い + 2 個揃い → 5 個の合計点 (例: [3,3,3,2,2] → 13 点)"],
        ["フォーダイス", "同じ目が 4 個以上 → その目 × 4 (例: [4,4,4,4,1] → 16 点)"],
        ["リトルストレート", "1-2-3-4-5 が揃う → 30 点"],
        ["ビッグストレート", "2-3-4-5-6 が揃う → 30 点"],
        ["チョイス", "5 個の合計。条件なし、捨て役にも使える"],
        ["ヨット", "5 個すべて同じ目 → 50 点"],
      ],
    },
  },
  en: {
    gameTitle: "Yacht",
    newGame: "New Game",
    numPlayers: "Number of players:",
    playerNamePlaceholder: (n) => `Player ${n} name`,
    start: "Start",
    rollFirst: "Roll",
    rerollSelected: "Reroll selected",
    restart: "Restart",
    diceHint: "Click dice to mark them for reroll. For the first throw of a turn, just press 'Roll' with nothing selected.",
    confirmScore: (cat, sc) => `Score ${sc} on ${cat}?`,
    gameOver: "Game Over",
    winnerLine: (name, score) => `Winner: ${name} (${score} pts)`,
    turnStatus: (name, rolls) => `${name}'s turn — rolls left: ${rolls}`,
    waitingFirstRoll: "(press 'Roll' to begin)",
    needSelection: "Select dice to reroll first.",
    confirmAbandon: "Abandon the current game?",
    category: "Category",
    total: "Total",
    langButton: "日本語",
    diceEmpty: "?",
    howToPlayBtn: "How to play",
    helpTitle: "How to play Yacht",
    close: "Close",
    loading: "Loading...",
    loadFailed: "Failed to load yacht.wasm. Please reload the page.",
    categories: {
      "ones": "Ones", "twos": "Twos", "threes": "Threes", "fours": "Fours",
      "fives": "Fives", "sixes": "Sixes", "full-house": "Full House",
      "four-of-a-kind": "Four of a Kind", "little-straight": "Little Straight",
      "big-straight": "Big Straight", "choice": "Choice", "yacht": "Yacht",
    },
    categoryTips: {
      "ones": "Sum of 1s", "twos": "Sum of 2s", "threes": "Sum of 3s",
      "fours": "Sum of 4s", "fives": "Sum of 5s", "sixes": "Sum of 6s",
      "full-house": "3-of-a-kind + pair → sum of all 5",
      "four-of-a-kind": "4 or more same → face × 4",
      "little-straight": "1-2-3-4-5 → 30 pts",
      "big-straight": "2-3-4-5-6 → 30 pts",
      "choice": "Sum of all 5 (no restriction)",
      "yacht": "All 5 same → 50 pts",
    },
    help: {
      intro: "Roll 5 dice and fill 12 categories on your scorecard.",
      flowHeader: "Flow of a turn",
      flow: [
        "Up to 3 rolls per turn.",
        "First roll uses all 5 dice. Afterwards, click the dice you want to keep and press the reroll button to reroll the rest.",
        "End the turn by recording the dice into one unused category (0 pts is allowed — that category is then used up).",
        "When all 12 categories are filled, the player with the highest total wins.",
      ],
      rolesHeader: "Categories",
      roles: [
        ["Ones – Sixes", "Sum of dice with that face (e.g. Ones on [1,1,2,3,4] → 2)"],
        ["Full House", "3-of-a-kind + pair → sum of all 5 (e.g. [3,3,3,2,2] → 13)"],
        ["Four of a Kind", "4 or more same face → face × 4 (e.g. [4,4,4,4,1] → 16)"],
        ["Little Straight", "1-2-3-4-5 → 30"],
        ["Big Straight", "2-3-4-5-6 → 30"],
        ["Choice", "Sum of all 5; no restriction. Use as a safe slot"],
        ["Yacht", "All 5 same face → 50"],
      ],
    },
  },
};

// Category index は WASM の Category enum と一致させる。
const CATEGORY_KEYS = [
  "ones", "twos", "threes", "fours", "fives", "sixes",
  "full-house", "four-of-a-kind", "little-straight", "big-straight",
  "choice", "yacht",
];

const state = {
  snapshot: null,
  lang: localStorage.getItem(LANG_KEY) || "ja",
  names: [],   // プレイヤー名 (WASM では持たない、JS 側で管理)
};

const wasm = { exports: null };

const el = (id) => document.getElementById(id);

function t(key, ...args) {
  const v = I18N[state.lang][key];
  return typeof v === "function" ? v(...args) : v;
}
function tCat(key) { return I18N[state.lang].categories[key] || key; }
function tCatTip(key) { return I18N[state.lang].categoryTips[key] || ""; }

// =========================================================================
// WASM 読み込みと、状態を構築するアダプタ層
// =========================================================================

async function loadWasm() {
  // GitHub Pages や python http.server だと wasm の Content-Type が
  // 適切でないことがあるため、ArrayBuffer 経由で確実に読み込む。
  const r = await fetch("yacht.wasm");
  if (!r.ok) throw new Error("HTTP " + r.status);
  const buf = await r.arrayBuffer();
  const m = await WebAssembly.instantiate(buf, {});
  wasm.exports = m.instance.exports;
}

// WASM のエクスポートから「以前の REST レスポンスと同じ形」の state を作る。
// render*() 系をそのまま使い回せる。
function snapshotFromWasm() {
  const w = wasm.exports;
  const playerCount = w.yacht_player_count();
  const turnStarted = !!w.yacht_turn_started();
  const isOver = !!w.yacht_is_over();

  const dice = [];
  for (let i = 0; i < 5; i++) dice.push(w.yacht_die_value(i));

  const players = [];
  for (let p = 0; p < playerCount; p++) {
    const scores = {};
    CATEGORY_KEYS.forEach((key, c) => {
      scores[key] = w.yacht_score_used(p, c) ? w.yacht_score_value(p, c) : null;
    });
    players.push({
      name: state.names[p] || ("P" + (p + 1)),
      scores,
      total: w.yacht_player_total(p),
    });
  }

  const snap = {
    currentPlayer: w.yacht_current_player(),
    rollsLeft: w.yacht_rolls_left(),
    turnStarted,
    isOver,
    dice,
    players,
  };

  if (turnStarted && !isOver) {
    const preview = {};
    CATEGORY_KEYS.forEach((key, c) => {
      const v = w.yacht_preview(c);
      if (v >= 0) preview[key] = v;
    });
    snap.preview = preview;
  }

  if (isOver) {
    let best = -1, winner = "";
    players.forEach((p) => {
      if (p.total > best) { best = p.total; winner = p.name; }
    });
    snap.winner = winner;
    snap.winnerScore = best;
  }

  return snap;
}

function syncState() { state.snapshot = snapshotFromWasm(); }

// =========================================================================
// 国際化と一般 UI
// =========================================================================

function applyStaticI18n() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  el("btn-lang").textContent = t("langButton");
  if (!el("help-modal").hidden) renderHelpModal();
}

function toggleLang() {
  state.lang = state.lang === "ja" ? "en" : "ja";
  localStorage.setItem(LANG_KEY, state.lang);
  applyStaticI18n();
  renderNameFields();
  if (state.snapshot) render();
}

function renderNameFields() {
  const n = parseInt(el("num-players").value, 10) || 1;
  const wrap = el("name-fields");
  const previous = [...wrap.querySelectorAll("input")].map((i) => i.value);
  wrap.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = t("playerNamePlaceholder", i + 1);
    input.dataset.idx = String(i);
    if (previous[i] !== undefined) input.value = previous[i];
    wrap.appendChild(input);
  }
}

// =========================================================================
// アクション
// =========================================================================

function startNewGame() {
  const n = parseInt(el("num-players").value, 10) || 1;
  const inputs = el("name-fields").querySelectorAll("input");
  const names = [];
  inputs.forEach((inp, i) => {
    names.push((inp.value || "").trim() || "P" + (i + 1));
  });
  state.names = names;
  // 32-bit 符号なしシード。0 だと xorshift が縮退するので最低 1 を入れる。
  const seed = ((Math.random() * 0x100000000) >>> 0) || 1;
  wasm.exports.yacht_new(n, seed);
  syncState();
  showGame();
  render();
}

function showGame() { el("setup").hidden = true; el("game").hidden = false; }
function showSetup() { el("setup").hidden = false; el("game").hidden = true; }

function rollClicked() {
  const s = state.snapshot;
  if (!s) return;
  if (!s.turnStarted) rollAll();
  else rerollSelected();
}

function rollAll() {
  if (!wasm.exports.yacht_roll_all()) flash("cannot roll");
  syncState();
  render();
}

function rerollSelected() {
  const positions = [...document.querySelectorAll(".die.selected")]
    .map((d) => parseInt(d.dataset.idx, 10));
  if (positions.length === 0) { flash(t("needSelection")); return; }
  const mask = positions.reduce((m, p) => m | (1 << p), 0);
  if (!wasm.exports.yacht_reroll(mask)) flash("cannot reroll");
  syncState();
  render();
}

function recordScore(catKey) {
  const c = CATEGORY_KEYS.indexOf(catKey);
  if (c < 0) return;
  if (wasm.exports.yacht_record(c) < 0) { flash("cannot record"); return; }
  syncState();
  render();
}

function restart() {
  if (!confirm(t("confirmAbandon"))) return;
  state.snapshot = null;
  state.names = [];
  renderNameFields();
  showSetup();
}

let flashTimer = null;
function flash(msg) {
  el("status").textContent = msg;
  if (flashTimer) clearTimeout(flashTimer);
  flashTimer = setTimeout(() => { if (state.snapshot) renderStatus(state.snapshot); }, 1800);
}

// =========================================================================
// 描画 (REST 版から流用)
// =========================================================================

function renderStatus(s) {
  if (s.isOver) { el("status").textContent = t("gameOver"); return; }
  const p = s.players[s.currentPlayer];
  let text = t("turnStatus", p.name, s.rollsLeft);
  if (!s.turnStarted) text += " " + t("waitingFirstRoll");
  el("status").textContent = text;
}

function renderDice(s) {
  const wrap = el("dice");
  wrap.innerHTML = "";
  if (!s.turnStarted) {
    for (let i = 0; i < 5; i++) {
      const d = document.createElement("div");
      d.className = "die empty";
      d.textContent = t("diceEmpty");
      wrap.appendChild(d);
    }
    return;
  }
  s.dice.forEach((v, i) => {
    const d = document.createElement("div");
    d.className = "die";
    d.dataset.idx = String(i);
    d.textContent = String(v);
    d.addEventListener("click", () => d.classList.toggle("selected"));
    wrap.appendChild(d);
  });
}

function renderRollButton(s) {
  const btn = el("btn-roll");
  if (s.isOver) { btn.hidden = true; return; }
  btn.hidden = false;
  btn.textContent = !s.turnStarted ? t("rollFirst") : t("rerollSelected");
  btn.disabled = s.rollsLeft <= 0;
}

function makeCategoryHost(cat, content) {
  const host = document.createElement("span");
  host.className = "tip-host";
  if (typeof content === "string") host.textContent = content;
  else host.appendChild(content);
  const tip = document.createElement("span");
  tip.className = "tip";
  tip.textContent = tCatTip(cat);
  host.appendChild(tip);
  return host;
}

function renderCategories(s) {
  const wrap = el("categories");
  wrap.innerHTML = "";
  if (s.isOver || !s.turnStarted) return;
  CATEGORY_KEYS.forEach((cat) => {
    if (!(cat in (s.preview || {}))) return;
    const label = tCat(cat);
    const sc = s.preview[cat];

    const btn = document.createElement("button");
    btn.className = "cat-btn tip-host";
    btn.type = "button";
    const name = document.createElement("span");
    name.className = "cat-name";
    name.textContent = label;
    btn.appendChild(name);
    const score = document.createElement("span");
    score.className = "cat-score";
    score.textContent = "+" + sc;
    btn.appendChild(score);
    const tip = document.createElement("span");
    tip.className = "tip";
    tip.textContent = tCatTip(cat);
    btn.appendChild(tip);

    btn.addEventListener("click", () => {
      if (confirm(t("confirmScore", label, sc))) recordScore(cat);
    });
    wrap.appendChild(btn);
  });
}

function renderScoreboard(s) {
  const tbl = el("scoreboard");
  tbl.innerHTML = "";
  const headRow = document.createElement("tr");
  headRow.appendChild(th(t("category")));
  s.players.forEach((p, i) => {
    const cell = th(p.name);
    if (i === s.currentPlayer && !s.isOver) cell.classList.add("current");
    headRow.appendChild(cell);
  });
  tbl.appendChild(headRow);

  CATEGORY_KEYS.forEach((cat) => {
    const row = document.createElement("tr");
    const labelCell = document.createElement("td");
    labelCell.appendChild(makeCategoryHost(cat, tCat(cat)));
    row.appendChild(labelCell);
    s.players.forEach((p, i) => {
      const v = p.scores[cat];
      const cell = td(v == null ? "·" : String(v), "num");
      if (i === s.currentPlayer && !s.isOver) cell.classList.add("current");
      row.appendChild(cell);
    });
    tbl.appendChild(row);
  });

  const totalRow = document.createElement("tr");
  totalRow.className = "total";
  totalRow.appendChild(td(t("total")));
  s.players.forEach((p, i) => {
    const cell = td(String(p.total), "num");
    if (i === s.currentPlayer && !s.isOver) cell.classList.add("current");
    totalRow.appendChild(cell);
  });
  tbl.appendChild(totalRow);
}

function renderGameOver(s) {
  const wrap = el("game-over");
  if (!s.isOver) { wrap.hidden = true; return; }
  wrap.hidden = false;
  wrap.innerHTML = "";
  const h = document.createElement("h2");
  h.textContent = t("gameOver");
  const p = document.createElement("p");
  p.textContent = t("winnerLine", s.winner, s.winnerScore);
  wrap.appendChild(h);
  wrap.appendChild(p);
}

function th(text) { const e = document.createElement("th"); e.textContent = text; return e; }
function td(text, cls) { const e = document.createElement("td"); e.textContent = text; if (cls) e.className = cls; return e; }

function render() {
  if (!state.snapshot) return;
  renderStatus(state.snapshot);
  renderDice(state.snapshot);
  renderRollButton(state.snapshot);
  renderCategories(state.snapshot);
  renderScoreboard(state.snapshot);
  renderGameOver(state.snapshot);
}

function renderHelpModal() {
  const c = el("help-content");
  c.innerHTML = "";
  const help = I18N[state.lang].help;

  const intro = document.createElement("p");
  intro.textContent = help.intro;
  c.appendChild(intro);

  const flowH = document.createElement("h3");
  flowH.textContent = help.flowHeader;
  c.appendChild(flowH);
  const flowList = document.createElement("ol");
  help.flow.forEach((line) => {
    const li = document.createElement("li");
    li.textContent = line;
    flowList.appendChild(li);
  });
  c.appendChild(flowList);

  const rolesH = document.createElement("h3");
  rolesH.textContent = help.rolesHeader;
  c.appendChild(rolesH);
  const rolesList = document.createElement("ul");
  help.roles.forEach(([name, desc]) => {
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = name;
    li.appendChild(strong);
    li.appendChild(document.createTextNode(" ― " + desc));
    rolesList.appendChild(li);
  });
  c.appendChild(rolesList);
}

function openHelp() { el("help-modal").hidden = false; renderHelpModal(); }
function closeHelp() { el("help-modal").hidden = true; }

// =========================================================================
// 起動
// =========================================================================

el("num-players").addEventListener("input", renderNameFields);
el("btn-new").addEventListener("click", startNewGame);
el("btn-roll").addEventListener("click", rollClicked);
el("btn-restart").addEventListener("click", restart);
el("btn-lang").addEventListener("click", toggleLang);
el("btn-help").addEventListener("click", openHelp);
el("btn-help-close").addEventListener("click", closeHelp);
el("help-modal").addEventListener("click", (e) => {
  if (e.target === el("help-modal")) closeHelp();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !el("help-modal").hidden) closeHelp();
});

applyStaticI18n();
renderNameFields();

(async () => {
  el("btn-new").disabled = true;
  el("btn-new").textContent = t("loading");
  try {
    await loadWasm();
    el("btn-new").disabled = false;
    el("btn-new").textContent = t("start");
  } catch (e) {
    console.error(e);
    el("btn-new").textContent = t("loadFailed");
  }
})();
