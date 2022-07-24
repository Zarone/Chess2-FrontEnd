// TODO: move Position class into this folder as well

export class Turn {
    constructor (turnString) {
        const parts = turnString.split(' ');
        this.player = parts[0];
        if ( parts.length > 1 ) {
            this.state = parts.slice(1).join(' ');
        }
    }

    toString () {
        return this.player + ' ' + this.state;
    }

    is (predicate) {
        return predicate(this);
    }

    static adapt (o) {
        if ( typeof o === 'string' ) return new this(o);
        if ( o instanceof this ) return o;
        console.error(`Cannot adapt to ${this.name}: `, o)
        throw new Error(
            `Cannot adapt to ${this.name}`);
    }
}
