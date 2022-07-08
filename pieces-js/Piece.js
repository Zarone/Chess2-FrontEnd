import { Position } from "../helper-js/board.js"

export class Piece {
    
    isWhite = false
    position = ""
    
    constructor(position, isWhite){
        this.isWhite = isWhite
        this.position = position instanceof Position ?
            position : new Position(position);
    }

    getImageSrc(){
        console.error("called Piece getImageSrc")
    }

    getMoves(){
        console.error("called piece getMoves")
        return []
    }
}