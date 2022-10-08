import { ChessBoard } from "./chess2.js";
import { socketID , LOSE_TEXT, WIN_TEXT, disconnectText, DISCONNECT_TIMER_START } from "./helper-js/utils.js";
import { getQuerystring } from "./helper-js/utils.js"
import { Cookie } from "./helper-js/cookieManager.js"
import { Bear } from "./pieces-js/Bear.js";
import { Elephant } from "./pieces-js/Elephant.js";
import { FishQueen } from "./pieces-js/FishQueen.js";
import { Monkey } from "./pieces-js/Monkey.js";
import { Fish } from "./pieces-js/Fish.js";
import { King } from "./pieces-js/King.js";
import { Queen } from "./pieces-js/Queen.js";
import { Rook } from "./pieces-js/Rook.js";
import { Position } from "./helper-js/board.js"
import { GameLauncher } from "./game/GameLauncher.js";
import { DOMPlugin } from "./game/plugins/DOMPlugin.js";
import { MultiplayerPlugin } from "./game/plugins/MultiplayerPlugin.js";
import { TimerPlugin } from "./game/plugins/TimerPlugin.js";
import { DOMBoardPlugin } from "./game/plugins/DOMBoardPlugin.js";
import { Events } from "./game/Events"
import { MoveInfo } from "../src/game/net/MoveInfo";
import { BoardFactory, BoardLayouts } from "./chess2/BoardLayout.js";
import { EndGamePlugin } from "./game/plugins/EndGamePlugin.js";
import { PieceHooksPlugin } from "./game/plugins/PieceHooksPlugin.js";
import { SinglePlayerPlugin } from "./game/plugins/SinglePlayerPlugin.js";
import { GameMode, GameModes } from "../src/helper-js/GameModes"
import { EnemyComputerSettings } from "../src/helper-js/EnemyComputerSettings";
import { Turn } from "./game/model/Turn.js";
import { NORMAL, WHITE } from "./helper-js/TurnUtil.js";
import { SpectatorPlugin } from "../src/game/plugins/SpectatorPlugin";
import { GameModeBasePlugin } from "../src/game/plugins/GameModeBasePlugin";

export const onLoad = async (styleSheet, styleName) => {

    const qstr = getQuerystring();
    let {roomID, friendRoom, timeLimit, computerLevel, computerType} = qstr;

    const gameMode = qstr.gamemode ? GameModes[qstr.gamemode] : GameModes.SINGLE_PLAYER;

    if (!globalThis.cookie) globalThis.cookie = new Cookie();

    let playerID = parseInt(globalThis.cookie.pid)

    if (roomID == undefined){
        roomID = null
    }

    // covered
    let turn_Dom = document.getElementById("turn")
    turn_Dom.innerText = "...Waiting for player to join"
    turn_Dom.style.backgroundColor = 'white'

    let socket = io(socketID(), {timeout: 100000})

    const launcher = new GameLauncher({ debug: true });
    launcher.init();
    launcher.install(new DOMPlugin());
    launcher.install(new DOMBoardPlugin({ styleSheet, styleName }));
    launcher.install(new PieceHooksPlugin());
    launcher.install(new EndGamePlugin());
    launcher.install(new TimerPlugin());
    // if ( gameMode == 'PLAYER_VS_PLAYER' ) {
    //     launcher.install(new MultiplayerPlugin({ socket }));
    // } else if ( gameMode == 'SINGLE_PLAYER' ) {
    //     launcher.install(new SinglePlayerPlugin());
    // } else {
    //     alert('why are you typing random stuff in the url?');
    //     throw new Error('why are you typing random stuff in the url?');
    // }
    launcher.install( new gameMode.plugin({socket, computerSettings: {level: +computerLevel, type: computerType} } ) )

    const game = launcher.game;

    game.set('boardLayout', BoardFactory.create(BoardLayouts.DEFAULT));

    // === TEMPORARY: update variables used by unmigrated code ===
    game.on(Events.state.ROOM_ID, (_, v) => roomID = v);
    game.on(Events.state.PLAYER_ID, (_, v) => playerID = v);
    // === END TEMPORARY ===

    let chessBoard = game.plugins[DOMBoardPlugin.prototype.constructor.name].board;

    let reversedPointer = { 
        get reversed(){
            return game.get('reversed');
        },
        set reversed(v){
            console.log("set reversed", v)
            game.set('reversed', v);
            // if (flipBoard && chessBoard) flipBoard(chessBoard.isWhite);
        },

        get flipped(){
            return game.get('flipped');
        },
        set flipped(v){
            console.log("set flipped", v)
            game.set('flipped', v);
        }
    }

    if (!(game.plugins[GameModeBasePlugin.identifier].constructor.name == SpectatorPlugin.prototype.constructor.name)){

        document.addEventListener("mouseup", event => {
            chessBoard.dragEnd(event)
    
            setTimeout(()=>{
                let thisTurn = Turn.adapt(game.get("currentTurn"))
                if (!thisTurn.is(NORMAL)) {
                    console.log("NOT NEW TURN")
                    return;
                }
    
                console.log(game.get("currentTurn"), game.get("isWhite"))
    
                if ((game.get("currentTurn") == "White") == game.get("isWhite")) {
                    console.log("NOT AI's TURN")
                    return;
                }
                if (!globalThis.outputPromise) {
                    console.log("NO AI TURN PREPARED")
                    return;
                }
        
                globalThis.outputPromise()
        
                let aiRes = globalThis.output;
                
                console.log("[AI output]", aiRes)
                
                for (let i = 0; i < aiRes.length; i++){
                    game.emit(Events.request.TRY_MAKE_MOVE, {fromPos: new Position(aiRes[i][0]), toPos: new Position(aiRes[i][1]), newTurn: aiRes[i][2]})
                }
            }, 0)
        })
        document.addEventListener("mousemove", event=>chessBoard.cursorMove(event))
    }

    launcher.launch();
    return { chessBoard, reversedPointer, gameMode };
}
