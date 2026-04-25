// WASM 公開 API (extern(C) yacht_*) の統合テスト。
// node --test tests/wasm/ で実行。Node.js 標準ライブラリ完結 (依存ゼロ)。
//
// レイヤー B (WASM 統合) のテスト。詳細は docs/testing.md 参照。

import { test, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wasmPath = path.resolve(__dirname, "../../public/yacht.wasm");

// Category enum と一致する index 順
const CAT = {
  ones: 0, twos: 1, threes: 2, fours: 3, fives: 4, sixes: 5,
  fullHouse: 6, fourOfAKind: 7, littleStraight: 8, bigStraight: 9,
  choice: 10, yacht: 11,
};

let w;

before(async () => {
  const buf = await fs.readFile(wasmPath);
  const m = await WebAssembly.instantiate(buf, {});
  w = m.instance.exports;
});

function dice() {
  const out = [];
  for (let i = 0; i < 5; i++) out.push(w.yacht_die_value(i));
  return out;
}

test("yacht_new initializes a fresh game", () => {
  w.yacht_new(2, 12345);
  assert.equal(w.yacht_player_count(), 2);
  assert.equal(w.yacht_current_player(), 0);
  assert.equal(w.yacht_rolls_left(), 3);
  assert.equal(w.yacht_turn_started(), 0);
  assert.equal(w.yacht_is_over(), 0);
  for (let p = 0; p < 2; p++) {
    for (let c = 0; c < 12; c++) {
      assert.equal(w.yacht_score_used(p, c), 0, `p${p} c${c} should be unused`);
    }
    assert.equal(w.yacht_player_total(p), 0);
  }
});

test("playerCount is clamped to [1, 5]", () => {
  w.yacht_new(0, 1);
  assert.equal(w.yacht_player_count(), 1);
  w.yacht_new(99, 1);
  assert.equal(w.yacht_player_count(), 5);
});

test("yacht_new with seed=0 still rolls valid dice (no PRNG degeneracy)", () => {
  w.yacht_new(1, 0);
  assert.equal(w.yacht_roll_all(), 1);
  for (const v of dice()) {
    assert.ok(v >= 1 && v <= 6, `expected 1..6, got ${v}`);
  }
});

test("yacht_roll_all rolls 5 dice in 1..6 and decrements rollsLeft", () => {
  w.yacht_new(1, 7);
  assert.equal(w.yacht_roll_all(), 1);
  assert.equal(w.yacht_turn_started(), 1);
  assert.equal(w.yacht_rolls_left(), 2);
  for (const v of dice()) {
    assert.ok(v >= 1 && v <= 6);
  }
  // 二度目の roll_all は失敗 (turn already started)
  assert.equal(w.yacht_roll_all(), 0);
});

test("yacht_die_value out-of-range returns -1", () => {
  w.yacht_new(1, 1);
  w.yacht_roll_all();
  assert.equal(w.yacht_die_value(-1), -1);
  assert.equal(w.yacht_die_value(5), -1);
});

test("yacht_reroll changes only the masked positions", () => {
  w.yacht_new(1, 100);
  w.yacht_roll_all();
  const before = dice();
  // 1 つだけ振り直す: bit 2 だけ立てる
  assert.equal(w.yacht_reroll(1 << 2), 1);
  const after = dice();
  for (let i = 0; i < 5; i++) {
    if (i === 2) continue;
    assert.equal(after[i], before[i], `position ${i} must not change`);
  }
});

test("yacht_reroll fails before any roll", () => {
  w.yacht_new(1, 1);
  // turnStarted=false の状態で reroll は失敗
  assert.equal(w.yacht_reroll(0b11111), 0);
});

test("yacht_reroll fails when no rolls left", () => {
  w.yacht_new(1, 1);
  w.yacht_roll_all();
  w.yacht_reroll(0b11111);
  w.yacht_reroll(0b11111);
  assert.equal(w.yacht_rolls_left(), 0);
  assert.equal(w.yacht_reroll(0b11111), 0);
});

test("yacht_record stores score and advances current player", () => {
  w.yacht_new(2, 1);
  w.yacht_roll_all();
  const expected = w.yacht_preview(CAT.choice);
  const recorded = w.yacht_record(CAT.choice);
  assert.equal(recorded, expected);
  assert.equal(w.yacht_current_player(), 1);
  assert.equal(w.yacht_score_used(0, CAT.choice), 1);
  assert.equal(w.yacht_score_value(0, CAT.choice), expected);
  assert.equal(w.yacht_player_total(0), expected);
});

test("yacht_record fails for already used category", () => {
  w.yacht_new(1, 1);
  w.yacht_roll_all();
  w.yacht_record(CAT.choice);
  // 同じ player の同じカテゴリ (この時点で player は 1 周して戻っているので OK)
  // 1 人プレイなら currentPlayer は 0 のまま
  assert.equal(w.yacht_current_player(), 0);
  w.yacht_roll_all();
  assert.equal(w.yacht_record(CAT.choice), -1);
});

test("yacht_record fails when no roll has happened", () => {
  w.yacht_new(1, 1);
  assert.equal(w.yacht_record(CAT.choice), -1);
});

test("yacht_preview computes choice as sum of dice", () => {
  w.yacht_new(1, 1);
  w.yacht_roll_all();
  const sum = dice().reduce((a, b) => a + b, 0);
  assert.equal(w.yacht_preview(CAT.choice), sum);
});

test("yacht_preview returns -1 for used category", () => {
  w.yacht_new(1, 1);
  w.yacht_roll_all();
  w.yacht_record(CAT.choice);
  w.yacht_roll_all();
  assert.equal(w.yacht_preview(CAT.choice), -1);
});

test("yacht_is_over becomes 1 only after every category is filled for every player", () => {
  // 1 人プレイで 12 カテゴリ全部埋める
  w.yacht_new(1, 1);
  for (let c = 0; c < 12; c++) {
    assert.equal(w.yacht_is_over(), 0, `not over yet at cat ${c}`);
    w.yacht_roll_all();
    w.yacht_record(c);
  }
  assert.equal(w.yacht_is_over(), 1);
});

test("two-player game alternates correctly", () => {
  w.yacht_new(2, 42);
  for (let round = 0; round < 12; round++) {
    for (let p = 0; p < 2; p++) {
      assert.equal(w.yacht_current_player(), p);
      w.yacht_roll_all();
      w.yacht_record(round);
    }
  }
  assert.equal(w.yacht_is_over(), 1);
  // 各プレイヤーのトータルが負でない
  assert.ok(w.yacht_player_total(0) >= 0);
  assert.ok(w.yacht_player_total(1) >= 0);
});

test("scoring is deterministic given a fixed seed", () => {
  w.yacht_new(1, 999);
  w.yacht_roll_all();
  const a = dice();
  w.yacht_new(1, 999);
  w.yacht_roll_all();
  const b = dice();
  assert.deepEqual(a, b);
});
