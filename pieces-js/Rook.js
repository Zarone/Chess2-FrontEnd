import {Piece} from "./Piece.js"

export class Rook extends Piece {
    constructor(position, isWhite){
        super(position, isWhite);
    }

    getImageSrc(){
        if (this.isWhite){
            return "White Rook.png"
        } else {
            return "Black Rook.png"
        }
    }
}