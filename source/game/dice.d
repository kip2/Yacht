module game.dice;

import std.random : Random, uniform;

enum int diceCount = 5;
enum int dieMin = 1;
enum int dieMax = 6;

struct Dice
{
    int[diceCount] values;

    void rollAll(ref Random rng)
    {
        foreach (i; 0 .. diceCount)
        {
            values[i] = rollOne(rng);
        }
    }

    void rerollAt(in size_t[] positions, ref Random rng)
    {
        foreach (p; positions)
        {
            values[p] = rollOne(rng);
        }
    }
}

int rollOne(ref Random rng)
{
    return uniform(dieMin, dieMax + 1, rng);
}

unittest
{
    auto rng = Random(42);
    Dice d;
    d.rollAll(rng);
    foreach (v; d.values)
    {
        assert(v >= dieMin && v <= dieMax);
    }
}
