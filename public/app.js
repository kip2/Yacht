"use strict";

const STORAGE_KEY = "yacht.gameId";
const LANG_KEY = "yacht.lang";

const I18N = {
  ja: {
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
    categories: {
      "ones": "エース",
      "twos": "デュース",
      "threes": "トレイ",
      "fours": "フォー",
      "fives": "ファイブ",
      "sixes": "シックス",
      "full-house": "フルハウス",
      "four-of-a-kind": "フォーダイス",
      "little-straight": "リトルストレート",
      "big-straight": "ビッグストレート",
      "choice": "チョイス",
      "yacht": "ヨット",
    },
    categoryTips: {
      "ones": "1 の目の合計",
      "twos": "2 の目の合計",
      "threes": "3 の目の合計",
      "fours": "4 の目の合計",
      "fives": "5 の目の合計",
      "sixes": "6 の目の合計",
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
    categories: {
      "ones": "Ones",
      "twos": "Twos",
      "threes": "Threes",
      "fours": "Fours",
      "fives": "Fives",
      "sixes": "Sixes",
      "full-house": "Full House",
      "four-of-a-kind": "Four of a Kind",
      "little-straight": "Little Straight",
      "big-straight": "Big Straight",
      "choice": "Choice",
      "yacht": "Yacht",
    },
    categoryTips: {
      "ones": "Sum of 1s",
      "twos": "Sum of 2s",
      "threes": "Sum of 3s",
      "fours": "Sum of 4s",
      "fives": "Sum of 5s",
      "sixes": "Sum of 6s",
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

const CATEGORY_ORDER = [
  "ones", "twos", "threes", "fours", "fives", "sixes",
  "full-house", "four-of-a-kind", "little-straight", "big-straight",
  "choice", "yacht",
];

const state = {
  gameId: null,
  snapshot: null,
  lang: localStorage.getItem(LANG_KEY) || "ja",
};

const el = (id) => document.getElementById(id);

function t(key, ...args) {
  const v = I18N[state.lang][key];
  return typeof v === "function" ? v(...args) : v;
}
function tCat(key) { return I18N[state.lang].categories[key] || key; }
function tCatTip(key) { return I18N[state.lang].categoryTips[key] || ""; }

async function api(method, path, body) {
  const opts = { method, headers: { "content-type": "application/json" } };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const r = await fetch(path, opts);
  return r.json();
}

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

async function startNewGame() {
  const n = parseInt(el("num-players").value, 10) || 1;
  const inputs = el("name-fields").querySelectorAll("input");
  const names = [];
  inputs.forEach((inp, i) => {
    names.push((inp.value || "").trim() || "P" + (i + 1));
  });
  const r = await api("POST", "/api/new", { playerCount: n, names });
  if (r.error) { alert(r.error); return; }
  state.gameId = r.gameId;
  state.snapshot = r.state;
  localStorage.setItem(STORAGE_KEY, r.gameId);
  showGame();
  render();
}

function showGame() { el("setup").hidden = true; el("game").hidden = false; }
function showSetup() { el("setup").hidden = false; el("game").hidden = true; }

async function rollClicked() {
  const s = state.snapshot;
  if (!s) return;
  if (!s.turnStarted) await rollAll();
  else await rerollSelected();
}

async function rollAll() {
  const r = await api("POST", "/api/roll", { gameId: state.gameId });
  if (r.error) flash(r.error);
  state.snapshot = r.state;
  render();
}

async function rerollSelected() {
  const positions = [...document.querySelectorAll(".die.selected")]
    .map((d) => parseInt(d.dataset.idx, 10));
  if (positions.length === 0) {
    flash(t("needSelection"));
    return;
  }
  const r = await api("POST", "/api/reroll", { gameId: state.gameId, positions });
  if (r.error) flash(r.error);
  state.snapshot = r.state;
  render();
}

async function recordScore(category) {
  const r = await api("POST", "/api/score", { gameId: state.gameId, category });
  if (r.error) { flash(r.error); return; }
  state.snapshot = r.state;
  render();
}

async function restart() {
  if (!confirm(t("confirmAbandon"))) return;
  localStorage.removeItem(STORAGE_KEY);
  state.gameId = null;
  state.snapshot = null;
  renderNameFields();
  showSetup();
}

let flashTimer = null;
function flash(msg) {
  const s = el("status");
  s.textContent = msg;
  if (flashTimer) clearTimeout(flashTimer);
  flashTimer = setTimeout(() => { if (state.snapshot) renderStatus(state.snapshot); }, 1800);
}

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

// 役名 + 説明の tooltip ホスト要素を作る。
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
  CATEGORY_ORDER.forEach((cat) => {
    if (!(cat in s.preview)) return;
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

  CATEGORY_ORDER.forEach((cat) => {
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

function openHelp() {
  el("help-modal").hidden = false;
  renderHelpModal();
}
function closeHelp() { el("help-modal").hidden = true; }

async function tryResume() {
  const id = localStorage.getItem(STORAGE_KEY);
  if (!id) return false;
  try {
    const r = await api("GET", "/api/state?gameId=" + encodeURIComponent(id));
    if (r.state) {
      state.gameId = id;
      state.snapshot = r.state;
      showGame();
      render();
      return true;
    }
  } catch (_) {}
  localStorage.removeItem(STORAGE_KEY);
  return false;
}

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
tryResume();
