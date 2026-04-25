module web.api;

import std.conv : to;

import vibe.http.server;
import vibe.data.json;

import game.state;
import game.category;
import game.dice : diceCount;
import web.session;

void handleNew(scope HTTPServerRequest req, scope HTTPServerResponse res)
{
    auto body_ = req.json;
    int count = body_["playerCount"].get!int;
    if (count < 1 || count > 5)
    {
        res.statusCode = 400;
        res.writeJsonBody(errorJson("playerCount must be 1..5"));
        return;
    }

    string[] names;
    if ("names" in body_)
    {
        foreach (n; body_["names"].get!(Json[]))
        {
            names ~= n.get!string;
        }
    }
    while (names.length < count)
    {
        names ~= "P" ~ (names.length + 1).to!string;
    }
    names = names[0 .. count];

    auto id = registry.create(names);
    Json result = Json.emptyObject;
    result["gameId"] = id;
    registry.withGame(id, (ref Game g) {
        result["state"] = serializeGame(g);
    });
    res.writeJsonBody(result);
}

void handleRoll(scope HTTPServerRequest req, scope HTTPServerResponse res)
{
    auto id = req.json["gameId"].get!string;
    if (!actOnGame(res, id, (ref Game g, ref Json out_) {
        if (!g.rollAll())
            out_["error"] = "cannot roll (not your first roll, or no rolls left)";
    })) return;
}

void handleReroll(scope HTTPServerRequest req, scope HTTPServerResponse res)
{
    auto body_ = req.json;
    auto id = body_["gameId"].get!string;

    size_t[] positions;
    foreach (p; body_["positions"].get!(Json[]))
    {
        immutable n = p.get!int;
        if (n < 0 || n >= diceCount)
        {
            res.statusCode = 400;
            res.writeJsonBody(errorJson("position out of range"));
            return;
        }
        positions ~= cast(size_t) n;
    }

    if (!actOnGame(res, id, (ref Game g, ref Json out_) {
        if (!g.reroll(positions))
            out_["error"] = "cannot reroll (roll first, or out of rolls)";
    })) return;
}

void handleScore(scope HTTPServerRequest req, scope HTTPServerResponse res)
{
    auto body_ = req.json;
    auto id = body_["gameId"].get!string;
    auto catName = body_["category"].get!string;

    Category cat;
    if (!tryParseCategory(catName, cat))
    {
        res.statusCode = 400;
        res.writeJsonBody(errorJson("unknown category: " ~ catName));
        return;
    }

    if (!actOnGame(res, id, (ref Game g, ref Json out_) {
        if (g.active.card.isUsed(cat))
            out_["error"] = "category already used";
        else if (!g.record(cat))
            out_["error"] = "cannot record (roll dice first)";
    })) return;
}

void handleState(scope HTTPServerRequest req, scope HTTPServerResponse res)
{
    auto id = req.query.get("gameId", "");
    if (id.length == 0)
    {
        res.statusCode = 400;
        res.writeJsonBody(errorJson("gameId is required"));
        return;
    }
    actOnGame(res, id, (ref Game g, ref Json out_) {});
}

// 共通: ID で Game を引いて op を実行し、結果 (state + 任意の error) を JSON で返す。
private bool actOnGame(scope HTTPServerResponse res, string id,
    scope void delegate(ref Game, ref Json) op)
{
    Json result = Json.emptyObject;
    immutable found = registry.withGame(id, (ref Game g) {
        op(g, result);
        result["state"] = serializeGame(g);
    });
    if (!found)
    {
        res.statusCode = 404;
        res.writeJsonBody(errorJson("game not found"));
        return false;
    }
    res.writeJsonBody(result);
    return true;
}

private Json errorJson(string message)
{
    auto j = Json.emptyObject;
    j["error"] = message;
    return j;
}

private Json serializeGame(in Game g)
{
    auto j = Json.emptyObject;
    j["currentPlayer"] = cast(int) g.currentPlayerIndex;
    j["rollsLeft"] = g.rollsLeft;
    j["turnStarted"] = g.turnStarted;
    j["isOver"] = g.isOver;

    auto dice = Json.emptyArray;
    foreach (v; g.dice.values) dice ~= Json(v);
    j["dice"] = dice;

    auto players = Json.emptyArray;
    foreach (ref p; g.players)
    {
        auto pj = Json.emptyObject;
        pj["name"] = p.name;
        auto scores = Json.emptyObject;
        foreach (i, name; categoryNames)
        {
            scores[name] = p.card.used[i] ? Json(p.card.scores[i]) : Json(null);
        }
        pj["scores"] = scores;
        pj["total"] = p.card.total;
        players ~= pj;
    }
    j["players"] = players;

    if (g.turnStarted && !g.isOver)
    {
        auto preview = Json.emptyObject;
        foreach (i, name; categoryNames)
        {
            if (!g.active.card.used[i])
            {
                preview[name] = score(cast(Category) i, g.dice.values[]);
            }
        }
        j["preview"] = preview;
    }

    if (g.isOver)
    {
        int best = -1;
        string winner;
        foreach (ref p; g.players)
        {
            if (p.card.total > best)
            {
                best = p.card.total;
                winner = p.name;
            }
        }
        j["winner"] = winner;
        j["winnerScore"] = best;
    }

    return j;
}
