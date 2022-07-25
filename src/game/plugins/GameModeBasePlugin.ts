import { PluginBase } from "../../../dist/game/plugins/BasePlugin"
import { Game } from "../../../dist/game/Game.js";
import { GameMode } from "../../helper-js/GameModes";

export class GameModeBasePlugin extends PluginBase {
    static identifier = "GameModePlugin";
    gameMode: any;

    install(game: Game){
        super.install(game)
    }

    constructor({gameMode}: {gameMode: GameMode}){
        super();
        this.gameMode = gameMode
    }
}