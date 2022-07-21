import { DISCONNECT_TIMER_START, socketID } from "../helper-js/utils";

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

        game.on('request.admitDefeat', () => {
            socket.emit('admitDefeat');
        });

        game.on('request.commitMove', (_, playerMoveInfo) => {
            socket.emit('makeMove', playerMoveInfo);
        })

    }
}
