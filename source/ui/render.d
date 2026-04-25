module ui.render;

import std.stdio : write, writeln, writefln;
import std.array : join;
import std.conv : to;
import std.string : leftJustify;

import game.state;
import game.category;
import game.score;
import game.dice : diceCount;

void render(in Game game)
{
    if (game.players.length == 0) return;

    writeln();
    writeln("--------------------------------------");
    auto p = game.players[game.currentPlayerIndex];
    writefln("Turn: %s | Rolls left: %d", p.name, game.rollsLeft);

    if (game.turnStarted)
    {
        writeln("Dice: ", formatDice(game.dice.values));
    }
    else
    {
        writeln("Dice: (not yet rolled — type 'roll')");
    }
    writeln();

    renderScoreCard(game);
    writeln("--------------------------------------");
}

void renderScoreCard(in Game game)
{
    immutable size_t catWidth = 20;
    immutable size_t colWidth = 10;

    write("Category".leftJustify(catWidth));
    foreach (ref p; game.players)
    {
        write(p.name.leftJustify(colWidth));
    }
    writeln();

    foreach (i, name; categoryNames)
    {
        write(name.leftJustify(catWidth));
        foreach (ref p; game.players)
        {
            immutable cell = p.card.used[i] ? p.card.scores[i].to!string : ".";
            write(cell.leftJustify(colWidth));
        }
        writeln();
    }

    write("TOTAL".leftJustify(catWidth));
    foreach (ref p; game.players)
    {
        write(p.card.total.to!string.leftJustify(colWidth));
    }
    writeln();
}

void renderHelp()
{
    writeln("Commands:");
    writeln("  roll                 first roll of the turn (all 5 dice)");
    writeln("  roll <pos...>        reroll dice at given positions (1-5)");
    writeln("  score <category>     record current dice into category and end turn");
    writeln("  cat / categories     list available categories with score preview");
    writeln("  card                 show the score card");
    writeln("  help / h / ?         show this help");
    writeln("  quit / q / exit      quit the game");
    writeln();
    writeln("Categories (alias):");
    foreach (i, name; categoryNames)
    {
        writeln("  ", name.leftJustify(20), " (", categoryAliases[i], ")");
    }
}

void renderCategoryPreview(in Game game)
{
    writeln("Available categories (preview for current dice):");
    foreach (i, name; categoryNames)
    {
        immutable cat = cast(Category) i;
        if (game.active.card.isUsed(cat)) continue;

        string preview;
        if (game.turnStarted)
        {
            preview = score(cat, game.dice.values[]).to!string;
        }
        else
        {
            preview = "-";
        }
        writeln("  ", name.leftJustify(20), " (", categoryAliases[i].leftJustify(3), ") -> ", preview);
    }
}

private string formatDice(in int[diceCount] dice)
{
    string[diceCount] parts;
    foreach (i, v; dice)
    {
        parts[i] = (i + 1).to!string ~ ":" ~ v.to!string;
    }
    return parts[].join("  ");
}
