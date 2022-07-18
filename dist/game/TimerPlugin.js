export class TimerPlugin {
    install (game) {
        this.timerWorker = new Worker('../helper-js/timerWorker.js');

        game.on('launch', () => {
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
                game.emit('admitDefeat');

                // TODO: this should listen to the admitDefeat event
                game.emit('request.gameOverModal',
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