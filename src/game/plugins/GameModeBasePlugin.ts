import { PluginBase } from "../../../dist/game/plugins/BasePlugin"
import { Game } from "../Game";
import { GameMode } from "../../helper-js/GameModes";
import { Events } from "../../../dist/game/Events"
import { MoveInfo } from "../net/MoveInfo";

export class GameModeBasePlugin extends PluginBase {
    static identifier = "GameModePlugin";
    gameMode: any;

    install(game: Game){
        super.install(game)

        this.on(Events.request.FORCE_MOVE, (_: {}, moveInfo: MoveInfo)=>{
            const boardLayout = game.get('boardLayout');
            const isValid = boardLayout.validateMove(
                game, game.get('currentTurn'), moveInfo);

            if ( ! isValid ) {
                console.error('move is not allowed', moveInfo);
                return;
            }

            boardLayout.makePreValidatedMove(game, moveInfo.fromPos, moveInfo.toPos);
            game.set('currentTurn', moveInfo.newTurn);
        })

    }

    constructor({gameMode}: {gameMode: GameMode}){
        super();
        this.gameMode = gameMode
    }
}