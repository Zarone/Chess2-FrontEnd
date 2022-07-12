import { AccessorUtil } from "../helper-js/accessors.js";
import { Cookie } from "../helper-js/cookieManager.js";
import { getQuerystring } from "../helper-js/utils.js"
import { Emitter } from "./Emitter.js";
import { Game } from "./Game.js";
export class GameLauncher {
    constructor (config) {
        this.config = config;
    }
    init () {
        if ( ! this.game ) this.game = new Game();
        if ( this.config.debug ) globalThis.game = this.game;

        // default values
        this.game.setState({
            currentTurn: 'Not Started'
        });

        let {roomID, friendRoom, timeLimit} = getQuerystring()
        this.game.setState({ roomID, friendRoom, timeLimit });
        let cookie = new Cookie();
        this.game.setState({ cookie, playerID: parseInt(cookie.pid) });
        
        // // Bind properties
        // ;[
        //     { name: 'turnText', accessor: { $: 'ElementInnerTextAccessor', id: 'turn' } },
        //     { name: 'modalTitle', accessor: { $: 'ElementInnerTextAccessor', id:'modal-heading' } },
        //     { name: 'roomID', accessor: { $: 'ElementInnerTextAccessor', id:'roomID' } },
        // ].forEach(o => {
        //     AccessorUtil.installProperty(this, o);
        // })
    }
    install (plugin) {
        this.game.events.emit('init.plugin.preInstallHook', plugin);
        plugin.install(this.game);
        this.game.events.emit('init.plugin.postInstallHook', plugin);
    }
    launch() {
        this.game.launch();
    }
}
