import {Piece} from "./Piece.js"

export class Bear extends Piece {
    constructor(position){
        super(position, undefined);
    }

    getImageSrc(){
        return "Gray Bear.png"
    }
}