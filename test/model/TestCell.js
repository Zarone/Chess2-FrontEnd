import { TestModel } from "./TestModel";

export class TestCell extends TestModel {
    assertPieceType (cls, message) {
        message = message ||
            `piece type at ${this.pos} is ${cls.name}`;
        if ( ! ( this.piece instanceof cls ) ) {
            this.tester.error({
                message,
                emessage: v => `got ${v.actualClass} instead`,
                expectedClass: cls.name,
                actualClass: this.piece?.constructor?.name,
                piece: this.piece
            });
            return false;
        } else {
            this.tester.pass({
                message,
                expectedClass: cls.name,
            })
            return true;
        }
    }

    assertNotEmpty (message) {
        message = message ||
            `cell at ${this.pos} holds a piece`;
        if ( ! this.piece ) {
            this.tester.error({
                message,
                emessage: () => `${this.pos} was empty`
            })
            return false;
        }
        return true;
    }
}
