import { MultiplayerPlugin } from "../../dist/game/plugins/MultiplayerPlugin"
import { SinglePlayerPlugin } from "../../dist/game/plugins/SinglePlayerPlugin"
import { PluginBase } from "../../dist/game/plugins/BasePlugin";
import { TestGameModePlugin } from "../game/plugins/TestGameModePlugin";
import { HumanVsAIPlugin } from "../game/plugins/HumanVsAIPlugin";
import { SpectatorPlugin } from "../game/plugins/SpectatorPlugin";

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
    label: string;
    hidden: boolean;
    constructor(
        singleplayer: boolean,
        pluginConstructor: pluginConstructor,
        modeName: string,
        label: string,
        hidden?: boolean
    ){
        this.singleplayer = singleplayer;
        this.plugin = (prop: {}) => { 
            return new pluginConstructor({gameMode: this, ...prop});
        };
        this.modeName = modeName;
        this.label = label;
        this.hidden = hidden || false;
    }
}

export const GameModes = {
    SINGLE_PLAYER: new GameMode(true, SinglePlayerPlugin, "SINGLE_PLAYER", "Single Player"),
    PLAYER_VS_PLAYER: new GameMode(false, MultiplayerPlugin, "PLAYER_VS_PLAYER", "Two Players"),
    TEST_MODE: new GameMode(true, TestGameModePlugin, "TEST_MODE", "Test Mode"),
    HUMAN_VS_AI: new GameMode(true, HumanVsAIPlugin, "HUMAN_VS_AI", "AI Opponent"),
    SPECTATOR: new GameMode(false, SpectatorPlugin, "SPECTATOR", "Spectate")
}