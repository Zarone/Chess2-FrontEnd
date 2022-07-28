import { BoardLayouts } from "../dist/chess2/BoardLayout.js";
import { Position } from "../dist/helper-js/board.js";
import { King } from "../dist/pieces-js/King";
import { Monkey } from "../dist/pieces-js/Monkey";
import { PlayTest } from "./PlayTest.js";

export class MonkeyRescueTest extends PlayTest {
    
    run () {
        
        this.setBoardLayout(BoardLayouts.MONKEY_SAVE_TEST);
        
        this.setTurn('White');

        let x1 = this.testCell('x1');
        x1.assertPieceType(King);
        const king = x1.piece;

        let a4 = this.testCell('a4');
        a4.assertPieceType(Monkey);
        const monkey = a4.piece;

        this.testMove({
            label: 'Move monkey to king',
            fromPos: 'a4',
            toPos: 'x1',
            newTurn: "White Rescue"
        }).assertAllowed();


        this.testMove({
            label: 'Move monkey to TEMP',
            fromPos: 'TEMP',
            toPos: 'c4',
            newTurn: "Black"
        }).assertAllowed();


        this.testMove({
            label: 'Move monkey to TEMP',
            fromPos: 'TEMP',
            toPos: 'c4',
            newTurn: "Black"
        }).assertAllowed();
        
        // no commit - move to TEMP happens internally

        // this.notTested('ChessBoard.makeMove', () => {
        //     move = this.testMove({
        //         label: 'Move monkey to TEMP',
        //         fromPos: 'a4',
        //         toPos: 'TEMP'
        //     });
        //     // no validation - this moves happens internally
        //     move.commit();

        //     move = this.testMove({
        //         label: 'Move king to where monkey was',
        //         fromPos: 'x1',
        //         toPos: 'a4',
        //     });
        //     // no validation - this moves happens internally
        //     move.commit();

        //     // simulate behaviour that we can't test
        //     monkey.position = Position.adapt('a4');
        // });

        // move = this.testMove({
        //     label: 'Monkey escapes',
        //     fromPos: 'TEMP',
        //     toPos: 'c4'
        // });
        // move.assertAllowed();
        // move.commit();
    }
}