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
        
        let crumbs;
        if (topic instanceof Event){
            if (topic.id != "state.whiteTimer" && topic.id != "state.blackTimer") {
                console.groupCollapsed("[Emit]", topic.id);
                console.log('[Args]', ...args);
                console.log('[Emitter]', topic.emitters.size == 0 ? "Root or ApiVersion < 1" : topic.emitters)
                console.groupEnd();
            }
            crumbs = topic.id.split('.');
        } else {
            debugger
            console.error(`Please use Event object for emit. You provided ${topic} of type ${typeof topic}.`)
            crumbs = topic.split('.')
        }

        let prefix = '';
        let outputs = {}
        while ( crumbs.length > 0 ) {
            
            let crumbOutput = []
            
            prefix += '.' + crumbs.shift();
            const listeners = this.listeners[prefix];
            if ( ! listeners || listeners.length < 1 ) continue;
            for ( const listener of listeners ) {
                let output = listener({ crumbs }, ...args);
                crumbOutput.push(output);
            }

            outputs[prefix] = crumbOutput;
        }

        return outputs;
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
