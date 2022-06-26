import {Piece} from "./Piece.js"
import {getVerticalAndHorizontal, verticalAndHorizontalToID} from "../helper-js/utils.js"
import {noPiece, notSameType} from "../helper-js/conditions.js"

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

    getMoves(){
        let {vertical, horizontal} = getVerticalAndHorizontal(this.position)
            
        let output = []

        if (horizontal + 1 < 9) output.push( {pos: verticalAndHorizontalToID(vertical, horizontal+1), conditions: [noPiece]} )
        if (horizontal - 1 > 0) output.push( {pos: verticalAndHorizontalToID(vertical, horizontal-1), conditions: [noPiece]} )
        
        if (this.isWhite){
            if (vertical + 1 < 9) output.push( {pos: verticalAndHorizontalToID(vertical+1, horizontal), conditions: [noPiece]} )
            if (horizontal - 1 > 0 && vertical + 1 < 9) output.push( {pos: verticalAndHorizontalToID(vertical+1, horizontal-1), conditions: [notSameType]} )
            if (horizontal + 1 < 9 && vertical + 1 < 9) output.push( {pos: verticalAndHorizontalToID(vertical+1, horizontal+1), conditions: [notSameType]} )
        } else {
            if (vertical - 1 > 0) output.push( {pos: verticalAndHorizontalToID(vertical-1, horizontal), conditions: [noPiece]} )
            if (horizontal - 1 > 0 && vertical - 1 > 0) output.push( {pos: verticalAndHorizontalToID(vertical-1, horizontal-1), conditions: [notSameType]} )
            if (horizontal + 1 < 9 && vertical - 1 > 0) output.push( {pos: verticalAndHorizontalToID(vertical-1, horizontal+1), conditions: [notSameType]} )
        }

        

        return output
    }
}