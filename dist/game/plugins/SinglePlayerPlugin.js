import { getQuerystring } from "../../helper-js/utils";
import { Events } from "../Events";
import { PluginBase } from "./BasePlugin";

export class SinglePlayerPlugin extends PluginBase {
    
    static apiVersion = 1

    static receives = [
        Events.state.CURRENT_TURN,
        Events.LAUNCH
    ]

    install (game) {
        super.install(game);
        this.on(Events.state.CURRENT_TURN, (_, v) => {
            game.set('isWhite', v.startsWith('White'));
        })

        this.on(Events.LAUNCH, () => {
            const timeLimit = getQuerystring().timeLimit * 60;
            game.set('finalTimeLimit', timeLimit);
            game.set('blackTimer', timeLimit);
            game.set('whiteTimer', timeLimit);

            game.set('currentTurn', 'White');
        })
    }
}
