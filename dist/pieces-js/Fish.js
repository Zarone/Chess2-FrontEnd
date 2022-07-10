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

    static moves = [
        // sideways
        { type: 'place', pos: [ 0, -1], conditions: [noPiece] },
        { type: 'place', pos: [ 0,  1], conditions: [noPiece] },
        // forward
        { type: 'place', pos: [ 1,  0], conditions: [noPiece] },
        // forward + attack
        { type: 'place', pos: [ 1, -1], conditions: [notSameType] },
        { type: 'place', pos: [ 1,  1], conditions: [notSameType] },
    ]
}