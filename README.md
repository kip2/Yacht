# Yacht (D)

D 言語で書いたヤッツィ (Yacht) ダイスゲーム。学習用に段階的に育てているプロジェクト。

## いま動くもの

- **CLI 版**: ターミナルで対話プレイ (REPL ループ)
- **Web 版**: vibe-d HTTP サーバ + ブラウザ UI (vanilla JS、日本語/英語切替、役名ホバー説明、遊び方モーダル付き)

## 動かす

必要なもの: `dmd` と [`dub`](https://dub.pm/)。Web 版の初回ビルド時のみ vibe-d 取得のためにインターネット接続が必要。

### CLI 版

```sh
dub run -c cli
```

### Web 版

```sh
dub run -c web
# → Yacht web server: http://127.0.0.1:8080/
```

ブラウザで <http://127.0.0.1:8080/> を開く。

### テスト

```sh
dub test       # cli config の unittest が走る (5 modules)
```

## ブランチ構成

| ブランチ | 内容                                                              |
| -------- | ----------------------------------------------------------------- |
| `main`   | アクティブ開発。今後 **WebAssembly 版** に移行する予定             |
| `server` | CLI + vibe-d Web 版のスナップショット (サーバ版として学習用に保存) |

GitHub Pages で公開できるようにすることが目下のゴール。

## ディレクトリ構成

```text
Yacht/
├── source/
│   ├── cli/app.d        # CLI 版エントリ
│   ├── web/             # Web 版 (vibe-d)
│   ├── game/            # ドメイン (CLI/Web 共通: state, dice, score, category)
│   └── ui/              # CLI 用 入出力 (parse, render)
├── public/              # Web 用静的アセット (index.html / style.css / app.js)
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
| `web.md`                 | Web 版の技術スタック・アーキテクチャ・REST API     |

## ライセンス

proprietary
