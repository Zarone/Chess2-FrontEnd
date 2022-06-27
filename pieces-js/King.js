import {Piece} from "./Piece.js"
import { getVerticalAndHorizontal, verticalAndHorizontalToID } from "../helper-js/utils.js";
import { notSameType } from "../helper-js/conditions.js";

export class King extends Piece {

    hasBanana = true;

    constructor(position, isWhite){
        super(position, isWhite);
    }

    getImageSrc(){
        if (this.hasBanana) {
            if (this.isWhite){
                return "White King Banana.png"
            } else {
                return "Black King Banana.png"
            }
        } else {
            if (this.isWhite){
                return "White King.png"
            } else {
                return "Black King.png"
            }
        }
    }

    getMoves(){
        let {vertical, horizontal} = getVerticalAndHorizontal(this.position)
            
        let output = []
        if ((vertical + 1) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical+1, horizontal), 
                    conditions: [notSameType]
                }
            )
        }
        if ((horizontal + 1) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical, horizontal+1), 
                    conditions: [notSameType]
                }
            )
        }
        if ((vertical - 1) > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical-1, horizontal), 
                    conditions: [notSameType]
                }
            )
        }
        if ((horizontal - 1) > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical, horizontal-1), 
                    conditions: [notSameType]
                }
            )
        }


        if ((vertical + 1) < 9 && (horizontal + 1) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical+1, horizontal+1), 
                    conditions: [notSameType]
                }
            )
        }

        if ((vertical - 1) > 0 && (horizontal - 1) > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical-1, horizontal-1), 
                    conditions: [notSameType]
                }
            )
        }

        if ((vertical + 1) < 9 && (horizontal - 1) > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical+1, horizontal-1), 
                    conditions: [notSameType]
                }
            )
        }

        if ((vertical - 1) > 0 && (horizontal + 1) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical-1, horizontal+1), 
                    conditions: [notSameType]
                }
            )
        }
        return output
    }
}