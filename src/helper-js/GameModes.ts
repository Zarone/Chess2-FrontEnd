import { MultiplayerPlugin } from "../../dist/game/plugins/MultiplayerPlugin"
import { SinglePlayerPlugin } from "../../dist/game/plugins/SinglePlayerPlugin"
import { PluginBase } from "../../dist/game/plugins/BasePlugin";
import { TestGameModePlugin } from "../game/plugins/TestGameModePlugin";

interface pluginConstructor {
    new (prop: {}) : PluginBase;
}

interface pluginConstructorWrapper {
    (prop:{}):PluginBase;
}

export class GameMode {
    singleplayer: boolean;
    plugin: pluginConstructorWrapper;
    modeName: string;
    constructor(singleplayer: boolean, pluginConstructor: pluginConstructor, modeName: string){
        this.singleplayer = singleplayer;
        this.plugin = (prop: {}) => { 
            return new pluginConstructor({gameMode: this, ...prop});
        };
        this.modeName = modeName;
    }
}

export const GameModes = {
    SINGLE_PLAYER: new GameMode(true, SinglePlayerPlugin, "SINGLE_PLAYER"),
    PLAYER_VS_PLAYER: new GameMode(false, MultiplayerPlugin, "PLAYER_VS_PLAYER"),
    TEST_MODE: new GameMode(true, TestGameModePlugin, "TEST_MODE")
}