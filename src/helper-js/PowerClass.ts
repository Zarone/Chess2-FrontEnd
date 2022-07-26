/**
 * PowerClass by EricDubé
 * Copyright (c) 2022 Chess2-FrontEnd Contributors. All rights reserved.
 * 
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

const __MAGIC_CREATE = {};

interface PowerClassConstructor {
    new (__expected_magic_create: {}, args: any): PowerClass;
    initializer: Function;
}

export class PowerClass {

    static initializer: Function; 
    static handler: {get: (...any: any)=>any}

    init: Function;

    constructor (__expected_magic_create: {}, args: any) {
        if ( __expected_magic_create !== __MAGIC_CREATE ) {
            const name = this.constructor.name;
            throw new Error(
                `Create ${name} using "${name}.create()" instead of "new ${name}()"`);
        }

        (this.constructor as PowerClassConstructor).initializer(this, ...args);
        console.log("this", JSON.stringify(this))
        if ( this.init && typeof this.init === 'function' ) this.init();
 
    }

    static create (...args: any) {
        console.log("[Power Class] Create", args)
        const o = new this(__MAGIC_CREATE, args);
        console.log("[Power Class] Created", JSON.stringify(o))

        return this.handler ? new Proxy(o,
            PowerClass.wrapHandler(this.handler)) : o;
    }

    static wrapHandler (handler: {get: (...any: any)=>any}) {
        const wHandler = { ...handler };
        wHandler.get = function get (...args: any) {
            let key: string = args[0];
            let target = args[1];

            if ( key === '_unproxied' ) return target;
            return handler.get(...args);
        }
        return wHandler;
    }

    static DATA_PROPERTY_INITIALIZER = (obj: {data: any}, data: any) => {
        obj.data = data;
    }

    static PARAMETRIC_INITIALIZER = (obj: any, ...objects: [args: any]) => {
        for ( const fields of objects ) {
            if ( typeof fields != 'object' ) {
                throw new Error('parametric class needs object constructor args');
            }
            for ( const k in fields ) {
                obj[k] = fields[k];
            }
        }
    }
}