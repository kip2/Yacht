# D の書き方ルール

このプロジェクトで守る書き方。迷ったらここに戻る。

## ファイルの先頭

- 必ず `module ...;` を書く。ファイルパスと一致させる。

  ```d
  // source/game/dice.d
  module game.dice;
  ```

## import の書き方

- **必要なシンボルだけ** 名指しで import する (グロブ import を避ける)。
- import は関数スコープでも OK。使う場所の近くに置けるとなお良い。

```d
import std.stdio : writeln, write, readln, stdout;
import std.random : uniform;
import std.algorithm : map, sum, sort;
import std.array : array;
```

避けたい書き方:

```d
import std.stdio;       // 何を使っているか不明瞭
import std.algorithm;   // 衝突の温床
```

## 命名規則

| 種別                     | 規則             | 例                    |
| ------------------------ | ---------------- | --------------------- |
| モジュール・パッケージ   | `lower_snake`    | `game.dice`           |
| 型 (struct/class/enum)   | `PascalCase`     | `ScoreCard`, `Dice`   |
| 関数・変数・フィールド   | `camelCase`      | `rollDice`, `turnNo`  |
| 定数 (enum/immutable)    | `camelCase`      | `maxRolls`            |
| テンプレート引数         | `PascalCase`     | `T`, `Range`          |

## 型と可変性

- デフォルトで **`immutable` / `const` を優先** する。書き換える必要が出たら外す。
- ローカル変数の型は推論 (`auto`) でよい。**API の引数・戻り値は必ず型を明示**。
- 数値リテラルはサフィックスで曖昧さを消す: `10L`, `1.0f`。

```d
immutable maxRolls = 3;
const string[] categories = ["ones", "twos", ...];
auto dice = rollDice(5);
```

## 関数

- 副作用のない関数は `pure` を付ける。I/O しない・グローバル状態を触らないなら付けられる。
- 例外を投げないなら `nothrow`、GC を使わないなら `@nogc` も付けられる — が **最初から付けない**。動いてから絞っていく。
- `@safe` は付けて困らないので、書けるところは付ける方針。

```d
pure @safe int scoreOnes(in int[] dice)
{
    import std.algorithm : count;
    return cast(int) dice.count(1) * 1;
}
```

## 構造体 vs クラス

- 値として扱いたいもの (サイコロ 1 個、スコアカード 1 枚) は `struct`。
- 参照セマンティクスが本当に必要なときだけ `class`。
- Yacht の範囲では **ほとんど `struct` で足りる**。

## エラー処理

- ユーザー入力の検証は **例外を投げず戻り値で扱う** (対話ループで握り潰しやすい)。
  - 例: `Nullable!T` や `bool tryParse(string, out T)` 風。
- 本当に想定外の不整合は `assert` または `enforce`。
- `throw new Exception(...)` は main に抜けさせず、ループの手前で受ける。

## unittest

- **同じファイル内** に `unittest { ... }` ブロックで書く。
- 1 ブロック = 1 振る舞い、を目安に小さく分ける。
- `dub test` で全部走る。

```d
unittest
{
    assert(scoreOnes([1, 1, 2, 3, 4]) == 2);
}
```

## コメント

- 何を書くか (`what`) ではなく、なぜそう書いたか (`why`) を書く。
- 命名で説明できるなら、コメントを書くより名前を直す。
- 公開 API には DDoc (`///`) を付けてよい (説明に値するなら)。

## 書式

- インデントは **スペース 4**。
- 波括弧は **Allman スタイル** (関数・制御構造とも改行して `{`)。

  ```d
  void foo()
  {
      if (cond)
      {
          ...
      }
  }
  ```
- 1 行は目安 100 文字。超えたら改行を考える。

## 禁止・非推奨

- ワイルドカード import (上記参照)。
- `shared` / スレッド関係は Yacht の範囲では不要。持ち込まない。
- グローバル可変状態。ゲーム状態は引数で渡す (or `struct Game` に閉じる)。
