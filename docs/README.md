# 開発者向け README

D 言語の学習用に段階的に育てているプロジェクト。
**ブラウザだけで遊べる WASM 版** がメインだが、サーバ版・CLI 版もブランチ別に保存している。

公開先: <https://kip2.github.io/Yacht/> (`main` の `public/` を GitHub Actions で配信)

## ブランチ構成

| ブランチ | 内容                                                                      |
| -------- | ------------------------------------------------------------------------- |
| `main`   | WebAssembly 版 (Pages 配信元)。CLI 版もこのブランチでビルドできる         |
| `server` | CLI + vibe-d Web 版のスナップショット (REST API のサーバ版として学習用)   |

## 必要なもの

| 用途              | パッケージ              |
| ----------------- | ----------------------- |
| CLI 版ビルド      | `dmd` / `dub`           |
| WASM 版ビルド     | `ldc` (LDC) / `lld` (`wasm-ld`) |

Arch なら: `sudo pacman -S dlang dub ldc lld`

## 動かす

### CLI 版

```sh
dub run -c cli
```

### WASM 版

```sh
scripts/build-wasm.sh         # → public/yacht.wasm (約 8 KB)
cd public && python3 -m http.server 8765
# → http://127.0.0.1:8765/ をブラウザで開く
```

### テスト

```sh
dub test       # cli config の unittest が走る (5 modules)
```

## ディレクトリ構成

```text
Yacht/
├── source/
│   ├── cli/app.d        # CLI 版エントリ (REPL ループ)
│   ├── wasm/exports.d   # WASM 用 extern(C) エクスポート + ゲーム状態 + PRNG
│   ├── game/            # ドメイン (CLI/WASM 共通: state, dice, score, category)
│   ├── ui/              # CLI 用 入出力 (parse, render)
│   └── web/             # サーバ版用 (server ブランチで使用)
├── public/              # WASM 版フロントエンド (GitHub Pages の配信元)
│   ├── index.html
│   ├── app.js           # WASM ロード + UI
│   ├── style.css
│   └── yacht.wasm       # ビルド成果物 (リポジトリにコミット済)
├── scripts/build-wasm.sh
├── docs/                # 設計ドキュメント (このファイルを含む)
├── .github/workflows/   # GitHub Pages デプロイ
├── dub.json             # dub プロジェクト設定 (cli / web の 2 configuration)
└── CLAUDE.md            # AI 連携ルール
```

## ドキュメント (`docs/`)

| ファイル                 | 内容                                                  |
| ------------------------ | ----------------------------------------------------- |
| `project-structure.md`   | ディレクトリ構成とビルドコマンド                       |
| `coding-style.md`        | D コーディング規約                                     |
| `interactive-cli.md`     | 対話型 CLI の REPL パターン                            |
| `architecture.md`        | モジュール依存・クラス図・ターン進行                    |
| `web.md`                 | サーバ版の技術スタック・REST API (`server` ブランチ向け) |
| `wasm.md`                | WASM 版の設計・ビルド・JS 連携                          |

## ライセンス

ルートの [`../LICENSE`](../LICENSE) (MIT)。
