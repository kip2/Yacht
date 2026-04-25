# ローカルで WASM ビルド + 静的サーバを動かすための環境。
# Arch ベースで ldc / lld / python を揃える。
# 通常は docker-compose.yml 経由で起動する想定 (compose 側で bind mount を行う)。
FROM archlinux:base

RUN pacman -Sy --noconfirm --needed ldc lld python \
    && pacman -Scc --noconfirm

WORKDIR /app
EXPOSE 8765

# bind mount 前提なので COPY しない。
# 起動時に WASM をビルドしてから http.server を起動する。
CMD ["bash", "-c", "scripts/build-wasm.sh && python -m http.server --directory public 8765"]
