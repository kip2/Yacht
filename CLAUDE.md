# Yacht — プロジェクトルール

このリポジトリは D + WebAssembly で動く **ブラウザ向けヨット (ダイスゲーム)** です。
CLI 版もビルドでき、サーバ版 (vibe-d) は `server` ブランチにスナップショットとして保存しています。
Claude はこのファイルを最初に読み、以下のルールに従って作業してください。

## 役割分担

- 実装は Claude が行い、ユーザーがレビューする。
- 大きな方針 (新機能の追加 / リファクタリング / ライブラリ採用 / ブランチ運用 /
  ファイル追加・削除) は **事前に提案して同意を取る**。
- 細かい実装の詰めは Claude が判断してよい。
  ただし想定外の副作用がありそう・複数案で迷う場合は先に確認。
- 不明点は先に質問する。勝手に仕様を決めない。

## ドキュメント作成の方針 (重要)

「コードを変更したら必ず docs を更新する」を **既定にする**。
過去にドキュメントが現状と乖離する事故が起きたため、徹底する。

- コードを書く・変える・消すたびに、対応する `docs/` を **同じコミット内で** 更新する。
- 新しい機能・パターン・ツールを入れたら、対応する doc を **同時に新規作成する**。
  - 例: 言語追加方式 → `docs/i18n.md`、CPU AI → `docs/cpu.md` のように粒度を分ける。
  - 既存 doc に詰め込まない。doc は 1 トピック 1 ファイルを基本とする。
- 「コードを書いて、後でドキュメント書く」は避ける。
- レビューで doc 更新が抜けていたら、Claude は **指示を待たず確認する** ("doc も更新しますか?")。
- doc の "案" や "TODO" 記述が実装済になったら、**実装記述に直す** (案を残さない)。

## 作業方針

- ファイル追加・ディレクトリ構成変更は、理由と併せて先に提示してから行う。
- doc と実コードが食い違っていたら Claude は指摘する。

## ブランチ構成

| ブランチ | 内容                                                              |
| -------- | ----------------------------------------------------------------- |
| `main`   | WASM 版 (Pages 配信元) + CLI 版                                    |
| `server` | CLI + vibe-d Web 版のスナップショット (REST API のサーバ版・学習用) |

機能ブランチは適宜 (例: 過去に `cpu` を CPU プレイヤー実装に使い、main にマージ済)。

## 技術スタック

- 言語: D
  - dmd: CLI 版
  - LDC: WASM 版 (`-mtriple=wasm32-unknown-unknown-wasm -betterC`)
- ビルド: dub (CLI)、`scripts/build-wasm.sh` (WASM)
- WASM リンカ: lld (`wasm-ld`)
- フロントエンド: vanilla JS / HTML / CSS (フレームワークなし)
- ローカル配信: `scripts/serve.sh` (python3 `http.server` の薄ラッパー)
- Docker: `Dockerfile` + `docker-compose.yml` (archlinux ベース)
- 公開: GitHub Pages (`.github/workflows/pages.yml` で `public/` をデプロイ)

## ディレクトリ構成

```text
Yacht/
├── README.md             # ユーザ向け (プレイ URL・遊び方・ローカル動作確認)
├── LICENSE               # MIT
├── CLAUDE.md             # このファイル
├── dub.json              # CLI 用の dub 設定
├── Dockerfile            # ローカル動作確認用 (compose 経由が想定)
├── docker-compose.yml
├── .github/workflows/    # Pages デプロイ + テスト
├── source/
│   ├── cli/app.d         # CLI 版エントリ (REPL ループ)
│   ├── wasm/exports.d    # WASM 用 extern(C) + ゲーム状態 + xorshift32 PRNG
│   ├── game/             # ドメイン (CLI/WASM 共通: state, dice, score, category)
│   └── ui/               # CLI 用 入出力 (parse, render)
├── public/               # Web フロントエンド (Pages 配信元)
│   ├── index.html
│   ├── app.js            # WASM ロード + UI + 簡易 CPU AI
│   ├── style.css
│   └── yacht.wasm        # ビルド成果物 (リポジトリにコミット)
├── scripts/
│   ├── build-wasm.sh
│   └── serve.sh
├── tests/                # 自動テスト (CI で走る)
└── docs/
    ├── README.md             # 開発者向け README
    ├── project-structure.md  # ディレクトリ構成とビルド
    ├── coding-style.md       # D の書き方ルール
    ├── interactive-cli.md    # CLI の REPL パターン
    ├── architecture.md       # モジュール依存・クラス図・ターン進行
    ├── wasm.md               # WASM 版の設計・ビルド・betterC 制約
    ├── cpu.md                # CPU AI の戦略
    ├── i18n.md               # 言語追加の手順
    ├── deploy.md             # GitHub Pages デプロイの仕組み
    └── testing.md            # テスト戦略・実行手順
```

モジュール追加・書き方は `docs/` を参照。

## ビルドと実行

```sh
# WASM 版 (Pages と同じ構成をローカルで確認)
scripts/build-wasm.sh           # → public/yacht.wasm
scripts/serve.sh                # → http://127.0.0.1:8765/

# Docker 版 (D 環境を入れたくない場合)
docker compose up --build       # → http://127.0.0.1:8765/

# CLI 版
dub run                         # ターミナルで対話プレイ

# テスト
dub test                        # CLI ドメインの unittest
node --test tests/wasm/         # WASM exports の統合テスト
```

詳しい手順 (3 パス + ブラウザでのテスト) は `docs/README.md` を、
テストは `docs/testing.md` を参照。

## コミットの方針

- コミットは **ユーザーが明示的に指示したときだけ** 行う。
- メッセージは日本語で簡潔に。何を/なぜ、を 1〜2 行。
- 末尾に `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` を付ける。
- 1 コミット 1 関心事を意識する (cleanup と機能追加を混ぜない)。
