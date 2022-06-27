import {Piece} from "./Piece.js"
import { getVerticalAndHorizontal, verticalAndHorizontalToID } from "../helper-js/utils.js";
import { canMonkeyJump, notSameType, noPiece } from "../helper-js/conditions.js";

export class Monkey extends Piece {
    constructor(position, isWhite){
        super(position, isWhite);
    }

    getImageSrc(){
        if (this.isWhite){
            return "White Monkey.png"
        } else {
            return "Black Monkey.png"
        }
    }

    getMoves(){
        let {vertical, horizontal} = getVerticalAndHorizontal(this.position)
            
        let output = []
        for (let i = 0; i < 4; i++){
            for (let j = 0; j < 4; j++){
                
                if (i == 0 && j == 0) continue;
                
                if ((vertical + i*2) < 9 && (horizontal + j*2) < 9){
                    output.push(
                        {
                            pos: verticalAndHorizontalToID(vertical+i*2, horizontal+j*2), 
                            conditions: [notSameType, canMonkeyJump]
                        }
                    )
                }

                if ((vertical - i*2) > 0 && (horizontal - j*2) > 0){
                    output.push(
                        {
                            pos: verticalAndHorizontalToID(vertical-i*2, horizontal-j*2), 
                            conditions: [notSameType, canMonkeyJump]
                        }
                    )
                }

                if ((vertical + i*2) < 9 && (horizontal - j*2) > 0){
                    output.push(
                        {
                            pos: verticalAndHorizontalToID(vertical+i*2, horizontal-j*2), 
                            conditions: [notSameType, canMonkeyJump]
                        }
                    )
                }

                if ((vertical - i*2) > 0 && (horizontal + j*2) < 9){
                    output.push(
                        {
                            pos: verticalAndHorizontalToID(vertical-i*2, horizontal+j*2), 
                            conditions: [notSameType, canMonkeyJump]
                        }
                    )
                }
            }
        }

        if ((vertical + 1) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical+1, horizontal), 
                    conditions: [noPiece]
                }
            )
        }
        if ((horizontal + 1) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical, horizontal+1), 
                    conditions: [noPiece]
                }
            )
        }
        if ((vertical - 1) > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical-1, horizontal), 
                    conditions: [noPiece]
                }
            )
        }
        if ((horizontal - 1) > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical, horizontal-1), 
                    conditions: [noPiece]
                }
            )
        }


        if ((vertical + 1) < 9 && (horizontal + 1) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical+1, horizontal+1), 
                    conditions: [noPiece]
                }
            )
        }

        if ((vertical - 1) > 0 && (horizontal - 1) > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical-1, horizontal-1), 
                    conditions: [noPiece]
                }
            )
        }

        if ((vertical + 1) < 9 && (horizontal - 1) > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical+1, horizontal-1), 
                    conditions: [noPiece]
                }
            )
        }

        if ((vertical - 1) > 0 && (horizontal + 1) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical-1, horizontal+1), 
                    conditions: [noPiece]
                }
            )
        }

        return output
    }
}