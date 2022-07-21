export class DOMPlugin {

    static elements = [
        { name: 'modal', id: 'myModal' },
        'modal-heading',
        'roomID',
        'jail-1',
        'jail-2',
        'chess-board',
        'board-container',
        'turn',
        'timer-top',
        'timer-bottom',
    ];

    install (game) {
        game.elements = {};
        for ( let o of DOMPlugin.elements ) {
            // Let 'string' be a shortcut for { id: 'string' }
            o = typeof o === 'string' ? { id: o } : o;
            console.log(`setting ${o.name || o.id} to `, document.getElementById(o.id));
            game.elements[o.name || o.id] = document.getElementById(o.id);
        }

        const gameOverModal = 
            new bootstrap.Modal(game.elements['modal'], {keyboard: false});

        game.events.on('request.gameOverModal', (_, message) => {
            gameOverModal.show();
            game.elements['modal-heading'].innerText = message;
        })

        game.events.on('request.clearModals', () => {
            gameOverModal.hide();
        })

        game.events.on('state.roomID', (_, roomID) => {
            game.elements['roomID'].innerText = 'Room ID: ' + roomID;
        })

        game.events.on('state.currentTurn', (_, currentTurn) => {
            this.updateTurnDOM(game, currentTurn);
        })

        // Bind properties that affect board orientation
        game.events.on('state.playerInfo', this.flipBoard.bind(this));
        game.events.on('state.reversed', this.flipBoard.bind(this));

        // Bind properties that affect the timer
        ;['whiteTimer', 'blackTimer', 'reversed'].forEach(k => {
            game.events.on('state.' + k, this.displayTimer.bind(this));
        })

        game.on('request.admitDefeat', (_, { message }) => {
            game.emit('request.gameOverModal', message);
        });

        game.on('launch', this.launch.bind(this));
    }

    launch () {
        this.displayTimer();
    }

    updateTurnDOM (game, currentTurn) {
        const turn_Dom = game.elements['turn'];
        if (
            currentTurn == "White" ||
            currentTurn == "White Jail" ||
            currentTurn == "White Rescue" ||
            currentTurn == "White Jumping"
        ) 
        {
            turn_Dom.style.backgroundColor = "white";
            turn_Dom.style.color = "black";
        } else if (
            currentTurn == "Black" ||
            currentTurn == "Black Jail" ||
            currentTurn == "Black Rescue" ||
            currentTurn == "Black Jumping"
        ) 
        {
            turn_Dom.style.backgroundColor = "black";
            turn_Dom.style.color = "white";
        } else 
        {
            turn_Dom.style.backgroundColor = "white";
            turn_Dom.style.color = "blue";
        }

        if (currentTurn != "White Jumping" && currentTurn != "Black Jumping"){
            turn_Dom.innerText = "Turn: " + currentTurn
        } else {
            turn_Dom.innerText = "Turn: " + currentTurn + " - Double Click Tile to Stop"
        }
    }

    flipBoard () {
        const isWhite = ! game.state.playerInfo || game.state.playerInfo.isWhite;
        const reversed = game.state.reversed;
        if ((!isWhite && !reversed) || (isWhite && reversed)){
            game.elements["jail-1"].style.flexWrap = "wrap-reverse"
            game.elements["jail-2"].style.flexWrap = "wrap-reverse"
            game.elements["chess-board"].style.flexWrap = "wrap-reverse"
            game.elements["chess-board"].style.flexDirection = "row-reverse"
            game.elements["board-container"].style.flexDirection = "row-reverse"
        } else {
            game.elements["jail-1"].style.flexWrap = ""
            game.elements["jail-2"].style.flexWrap = ""
            game.elements["chess-board"].style.flexWrap = ""
            game.elements["chess-board"].style.flexDirection = ""
            game.elements["board-container"].style.flexDirection = ""
        }
    }

    displayTimer () {
        // ???: is it possible to add getter logic here if ever needed?
        const { isWhite, whiteTimer, blackTimer, reversed } = game.state;

        // Note: this is effectively "( !isWhite XOR reversed )"
        const flipped = isWhite ? reversed : ! reversed;
        
        const whiteTimerDom = game.elements[flipped ? 'timer-top' : 'timer-bottom'];
        const blackTimerDom = game.elements[flipped ? 'timer-bottom' : 'timer-top'];

        whiteTimerDom.innerText = 'White --- ' + this.toTimerString_(whiteTimer);
        blackTimerDom.innerText = 'Black --- ' + this.toTimerString_(blackTimer);
    }

    toTimerString_ (val) {
        const seconds = val % 60;
        return Math.floor(val/60).toString() +
            (seconds < 10 ? ':0' : ':') +
            seconds.toFixed(1)
    }
}
