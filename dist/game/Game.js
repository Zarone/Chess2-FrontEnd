import { Emitter } from "./Emitter.js";

import { Event, Events } from "./Events"

export class Game {
    constructor () {

        // identifiers to literal DOM elements
        this.elements = {};
        // identifiers to arbitrary instances
        this.controllers = {};

        this.events = new Emitter();

        this.state = {};

        this.plugins = {};
    }
    launch () {
        this.events.emit(Events.LAUNCH);
    }

    setState (obj) {
        for ( const k in obj ) {
            this.set(k, obj[k]);
        }
    }

    set (k, v) {
        this.state[k] = v;
        const joinTopicName = (...a) => a.join('.');
        this.events.emit(new Event(joinTopicName('state', k)), v);
        
        // I just don't need this to log every frame
        if (k=="whiteTimer" || k=="blackTimer") return;

        console.log('going to emit', joinTopicName('state', k), v)
    }

    get (k) {
        return this.state[k];
    }

    // Shortcuts for event emitter access
    on (...a) { return this.events.on(...a); }
    emit (...a) { return this.events.emit(...a); }
}
