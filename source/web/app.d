module web.app;

import std.stdio : writeln;

import vibe.core.core : runApplication;
import vibe.http.server;
import vibe.http.router : URLRouter;
import vibe.http.fileserver : serveStaticFile, serveStaticFiles;

import web.api;
import web.session;

int main()
{
    registry = new GameRegistry;

    auto router = new URLRouter;
    router.post("/api/new",    &handleNew);
    router.post("/api/roll",   &handleRoll);
    router.post("/api/reroll", &handleReroll);
    router.post("/api/score",  &handleScore);
    router.get ("/api/state",  &handleState);

    router.get("/", serveStaticFile("public/index.html"));
    router.get("*", serveStaticFiles("public/"));

    auto settings = new HTTPServerSettings;
    settings.port = 8080;
    settings.bindAddresses = ["127.0.0.1"];

    listenHTTP(settings, router);
    writeln("Yacht web server: http://127.0.0.1:8080/");
    return runApplication();
}
