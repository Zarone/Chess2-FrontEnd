export class Piece {
    
    isWhite = false
    position = ""
    
    constructor(position, isWhite){
        this.isWhite = isWhite
        this.position = position
    }

    getImageSrc(){
        console.error("called Piece getImageSrc")
    }

    getMoves(){
        console.error("called piece getMoves")
        return []
    }
}