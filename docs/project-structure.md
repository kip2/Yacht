# プロジェクト構成とビルド

## ディレクトリ

```text
Yacht/
├── dub.json          # dub 設定
├── source/           # すべての D ソースはここ (sourcePaths)
│   └── app.d         # エントリポイント (main 関数)
├── bin/              # ビルド成果物 (dub が生成; git 管理外)
└── docs/             # 書き方ドキュメント
```

`source/` 以下のディレクトリ階層が、そのままモジュール階層になる。

| ファイル                            | モジュール名          |
| ----------------------------------- | --------------------- |
| `source/app.d`                      | `app`                 |
| `source/game/state.d`               | `game.state`          |
| `source/game/dice.d`                | `game.dice`           |
| `source/ui/render.d`                | `ui.render`           |

> 各ファイル先頭には必ず `module xxx.yyy;` を明示する (`coding-style.md` 参照)。

## モジュールを増やすとき

1. `source/<カテゴリ>/<名前>.d` を作る。
2. 先頭行に `module <カテゴリ>.<名前>;` を書く。
3. 使う側で `import <カテゴリ>.<名前>;` する。
4. dub 設定を変更する必要はない (`sourcePaths: ["source"]` で自動認識)。

推奨カテゴリ例:

- `game/`   : ゲームロジック (状態・サイコロ・役判定・スコア)
- `ui/`     : 描画・入力パース
- `util/`   : 汎用ユーティリティ

## ビルド

```sh
dub build          # bin/yacht を生成 (デバッグビルド)
dub build -b release
dub run            # ビルドして実行
dub test           # unittest ブロックを走らせる
dub clean          # .dub/ と bin/ を削除
```

## 単発ファイルを試したいとき

`build_run.fish` は dub を介さず、1 本の `.d` ファイルを `dmd` で直接コンパイル&実行する実験用スクリプト。
サイコロ判定ロジックだけを切り離して試す、といった用途に使う。

```sh
./build_run.fish sandbox/try_dice.d
./build_run.fish --test sandbox/try_dice.d    # unittest 付きで
```

本番コードは `source/` に置き、`dub` でビルドする。
