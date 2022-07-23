/**
 * PowerClass by EricDubé
 * Copyright (c) 2022 Chess2-FrontEnd Contributors. All rights reserved.
 * 
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

const __MAGIC_CREATE = {};

export class PowerClass {
    constructor (__expected_magic_create, args) {
        if ( __expected_magic_create !== __MAGIC_CREATE ) {
            const name = this.constructor.name;
            throw new Error(
                `Create ${name} using "${name}.create()" instead of "new ${name}()"`);
        }

        this.constructor.initializer(this, ...args);
    }

    static create (...args) {
        const o = new this(__MAGIC_CREATE, args);

        return this.handler ? new Proxy(o, this.handler) : o;
    }

    static DATA_PROPERTY_INITIALIZER = (obj, data) => {
        obj.data = data;
    }

    static PARAMETRIC_INITIALIZER = (obj, ...objects) => {
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
