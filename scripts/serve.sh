#!/usr/bin/env bash
# public/ を静的サーバとして配信する。引数なしならポート 8765。
# WASM 再ビルドはしない (`scripts/build-wasm.sh` は別途必要なときだけ実行)。
set -euo pipefail

cd "$(dirname "$0")/.."
PORT="${1:-8765}"

if [ ! -f public/yacht.wasm ]; then
    echo "public/yacht.wasm が見つかりません。"
    echo "scripts/build-wasm.sh を先に実行するか、"
    echo "リポジトリにコミットされている wasm を取り戻してください。"
    exit 1
fi

echo "Serving public/ at http://127.0.0.1:${PORT}/"
echo "(Ctrl+C で停止)"
exec python3 -m http.server --directory public "${PORT}"
