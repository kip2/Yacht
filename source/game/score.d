module game.score;

import game.category : Category;

struct ScoreCard
{
    enum size_t slots = Category.max + 1;

    int[slots] scores;
    bool[slots] used;

    void record(Category c, int s) pure @safe
    {
        scores[c] = s;
        used[c] = true;
    }

    bool isUsed(Category c) const pure @safe
    {
        return used[c];
    }

    int scoreOf(Category c) const pure @safe
    {
        return scores[c];
    }

    bool isFull() const pure @safe
    {
        foreach (u; used) if (!u) return false;
        return true;
    }

    int total() const pure @safe
    {
        int sum = 0;
        foreach (i; 0 .. slots)
        {
            if (used[i]) sum += scores[i];
        }
        return sum;
    }
}

unittest
{
    ScoreCard card;
    assert(!card.isFull);
    assert(card.total == 0);

    card.record(Category.ones, 3);
    assert(card.isUsed(Category.ones));
    assert(card.scoreOf(Category.ones) == 3);
    assert(card.total == 3);

    foreach (i; 0 .. ScoreCard.slots)
    {
        card.record(cast(Category) i, 5);
    }
    assert(card.isFull);
    assert(card.total == 5 * ScoreCard.slots);
}
