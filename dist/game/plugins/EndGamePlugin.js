import { LOSE_TEXT, NEUTRAL_GAME_OVER } from "../../helper-js/utils";
import { Events } from "../Events";
import { PluginBase } from "./BasePlugin";
import { GameModeBasePlugin } from "../../../src/game/plugins/GameModeBasePlugin";

export class EndGamePlugin extends PluginBase {

    static apiVersion = 1

    static receives = [
        Events.state.BOARD_UPDATE
    ]

    static broadcasts = [
        Events.request.ADMIT_DEFEAT
    ]

    static documentation = `
        EndGamePlugin listens to board updates and ends the game if the current
        player has a piece in each jail slot.
    `


    install (game) {
        super.install(game);

        this.on(Events.state.BOARD_UPDATE, () => {

            if ( !game.plugins[GameModeBasePlugin.identifier] ) throw new Error("[EndGamePlugin]: No Game Mode Set")

            if ( game.plugins[GameModeBasePlugin.identifier].gameMode.singleplayer && EndGamePlugin.checkLoseCondition(game, true) ) {
                this.emit(Events.request.ADMIT_DEFEAT, { message: NEUTRAL_GAME_OVER });
            } else if ( EndGamePlugin.checkLoseCondition(game) ) {
                this.emit(Events.request.ADMIT_DEFEAT, { message: LOSE_TEXT });
            }

        });
    }

    static checkLoseCondition (game, bothPlayers) {
        const boardLayout = game.get('boardLayout');
        if (bothPlayers) return ( (boardLayout['x1'] && boardLayout['x2']) || (boardLayout['y1'] && boardLayout['y2']) )
        const c = game.get('isWhite') ? 'x' : 'y';
        return boardLayout[c + '1'] && boardLayout[c + '2'];
    }
}
