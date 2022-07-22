import {Event} from "../Events"

export class PluginBase {
    install(game){
        this.game = game;
    }

    on (topic, ...args) {
        if (!this.game) {
            console.error("Error in topic", topic)
            throw new Error("Game not provided in plugin")
        }
        if (!(topic instanceof Event)){
            console.error(`Please use Event object for emit. You provided ${topic} of type ${typeof topic}.`)
        } else {
            topic.listeners.add(this.constructor.name)
        }

        if ( this.constructor.apiVersion >= 1 ) {
            if ( ! this.constructor.receives.includes(topic) ) {
                throw new Error(`Received undeclared topic: ${topic} in ` +
                    this.constructor.name);
            }
        }

        return this.game.events.on(topic, ...args); 
    }
    emit (topic, ...args) {
        if (!this.game) {
            console.error("Error in topic", topic)
            throw new Error("Game not provided in plugin")
        }
        if (!(topic instanceof Event)){
            console.error(`Please use Event object for emit. You provided ${topic} of type ${typeof topic}.`)
        } else {
            topic.emitters.add(this.constructor.name)
        }

        if ( this.constructor.apiVersion >= 1 ) {
            if ( ! this.constructor.broadcasts.includes(topic) ) {
                throw new Error(`Broadcasted undeclared topic: ${topic} in ` +
                    this.constructor.name);
            }
        }

        return this.game.events.emit(topic, ...args); 
    }
}