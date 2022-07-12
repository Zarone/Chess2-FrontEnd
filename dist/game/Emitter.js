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

export class Emitter {
    constructor () {
        this.listeners = {};
    }

    on (topic, listener) {
        if ( ! this.listeners['.' + topic] ) this.listeners['.' + topic] = [];
        this.listeners['.' + topic].push(listener);
    }

    emit (topic, ...args) {
        const crumbs = topic.split('.');

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
