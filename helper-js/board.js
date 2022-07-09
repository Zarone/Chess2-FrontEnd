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

    isWithinBounds() {
        // TEMP has no row position, so just return true
        if ( this.isTemp() ) return true;

        // only valid 'z' position is 'z1'
        if ( this.column == 'z' ) return this.row == 1;

        // For jail row must be 1 or 2
        if ( this.isJail() ) return this.row == 1 || this.row == 2;
        
        // If this code is reached the piece must be on the board
        const { vertical, horizontal } = this.coords;
        if ( vertical < 1 || vertical > 8 ) return false;
        if ( horizontal < 1 || horizontal > 8 ) return false;
        return true;
    }

    // Defining toString allows this to be used as the index for boardLayout
    toString() {
        return this.id;
    }

    // Adds an array of [vertical, horizontal] (called "vector") to this
    // position, returning a new position as the result.
    plus (vector) {
        const coords = this.coords;
        return new Position({
            vertical: coords.vertical + vector[0],
            horizontal: coords.horizontal + vector[1]
        });
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
        // if toID returns undefined, you still need a character
        // or else id.split just crashes
        return (Position.toID[horizontal] || "!") + vertical
    }

    
}
