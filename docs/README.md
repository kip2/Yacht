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

## ローカル動作確認

3 つのパスがあり、目的に応じて選ぶ。

### パス A: 配信のみ (一番速い)

リポジトリ直下にコミットされている `public/yacht.wasm` をそのまま使う。
JS / HTML / CSS だけを編集する作業ならこれで十分。

```sh
scripts/serve.sh                # http://127.0.0.1:8765/
scripts/serve.sh 8080           # ポート指定もできる
```

中身は `python3 -m http.server --directory public 8765` の薄いラッパー。

### パス B: Docker (D 環境を入れたくないとき)

`Dockerfile` + `docker-compose.yml` で完結:

```sh
docker compose up --build       # 初回はイメージビルドに数分
# 2 回目以降は --build を外せば早い
docker compose down             # 後片付け
```

コンテナ起動時に `scripts/build-wasm.sh` が走り、その後 `python -m http.server` が
ポート 8765 で配信を始める。`docker-compose.yml` で `.:/app` を bind mount しているので、
ホスト側で `source/` や `public/` を編集 → `docker compose up` し直しで反映される。

ベースイメージは `archlinux:base`、入れているのは `ldc / lld / python` の 3 つだけ。

### パス C: ローカルに D を入れて手動ビルド

```sh
sudo pacman -S ldc lld python    # 一度だけ
scripts/build-wasm.sh             # source/ 変更時に再実行
scripts/serve.sh                  # http://127.0.0.1:8765/
```

CLI 版を試したいときはこちら + `dmd` / `dub` も必要:

```sh
sudo pacman -S dlang dub
dub run                           # CLI で対話プレイ
```

### unittest (CLI ドメインロジック)

```sh
dub test                          # CLI ドメインの unittest (5 modules)
```

WASM 公開 API の自動テストもある。詳しくは `docs/testing.md` を参照。

## ブラウザでのテスト手順

1. ブラウザで <http://127.0.0.1:8765/> を開く
2. 「新しいゲーム」で人数とプレイヤー名を入力
3. 「開始」 → ダイスを振って遊ぶ
4. ファイルを編集したら **`Ctrl+Shift+R` で強制リロード** (キャッシュ回避)
5. WASM 関連を編集した場合は先に `scripts/build-wasm.sh` (パス C) または
   `docker compose up --build` (パス B) でビルドし直す

## ディレクトリ構成

```text
Yacht/
├── source/
│   ├── cli/app.d        # CLI 版エントリ (REPL ループ)
│   ├── wasm/exports.d   # WASM 用 extern(C) エクスポート + ゲーム状態 + PRNG
│   ├── game/            # ドメイン (CLI/WASM 共通: state, dice, score, category)
│   └── ui/              # CLI 用 入出力 (parse, render)
├── public/              # WASM 版フロントエンド (GitHub Pages の配信元)
│   ├── index.html
│   ├── app.js           # WASM ロード + UI + CPU AI
│   ├── style.css
│   └── yacht.wasm       # ビルド成果物 (リポジトリにコミット済)
├── scripts/
│   ├── build-wasm.sh
│   └── serve.sh
├── tests/               # 自動テスト
├── docs/                # 設計ドキュメント (このファイルを含む)
├── .github/workflows/   # Pages デプロイ + 自動テスト
├── dub.json             # CLI 用 dub 設定
└── CLAUDE.md            # AI 連携ルール
```

## ドキュメント (`docs/`)

| ファイル                 | 内容                                                  |
| ------------------------ | ----------------------------------------------------- |
| `project-structure.md`   | ディレクトリ構成とビルドコマンド                       |
| `coding-style.md`        | D コーディング規約                                     |
| `interactive-cli.md`     | 対話型 CLI の REPL パターン                            |
| `architecture.md`        | モジュール依存・クラス図・ターン進行                    |
| `wasm.md`                | WASM 版の設計・ビルド・betterC 制約                    |
| `cpu.md`                 | CPU AI の戦略                                          |
| `i18n.md`                | 言語追加の手順                                         |
| `deploy.md`              | GitHub Pages デプロイの仕組み                          |
| `testing.md`             | テスト戦略・実行手順                                   |

## ライセンス

ルートの [`../LICENSE`](../LICENSE) (MIT)。
