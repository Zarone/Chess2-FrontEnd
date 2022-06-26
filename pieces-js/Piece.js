export class Piece {
    
    isWhite = false
    position = ""
    
    constructor(position, isWhite){
        this.isWhite = isWhite
        this.position = position
        console.log("called Piece constructor")
    }

    getImageSrc(){
        console.log("called Piece getImageSrc")
    }
}