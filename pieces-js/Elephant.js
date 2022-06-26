import {Piece} from "./Piece.js"
import { getVerticalAndHorizontal, verticalAndHorizontalToID } from "../helper-js/utils.js";
import { noDiagonalBlocking, notSameType } from "../helper-js/conditions.js";

export class Elephant extends Piece {
    constructor(position, isWhite){
        super(position, isWhite);
    }

    getImageSrc(){
        if (this.isWhite){
            return "White Elephant.png"
        } else {
            return "Black Elephant.png"
        }
    }

    getMoves(){

        let {vertical, horizontal} = getVerticalAndHorizontal(this.position)
        
        let output = []

        if (vertical + 2 < 9 && horizontal + 2 < 9) output.push( 
            {pos: verticalAndHorizontalToID(vertical+2, horizontal+2), conditions: [noDiagonalBlocking, notSameType]} 
        )
        if (vertical + 2 < 9 && horizontal - 2 > 0) output.push( 
            {pos: verticalAndHorizontalToID(vertical+2, horizontal-2), conditions: [noDiagonalBlocking, notSameType]} 
        )
        if (vertical - 2 > 0 && horizontal + 2 < 9) output.push( 
            {pos: verticalAndHorizontalToID(vertical-2, horizontal+2), conditions: [noDiagonalBlocking, notSameType]} 
        )
        if (vertical - 2 > 0 && horizontal - 2 > 0) output.push( 
            {pos: verticalAndHorizontalToID(vertical-2, horizontal-2), conditions: [noDiagonalBlocking, notSameType]} 
        )
        
        return output
    }
}