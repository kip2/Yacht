# Yacht (D)

D 言語で書いたヤッツィ (Yacht) ダイスゲーム。学習用に段階的に育てているプロジェクト。

## いま動くもの (`main` ブランチ)

- **Web 版 (WebAssembly)**: D で書いたゲームロジックを WASM にコンパイルし、
  ブラウザだけで遊べる。サーバ不要。GitHub Pages から配信できる構成。
- **CLI 版**: ターミナルで対話プレイ (REPL ループ)

学習用の **サーバ版** (vibe-d 製 HTTP サーバ + REST API) は `server` ブランチに保存してある。

## 動かす

### 必要なもの

| 用途         | パッケージ                              |
| ------------ | --------------------------------------- |
| CLI 版ビルド | `dmd` と [`dub`](https://dub.pm/)        |
| WASM 版ビルド | `ldc` (LDC) と `lld` (wasm-ld)           |

Arch なら: `sudo pacman -S dlang dub ldc lld`

### CLI 版

```sh
dub run -c cli
```

### Web 版 (WASM)

ビルド:

```sh
scripts/build-wasm.sh        # → public/yacht.wasm
```

ローカル動作確認 (任意の静的ファイルサーバで OK):

```sh
cd public && python3 -m http.server 8765
# → http://127.0.0.1:8765/
```

### テスト

```sh
dub test       # cli config の unittest が走る (5 modules)
```

## ブランチ構成

| ブランチ | 内容                                                                       |
| -------- | -------------------------------------------------------------------------- |
| `main`   | WebAssembly 版 (現行・GitHub Pages 配信用)。CLI 版もここで動く             |
| `server` | CLI + vibe-d Web 版のスナップショット (サーバ版として学習用に保存)          |

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
├── docs/                # 書き方・設計ドキュメント
├── dub.json             # dub プロジェクト設定 (cli / web の 2 configuration)
└── CLAUDE.md            # AI 連携ルール
```

## ドキュメント (`docs/`)

| ファイル                 | 内容                                              |
| ------------------------ | ------------------------------------------------- |
| `project-structure.md`   | ディレクトリ構成とビルドコマンド                  |
| `coding-style.md`        | D コーディング規約                                |
| `interactive-cli.md`     | 対話型 CLI の REPL パターン                       |
| `architecture.md`        | モジュール依存・クラス図・ターン進行              |
| `web.md`                 | サーバ版の技術スタック・REST API (`server` ブランチ) |
| `wasm.md`                | WASM 版の設計・ビルド・JS 連携                    |

## ライセンス

proprietary
