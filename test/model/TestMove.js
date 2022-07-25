import { ChessBoard } from "../../dist/chess2";
import { Position } from "../../dist/helper-js/board";
import { TestModel } from "./TestModel";

export class TestMove extends TestModel {
    assertAllowed (message) {
        const game = this.tester.game;
        const boardLayout = game.get('boardLayout');

        message = message ||
            `move allowed from ${this.fromPos} to ${this.toPos}`;
        const fromCell = this.tester.testCell(this.fromPos);
        if ( ! fromCell.assertNotEmpty(message) ) {
            return false;
        };

        // Test move as though it came from active player
        const piece = fromCell.piece;


        let fromPos = this.fromPos == 'TEMP' ?
            piece.position : this.fromPos;

        let moves = piece.getMoves();
        moves = boardLayout.filterImpossibleMoves(game, moves, fromPos);

        let check = false;
        for ( const move of moves ) {
            if ( Position.adapt(this.toPos).equals(move.pos) ) {
                check = true;
                break;
            }
        }

        const result = {
            message,
            fromPos: this.fromPos,
            piecePos: fromPos,
            toPos: this.toPos,
            pieceClass: this.piece?.constructor?.name
        };

        if ( ! check ) {
            this.tester.error({
                ...result,
                emessage: () => 'failed basic validation'
            });
            return false;
        }

        this.tester.pass({
            ...result
        });
        return true;
    }

    commit (options, message) {
        const game = this.tester.game;
        const boardLayout = game.get('boardLayout');

        const fromCell = this.tester.testCell(this.fromPos);
        if ( ! fromCell.assertNotEmpty(message) ) {
            return false;
        };
        const piece = fromCell.piece;

        // TODO: cannot test update to currentTurn yet since
        //   that is currently coupled with code that interacts
        //   with the DOM. Specifically 'makeMove' in ChessBoard.

        this.tester.simulatedOperations++;

        if ( this.toPos == 'TEMP' ) {
            console.log('!!!!!')
            boardLayout.moveToTemp(this.fromPos);
            return;
        }
        boardLayout.move(this.fromPos, this.toPos, options);
    }
}