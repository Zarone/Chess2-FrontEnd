import { PluginBase } from "./BasePlugin"

import { Events } from "../Events"

export class TimerPlugin extends PluginBase {

    static apiVersion = 1

    static receives = [
        Events.LAUNCH
    ]

    static broadcasts = [
        Events.request.ADMIT_DEFEAT,
        Events.request.GAME_OVER_MODAL,
    ]

    static reads = ['isWhite', 'currentTurn']
    static writes = ['whiteTimer', 'blackTimer', 'finalTimeLimit']

    static documentation = `
        TimerPlugin decrements game state properties whiteTimer and blackTimer
        on an interval. If finalTimeLimit is greater than an hour TimerPlugin
        will halt (it is assumed that a time limit is not wanted).

        Properties whiteTimer, blackTimer, and finalTimeLimit represent the
        time in minutes as a non-integer value.

        When a player runs out of time, they lose and the game ends.
    `

    install (game) {
        super.install(game)
        
        this.timerWorker = new Worker('../helper-js/timerWorker.js');

        this.on(Events.LAUNCH, () => {
            this.launch(game);
        })
    }

    launch (game) {
        this.timerWorker.onmessage = () => {
            const {
                isWhite,
                currentTurn,
                finalTimeLimit,
            } = game.state;

            if ( currentTurn != 'Not Started' && finalTimeLimit > 60*60 ) {
                this.terminate();
                return;
            }

            // TODO: maybe enumerate turn types so this isn't a string
            if ( currentTurn == 'Not Started' ) return;

            const turnPlayer = currentTurn.startsWith('White') ? 'White' : 'Black';
            const clientPlayer = isWhite ? 'White' : 'Black';

            this.decrementTimer(turnPlayer);

            if ( turnPlayer != clientPlayer ) {
                return;
            }

            const timeLeft = game.get(this.timerProp_(turnPlayer));
            if ( timeLeft < 0 ) {
                this.emit(Events.request.ADMIT_DEFEAT);

                // TODO: this should listen to the admitDefeat event
                this.emit(Events.request.GAME_OVER_MODAL,
                    "You Lost. Better Luck Next Time 😊");

                this.terminate();
            }

        };
    }

    terminate () {
        this.timerWorker.terminate();
    }

    // Returns 'whiteTimer' if given 'White', 'blackTimer' if given 'Black'
    timerProp_(player) {
        return player.toLowerCase() + 'Timer';
    }

    // Increments timer corresponding to player ('White' or 'Black')
    decrementTimer (player) {
        const k = this.timerProp_(player);
        game.set(k, game.get(k) - 0.1);
    }
}