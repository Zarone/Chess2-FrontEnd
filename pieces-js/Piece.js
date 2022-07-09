import { Position } from "../helper-js/board.js"
import { MovePreprocessor } from "../helper-js/moves.js";

export class Piece {
    
    isWhite = false
    position = ""
    
    constructor(position, isWhite){
        this.isWhite = isWhite
        this.position = position instanceof Position ?
            position : new Position(position);
    }

    getImageSrc(){
        console.error("called Piece getImageSrc")
    }

    getMoves(){
        if ( ! this.constructor.moves ) {
            console.error(`[core.Piece] ${this.constructor.name} must provide moves `);
        }
        return new MovePreprocessor(this, this.constructor.moves).getMoves();
    }
}