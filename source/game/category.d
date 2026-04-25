module game.category;

enum Category : int
{
    ones,
    twos,
    threes,
    fours,
    fives,
    sixes,
    fullHouse,
    fourOfAKind,
    littleStraight,
    bigStraight,
    choice,
    yacht,
}

// 文字列名は betterC (= WASM ビルド) では使わないので除外する。
// std.string の `==` 比較が memcmp を引き、wasm-ld が解決できないため。
version (D_BetterC) {} else
{
    immutable string[] categoryNames = [
        "ones", "twos", "threes", "fours", "fives", "sixes",
        "full-house", "four-of-a-kind", "little-straight", "big-straight",
        "choice", "yacht",
    ];

    immutable string[] categoryAliases = [
        "1", "2", "3", "4", "5", "6",
        "fh", "4k", "ls", "bs",
        "ch", "y",
    ];
}

pure @safe int score(Category c, in int[] dice)
{
    final switch (c)
    {
    case Category.ones:           return sumOfFace(dice, 1);
    case Category.twos:           return sumOfFace(dice, 2);
    case Category.threes:         return sumOfFace(dice, 3);
    case Category.fours:          return sumOfFace(dice, 4);
    case Category.fives:          return sumOfFace(dice, 5);
    case Category.sixes:          return sumOfFace(dice, 6);
    case Category.fullHouse:      return scoreFullHouse(dice);
    case Category.fourOfAKind:    return scoreFourOfAKind(dice);
    case Category.littleStraight: return isLittleStraight(dice) ? 30 : 0;
    case Category.bigStraight:    return isBigStraight(dice) ? 30 : 0;
    case Category.choice:         return sumAll(dice);
    case Category.yacht:          return isYacht(dice) ? 50 : 0;
    }
}

version (D_BetterC) {} else
pure @safe bool tryParseCategory(string s, out Category c)
{
    foreach (i, name; categoryNames)
    {
        if (s == name)
        {
            c = cast(Category) i;
            return true;
        }
    }
    foreach (i, alias_; categoryAliases)
    {
        if (s == alias_)
        {
            c = cast(Category) i;
            return true;
        }
    }
    return false;
}

private pure @safe int sumOfFace(in int[] dice, int face)
{
    int total = 0;
    foreach (v; dice)
    {
        if (v == face) total += v;
    }
    return total;
}

private pure @safe int sumAll(in int[] dice)
{
    int s = 0;
    foreach (v; dice) s += v;
    return s;
}

// 1〜6 の出目を数えた配列を返す。インデックスは出目の値そのもの。
private pure @safe int[7] facesCount(in int[] dice)
{
    int[7] c;
    foreach (v; dice) c[v]++;
    return c;
}

private pure @safe int scoreFullHouse(in int[] dice)
{
    auto c = facesCount(dice);
    bool hasThree = false;
    bool hasTwo = false;
    foreach (n; c[1 .. $])
    {
        if (n == 3) hasThree = true;
        else if (n == 2) hasTwo = true;
    }
    return (hasThree && hasTwo) ? sumAll(dice) : 0;
}

private pure @safe int scoreFourOfAKind(in int[] dice)
{
    auto c = facesCount(dice);
    foreach (face; 1 .. 7)
    {
        if (c[face] >= 4) return face * 4;
    }
    return 0;
}

private pure @safe bool isLittleStraight(in int[] dice)
{
    auto c = facesCount(dice);
    return c[1] >= 1 && c[2] >= 1 && c[3] >= 1 && c[4] >= 1 && c[5] >= 1;
}

private pure @safe bool isBigStraight(in int[] dice)
{
    auto c = facesCount(dice);
    return c[2] >= 1 && c[3] >= 1 && c[4] >= 1 && c[5] >= 1 && c[6] >= 1;
}

private pure @safe bool isYacht(in int[] dice)
{
    auto c = facesCount(dice);
    foreach (face; 1 .. 7)
    {
        if (c[face] == dice.length) return true;
    }
    return false;
}

unittest
{
    assert(score(Category.ones, [1, 1, 2, 3, 4]) == 2);
    assert(score(Category.threes, [3, 3, 3, 1, 2]) == 9);
    assert(score(Category.sixes, [1, 2, 3, 4, 5]) == 0);
}

unittest
{
    assert(score(Category.fullHouse, [3, 3, 3, 2, 2]) == 13);
    assert(score(Category.fullHouse, [3, 3, 2, 2, 1]) == 0);
    assert(score(Category.fullHouse, [4, 4, 4, 4, 4]) == 0); // 5 of a kind は full house ではない
}

unittest
{
    assert(score(Category.fourOfAKind, [4, 4, 4, 4, 1]) == 16);
    assert(score(Category.fourOfAKind, [5, 5, 5, 5, 5]) == 20);
    assert(score(Category.fourOfAKind, [3, 3, 3, 2, 2]) == 0);
}

unittest
{
    assert(score(Category.littleStraight, [1, 2, 3, 4, 5]) == 30);
    assert(score(Category.bigStraight, [2, 3, 4, 5, 6]) == 30);
    assert(score(Category.littleStraight, [2, 3, 4, 5, 6]) == 0);
    assert(score(Category.bigStraight, [1, 2, 3, 4, 5]) == 0);
}

unittest
{
    assert(score(Category.choice, [1, 2, 3, 4, 5]) == 15);
    assert(score(Category.yacht, [4, 4, 4, 4, 4]) == 50);
    assert(score(Category.yacht, [4, 4, 4, 4, 5]) == 0);
}

unittest
{
    Category c;
    assert(tryParseCategory("ones", c) && c == Category.ones);
    assert(tryParseCategory("y", c) && c == Category.yacht);
    assert(tryParseCategory("fh", c) && c == Category.fullHouse);
    assert(!tryParseCategory("nope", c));
}
