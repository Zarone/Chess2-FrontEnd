import {Piece} from "./Piece.js"
import { getVerticalAndHorizontal, verticalAndHorizontalToID } from "../helper-js/utils.js";
import { canMonkeyJump, notSameType, noPiece, canMonkeyPrisonJump } from "../helper-js/conditions.js";

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

        if (this.isWhite){
            if (vertical % 2 == 0 && horizontal % 2 == 1) output.push({pos: "x1", conditions: [canMonkeyPrisonJump]})
            if (vertical % 2 == 1 && horizontal % 2 == 1) output.push({pos: "x2", conditions: [canMonkeyPrisonJump]})
        } else {
            if (vertical % 2 == 0 && horizontal % 2 == 0) output.push({pos: "y1", conditions: [canMonkeyPrisonJump]})
            if (vertical % 2 == 1 && horizontal % 2 == 0) output.push({pos: "y2", conditions: [canMonkeyPrisonJump]})
        }

        return output
    }

    getJumpingMoves(){
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

        return output
    }
}