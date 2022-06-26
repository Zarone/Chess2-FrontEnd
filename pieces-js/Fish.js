import {Piece} from "./Piece.js"

export class Fish extends Piece {
    constructor(position, isWhite){
        super(position, isWhite);
    }

    getImageSrc(){
        if (this.isWhite){
            return "White Fish.png"
        } else {
            return "Black Fish.png"
        }
    }
}