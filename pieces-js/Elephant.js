import {Piece} from "./Piece.js"

export class Elephant extends Piece {
    constructor(position, isWhite){
        super(position, isWhite);
    }

    getImageSrc(){
        if (this.isWhite){
            return "White Elephant.png"
        } else {
            return "Black Elephant.png"
        }
    }
}