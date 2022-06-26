import {Piece} from "./Piece.js"

export class FishQueen extends Piece {
    constructor(position, isWhite){
        super(position, isWhite);
    }

    getImageSrc(){
        if (this.isWhite){
            return "White Fish Queen.png"
        } else {
            return "Black Fish Queen.png"
        }
    }
}