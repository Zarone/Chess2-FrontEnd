import {Piece} from "./Piece.js"

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
        return [ 
            {pos: "a1", conditions: []}, 
            {pos: "b1", conditions: []}, 
            {pos: "e1", conditions: []}, 
            {pos: "x1", conditions: []}, 
            {pos: "x2", conditions: []}, 
            {pos: "y1", conditions: []}, 
            {pos: "y2", conditions: []} 
        ] 
    }
}