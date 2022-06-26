import {Piece} from "./Piece.js"

export class Queen extends Piece {
    constructor(position, isWhite){
        super(position, isWhite);
    }

    getImageSrc(){
        if (this.isWhite){
            return "White Queen.png"
        } else {
            return "Black Queen.png"
        }
    }
}