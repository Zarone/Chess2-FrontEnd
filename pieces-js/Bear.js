import {Piece} from "./Piece.js"

export class Bear extends Piece {
    constructor(position, isWhite){
        super(position, isWhite);
    }

    getImageSrc(){
        return "Gray Bear.png"
    }
}