#!/usr/bin/env bash
# WebAssembly 版のビルド。
# LDC + wasm-ld (lld の一部) が必要。Arch なら `sudo pacman -S ldc lld`。
#
# 出力: public/yacht.wasm
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p public

ldc2 \
  -mtriple=wasm32-unknown-unknown-wasm \
  -betterC -Os -release \
  --boundscheck=off \
  source/wasm/exports.d \
  source/game/category.d \
  -L=--no-entry \
  -L=--export-dynamic \
  -of=public/yacht.wasm

size=$(stat -c %s public/yacht.wasm 2>/dev/null || stat -f %z public/yacht.wasm)
echo "Built public/yacht.wasm (${size} bytes)"
