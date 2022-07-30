import { Fish } from "../../pieces-js/Fish";
import { FishQueen } from "../../pieces-js/FishQueen";
import { Events } from "../Events";
import { PluginBase } from "./BasePlugin";

export class PieceHooksPlugin extends PluginBase {

    static apiVersion = 1

    static receives = [
        Events.state.BOARD_MOVE
    ]

    static broadcasts = [
        Events.state.BOARD_UPDATE
    ]

    documentation = `
        This plugin processes hooks on piece moves:
        - Fish reaching end of board creates FishyQueen
        - Capture of a piece activates the Rook
    `

    install (game) {
        super.install(game);

        // UPDATE ROOK ACTIVITY
        this.on(Events.state.BOARD_MOVE, (_, { piece, toPos, victim }) => {
            game.set('rookActiveBlack', false);
            game.set('rookActiveWhite', false);
            const boardLayout = game.get('boardLayout');

            // console.log('set rook active?', victim != undefined);

            // if a piece was taken
            if (victim != undefined){
                if (victim.isWhite){
                    game.set('rookActiveWhite', true);
                } else if (boardLayout[toPos] != null){
                    game.set('rookActiveBlack', true);
                }
            } else if (toPos.isJail()){
                // TEST: ensure 'piece' is royalty
                if (piece.isWhite){
                    game.set('rookActiveWhite', true);
                } else {
                    game.set('rookActiveBlack', true);
                }
            }
        });

        // CHECK FISH PROMOTION
        this.on(Events.state.BOARD_MOVE, (_, { piece, fromPos, toPos }) => {
            const boardLayout = game.get('boardLayout');

            if ( ! (piece instanceof Fish) ) return;

            let rowName = toPos.row

            // console.log('=====FISH=====', piece.isWhite, rowName, toPos.id);
            if (
                (piece.isWhite && rowName=="8") ||
                (!piece.isWhite && rowName=="1")
            ){
                boardLayout[toPos] = new FishQueen(toPos, piece.isWhite);
                this.emit(Events.state.BOARD_UPDATE);
            }
        });
    }
}