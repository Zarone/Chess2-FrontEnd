import { BoardFactory } from "../dist/chess2/BoardLayout";
import { GameLauncher } from "../dist/game/GameLauncher"
import { EndGamePlugin } from "../dist/game/plugins/EndGamePlugin";
import { PieceHooksPlugin } from "../dist/game/plugins/PieceHooksPlugin";
import { TimerPlugin } from "../dist/game/plugins/TimerPlugin";
import { BaseTest } from "./framework/BaseTest";
import { TestCell } from "./model/TestCell";
import { TestMove } from "./model/TestMove";

export class PlayTest extends BaseTest {
    static documentation = `
        Tests a "play" - a sequence of moves in a game.
    `

    setup () {
        const launcher = new GameLauncher({ debug: true });
        launcher.init();
        launcher.install(new PieceHooksPlugin());
        launcher.install(new EndGamePlugin());

        this.game = launcher.game;
    }

    setBoardLayout(layout) {
        game.set('boardLayout', BoardFactory.create(layout));
    }

    setTurn(turn) {
        game.set('currentTurn', turn);
    }

    testCell(id) {
        // Test boardLayout[id] and boardLayout.data[id] both work
        const a = game.get('boardLayout').data[id];
        const b = game.get('boardLayout')[id];
        if ( a !== b ) {
            this.errors.push({
                message: 'BoardLayout proxy error',
                fromData: a,
                fromProxy: b,
            });
        }

        // Generate cell information
        return new TestCell(this, { pos: id, piece: a });
    }

    testMove (args) {
        return new TestMove(this, args);
    }
}
