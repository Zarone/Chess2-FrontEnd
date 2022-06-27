import {Piece} from "./Piece.js"
import {noPiece, rookActive, notSameType} from "../helper-js/conditions.js"
import {getVerticalAndHorizontal, toID} from "../helper-js/utils.js"

export class Rook extends Piece {
    constructor(position, isWhite){
        super(position, isWhite);
    }

    getImageSrc(){
        if (this.isWhite){
            return "White Rook.png"
        } else {
            return "Black Rook.png"
        }
    }

    getMoves(){
        let {vertical, horizontal} = getVerticalAndHorizontal(this.position)
            
        let output = []

        for (let i = 1; i < 9; i++){
            for (let j = 1; j < 9; j++){
                
                let id = toID[i]+(j);
                if (
                    (i == (horizontal+1) && j == vertical && (horizontal+1) < 9) || 
                    (i == (horizontal-1) && j == vertical && (horizontal-1) > 0) ||
                    (i == horizontal && j == (vertical+1) && (vertical+1) < 9) ||
                    (i == horizontal && j == (vertical-1) && (vertical-1) > 0)
                ){
                    output.push({pos: id, conditions: [notSameType, rookActive]})
                }
                output.push({pos: id, conditions: [noPiece]})
                

            }
        }

        return output
    }
}