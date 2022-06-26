export class Piece {
    
    isWhite = false
    position = ""
    
    constructor(position, isWhite){
        this.isWhite = isWhite
        this.position = position
    }

    getImageSrc(){
        console.log("called Piece getImageSrc")
    }
}