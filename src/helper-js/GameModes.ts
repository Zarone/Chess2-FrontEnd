import { MultiplayerPlugin } from "../../dist/game/plugins/MultiplayerPlugin.js"
import { SinglePlayerPlugin } from "../../dist/game/plugins/SinglePlayerPlugin.js"
import { PluginBase } from "../../dist/game/plugins/BasePlugin";

interface pluginConstructor {
    new () : PluginBase;
}

export class GameMode {
    singleplayer: boolean;
    plugin: pluginConstructor;
    modeName: string;
    constructor(singleplayer: boolean, pluginConstructor: pluginConstructor, modeName: string){
        this.singleplayer = singleplayer;
        this.plugin = pluginConstructor;
        this.modeName = modeName;
    }
}

export const GameModes = {
    SINGLE_PLAYER: new GameMode(true, SinglePlayerPlugin, "SINGLE_PLAYER"),
    PLAYER_VS_PLAYER: new GameMode(false, MultiplayerPlugin, "PLAYER_VS_PLAYER")
}