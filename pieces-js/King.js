import {Piece} from "./Piece.js"

export class King extends Piece {

    hasBanana = true;

    constructor(position, isWhite){
        super(position, isWhite);
    }

    getImageSrc(){
        if (this.hasBanana) {
            if (this.isWhite){
                return "White King Banana.png"
            } else {
                return "Black King Banana.png"
            }
        } else {
            if (this.isWhite){
                return "White King.png"
            } else {
                return "Black King.png"
            }
        }
    }
}