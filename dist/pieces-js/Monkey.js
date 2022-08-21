import {Piece} from "./Piece.js"
import { getVerticalAndHorizontal, verticalAndHorizontalToID } from "../helper-js/utils.js";
import { canMonkeyPrisonJump, notSameType, noPiece, sameMonkeyTurn, straightBlocking, diagonalBlocking, nonInitMonkeyJump } from "../helper-js/conditions.js";

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
        if ((vertical + 2) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical+2, horizontal), 
                    conditions: [notSameType, straightBlocking]
                }
            )
        }

        if ((vertical - 2) > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical-2, horizontal), 
                    conditions: [notSameType, straightBlocking]
                }
            )
        }

        if ((horizontal + 2) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical, horizontal+2), 
                    conditions: [notSameType, straightBlocking]
                }
            )
        }

        if ((horizontal - 2) > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical, horizontal-2), 
                    conditions: [notSameType, straightBlocking]
                }
            )
        }

        if ((vertical - 2) > 0 && (horizontal + 2) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical-2, horizontal+2), 
                    conditions: [notSameType, diagonalBlocking]
                }
            )
        }

        if ((vertical + 2) < 9 && (horizontal + 2) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical + 2, horizontal + 2), 
                    conditions: [notSameType, diagonalBlocking]
                }
            )
        }

        if ((vertical + 2) < 9 && (horizontal - 2) > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical+2, horizontal-2), 
                    conditions: [notSameType, diagonalBlocking]
                }
            )
        }

        if ((vertical - 2) > 0 && (horizontal - 2)  > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical-2, horizontal-2), 
                    conditions: [notSameType, diagonalBlocking]
                }
            )
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
            if (this.position == "a4") { output.push({pos: "x1", conditions: [canMonkeyPrisonJump]}) }
            if (this.position == "a5") { output.push({pos: "x2", conditions: [canMonkeyPrisonJump]}) }
            // if (vertical % 2 == 0 && horizontal % 2 == 1) output.push({pos: "x1", conditions: [canMonkeyPrisonJump]})
            // if (vertical % 2 == 1 && horizontal % 2 == 1) output.push({pos: "x2", conditions: [canMonkeyPrisonJump]})
        } else {
            if (this.position == "h4") { output.push({pos: "y1", conditions: [canMonkeyPrisonJump]}) }
            if (this.position == "h5") { output.push({pos: "y2", conditions: [canMonkeyPrisonJump]}) }
            // if (vertical % 2 == 0 && horizontal % 2 == 0) output.push({pos: "y1", conditions: [canMonkeyPrisonJump]})
            // if (vertical % 2 == 1 && horizontal % 2 == 0) output.push({pos: "y2", conditions: [canMonkeyPrisonJump]})
        }


        return output
    }

    getJumpingMoves(){
        let {vertical, horizontal} = getVerticalAndHorizontal(this.position)
            
        let output = []

        output.push({
            pos: this.position.id,
            conditions: [sameMonkeyTurn]
        })
        
        if ((vertical + 2) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical+2, horizontal), 
                    conditions: [notSameType, straightBlocking, nonInitMonkeyJump]
                }
            )
        }

        if ((vertical - 2) > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical-2, horizontal), 
                    conditions: [notSameType, straightBlocking, nonInitMonkeyJump]
                }
            )
        }

        if ((horizontal + 2) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical, horizontal+2), 
                    conditions: [notSameType, straightBlocking, nonInitMonkeyJump]
                }
            )
        }

        if ((horizontal - 2) > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical, horizontal-2), 
                    conditions: [notSameType, straightBlocking, nonInitMonkeyJump]
                }
            )
        }

        if ((vertical - 2) > 0 && (horizontal + 2) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical-2, horizontal+2), 
                    conditions: [notSameType, diagonalBlocking, nonInitMonkeyJump]
                }
            )
        }

        if ((vertical + 2) < 9 && (horizontal + 2) < 9){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical + 2, horizontal + 2), 
                    conditions: [notSameType, diagonalBlocking, nonInitMonkeyJump]
                }
            )
        }

        if ((vertical + 2) < 9 && (horizontal - 2) > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical+2, horizontal-2), 
                    conditions: [notSameType, diagonalBlocking, nonInitMonkeyJump]
                }
            )
        }

        if ((vertical - 2) > 0 && (horizontal - 2)  > 0){
            output.push(
                {
                    pos: verticalAndHorizontalToID(vertical-2, horizontal-2), 
                    conditions: [notSameType, diagonalBlocking, nonInitMonkeyJump]
                }
            )
        }

        if (this.isWhite){
            if (this.position == "a4") { output.push({pos: "x1", conditions: [canMonkeyPrisonJump]}) }
            if (this.position == "a5") { output.push({pos: "x2", conditions: [canMonkeyPrisonJump]}) }
            // if (vertical % 2 == 0 && horizontal % 2 == 1) output.push({pos: "x1", conditions: [canMonkeyPrisonJump]})
            // if (vertical % 2 == 1 && horizontal % 2 == 1) output.push({pos: "x2", conditions: [canMonkeyPrisonJump]})
        } else {
            if (this.position == "h4") { output.push({pos: "y1", conditions: [canMonkeyPrisonJump]}) }
            if (this.position == "h5") { output.push({pos: "y2", conditions: [canMonkeyPrisonJump]}) }
            // if (vertical % 2 == 0 && horizontal % 2 == 0) output.push({pos: "y1", conditions: [canMonkeyPrisonJump]})
            // if (vertical % 2 == 1 && horizontal % 2 == 0) output.push({pos: "y2", conditions: [canMonkeyPrisonJump]})
        }

        return output
    }
}