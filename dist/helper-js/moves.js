import { Position } from "./board.js";

export class DefaultMoveSpec {
    constructor (spec) {
        this.spec = spec;
    }
    maybeOutput ({ piece, output }) {
        const refPos = piece.position;
        const vector = [...this.spec.pos];

        // Flip position change for black pieces
        if ( ! piece.isWhite ) vector[0] *= -1;

        // Add position change to reference position
        const pos = refPos.plus(vector);

        // Do not output if this position is off the board
        // TODO: have board class implement this instead
        if ( ! pos.isWithinBounds() ) return;

        output.push({ pos: pos.id, conditions: this.spec.conditions });
    }
}

export class MovePreprocessor {
    constructor (piece, moves) {
        this.piece = piece;
        this.moves = moves;
    }

    static moveSpecTypes = {
        place: DefaultMoveSpec
    };

    getMoves() {
        const piece = this.piece;

        const output = [];

        for ( let move of this.moves ) {
            move = new MovePreprocessor.moveSpecTypes[move.type || 'place'](move);
            move.maybeOutput({ piece, output });
        }

        return output;
    }
}
