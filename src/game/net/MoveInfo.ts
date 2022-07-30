import { Position } from "../../../dist/helper-js/board";
import { PowerClass } from "../../helper-js/PowerClass";

interface MoveInfoData {
    toPos: Position;
    fromPos: Position; 
    newTurn: string;
    [other: string]: any;
}

// Represents move information that can be sent over sockets
export class MoveInfo extends PowerClass {
    [x: string]: any;
    static initializer = PowerClass.PARAMETRIC_INITIALIZER;

    serialize (): MoveInfoData {
        console.log("[Serializing Move]", this)
        return {
            ...<MoveInfoData><unknown>this,
            toPos: this.toPos?.id || this.toPos,
            fromPos: this.fromPos?.id || this.fromPos,
        };
    }

    static deserialize (data: MoveInfoData) {
        data = {
            ...data,
            toPos: new Position(data.toPos),
            fromPos: new Position(data.fromPos)
        };
        return this.create(data);
    }
}
