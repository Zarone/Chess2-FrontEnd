import {Piece} from "./Piece.js"

export class Monkey extends Piece {
    constructor(position, isWhite){
        super(position, isWhite);
    }

    getImageSrc(){
        if (this.isWhite){
            return "White Monkey.png"
        } else {
            return "Black Monkey.png"
        }
    }
}