import { LOSE_TEXT } from "../../helper-js/utils";
import { Events } from "../Events";
import { PluginBase } from "./BasePlugin";

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
            if ( this.checkLoseCondition(game) ) {
                this.emit(Events.request.ADMIT_DEFEAT, { message: LOSE_TEXT });
            }
        });
    }

    checkLoseCondition (game) {
        const boardLayout = game.get('boardLayout');
        const c = game.get('isWhite') ? 'x' : 'y';
        return boardLayout[c + '1'] && boardLayout[c + '2'];
    }
}
