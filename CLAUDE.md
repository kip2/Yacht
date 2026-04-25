# Yacht — プロジェクトルール

このリポジトリは D 言語で書く **対話型 CLI の Yacht ダイスゲーム** です。
Claude はこのファイルを最初に読み、以下のルールに従って作業してください。

## 役割分担

- **実装はユーザー本人が行う**。Claude はゲームロジックを勝手に書かない。
- Claude が扱ってよいもの:
  - プロジェクト構成・ビルド設定 (`dub.json`, `.gitignore`, スクリプト類)
  - `docs/` 配下のドキュメント
  - 雛形・スケルトンコードの骨組みのみ (例: `source/app.d` の対話ループ枠組み)
  - ユーザーから明示的に依頼されたリファクタリング・バグ修正
- 依頼されない限り、`source/` 配下のロジックには追記しない。
  書きたくなった場合は「この部分、雛形を足しますか?」と先に確認する。

## 作業方針

- 不明点があれば先に質問する。勝手に仕様を決めない。
- 新しい書き方・パターンを導入したら、必ず `docs/` に反映する
  (コード → ドキュメントの順で揃える)。
- ファイル追加・ディレクトリ構成変更は、理由と併せて先に提示してから行う。

## 技術スタック

- 言語: D (dmd)
- ビルド: [dub](https://dub.pm/)  ※単発ファイル実験用に `build_run.fish` も残す
- 対話方式: 標準入出力 (`readln` / `writeln`) によるターミナル REPL

## ディレクトリ構成

```text
Yacht/
├── CLAUDE.md              # このファイル
├── dub.json               # dub プロジェクト設定 (cli / web の 2 configuration)
├── build_run.fish         # 単発 .d ファイル用コンパイル&実行スクリプト
├── .gitignore
├── source/
│   ├── cli/app.d          # CLI 版エントリ (REPL ループ)
│   ├── web/               # Web 版 (vibe-d で HTTP サーバー)
│   │   ├── app.d
│   │   ├── api.d
│   │   └── session.d
│   ├── game/              # ドメイン (CLI/Web 共通: 状態・ダイス・役・点数)
│   │   ├── dice.d
│   │   ├── category.d
│   │   ├── score.d
│   │   └── state.d
│   └── ui/                # CLI 用の入出力 (Web では未使用)
│       ├── parse.d
│       └── render.d
├── public/                # Web 用静的アセット (index.html / style.css / app.js)
└── docs/
    ├── project-structure.md   # ディレクトリ構成とビルド
    ├── coding-style.md        # D の書き方ルール
    ├── interactive-cli.md     # 対話型 CLI の書き方パターン
    ├── architecture.md        # モジュール依存・クラス図・ターン進行
    ├── web.md                 # Web 版の技術スタックと REST API
    └── wasm.md                # WebAssembly 版の計画・betterC 制約・JS 連携
```

モジュールを増やすときのルール・具体的な書き方は `docs/` を参照。

## ビルドと実行

```sh
# CLI 版 (デフォルト)
dub run -c cli                 # ターミナルで対話プレイ

# Web 版 (vibe-d サーバー、http://127.0.0.1:8080/)
dub run -c web

# テスト (unittest)
dub test                       # cli config がテスト対象 (web 配下は除外)

# 単一ファイルをサッと試す (実験用)
./build_run.fish path/to/sketch.d
./build_run.fish --test path/to/sketch.d
```

## コミットの方針

- コミットは **ユーザーが明示的に指示したときだけ** 行う。
- メッセージは日本語で簡潔に。何を/なぜ、を 1〜2 行。

## ドキュメントの扱い

- `docs/` の各ファイルは「これから書くコードの指針」であり、既存コードの説明書ではない。
- 書き方を変えた・新しいパターンを採用したときは、対応する doc を更新する。
- doc と実コードが食い違っていたら Claude は指摘する。
