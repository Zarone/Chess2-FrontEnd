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

        game.events.on('state.roomID', (_, roomID) => {
            game.elements['roomID'].innerText = roomID;
        })

        game.events.on('state.currentTurn', (_, currentTurn) => {
            this.updateTurnDOM(game, currentTurn);
        })
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
}
