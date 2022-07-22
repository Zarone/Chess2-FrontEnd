import { DISCONNECT_TIMER_START, LOSE_TEXT, socketID, WIN_TEXT } from "../helper-js/utils";

export class MultiplayerPlugin {
    constructor ({ socket }) {
        this.socket = socket;
    }

    install (game) {

        let socket = this.socket || (this.socket = io(socketID()));

        let disconnectTimer = DISCONNECT_TIMER_START;
        socket.on("disconnect", () => {
            disconnectTimer = DISCONNECT_TIMER_START
            game.events.emit('request.gameOverModal', disconnectText(disconnectTimer));

            let timer = setInterval(()=>{
                let text;
                if (disconnectTimer < 0){
                    text = LOSE_TEXT
                } else {
                    disconnectTimer -= 1;
                    text = disconnectText(disconnectTimer)
                }
                game.events.emit('request.gameOverModal', text);
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
            game.events.emit('request.gameOverModal',
                "Maximum players on server. Please try again later.");
        });
        socket.on("fullRoom", ()=>{
            game.events.emit('request.gameOverModal', "The room you tried to join is full.");
        });

        socket.on('player', (playerInfo)=>{
            // ???: move to a playerInfo plugin
            game.on('state.playerInfo', (_, playerInfo) => {
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
            game.events.emit(
                'request.gameOverModal',
                game.get('playerID') == id ? WIN_TEXT : LOSE_TEXT,
            );
        })

        // ???: Maybe add a ReconnectionPlugin
        this.installReconnection(game);

        game.on('request.admitDefeat', () => {
            socket.emit('admitDefeat');
        });

        game.on('request.commitMove', (_, playerMoveInfo) => {
            socket.emit('makeMove', playerMoveInfo);
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
            game.emit('request.reconnectData');
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

        game.on('request.sendReconnectData', (_, data) => {
            socket.emit('reconnectData', data);
        })


        socket.on("establishReconnection", (args)=>{
            
            console.log("RECONNECT DATA: ", args)

            game.emit('request.clearModals');

            const { roomID, playerID } = game.state;
            if ( args.roomID != roomID || args.pid == playerID ) return;

            game.emit('request.setBoardLayout', args);

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
