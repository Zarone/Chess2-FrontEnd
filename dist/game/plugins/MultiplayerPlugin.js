import { DISCONNECT_TIMER_START, LOSE_TEXT, socketID, WIN_TEXT, disconnectText } from "../../helper-js/utils";

import { PluginBase } from "./BasePlugin"
import { Events } from "../Events"
import { MoveInfo } from "../net/MoveInfo";

export class MultiplayerPlugin extends PluginBase {
    constructor ({ socket }) {
        super();
        this.socket = socket;
    }

    install (game) {
        super.install(game)

        let socket = this.socket || (this.socket = io(socketID()));

        let disconnectTimer = DISCONNECT_TIMER_START;
        socket.on("disconnect", () => {
            disconnectTimer = DISCONNECT_TIMER_START
            this.emit(Events.request.GAME_OVER_MODAL, disconnectText(disconnectTimer));

            let timer = setInterval(()=>{
                let text;
                if (disconnectTimer < 0){
                    text = LOSE_TEXT
                } else {
                    disconnectTimer -= 1;
                    text = disconnectText(disconnectTimer)
                }
                this.emit(Events.request.GAME_OVER_MODAL, text);
            }, 1000)
        })

        let joinMessage = {
            roomID: game.state.roomID,
            friendRoom: (v => v == "true" || v === true)(game.state.friendRoom),
            playerID: game.state.playerID,
            timeLimit: game.state.timeLimit,
        };
        socket.emit('joined', joinMessage);

        socket.on("maximumPlayers", ()=>{
            this.emit(Events.request.GAME_OVER_MODAL,
                "Maximum players on server. Please try again later.");
        });
        socket.on("fullRoom", ()=>{
            this.emit(Events.request.GAME_OVER_MODAL, "The room you tried to join is full.");
        });

        socket.on('player', (playerInfo)=>{
            // ???: move to a playerInfo plugin
            this.on(Events.state.PLAYER_INFO, (_, playerInfo) => {
                game.set('playerID', playerInfo.pid);

                if ( globalThis.cookie.pid !== playerInfo.pid ) {
                    globalThis.cookie.pid = playerInfo.pid.toString();
                }

                game.set('roomID', playerInfo.roomID);
                game.set('isWhite', playerInfo.isWhite);
            });

            game.set('playerInfo', playerInfo);
        });

        socket.on("twoPlayers", (args)=>{
            if (game.get('roomID') == args.thisRoomID){

                let finalTimeLimit = args.finalTimeLimit*60;
                game.set('finalTimeLimit', finalTimeLimit);
                game.set('whiteTimer', finalTimeLimit);
                game.set('blackTimer', finalTimeLimit);

                game.set('currentTurn', 'White');
            }
        })

        socket.on('gameOver', ({ room, id }) => {
            // Guard clause: room should match
            if ( room != game.get('roomID') ) return;
            this.emit(
                Events.request.GAME_OVER_MODAL,
                game.get('playerID') == id ? WIN_TEXT : LOSE_TEXT,
            );
        })

        socket.on('registeredMove', args => {
            const moveInfo = MoveInfo.deserialize(args.moveInfo);

            const { roomID, playerID } = game.state;

            if ( roomID != args.room ) return;
            if ( playerID == args.player ) return;

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

        // ???: Maybe add a ReconnectionPlugin
        this.installReconnection(game);

        this.on(Events.request.ADMIT_DEFEAT, () => {
            socket.emit('admitDefeat');
        });

        this.on(Events.request.COMMIT_MOVE, (_, { player, room, moveInfo }) => {
            moveInfo = moveInfo.serialize();
            socket.emit('makeMove', { player, room, moveInfo });
        })
    }

    installReconnection () {
        let socket = this.socket || (this.socket = io(socketID()));

        socket.on('partialReconnect', playerInfo => {
            game.set('playerID', playerInfo.pid);

            if ( globalThis.cookie.pid !== game.get('playerID') ) {
                globalThis.cookie.pid = game.get('playerID').toString();
            }
            
            game.set('roomID', playerInfo.roomID);
            game.set('isWhite', playerInfo.isWhite);
            game.set('finalTimeLimit', playerInfo.timeLimit * 60);
        });

        socket.on("needReconnectData", args => {
            const { roomID, playerID } = game.state;
            if ( roomID != args.roomID || playerID == args.playerID ) return;
            this.emit(Events.request.RECONNECT_DATA);
            // if (roomID == args.roomID && playerID != args.playerID){
            //     console.log("EMITTING DATA FOR RECONNECT, CURRENT BOARD: ", chessBoard.boardLayout)
            //     socket.emit("reconnectData", {
            //         layout: Object.keys(chessBoard.boardLayout).map((val, index)=>{
            //             return {
            //                 position: chessBoard.boardLayout[val].position.id, 
            //                 isWhite: chessBoard.boardLayout[val].isWhite, 
            //                 type: chessBoard.boardLayout[val].constructor.name, 
            //                 hasBanana: chessBoard.boardLayout[val].hasBanana,
            //                 key: val
            //             }
            //         }), 
            //         rookActiveWhite: chessBoard.rookActiveWhite,
            //         rookActiveBlack: chessBoard.rookActiveBlack,
            //         currentTurn: chessBoard.currentTurn
            //     })
            // }
        })

        this.on(Events.request.SEND_RECONNECT_DATA, (_, data) => {
            socket.emit('reconnectData', data);
        })


        socket.on("establishReconnection", (args)=>{
            
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
