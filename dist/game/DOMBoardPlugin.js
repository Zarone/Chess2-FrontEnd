import { ChessBoard } from "../chess2";
import { LOSE_TEXT } from "../helper-js/utils";

export class DOMBoardPlugin {
    constructor ({ styleSheet, styleName }) {
        this.styleSheet = styleSheet;
        this.styleName = styleName;
    }
    install (game) {
        this.board = new ChessBoard(
            game,
            (moveInfo)=>{

                // TODO: MoveInfo class to encapsulate serialize/deserialize logic
                if ( moveInfo.toPos ) moveInfo.toPos = moveInfo.toPos?.id || moveInfo.toPos;
                if ( moveInfo.fromPos ) moveInfo.fromPos = moveInfo.fromPos?.id || moveInfo.fromPos;

                console.log('EMIT', moveInfo)
                if (moveInfo.newTurn === undefined) debugger

                // launcher.events.emit('move.end', moveInfo);

                game.emit("request.commitMove", {
                    player: game.get('playerID'),
                    room: game.get('roomID'),
                    moveInfo
                })
            },
            game.emit.bind(game, 'request.admitDefeat', { message: LOSE_TEXT }),
            this.styleSheet, this.styleName
        )
    }
}