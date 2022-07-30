import { Events } from "../../../dist/game/Events.js";
import { GameModeBasePlugin } from "./GameModeBasePlugin";
import { Game } from "../Game";
import { getQuerystring } from "../../../dist/helper-js/utils";

interface AI {
    getVersion: ()=>string,
    act: (turn: string, plugin: HumanVsAIPlugin) => void
}

export class HumanVsAIPlugin extends GameModeBasePlugin {

    static apiVersion = 1

    static receives = [
        Events.state.CURRENT_TURN,
        Events.LAUNCH,
        Events.request.FORCE_MOVE,
        Events.request.VALIDATE_MOVE,
        Events.request.TRY_MAKE_MOVE
    ]

    install (game: Game) {
        super.install(game);

        this.on(Events.LAUNCH, () => {
            const timeLimit = getQuerystring().timeLimit * 60;
            game.set('finalTimeLimit', timeLimit);
            game.set('blackTimer', timeLimit);
            game.set('whiteTimer', timeLimit);
            
            game.set('isWhite', true);
            game.set('currentTurn', 'White');
            this.launch(game);
        });
    }

    async launch (game: Game) {
        const go = new (globalThis as any).Go();
        const source = await fetch("assets/main.wasm");
        const wasm = await WebAssembly.instantiateStreaming(source, go.importObject);
        go.run((wasm as any).instance);

        const ai = ((globalThis as any) as AI);

        this.on(Events.state.CURRENT_TURN, () => {
            const turn = game.get('currentTurn');
            ai.act(turn, this);
        });

        console.log("AI", ai.getVersion());
    }

    // This method allows the AI to complain about stuff
    // (these are not errors; just complaints)
    complain (message: string) {
        console.log(`[AI complaint] ${message} :/`);
    }
}
