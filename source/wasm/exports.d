// WebAssembly 用エントリ。LDC + -betterC でビルドする想定。
//
// 現在 dub.json に wasm config はまだ無いので、このファイルは
// 既存の cli / web ビルドからは "excludedSourceFiles" で除外している。
// LDC を導入したら wasm config を追加してビルドする。
//
// 詳しい設計と JS 側ラッパーの形は docs/wasm.md を参照。

module wasm.exports;

import game.category : Category, score;

enum int diceCount = 5;
enum int maxPlayers = 5;
enum int categoryCount = 12;
enum int rollsPerTurn = 3;

private struct Scorecard
{
    int[categoryCount] values;
    bool[categoryCount] used;
}

private struct WasmGame
{
    int playerCount;
    int currentPlayer;
    int rollsLeft;
    bool turnStarted;
    int[diceCount] dice;
    Scorecard[maxPlayers] cards;
    uint rngState;
}

private __gshared WasmGame g;

// xorshift32 PRNG (betterC 互換、std.random 不使用)。
private uint nextU32()
{
    uint s = g.rngState;
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    g.rngState = s;
    return s;
}

private int rollDie()
{
    return cast(int)((nextU32() % 6) + 1);
}

private void startTurn()
{
    g.rollsLeft = rollsPerTurn;
    g.turnStarted = false;
    g.dice[] = 0;
}

// =========================================================================
// 公開関数 (extern(C)) ― すべて JS 側から呼ぶ
// =========================================================================

extern (C) void yacht_new(int playerCount, uint seed)
{
    if (playerCount < 1) playerCount = 1;
    if (playerCount > maxPlayers) playerCount = maxPlayers;

    g = WasmGame.init;
    g.playerCount = playerCount;
    g.rngState = (seed != 0) ? seed : 1;
    startTurn();
}

extern (C) int yacht_roll_all()
{
    if (g.turnStarted) return 0;
    if (g.rollsLeft <= 0) return 0;

    foreach (i; 0 .. diceCount)
    {
        g.dice[i] = rollDie();
    }
    g.rollsLeft--;
    g.turnStarted = true;
    return 1;
}

extern (C) int yacht_reroll(int positionMask)
{
    if (!g.turnStarted) return 0;
    if (g.rollsLeft <= 0) return 0;
    immutable int allMask = (1 << diceCount) - 1;
    if ((positionMask & allMask) == 0) return 0;

    foreach (i; 0 .. diceCount)
    {
        if (positionMask & (1 << i))
        {
            g.dice[i] = rollDie();
        }
    }
    g.rollsLeft--;
    return 1;
}

extern (C) int yacht_record(int category)
{
    if (!g.turnStarted) return -1;
    if (category < 0 || category >= categoryCount) return -1;

    auto card = &g.cards[g.currentPlayer];
    if (card.used[category]) return -1;

    immutable s = score(cast(Category) category, g.dice[]);
    card.values[category] = s;
    card.used[category] = true;

    g.currentPlayer = (g.currentPlayer + 1) % g.playerCount;
    startTurn();
    return s;
}

extern (C) int yacht_preview(int category)
{
    if (!g.turnStarted) return -1;
    if (category < 0 || category >= categoryCount) return -1;
    if (g.cards[g.currentPlayer].used[category]) return -1;
    return score(cast(Category) category, g.dice[]);
}

// 状態取得
extern (C) int yacht_player_count()    { return g.playerCount; }
extern (C) int yacht_current_player()  { return g.currentPlayer; }
extern (C) int yacht_rolls_left()      { return g.rollsLeft; }
extern (C) int yacht_turn_started()    { return g.turnStarted ? 1 : 0; }

extern (C) int yacht_die_value(int idx)
{
    if (idx < 0 || idx >= diceCount) return -1;
    return g.dice[idx];
}

extern (C) int yacht_score_value(int player, int category)
{
    if (player < 0 || player >= g.playerCount) return 0;
    if (category < 0 || category >= categoryCount) return 0;
    return g.cards[player].values[category];
}

extern (C) int yacht_score_used(int player, int category)
{
    if (player < 0 || player >= g.playerCount) return 0;
    if (category < 0 || category >= categoryCount) return 0;
    return g.cards[player].used[category] ? 1 : 0;
}

extern (C) int yacht_player_total(int player)
{
    if (player < 0 || player >= g.playerCount) return 0;
    int sum = 0;
    foreach (i; 0 .. categoryCount)
    {
        if (g.cards[player].used[i]) sum += g.cards[player].values[i];
    }
    return sum;
}

extern (C) int yacht_is_over()
{
    foreach (p; 0 .. g.playerCount)
    {
        foreach (i; 0 .. categoryCount)
        {
            if (!g.cards[p].used[i]) return 0;
        }
    }
    return 1;
}
