import { Emitter, SubEmitter } from "../../dist/game/Emitter.js";

import { Event, Events } from "./../../dist/game/Events"

import { PluginBase } from "../../dist/game/plugins/BasePlugin.js";

export class Game {

    elements: {[key: string]: HTMLElement}
    controllers: {};
    events: Emitter;
    state: {[key: string]: any};
    plugins: {[key: string]: PluginBase};

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

    setState (obj: { [key: string]: any }) {
        for ( const k in obj ) {
            this.set(k, obj[k]);
        }
    }

    set (k: string, v: any) {
        const joinTopicName = (...a: any) => a.join('.');
        const topicName = joinTopicName('state', k);

        if ( v && v.installEmitter && typeof v.installEmitter === 'function' ) {
            v.installEmitter(new SubEmitter(topicName, this.events));
        }

        this.state[k] = v;

        this.events.emit(new Event(topicName), v);
        
        // I just don't need this to log every frame
        if (k=="whiteTimer" || k=="blackTimer") return;

        console.log('going to emit', topicName, v)
    }

    get (k: string) {
        return this.state[k];
    }

    // Shortcuts for event emitter access
    on (...a: any) { return this.events.on(...a); }
    emit (...a: any) { return this.events.emit(...a); }
}

