module game.state;

import std.random : Random;

import game.dice;
import game.category;
import game.score;

enum int rollsPerTurn = 3;

struct Player
{
    string name;
    ScoreCard card;
}

struct Game
{
    Player[] players;
    size_t currentPlayerIndex;
    Dice dice;
    int rollsLeft;
    bool turnStarted; // この手番でまだ最初の roll をしていないなら false
    Random rng;

    static Game create(string[] names, Random rng)
    {
        Game g;
        g.players.length = names.length;
        foreach (i, n; names) g.players[i].name = n;
        g.rng = rng;
        g.startTurn();
        return g;
    }

    void startTurn()
    {
        rollsLeft = rollsPerTurn;
        turnStarted = false;
        dice.values[] = 0;
    }

    ref inout(Player) active() inout return
    {
        return players[currentPlayerIndex];
    }

    bool isOver() const pure @safe
    {
        foreach (ref p; players)
        {
            if (!p.card.isFull) return false;
        }
        return true;
    }

    bool canRoll() const pure @safe
    {
        return rollsLeft > 0;
    }

    // この手番の最初の roll。成功したら true。
    bool rollAll()
    {
        if (turnStarted) return false; // 2 投目以降は reroll を使う
        if (!canRoll) return false;
        dice.rollAll(rng);
        rollsLeft--;
        turnStarted = true;
        return true;
    }

    // 既に振った後、指定位置 (0-indexed) のダイスだけを振り直す。
    bool reroll(in size_t[] positions)
    {
        if (!turnStarted) return false;
        if (!canRoll) return false;
        foreach (p; positions)
        {
            if (p >= diceCount) return false;
        }
        dice.rerollAt(positions, rng);
        rollsLeft--;
        return true;
    }

    // 現在のダイスをカテゴリに記録し、次のプレイヤーへ手番を回す。
    bool record(Category c)
    {
        if (!turnStarted) return false;
        if (active.card.isUsed(c)) return false;
        immutable s = score(c, dice.values[]);
        active.card.record(c, s);
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        startTurn();
        return true;
    }
}

unittest
{
    auto g = Game.create(["A", "B"], Random(1));
    assert(g.players.length == 2);
    assert(g.currentPlayerIndex == 0);
    assert(g.rollsLeft == rollsPerTurn);
    assert(!g.turnStarted);

    assert(g.rollAll());
    assert(g.turnStarted);
    assert(g.rollsLeft == rollsPerTurn - 1);

    // 同じ手番で再度 rollAll はできない
    assert(!g.rollAll());

    // 範囲外 reroll は失敗
    assert(!g.reroll([99]));

    assert(g.record(Category.choice));
    assert(g.currentPlayerIndex == 1);
    assert(!g.turnStarted);
}
