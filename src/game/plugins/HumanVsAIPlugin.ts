import { Events } from "../../../dist/game/Events.js";
import { GameModeBasePlugin } from "./GameModeBasePlugin";
import { Game } from "../Game";
import { getQuerystring } from "../../../dist/helper-js/utils";
import { GameMode } from "../../helper-js/GameModes.js";
import { computerType, EnemyComputerConstructorArgs, EnemyComputerSettings } from "../../helper-js/EnemyComputerSettings"
import { Position } from "../../../dist/helper-js/board.js";

type AI = {
    [key in computerType]: (turn: string, plugin: HumanVsAIPlugin) => void;
} & {
    getVersion: () => string;
    output: [[string, string], [string, string]];
};


export class HumanVsAIPlugin extends GameModeBasePlugin {
    // testing address
    // http://localhost:5500/game.html?friendRoom=false&timeLimit=100&computerLevel=5&computerType=ALGORITHMIC&gamemode=HUMAN_VS_AI

    static apiVersion = 1

    static receives = [
        Events.state.CURRENT_TURN,
        Events.LAUNCH,
        Events.request.FORCE_MOVE,
        Events.request.VALIDATE_MOVE,
        Events.request.TRY_MAKE_MOVE,
        Events.request.COMMIT_MOVE
    ]
    
    static broadcasts = [
        Events.request.TRY_MAKE_MOVE,
        Events.request.VALIDATE_MOVE,
        Events.request.FORCE_MOVE
    ]

    computerSettings: EnemyComputerSettings;

    constructor(
        {gameMode, computerSettings}: 
        {gameMode: GameMode, computerSettings: EnemyComputerConstructorArgs})
    {
        super({gameMode})
        this.computerSettings = new EnemyComputerSettings(computerSettings);
    }

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

        this.on(Events.request.COMMIT_MOVE, () => {
            const turn = game.get('currentTurn');

            ai[this.computerSettings.act](turn, this);
            let aiRes = ai.output;
            console.log("[AI Output]", aiRes)
            
            let [primaryMove, secondaryMove] = aiRes; 
            
            let [fromPos, toPos] = primaryMove;
            
            this.emit(Events.request.TRY_MAKE_MOVE, {fromPos: new Position(fromPos), toPos: new Position(toPos), newTurn: "White"})

        });

        console.log("AI", ai.getVersion());
    }

    // This method allows the AI to complain about stuff
    // (these are not errors; just complaints)
    complain (message: string) {
        console.log(`[AI complaint] ${message} :/`);
    }

    // And these are actually errors, also from the AI
    errorFromAI(message: string){
        console.log(`[AI (more angry) complaint] ${message} :O`)
    }
}
