# 対話型 CLI の書き方

Yacht は「起動すると 1 本のプロセスが立ち上がり、プロンプト越しにコマンドを打って進める」タイプの CLI にする。
ここではそのための **最小パターン** と、肉付けしていくときの指針をまとめる。

## 基本ループ (REPL パターン)

`source/app.d` が採用している形。3 つの責務を明確に分けるのがポイント。

```
[1] 描画 (render)   : 現在の状態を画面に出す
[2] 入力 (read)     : プロンプトを出して 1 行読む
[3] 解釈 (dispatch) : コマンドを解釈し、状態を更新する
      ↑ ループ
```

擬似コード:

```d
while (running)
{
    render(state);            // 1. 画面を描く
    auto cmd = prompt("> ");  // 2. 入力をもらう
    running = dispatch(cmd, state); // 3. 状態更新 & 続けるか決める
}
```

**このループは状態 (`state`) を持ち回すだけ**。ゲームロジックは `dispatch` の先、
さらに `game.*` モジュールに閉じ込める。`app.d` をロジックで太らせない。

## 入力の読み方

- 標準入力は `readln()` で 1 行受け取る。末尾に改行が付くので `strip` する。
- `readln()` は EOF (Ctrl-D) で `null` を返す。必ずチェックする。
- プロンプトを出した直後は `stdout.flush()`。行バッファがあると表示が遅れる。

```d
import std.stdio : write, readln, stdout;
import std.string : strip;

string prompt(string label)
{
    write(label);
    stdout.flush();
    auto line = readln();
    if (line is null) return null; // EOF
    return line.strip.idup;
}
```

## コマンドの解釈

最初は **単純な `switch` で十分**。複雑になってから表駆動やコマンドパターンに移す。

```d
bool dispatch(string cmd, ref Game g)
{
    import std.string : split;
    auto parts = cmd.split;        // "roll 1 3 5" -> ["roll", "1", "3", "5"]
    if (parts.length == 0) return true;

    switch (parts[0])
    {
    case "help":  showHelp();             return true;
    case "roll":  g.rollKeeping(parts[1 .. $]); return true;
    case "score": g.writeScore(parts[1 .. $]);  return true;
    case "quit": case "q": return false;
    default:
        writeln("unknown: ", parts[0]);
        return true;
    }
}
```

ルール:

- **1 コマンド = 1 関数** にまで分解する。`dispatch` はディスパッチだけ。
- パースは `dispatch` の中でやる。ゲームロジック側に文字列を持ち込まない。
- 失敗 (引数不足・不正値) は例外ではなく「エラーメッセージを出して `return true`」で処理する。ループは続行。

## 描画の指針

Yacht は毎ターン状態が変わるので、**毎ループ全画面を描き直す** のが素直。

- 最初は画面クリアせず、ただ `writeln` で追記していく (ログ風)。十分遊べる。
- きれいに見せたくなったら ANSI エスケープでクリア/カーソル移動する。
  - クリア: `"\x1b[2J\x1b[H"` を `write` する。
  - 色: `"\x1b[31m...\x1b[0m"` (31=red, 32=green, ...)。
- Windows を視野に入れる場合は [`arsd.terminal`](https://code.dlang.org/packages/arsd-official%3Aterminal) 等の採用を検討 (必要になってから dub 依存を足す)。

描画関数は **副作用 = 標準出力書き込みだけ** に限定し、state を書き換えない。

```d
void render(in Game g)
{
    writeln("=== Round ", g.round, " / Player ", g.player, " ===");
    renderDice(g.dice);
    renderScoreCard(g.card);
}
```

## 状態の持ち方

- グローバル変数にしない。`struct Game` を 1 つ作り、`app.d` のループがそれを所有する。
- `dispatch` に `ref Game` で渡す。読むだけの関数は `in Game` (= `const scope`)。
- 乱数源 (サイコロ) も `Game` の中に持たせておくと、テストでシードを固定しやすい。

```d
struct Game
{
    int round;
    int player;
    Dice[5] dice;
    ScoreCard card;
    // Random rng;  // 必要になったら
}
```

## テストしやすくするコツ

- ロジック (役判定・点数計算) は **標準入出力を触らない純粋関数** にする。
  → `unittest` から直接呼べる。
- 対話ループ (`app.d`) 側はテストしない。テスト対象はあくまで `game.*`。
- 入力文字列 → コマンド種別、のパース部分は独立した pure 関数にしておくとテストが楽。

## 拡張するときの順序 (目安)

1. `dispatch` に `help`, `quit` だけある状態からスタート (いまここ)。
2. `game.dice` を足して `roll` コマンド。振って出目を表示するだけ。
3. `game.score` を足して役判定と点数計算 (← unittest をしっかり)。
4. `game.state` に `Game` 構造体を定義し、ターン進行を入れる。
5. `ui.render` に描画を切り出す。`app.d` はループだけにする。

各ステップで `docs/` に書いてあるルールを踏み外していないか見直す。
