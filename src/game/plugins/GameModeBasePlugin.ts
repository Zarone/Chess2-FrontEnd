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
                boardLayout.makePreValidatedMove(game, moveInfo.fromPos, moveInfo.toPos);
                game.set('currentTurn', moveInfo.newTurn);
            })
            
            this.on(Events.request.VALIDATE_MOVE, (_: {}, moveInfo: MoveInfo)=>{
                const boardLayout = game.get('boardLayout');
                return boardLayout.validateMove(
                    game, game.get('currentTurn'), moveInfo
                )
            })

            this.on(Events.request.TRY_MAKE_MOVE, (_: {}, moveInfo: MoveInfo)=>{
                let validateResponse: {[key: string]: (Error|boolean)[]} = this.emit(Events.request.VALIDATE_MOVE, moveInfo);
                
                for ( let i = 0; i < validateResponse["."+Events.request.VALIDATE_MOVE].length; i++ ){
                    let response = validateResponse["."+Events.request.VALIDATE_MOVE][i]
                    if ( response instanceof Error ) {
                        throw response;
                    }
                }

    
                this.emit(Events.request.FORCE_MOVE, moveInfo)

            })
        }

    }

    constructor({gameMode}: {gameMode: GameMode}){
        super();
        if (!gameMode) throw new Error("[GameModeBasePlugin]: No Game Mode provided")
        this.gameMode = gameMode
    }
}