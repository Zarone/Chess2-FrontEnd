/**
 * Simple Custom Emitter
 * 
 * How to use:
 *   const emitter = new Emitter();
 *   emitter.on('a.b.c', (x, ...args) => { console.log('ev', x, args) });
 * 
 *   emitter.emit('a.b.c', 'hello'); // outputs: 'ev' { crumbs: [] } ['hello']
 *   emitter.emit('a.b', 'hello');   // outputs nothing - doesn't match 'a.b.c'
 *   emitter.emit('a.b.c.d', 'hi!'); // outputs: 'ev' { crumbs: 'd' } ['hi!']
 */

import {Event} from "./Events"

export class Emitter {
    constructor () {
        this.listeners = {};
    }

    on (topic, listener) {

        let topicStr;
        if (topic instanceof Event){
            topicStr = '.' + topic.id;
        } else {
            debugger
            console.error(`Please use Event object for emit. You provided ${topic} of type ${typeof topic}.`)
            topicStr = '.' + topic;
        }

        if ( ! this.listeners[topicStr] ) this.listeners[topicStr] = [];
        this.listeners[topicStr].push(listener);
    }

    emit (topic, ...args) {
        // console.log('[Emitter]', topic.id, ...args);

        let crumbs;
        if (topic instanceof Event){
            crumbs = topic.id.split('.');
        } else {
            debugger
            console.error(`Please use Event object for emit. You provided ${topic} of type ${typeof topic}.`)
            crumbs = topic.split('.')
        }

        let prefix = '';
        while ( crumbs.length > 0 ) {
            prefix += '.' + crumbs.shift();
            const listeners = this.listeners[prefix];
            if ( ! listeners || listeners.length < 1 ) continue;
            for ( const listener of listeners ) {
                listener({ crumbs }, ...args);
            }
        }
    }
}

export class SubEmitter {
    constructor (prefix, delegate) {
        this.prefix = prefix;
        this.delegate = delegate;
    }

    on(topic, ...a) {
        return this.delegate.on(Event.create(this.prefix + '.' + topic), ...a);
    }

    emit(topic, ...a) {
        return this.delegate.emit(Event.create(this.prefix + '.' + topic), ...a);
    }
}
