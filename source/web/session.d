module web.session;

import core.sync.mutex : Mutex;
import std.uuid : randomUUID;
import std.random : Random, unpredictableSeed;

import game.state;

// 進行中のゲームをメモリ上に保持する。プロセス終了で消える (永続化なし)。
// vibe-d は既定でシングルスレッドだが、念のため Mutex で保護する。
final class GameRegistry
{
    private Mutex mtx;
    private Game[string] games;

    this()
    {
        mtx = new Mutex;
    }

    string create(string[] names)
    {
        synchronized (mtx)
        {
            auto id = randomUUID().toString;
            games[id] = Game.create(names, Random(unpredictableSeed));
            return id;
        }
    }

    // 指定 ID のゲームに対して op を実行する。見つからなければ false。
    bool withGame(string id, scope void delegate(ref Game) op)
    {
        synchronized (mtx)
        {
            auto p = id in games;
            if (p is null) return false;
            op(*p);
            return true;
        }
    }

    void remove(string id)
    {
        synchronized (mtx)
        {
            games.remove(id);
        }
    }
}

__gshared GameRegistry registry;
