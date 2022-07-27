import { Events } from "../../../dist/game/Events.js";
import { GameModeBasePlugin } from "../../../src/game/plugins/GameModeBasePlugin";
import { Game } from "../Game";

export class TestGameModePlugin extends GameModeBasePlugin {
    
    static apiVersion = 1

    static receives = [
        Events.state.CURRENT_TURN,
        Events.LAUNCH,
        Events.request.FORCE_MOVE
    ]

    install (game: Game) {
        super.install(game);

        this.on(Events.LAUNCH, () => {
            game.set('currentTurn', 'White');
        })
    }
}

