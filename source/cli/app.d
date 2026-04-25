module cli.app;

import std.stdio : write, writeln, readln, stdout;
import std.string : strip;
import std.random : Random, unpredictableSeed;
import std.conv : to;

import game.state;
import game.category;
import ui.render;
import ui.parse;

void main()
{
    greet();

    auto names = askPlayers();
    if (names.length == 0)
    {
        writeln("bye.");
        return;
    }

    auto game = Game.create(names, Random(unpredictableSeed));

    bool quit = false;
    while (!game.isOver && !quit)
    {
        render(game);
        auto input = prompt("> ");
        if (input is null) break;

        auto cmd = parse(input);
        quit = !handle(cmd, game);
    }

    if (game.isOver)
    {
        writeln();
        writeln("=== GAME OVER ===");
        renderScoreCard(game);
        writeln("Winner: ", winnerName(game));
    }
    else
    {
        writeln("bye.");
    }
}

void greet()
{
    writeln("=== Yacht ===");
    writeln("type 'help' to see commands.");
    writeln("=============");
}

string[] askPlayers()
{
    while (true)
    {
        auto line = prompt("Number of players (1-5)? ");
        if (line is null) return [];

        int n;
        if (tryParseInt(line, n) && n >= 1 && n <= 5)
        {
            string[] names;
            foreach (i; 0 .. n)
            {
                auto label = "Player " ~ (i + 1).to!string ~ " name (default P" ~ (i + 1).to!string ~ "): ";
                auto name = prompt(label);
                if (name is null) return [];
                names ~= (name.length == 0 ? "P" ~ (i + 1).to!string : name);
            }
            return names;
        }
        writeln("Please enter 1 to 5.");
    }
}

string prompt(string label)
{
    write(label);
    stdout.flush();
    auto line = readln();
    if (line is null) return null;
    return line.strip.idup;
}

// 戻り値: ループを続けるなら true、抜けるなら false
bool handle(in Command cmd, ref Game game)
{
    final switch (cmd.kind)
    {
    case CommandKind.none:
        return true;

    case CommandKind.roll:
        if (!game.rollAll())
        {
            if (game.turnStarted)
                writeln("already rolled. use 'roll <positions>' to reroll specific dice.");
            else
                writeln("no rolls left. type 'score <category>'.");
        }
        return true;

    case CommandKind.reroll:
        if (!game.turnStarted)
        {
            writeln("first roll must be 'roll' (no positions).");
        }
        else if (!game.canRoll)
        {
            writeln("no rolls left. type 'score <category>'.");
        }
        else if (!game.reroll(cmd.positions))
        {
            writeln("invalid reroll positions.");
        }
        return true;

    case CommandKind.score:
        return handleScore(cmd.category, game);

    case CommandKind.listCategories:
        renderCategoryPreview(game);
        return true;

    case CommandKind.showCard:
        renderScoreCard(game);
        return true;

    case CommandKind.help:
        renderHelp();
        return true;

    case CommandKind.quit:
        return false;

    case CommandKind.unknown:
        writeln("unknown command: '", cmd.raw, "'. type 'help'.");
        return true;
    }
}

private bool handleScore(Category c, ref Game game)
{
    if (!game.turnStarted)
    {
        writeln("roll dice first.");
        return true;
    }
    if (game.active.card.isUsed(c))
    {
        writeln("category already used. pick another.");
        return true;
    }

    immutable name = game.active.name;
    immutable s = score(c, game.dice.values[]);
    game.record(c);
    writeln(name, " scored ", s, " on ", categoryNames[c], ".");
    return true;
}

private string winnerName(in Game game)
{
    int best = -1;
    string name = "";
    foreach (ref p; game.players)
    {
        immutable t = p.card.total;
        if (t > best)
        {
            best = t;
            name = p.name;
        }
    }
    return name;
}
