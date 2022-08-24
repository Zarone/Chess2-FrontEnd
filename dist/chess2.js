import {Rook} from "./pieces-js/Rook.js"
import {Monkey} from "./pieces-js/Monkey.js"
import {Fish} from "./pieces-js/Fish.js"
import {FishQueen} from "./pieces-js/FishQueen.js"
import {Queen} from "./pieces-js/Queen.js"
import {King} from "./pieces-js/King.js"
import {Elephant} from "./pieces-js/Elephant.js"
import {Bear} from "./pieces-js/Bear.js"
import { Position } from "./helper-js/board.js"

import {nextToJail, toID, canMoveKey, canMoveValue, prevMoveColor, getVerticalAndHorizontal} from "./helper-js/utils.js"
import { BoardFactory, BoardLayouts } from "./chess2/BoardLayout.js"

export class ChessBoard {

    set boardLayout (v) {
        this.game.set('boardLayout', v);
    }
    get boardLayout () {
        return this.game.get('boardLayout');
    }
    dragging = false
    
    draggingRoyalty = false
    draggingMonkey = false; // specifically for monkey rescuing king
    draggingJumpingMoney = false; // for anytime monkey is jumping

    draggingPiece = null
    draggingPieceWidth = null
    draggingPieceHeight = null
    draggingPieceDom = null

    // IDEA: install all game.state properties w/ Object.defineProperty
    set isWhite (v) {
        this.game.set('isWhite', v);
    }
    get isWhite() {
        return this.game.get('isWhite');
    }

    // currentTurn = "Not Started"; // either "Not Started", "White", "Black", "White Jail", "Black Jail", "White Rescue", "Black Rescue", "White Jumping", "Black Jumping"

    makeMoveCallbackFunc = undefined;
    gameOverCallbackFunc = undefined;
    madeMoveCallbackFunc = undefined;

    styleType = undefined; // of type CustomStyle
    styleSheetReference = undefined;

    isSound = true;

    set currentTurn (v) {
        this.game.set('currentTurn', v);
    }
    get currentTurn () {
        return this.game.state.currentTurn;
    }

    constructor(game, makeMoveCallback, gameOverCallback, styleSheetReference, styleType, madeMoveCallbackFunc){
        globalThis.gameboard = this;
        this.game = game;

        this.styleSheetReference = styleSheetReference;
        this.styleType = styleType;
        
        this.makeMoveCallbackFunc = makeMoveCallback;
        this.gameOverCallbackFunc = gameOverCallback;
        this.madeMoveCallbackFunc = madeMoveCallbackFunc;
    }

    cursorMove(event){
        if (this.dragging){
            this.draggingPieceDom.style.left = (event.clientX - this.draggingPieceWidth/2) + "px"
            this.draggingPieceDom.style.top = (event.clientY - this.draggingPieceHeight/2) + "px"
        }
    }

    dragStart(event){
        this.resetTiles()
        let canMove = (this.isWhite && this.currentTurn == "White") || (!this.isWhite && this.currentTurn == "Black");
        if (!canMove) return;
        
        event.preventDefault();

        if (event.srcElement.nodeName != "IMG") return;
        
        this.draggingPiece = this.boardLayout[event.srcElement.parentNode.id]
        
        let sameColorAsPlayer = (this.draggingPiece.isWhite == null || (this.isWhite && this.draggingPiece.isWhite) || (!this.isWhite && !this.draggingPiece.isWhite))
        if (!sameColorAsPlayer) return;

        this.draggingPieceDom = event.target
        this.draggingPieceDom.style.position = "fixed"
        this.draggingPieceWidth = event.target.offsetWidth
        this.draggingPieceHeight = event.target.offsetHeight
        this.dragging = true
        
        this.findAndRenderMoves(this.draggingPiece)
    }

    dragEnd(event){

        if (!this.dragging) return

        if (!this.draggingPieceDom.parentNode) debugger
        this.draggingPieceDom.parentNode.removeChild(this.draggingPieceDom.parentNode.lastChild)

        let attemptMoveTo = document.elementFromPoint(event.clientX, event.clientY)

        if (attemptMoveTo.nodeName == "IMG"){
            attemptMoveTo = attemptMoveTo.parentElement
        }

        this.makeMove(attemptMoveTo, event)
    }
    
    renderMovesForTakenKingQueen(){
        if (this.isWhite){
            if (this.boardLayout["y1"] == undefined) {
                this.styleType.canMove.setAt(document.getElementById("y1"))
            }
            if (this.boardLayout["y2"] == undefined) {
                this.styleType.canMove.setAt(document.getElementById("y2"))
            }
        } else {
            if (this.boardLayout["x1"] == undefined) {
                this.styleType.canMove.setAt(document.getElementById("x1"))
            }
            if (this.boardLayout["x2"] == undefined) {
                this.styleType.canMove.setAt(document.getElementById("x2"))
            }
        }
    }

    renderMovesForJumpingMonkey(piece){
        this.boardLayout.data["TEMP"].position = piece.position
        this.boardLayout.data[piece.position] = this.boardLayout["TEMP"]
        let foundMoves = this.boardLayout.data["TEMP"].getJumpingMoves()
        let moves = this.filterImpossibleMoves(foundMoves, piece.position)
        this.boardLayout.data[piece.position] = piece
        this.renderMoves( moves )
    }

    // sorry for the poor naming convention
    // I sort of dug myself into a hole here
    renderMovesForJumpingMonkeyNonRescue(piece){
        let foundMoves = piece.getJumpingMoves()
        this.renderMoves( this.filterImpossibleMoves(foundMoves, piece.position) )
    }

    manageTakeKingOrQueen(piece, event){
        this.draggingPieceDom = document.createElement('img');
        this.draggingPieceDom.setAttribute("src", "./assets/"+this.styleType.name+"/"+piece.getImageSrc());
        this.draggingPieceDom.setAttribute("class", this.styleSheetReference["piece-image"] /*"piece-image"*/);

        document.getElementById("x1").appendChild(this.draggingPieceDom);

        this.draggingPieceDom.style.position = "fixed"
        this.draggingPieceWidth = this.draggingPieceDom.offsetWidth
        this.draggingPieceHeight = this.draggingPieceDom.offsetHeight
        this.dragging = true
        this.draggingRoyalty = true

        this.draggingPiece = piece;

        this.renderMovesForTakenKingQueen()
        if (event) this.cursorMove(event)
    }

    manageMonkeyJumpingNonRescue(event){
        let piece = this.boardLayout["TEMP"];
        this.draggingPieceDom = document.createElement('img');
        this.draggingPieceDom.setAttribute("src", "./assets/"+this.styleType.name+"/"+piece.getImageSrc());
        this.draggingPieceDom.setAttribute("class", this.styleSheetReference["piece-image"]/*"piece-image"*/);

        document.getElementById("x1").appendChild(this.draggingPieceDom);

        this.draggingPieceDom.style.position = "fixed"
        this.draggingPieceWidth = this.draggingPieceDom.offsetWidth
        this.draggingPieceHeight = this.draggingPieceDom.offsetHeight
        this.dragging = true
        this.draggingJumpingMoney = true

        this.draggingPiece = piece;

        this.renderMovesForJumpingMonkeyNonRescue(piece)
        if (event) this.cursorMove(event)
    }

    manageMonkeyJumping(piece, event){
        this.draggingPieceDom = document.createElement('img');

        this.draggingPieceDom.setAttribute("src", "./assets/"+this.styleType.name+"/"+this.boardLayout["TEMP"].getImageSrc());
        this.draggingPieceDom.setAttribute("class", this.styleSheetReference["piece-image"]/*"piece-image"*/);

        document.getElementById("x1").appendChild(this.draggingPieceDom);

        this.draggingPieceDom.style.position = "fixed"
        this.draggingPieceWidth = this.draggingPieceDom.offsetWidth
        this.draggingPieceHeight = this.draggingPieceDom.offsetHeight
        this.dragging = true
        this.draggingMonkey = true

        this.draggingPiece = this.boardLayout["TEMP"];

        this.renderMovesForJumpingMonkey(piece)
        if (event) this.cursorMove(event)
    }

    playChessSound(){
        if (this.isSound){
            let audio = new Audio('./assets/Chess Sound.mp3');
            audio.loop = false;
            audio.play().catch(()=>{return;})
        }
    }

    makeMove(moveToDom, event){
        let classNames = moveToDom.className.split(" ")
        
        let isMoveableTile = this.styleType.canMove.checkAgainst(moveToDom);

        let monkeyJumpingNonRescue = false;

        const toPos = new Position(moveToDom.id);
        const fromPos = ( this.draggingMonkey || this.draggingRoyalty ) ?
            "TEMP" : this.draggingPiece.position;

        // === Start: Internal functions of makeMove ===
        const abortMove = (msg) => {
            console.log(msg);
            document.getElementById("x1").appendChild(this.draggingPieceDom);
            
            if ( this.draggingJumpingMoney ) {
                monkeyJumpingNonRescue = true;
                this.boardLayout["TEMP"] = this.boardLayout[fromPos]
                this.boardLayout["TEMP"].position = fromPos
                return;
            }

            // if there's no state to revert back to, then don't
            if ( this.draggingMonkey || this.draggingRoyalty ) return;

            this.draggingMonkey = false;
            this.draggingRoyalty = false;
            this.dragging = false;
            this.resetTiles();
            this.updatePieces();

        };

        const nextTurn = (changePlayer, phase) => {
            let currentPlayer = this.currentTurn.startsWith('White') ?
                'White' : 'Black';
            let otherPlayer = currentPlayer == 'White' ? 'Black' : 'White';
            let nextPlayer = changePlayer ? otherPlayer : currentPlayer;
            this.currentTurn = nextPlayer + (phase ? ' ' + phase : '');
        };
        // === End: Internal functions of makeMove ===

        // Placing a piece outside the game board
        if (!classNames.includes(this.styleSheetReference["chess-box"]) && !classNames.includes(this.styleSheetReference["chess-jail-box"])){
            abortMove("not a tile on game board");
            return;
        }

        // Placing a piece in the position it's already in
        if (toPos.id == this.draggingPiece.position.id) {
            // For jumping monkey, this action ends the turn
            if ( this.draggingJumpingMoney ) {
                this.draggingJumpingMoney = false
                this.dragging = false;
                nextTurn(true);
                this.makeMoveCallbackFunc({fromPos, toPos, newTurn: this.currentTurn})
                this.resetTiles();
                this.playChessSound();
                delete this.boardLayout["MONKEY_START"];
                this.madeMoveCallbackFunc();
            } else {
                abortMove("moving to same tile as you're already on");
            }
            return;
        }

        if ( ! isMoveableTile ) {
            abortMove("not a moveable tile");
            return;
        }

        let tookKingOrQueen = false;
        let monkeyJumping = false;
        let tempPiece = undefined;
        
        if ( this.boardLayout[fromPos].constructor.name == Monkey.name ) {
            let {vertical: verticalFrom, horizontal: horizontalFrom} = getVerticalAndHorizontal(fromPos)
            let {vertical: verticalTo, horizontal: horizontalTo} = getVerticalAndHorizontal(toPos)
            let oldToPos = this.boardLayout[toPos]
            let oldFromPos = this.boardLayout[fromPos]
            this.boardLayout[toPos] = new Monkey(toPos, oldFromPos.isWhite)
            delete this.boardLayout[fromPos]

            let tempMonkeyLastMoveStorage;
            if (this.boardLayout["MONKEY_START"]){
                tempMonkeyLastMoveStorage = new Monkey( this.boardLayout["MONKEY_START"].position, this.boardLayout["MONKEY_START"].isWhite )
                delete this.boardLayout["MONKEY_START"]
            }

            if (
                ! oldToPos &&
                (fromPos == "TEMP" || Math.abs(verticalFrom - verticalTo) > 1 || Math.abs(horizontalFrom - horizontalTo) > 1) &&
                this.findJumpingMoves(this.boardLayout[toPos]).length > 0
            ) {
                monkeyJumpingNonRescue = true;
            }
            this.boardLayout[toPos] = oldToPos;
            this.boardLayout[fromPos] = oldFromPos;

            if (tempMonkeyLastMoveStorage) this.boardLayout["MONKEY_START"] = tempMonkeyLastMoveStorage
        }
        this.draggingJumpingMoney = false;

        if ( toPos.isJail() && ! this.draggingRoyalty ) {
            monkeyJumping = true;

            let nextTo = nextToJail(toPos)

            tempPiece = this.boardLayout[toPos] // set to king
            this.boardLayout["TEMP"] = this.boardLayout[fromPos] // set to monkey

            delete this.boardLayout[fromPos]

            const { piece } = this.boardLayout.move(toPos, nextTo, { noTemp: true });
            piece.hasBanana = false;
            // this.boardLayout[nextTo] = this.boardLayout[toPos]
            // this.boardLayout[nextTo].position = nextTo
            // this.boardLayout[nextTo].hasBanana = false;
            // delete this.boardLayout[toPos]

            nextTurn(false, 'Rescue');
            this.makeMoveCallbackFunc({fromPos, toPos, newTurn: this.currentTurn});
        } else if ( monkeyJumpingNonRescue ) {
            if (this.currentTurn == "White" || this.currentTurn == "Black"){
                this.boardLayout["MONKEY_START"] = new Monkey (fromPos, this.boardLayout[fromPos].isWhite);
            }

            // this temporarily stores what is currently in TEMP
            let temporaryTEMP;

            if (fromPos == "TEMP") temporaryTEMP = this.boardLayout["TEMP"];

            this.boardLayout.move(fromPos, toPos);

            if (fromPos == "TEMP") this.boardLayout["TEMP"] = temporaryTEMP;

            // this.boardLayout[toPos] = this.boardLayout[fromPos]
            // delete this.boardLayout[fromPos]
            // this.boardLayout[toPos].position = toPos;
            // this.boardLayout["TEMP"] = this.boardLayout[toPos]

            nextTurn(false, 'Jumping');
            this.makeMoveCallbackFunc({fromPos, toPos, newTurn: this.currentTurn});
        } else {
            if (
                this.boardLayout[toPos] &&
                (this.boardLayout[toPos].constructor.name == King.name || 
                this.boardLayout[toPos].constructor.name == Queen.name)
            ){
                tookKingOrQueen = true;
                tempPiece = this.boardLayout[toPos]
                this.boardLayout["TEMP"] = tempPiece
            }

            this.boardLayout.move(fromPos, toPos);

            nextTurn(! tookKingOrQueen, tookKingOrQueen && 'Jail');

            this.makeMoveCallbackFunc({fromPos, toPos, newTurn: this.currentTurn});
        }

        this.draggingMonkey = false;
        this.draggingRoyalty = false;
        this.dragging = false;
        this.resetTiles();
        this.updatePieces();
        if (tookKingOrQueen) this.manageTakeKingOrQueen(tempPiece, event);
        if (monkeyJumping) this.manageMonkeyJumping(tempPiece, event);
        if (monkeyJumpingNonRescue) this.manageMonkeyJumpingNonRescue(event);
        this.playChessSound();
        this.madeMoveCallbackFunc();
    }

    filterImpossibleMoves(moves, currentPos){
        return this.boardLayout.filterImpossibleMoves(this.game, moves, currentPos);
    }

    makePreValidatedMove(fromPos, toPos){
        return this.boardLayout.makePreValidatedMove(this.game, fromPos, toPos);
    }

    setPrevColor(toPos){
        if (toPos != "TEMP"){
            document.getElementById(toPos).style["backgroundColor"] = prevMoveColor
        }
    }

    renderMoves(moves){

        // this is to deal with a specific problem on safari.
        // for whatever reason, the boxes resize on update, so if I
        // only update the red tiles, then they're a different
        // size than everything else.
        let elements = document.getElementsByClassName("chess-box")
        for (let i = 0; i < elements.length; i++){
            let element = elements[i];
            this.styleType.canMove.setAt(element.style);
            this.styleType.canMove.unsetAt(element.style);
        }
        elements = document.getElementsByClassName("chess-jail-box")
        for (let i = 0; i < elements.length; i++){
            let element = elements[i];
            this.styleType.canMove.setAt(element.style);
            this.styleType.canMove.unsetAt(element.style);
        }

        for (let i = 0; i < moves.length; i++){
            let editTileDom = document.getElementById(moves[i].pos);
            this.styleType.canMove.unsetAt(editTileDom);
            this.styleType.canMove.setAt(editTileDom);
        }
    }

    findMoves(piece){
        let movesFromPiece = piece.getMoves()
        return this.filterImpossibleMoves(movesFromPiece, piece.position)
    }

    findJumpingMoves(piece){
        let movesFromPiece = piece.getJumpingMoves()
        return this.filterImpossibleMoves(movesFromPiece, piece.position)
    }

    // validateMove(currentPosition, newPosition, newTurn){
    //     return this.boardLayout.validateMove(
    //         this.game, game.get('currentTurn'), {
    //             fromPos: currentPosition,
    //             toPos: newPosition,
    //             newTurn
    //         }
    //     );
    // }

    findAndRenderMoves(piece){
        let movesToRender = this.findMoves(piece)
        this.renderMoves(movesToRender)
    }

    renderPiece(tileDom, piece){
        let imageDom = document.createElement("img");
        imageDom.setAttribute("src", "./assets/"+this.styleType.name+"/"+piece.getImageSrc());
        imageDom.setAttribute("class", this.styleSheetReference["piece-image"]);
        while (tileDom.hasChildNodes()) {
            tileDom.removeChild(tileDom.lastChild);
        }
        tileDom.appendChild(imageDom)
    }

    addPieceEvents(tileDom){
        tileDom.addEventListener("dragstart", event => this.dragStart(event))
        tileDom.addEventListener("click", event => this.dragStart(event))
    }

    resetTiles(){
        for (let i = 1; i < 9; i++){
            for (let j = 1; j < 9; j++){
                let id = toID[i]+(j);
                this.styleType.canMove.unsetAt(document.getElementById(id));
            }
        }
        
        this.styleType.canMove.unsetAt(document.getElementById("x1"));
        this.styleType.canMove.unsetAt(document.getElementById("y1"));
        this.styleType.canMove.unsetAt(document.getElementById("x2"));
        this.styleType.canMove.unsetAt(document.getElementById("y2"));
        this.styleType.canMove.unsetAt(document.getElementById("z1"));

    }

    updateSinglePiece(id){
        let piece = this.boardLayout[id]
        let tileDom = document.getElementById(id);

        if (piece == undefined){
            while (tileDom.hasChildNodes()) {
                tileDom.removeChild(tileDom.lastChild);
            }
        } else {                
            this.renderPiece(tileDom, piece)

            this.addPieceEvents(tileDom)
        }
    }

    updatePieces(){
        for (let i = 1; i < 9; i++){
            for (let j = 1; j < 9; j++){
                let id = toID[i]+(j);
                this.updateSinglePiece(id)
            }
        }

        this.updateSinglePiece("x1")
        this.updateSinglePiece("x2")
        this.updateSinglePiece("y1")
        this.updateSinglePiece("y2")
        this.updateSinglePiece("z1")
    }
}
