import { FishQueen } from "./FishQueen.js";

export class Queen extends FishQueen {
    constructor(position, isWhite){
        super(position, isWhite);
    }

    getImageSrc(){
        if (this.isWhite){
            return "White Queen.png"
        } else {
            return "Black Queen.png"
        }
    }
}