export class Event {
    constructor(id, temp=false){
        if (!temp){
            this.listeners = new Set();
            this.emitters = new Set();
        }
        this.id = id;
    }

    static memo = {}

    // Creates an Event if it does not exist in 'memo',
    //   otherwise returns the memo'd event
    static create (id) {
        return Event.memo[id] || (
            Event.memo[id] = new Event(id)
        );
    }

    /**
     * For example:
     *      let AB = new Event("a.b");
     *      console.log(AB.c.d.e.id); // returns "a.b.c.d.e"
     *      
     */
    get(v){
        return new Event(`${this.id}.${v}`, true)
    }

    toString() {
        return this.id;
    }
}

export const Events = {
    request: {
        RECONNECT_DATA: new Event("request.reconnectData"),
        SET_BOARD_LAYOUT: new Event("request.setBoardLayout"),
        GAME_OVER_MODAL: new Event("request.gameOverModal"),
        CLEAR_MODALS: new Event("request.clearModals"),
        ADMIT_DEFEAT: new Event("request.admitDefeat"),
        COMMIT_MOVE: new Event("request.commitMove"),
        SEND_RECONNECT_DATA: new Event("request.sendReconnectData"),
        TRY_MAKE_MOVE: new Event("requests.tryMakeMove"),
        FORCE_MOVE: new Event("requests.forceMove"),
        VALIDATE_MOVE: new Event("requests.validateMove")
    },
    state: {
        ROOM_ID: new Event("state.roomID"),
        PLAYER_ID: new Event("state.playerID"),
        CURRENT_TURN: new Event("state.currentTurn"),
        IS_WHITE: new Event("state.isWhite"),
        REVERSED: new Event("state.reversed"),
        WHITE_TIMER: new Event("state.whiteTimer"),
        BLACK_TIMER: new Event("state.blackTimer"),
        PLAYER_INFO: new Event("state.playerInfo"),
        BOARD_LAYOUT: new Event("state.boardLayout"),
        BOARD_UPDATE: new Event("state.boardLayout.update"),
        BOARD_MOVE: new Event("state.boardLayout.update.move"),
        FLIPPED: new Event("state.flipped")
    },
    LAUNCH: new Event("launch"),
    init: {
        plugin: {
            PRE_INSTALL_HOOK: new Event("init.plugin.preInstallHook"),
            POST_INSTALL_HOOK: new Event("init.plugin.postInstallHook")
        }
    }

}