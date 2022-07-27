import { PluginBase } from "../../../dist/game/plugins/BasePlugin"
import { Game } from "../Game";
import { GameMode } from "../../helper-js/GameModes";
import { Events } from "../../../dist/game/Events"
import { MoveInfo } from "../net/MoveInfo";
import { Event } from "../../../dist/game/Events";

export class GameModeBasePlugin extends PluginBase {
    static identifier = "GameModePlugin";
    gameMode: GameMode;

    static receives: Event[];

    install(game: Game){
        super.install(game)
        if ( !(this.constructor as typeof GameModeBasePlugin).receives ) throw Error("[GameModeBasePlugin] Receives list not defined in derived class")
        if ( (this.constructor as typeof GameModeBasePlugin).receives.includes(Events.request.FORCE_MOVE)){        
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

    }

    constructor({gameMode}: {gameMode: GameMode}){
        super();
        if (!gameMode) throw new Error("[GameModeBasePlugin]: No Game Mode provided")
        this.gameMode = gameMode
    }
}