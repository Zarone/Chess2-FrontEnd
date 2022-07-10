import { noDiagonalBlocking, notSameType, noStraightBlocking } from "../helper-js/conditions.js";
import {getVerticalAndHorizontal, verticalAndHorizontalToID} from "../helper-js/utils.js"
import {Piece} from "./Piece.js"

export class FishQueen extends Piece {
    constructor(position, isWhite){
        super(position, isWhite);
    }

    getImageSrc(){
        if (this.isWhite){
            return "White Fish Queen.png"
        } else {
            return "Black Fish Queen.png"
        }
    }

    getMoves(){
        let {vertical, horizontal} = getVerticalAndHorizontal(this.position)
            
        let output = []

        for (let i = 1; i < 8; i++){
            if (vertical + i < 9){
                output.push( 
                    {pos: verticalAndHorizontalToID(vertical+i, horizontal), conditions: [
                        notSameType, noStraightBlocking
                    ]} 
                )
            }
            if (vertical - i > 0) {
                output.push(
                    {pos: verticalAndHorizontalToID(vertical-i, horizontal), conditions: [
                        notSameType, noStraightBlocking
                    ]}
                )
            }
            if (horizontal + i < 9) {
                output.push(
                    {pos: verticalAndHorizontalToID(vertical, horizontal+i), conditions: [
                        notSameType, noStraightBlocking
                    ]} 
                )
            }
            if (horizontal - i > 0) {   
                output.push(
                    {pos: verticalAndHorizontalToID(vertical, horizontal-i), conditions: [
                        notSameType, noStraightBlocking
                    ]} 
                )
            }
            
            if (horizontal - i > 0 && vertical - i > 0) {
                output.push(
                    {pos: verticalAndHorizontalToID(vertical-i, horizontal-i), conditions: [
                        notSameType, noDiagonalBlocking
                    ]}
                )
            }
            if (horizontal - i > 0 && vertical + i < 9) {
                output.push(
                    {pos: verticalAndHorizontalToID(vertical+i, horizontal-i), conditions: [
                        notSameType, noDiagonalBlocking
                    ]} 
                )
            }
            if (horizontal + i < 9 && vertical - i > 0) {
                output.push(
                    {pos: verticalAndHorizontalToID(vertical-i, horizontal+i), conditions: [
                        notSameType, noDiagonalBlocking
                    ]}
                )
            }
            if (horizontal + i < 9 && vertical + i < 9) {
                output.push( 
                    {pos: verticalAndHorizontalToID(vertical+i, horizontal+i), conditions: [
                        notSameType, noDiagonalBlocking
                    ]}
                )
            }
        }

        return output
    }
}