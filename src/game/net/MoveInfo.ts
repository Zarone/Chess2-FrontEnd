import { Position } from "../../../dist/helper-js/board";
import { PowerClass } from "../../helper-js/PowerClass";

// Represents move information that can be sent over sockets
export class MoveInfo extends PowerClass {
    [x: string]: any;
    static initializer = PowerClass.PARAMETRIC_INITIALIZER;

    serialize () {
        console.log("[Serializing Move]", this)
        return {
            ...this,
            toPos: this.toPos?.id || this.toPos,
            fromPos: this.fromPos?.id || this.fromPos,
        };
    }

    static deserialize (data: {toPos: Position, fromPos: Position, newTurn: string}) {
        data = {
            ...data,
            toPos: new Position(data.toPos),
            fromPos: new Position(data.fromPos)
        };
        return this.create(data);
    }
}
