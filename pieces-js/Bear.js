import {Piece} from "./Piece.js"
import {getVerticalAndHorizontal, verticalAndHorizontalToID} from "../helper-js/utils.js"
import {noPiece} from "../helper-js/conditions.js"

export class Bear extends Piece {
    constructor(position){
        super(position, null);
    }

    getImageSrc(){
        return "Gray Bear.png"
    }

    getMoves(){
        if (this.position == "z1"){
            return [ 
                {pos: "d4", conditions:[noPiece]}, 
                {pos: "e4", conditions:[noPiece]}, 
                {pos: "d5", conditions:[noPiece]} ,
                {pos: "e5", conditions:[noPiece]}, 
            ]
        } else {
            let {vertical, horizontal} = getVerticalAndHorizontal(this.position)
            
            let output = []

            if (vertical + 1 < 9) output.push( {pos: verticalAndHorizontalToID(vertical+1, horizontal), conditions: [noPiece]} )
            if (vertical - 1 > 0) output.push( {pos: verticalAndHorizontalToID(vertical-1, horizontal), conditions: [noPiece]} )
            if (horizontal + 1 < 9) output.push( {pos: verticalAndHorizontalToID(vertical, horizontal+1), conditions: [noPiece]} )
            if (horizontal - 1 > 0) output.push( {pos: verticalAndHorizontalToID(vertical, horizontal-1), conditions: [noPiece]} )
            
            if (horizontal - 1 > 0 && vertical - 1 > 0) output.push( {pos: verticalAndHorizontalToID(vertical-1, horizontal-1), conditions: [noPiece]} )
            if (horizontal - 1 > 0 && vertical + 1 < 9) output.push( {pos: verticalAndHorizontalToID(vertical+1, horizontal-1), conditions: [noPiece]} )
            if (horizontal + 1 < 9 && vertical - 1 > 0) output.push( {pos: verticalAndHorizontalToID(vertical-1, horizontal+1), conditions: [noPiece]} )
            if (horizontal + 1 < 9 && vertical + 1 < 9) output.push( {pos: verticalAndHorizontalToID(vertical+1, horizontal+1), conditions: [noPiece]} )
            
            return output
        }
    }
}