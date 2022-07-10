import { Position } from "../helper-js/board.js"
import { MovePreprocessor } from "../helper-js/moves.js";

export class Piece {
    
    isWhite = false
    position_ = ""
    
    constructor(position, isWhite){
        this.isWhite = isWhite
        this.position_ = position instanceof Position ?
            position : new Position(position);
    }

    set position(val){
        if ( typeof val == "string" ){
            this.position_ = new Position(val)
        } else if ( val instanceof Position ) {
            this.position_ = val
        } else {
            throw new Error('bad argument sent position');
        }
    }

    get position(){
        return this.position_;
    }

    getImageSrc(){
        console.error(`[core.Piece] ${this.constructor.name} called base getImageSrc `);
    }

    getMoves(){
        if ( ! this.constructor.moves ) {
            console.error(`[core.Piece] ${this.constructor.name} must provide moves `);
        }
        return new MovePreprocessor(this, this.constructor.moves).getMoves();
    }
}