import { Position } from "../../helper-js/board";
import { PowerClass } from "../../helper-js/PowerClass";

// Represents move information that can be sent over sockets
export class MoveInfo extends PowerClass {
    static initializer = PowerClass.PARAMETRIC_INITIALIZER;

    serialize () {
        return {
            ...this,
            toPos: this.toPos?.id || this.toPos,
            fromPos: this.fromPos?.id || this.fromPos,
        };
    }

    static deserialize (data) {
        data = {
            ...data,
            toPos: new Position(data.toPos),
            fromPos: new Position(data.fromPos)
        };
        return this.create(data);
    }
}
