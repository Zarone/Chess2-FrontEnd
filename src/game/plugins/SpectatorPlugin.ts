import { Events } from "../../../dist/game/Events";
import { socketID } from "../../../dist/helper-js/utils";
import { GameMode } from "../../helper-js/GameModes";
import { Game } from "../Game";
import { MoveInfo } from "../net/MoveInfo";
import { GameModeBasePlugin } from "./GameModeBasePlugin";

export class SpectatorPlugin extends GameModeBasePlugin {

    static apiVersion = 1

    static receives = [
        Events.request.FORCE_MOVE,
        Events.request.VALIDATE_MOVE,
        Events.request.TRY_MAKE_MOVE,
        Events.state.CURRENT_TURN,
        Events.LAUNCH,
    ]
    static broadcasts = [
        Events.request.FORCE_MOVE,
        Events.request.CLEAR_MODALS,
        Events.request.SET_BOARD_LAYOUT,
    ]
    socket: any;


    constructor (
        { gameMode }:
        { gameMode: GameMode }
    ) {
        super({gameMode});
        this.socket = io(socketID());
    }

    install (game: Game) {
        super.install(game);

        game.set('isWhite', true)
        this.on(Events.LAUNCH, () => {
            game.set('currentTurn', 'White');
        })

        const socket = this.socket;
        const joinMessage = {
            roomID: game.state.roomID,
            spectator: true,
        };
        socket.emit('joined', joinMessage);

        socket.on('registeredMove', (args: any) => {
            console.log('registeredMove', args)
            const moveInfo = MoveInfo.deserialize(args.moveInfo);
            
            const { roomID } = game.state;
            
            if ( roomID != args.room ) return;
            
            console.log('emitting force move');
            this.emit(Events.request.FORCE_MOVE, moveInfo)

        })
        socket.on("establishReconnection", (args: any)=>{
            console.log('establishReconnection')
            
            console.log("RECONNECT DATA: ", args)

            this.emit(Events.request.CLEAR_MODALS);

            const { roomID, playerID } = game.state;
            if ( args.roomID != roomID || args.pid == playerID ) return;

            this.emit(Events.request.SET_BOARD_LAYOUT, args);

            const { finalTimeLimit, currentTurn } = game.state;
            
            game.set('whiteTimer', finalTimeLimit - args.timeWhite);
            game.set('blackTimer', finalTimeLimit - args.timeBlack);

            if (finalTimeLimit <= 60*60){
                if ( currentTurn.startsWith('Black') ) game.blackTimer -= args.timeSinceLastMove;
                if ( currentTurn.startsWith('White') ) game.whiteTimer -= args.timeSinceLastMove;
            } 

        })
    }
}