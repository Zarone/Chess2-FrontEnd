import { Bear } from "./Bear";
import { Elephant } from "./Elephant";
import { Fish } from "./Fish";
import { FishQueen } from "./FishQueen";
import { King } from "./King";
import { Monkey } from "./Monkey";
import { Queen } from "./Queen";
import { Rook } from "./Rook";

export class Pieces {
    static getClassFromID (name) {
        return {
            Bear: Bear,
            Fish: Fish,
            Elephant: Elephant,
            Monkey: Monkey,
            FishQueen: FishQueen,
            King: King,
            Queen: Queen,
            Rook: Rook,
        }[name];
    }
}