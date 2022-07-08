export class Position {
    constructor (idOrCoords) {
        // Adapt from [y, x] to {vertical, horizontal}
        if ( Array.isArray(idOrCoords) ) {
            idOrCoords = {
                vertical: idOrCoords[0],
                horizontal: idOrCoords[1]
            };
        }

        // Allow initializing with either id or coords format
        if ( typeof idOrCoords === 'object' ) {
            this.coords_ = idOrCoords;
        } else if ( typeof idOrCoords === 'string' ) {
            this.id_ = idOrCoords;
        } else {
            throw new Error('failed to adapt constructor argument');
        }
    }

    get id() {
        if ( this.id_ !== undefined ) return this.id_;

        // Convert coords to id, also cache id value
        return this.id_ = Position.verticalAndHorizontalToID(
            this.coords_.vertical, this.coords_.horizontal
        );
    }

    set id(v) {
        this.id_ = v;
        // invalidate coords_ value; it must be recalculated
        this.coords_ = undefined;
    }

    get coords() {
        if ( this.coords_ !== undefined ) return this.coords_;

        // Convert id to coords, also cache coords value
        return this.coords_ = Position.getVerticalAndHorizontal(this.id_);
    }

    set coords(v) {
        this.coords_ = v;
        // invalidate id_ value; it must be recalculated
        this.id_ = undefined;
    }

    get column() {
        return this.id.split("")[0];
    }

    get row() {
        if ( this.id == 'TEMP' ) {
            throw new Error('Tried to get row number of "TEMP" position');
        }
        return this.id.substring(1);
    }

    isTemp() {
        return this.id == 'TEMP';
    }

    isJail() {
        return ['x', 'y'].includes(this.column);
    }

    // Defining toString allows this to be used as the index for boardLayout
    toString() {
        return this.id;
    }

    static toID = [
        null, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'
    ]

    static toNum = {
        'a': 1,
        'b': 2,
        'c': 3,
        'd': 4,
        'e': 5,
        'f': 6,
        'g': 7,
        'h': 8,
    }

    static getVerticalAndHorizontal(id) {
        if ( id instanceof Position ) return id.coords;

        let individualCoords = id.split("")
        let vertical = +individualCoords[1]
        let horizontal = Position.toNum[individualCoords[0]]
        return {vertical, horizontal}
    }

    static verticalAndHorizontalToID(vertical, horizontal) {
        return Position.toID[horizontal] + vertical
    }
}
