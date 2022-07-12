import { Emitter } from "./Emitter.js";
export class Game {
    constructor () {

        // identifiers to literal DOM elements
        this.elements = {};
        // identifiers to arbitrary instances
        this.controllers = {};

        this.events = new Emitter();

        this.state = {};
    }
    launch () {
        this.events.emit('launch');
    }

    setState (obj) {
        for ( const k in obj ) {
            this.set(k, obj);
        }
    }

    set (k, v) {
        this.state[k] = v;
        const joinTopicName = (...a) => a.join('.');
        this.events.emit(joinTopicName('state', k), v);
        console.log('going to emit', joinTopicName('state', k), v)
    }
}