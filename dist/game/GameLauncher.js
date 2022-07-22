import { Cookie } from "../helper-js/cookieManager.js";
import { getQuerystring } from "../helper-js/utils.js"
import { Game } from "./Game.js";

import { Events } from "./Events"
export class GameLauncher {
    constructor (config) {
        this.config = config;
    }
    init () {
        if ( ! this.game ) this.game = new Game();
        if ( this.config.debug ) globalThis.game = this.game;

        // default values
        this.game.setState({
            currentTurn: 'Not Started',
            reversed: false,
        });

        let {roomID, friendRoom, timeLimit} = getQuerystring()
        this.game.setState({ roomID, friendRoom, timeLimit });
        this.game.setState({ cookie: globalThis.cookie, playerID: parseInt(globalThis.cookie.pid) });
        
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
        this.game.events.emit(Events.init.plugin.PRE_INSTALL_HOOK, plugin);

        // TODO: Move this install step to a Plugin base class
        this.game.plugins[plugin.constructor.name] = plugin;

        plugin.install(this.game);
        this.game.events.emit(Events.init.plugin.POST_INSTALL_HOOK, plugin);
    }
    launch() {
        this.game.launch();
    }
}
