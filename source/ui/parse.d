module ui.parse;

import std.string : strip, toLower, split;
import std.conv : to;

import game.category;
import game.dice : diceCount;

enum CommandKind
{
    none,
    roll,
    reroll,
    score,
    listCategories,
    showCard,
    help,
    quit,
    unknown,
}

struct Command
{
    CommandKind kind;
    Category category;    // score 用
    size_t[] positions;   // reroll 用 (0-indexed)
    string raw;
}

Command parse(string input)
{
    Command c;
    c.raw = input;
    immutable trimmed = input.strip;
    if (trimmed.length == 0)
    {
        c.kind = CommandKind.none;
        return c;
    }

    auto parts = trimmed.toLower.split;
    auto head = parts[0];
    auto args = parts[1 .. $];

    switch (head)
    {
    case "roll":
    case "r":
        return parseRoll(args, c);
    case "score":
    case "s":
        return parseScore(args, c);
    case "categories":
    case "cat":
    case "c":
        c.kind = CommandKind.listCategories;
        return c;
    case "card":
        c.kind = CommandKind.showCard;
        return c;
    case "help":
    case "h":
    case "?":
        c.kind = CommandKind.help;
        return c;
    case "quit":
    case "q":
    case "exit":
    case "e":
        c.kind = CommandKind.quit;
        return c;
    default:
        c.kind = CommandKind.unknown;
        return c;
    }
}

private Command parseRoll(string[] args, Command c)
{
    if (args.length == 0)
    {
        c.kind = CommandKind.roll;
        return c;
    }
    size_t[] pos;
    foreach (a; args)
    {
        int n;
        if (!tryParseInt(a, n) || n < 1 || n > diceCount)
        {
            c.kind = CommandKind.unknown;
            return c;
        }
        pos ~= cast(size_t)(n - 1);
    }
    c.kind = CommandKind.reroll;
    c.positions = pos;
    return c;
}

private Command parseScore(string[] args, Command c)
{
    if (args.length != 1)
    {
        c.kind = CommandKind.unknown;
        return c;
    }
    Category cat;
    if (!tryParseCategory(args[0], cat))
    {
        c.kind = CommandKind.unknown;
        return c;
    }
    c.kind = CommandKind.score;
    c.category = cat;
    return c;
}

bool tryParseInt(string s, out int v)
{
    try
    {
        v = s.to!int;
        return true;
    }
    catch (Exception)
    {
        return false;
    }
}

unittest
{
    auto c = parse("roll");
    assert(c.kind == CommandKind.roll);

    c = parse("roll 1 3 5");
    assert(c.kind == CommandKind.reroll);
    assert(c.positions == [0UL, 2UL, 4UL]);

    c = parse("roll 9");
    assert(c.kind == CommandKind.unknown); // 範囲外

    c = parse("score yacht");
    assert(c.kind == CommandKind.score);
    assert(c.category == Category.yacht);

    c = parse("s y");
    assert(c.kind == CommandKind.score);
    assert(c.category == Category.yacht);

    c = parse("");
    assert(c.kind == CommandKind.none);

    c = parse("foo");
    assert(c.kind == CommandKind.unknown);
}
