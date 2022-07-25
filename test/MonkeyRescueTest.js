import { BoardLayouts } from "../dist/chess2/BoardLayout";
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

        // let move = this.testMove({
        //     label: 'Move monkey onto king',
        //     fromPos: 'a4',
        //     toPos: 'x1'
        // });
        // move.assertAllowed();
        // move.commit();

        // let a4 = this.testCell('a4');
        // a4.assertPiece(king);

        // let temp = this.testCell('TEMP');
        // temp.assertPiece(monkey);

        // let move = this.testMove({
        //     label: 'Monkey escape',
        //     fromPos: 'TEMP',
        //     toPos: 'b4'
        // });

        // move.assertAllowed();
        // move.commit();
    }
}