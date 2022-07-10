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

export class ChessBoard {

    boardLayout = {} // set in constructor
    dragging = false
    
    draggingRoyalty = false
    draggingMonkey = false; // specifically for monkey rescuing king
    draggingJumpingMoney = false; // for anytime monkey is jumping

    draggingPiece = null
    draggingPieceWidth = null
    draggingPieceHeight = null
    draggingPieceDom = null

    isWhite = undefined

    rookActiveWhite = false;
    rookActiveBlack = false;

    currentTurn = "Not Started"; // either "Not Started", "White", "Black", "White Jail", "Black Jail", "White Rescue", "Black Rescue", "White Jumping", "Black Jumping"

    makeMoveCallbackFunc = undefined;
    gameOverCallbackFunc = undefined;

    styleType = undefined; // either "oat", "pixel"
    styleSheetReference = undefined;

    constructor(makeMoveCallback, gameOverCallback, styleSheetReference, styleType){
        this.styleSheetReference = styleSheetReference;
        this.styleType = styleType;
        
        this.boardLayout = {
            "a8": new Rook("a8", false),
            "b8": new Monkey("b8", false),
            "c8": new Fish("c8", false),
            "d8": new Queen("d8", false),
            "e8": new King("e8", false),
            "f8": new Fish("f8", false),
            "g8": new Monkey("g8", false),
            "h8": new Rook("h8", false),

            "a7": new Fish("a7", false),
            "b7": new Fish("b7", false),
            "c7": new Elephant("c7", false),
            "d7": new Fish("d7", false),
            "e7": new Fish("e7", false),
            "f7": new Elephant("f7", false),
            "g7": new Fish("g7", false),
            "h7": new Fish("h7", false),

            
            "a1": new Rook("a1", true),
            "b1": new Monkey("b1", true),
            "c1": new Fish("c1", true),
            "d1": new Queen("d1", true),
            "e1": new King("e1", true),
            "f1": new Fish("f1", true),
            "g1": new Monkey("g1", true),
            "h1": new Rook("h1", true),

            "a2": new Fish("a2", true),
            "b2": new Fish("b2", true),
            "c2": new Elephant("c2", true),
            "d2": new Fish("d2", true),
            "e2": new Fish("e2", true),
            "f2": new Elephant("f2", true),
            "g2": new Fish("g2", true),
            "h2": new Fish("h2", true),

            "z1": new Bear("z1"),
        }

        this.makeMoveCallbackFunc = makeMoveCallback;
        this.gameOverCallbackFunc = gameOverCallback;
    }

    cursorMove(event){
        if (this.dragging){
            this.draggingPieceDom.style.left = (event.clientX - this.draggingPieceWidth/2) + "px"
            this.draggingPieceDom.style.top = (event.clientY - this.draggingPieceHeight/2) + "px"
        }
    }

    dragStart(event){
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
    
    updateRookActivity(toPos){
        this.rookActiveBlack = false;
        this.rookActiveWhite = false;

        // if a piece was taken
        if (this.boardLayout[toPos] != undefined){
            if (this.boardLayout[toPos].isWhite){
                this.rookActiveWhite = true;
            } else if (this.boardLayout[toPos] != null){
                this.rookActiveBlack = true;
            }
        }
    }

    checkFishPromotion(fromPos, toPos){
        
        // if the piece being moved is a fish
        if ( this.boardLayout[fromPos].constructor.name == Fish.name ){

            let rowName = toPos.row
            if (
                (this.boardLayout[fromPos].isWhite && rowName=="8") ||
                (!this.boardLayout[fromPos].isWhite && rowName=="1")
            ){
                this.boardLayout[fromPos] = new FishQueen(fromPos, this.boardLayout[fromPos].isWhite)
            }

        }
    }

    stateChecks(fromPos, toPos){
        this.updateRookActivity(toPos);
        this.checkFishPromotion(fromPos, toPos);
    }
    
    renderMovesForTakenKingQueen(){
        if (this.isWhite){
            if (this.boardLayout["y1"] == undefined) {
                document.getElementById("y1").style[canMoveKey(this.styleType)] = canMoveValue(this.styleType);
            }
            if (this.boardLayout["y2"] == undefined) {
                document.getElementById("y2").style[canMoveKey(this.styleType)] = canMoveValue(this.styleType);
            }
        } else {
            if (this.boardLayout["x1"] == undefined) {
                document.getElementById("x1").style[canMoveKey(this.styleType)] = canMoveValue(this.styleType);
            }
            if (this.boardLayout["x2"] == undefined) {
                document.getElementById("x2").style[canMoveKey(this.styleType)] = canMoveValue(this.styleType);
            }
        }
    }

    renderMovesForJumpingMonkey(piece){
        this.boardLayout["TEMP"].position = piece.position
        this.boardLayout[piece.position] = this.boardLayout["TEMP"]
        let foundMoves = this.boardLayout["TEMP"].getJumpingMoves()
        this.renderMoves( this.filterImpossibleMoves(foundMoves, piece.position) )
        this.boardLayout[piece.position] = piece
    }

    // sorry for the poor naming convention
    // I sort of dug myself into a hole here
    renderMovesForJumpingMonkeyNonRescue(piece){
        let foundMoves = piece.getJumpingMoves()
        this.renderMoves( this.filterImpossibleMoves(foundMoves, piece.position) )
    }

    manageTakeKingOrQueen(piece, event){
        this.draggingPieceDom = document.createElement('img');
        this.draggingPieceDom.setAttribute("src", "./assets/"+this.styleType+"/"+piece.getImageSrc());
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
        this.draggingPieceDom.setAttribute("src", "./assets/"+this.styleType+"/"+piece.getImageSrc());
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

        this.draggingPieceDom.setAttribute("src", "./assets/"+this.styleType+"/"+this.boardLayout["TEMP"].getImageSrc());
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
        let audio = new Audio('./assets/Chess Sound.mp3');
        audio.loop = false;
        audio.play().catch(()=>{return;})
    }

    makeMove(moveToDom, event){
        let classNames = moveToDom.className.split(" ")
        
        let isMoveableTile = moveToDom.style[canMoveKey(this.styleType)] == canMoveValue(this.styleType);
        console.log(isMoveableTile, this.styleType, moveToDom.style[canMoveKey(this.styleType)], canMoveValue(this.styleType))

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
                (Math.abs(verticalFrom - verticalTo) > 1 || Math.abs(horizontalFrom - horizontalTo) > 1) &&
                this.findJumpingMoves(this.boardLayout[toPos]).length > 0
            ) {
                monkeyJumpingNonRescue = true;
            }
            this.boardLayout[toPos] = oldToPos;
            this.boardLayout[fromPos] = oldFromPos;
                
            this.boardLayout["MONKEY_START"] = tempMonkeyLastMoveStorage
        }
        this.draggingJumpingMoney = false;

        if ( toPos.isJail() && ! this.draggingRoyalty ) {
            monkeyJumping = true;

            let nextTo = nextToJail(toPos)

            tempPiece = this.boardLayout[toPos]
            this.boardLayout["TEMP"] = this.boardLayout[fromPos]

            delete this.boardLayout[fromPos]

            this.boardLayout[nextTo] = this.boardLayout[toPos]
            this.boardLayout[nextTo].position = nextTo
            this.boardLayout[nextTo].hasBanana = false;

            delete this.boardLayout[toPos]

            nextTurn(false, 'Rescue');
            this.makeMoveCallbackFunc({fromPos, toPos, newTurn: this.currentTurn});
        } else if ( monkeyJumpingNonRescue ) {
            if (this.currentTurn == "White" || this.currentTurn == "Black"){
                this.boardLayout["MONKEY_START"] = new Monkey (fromPos, this.boardLayout[fromPos].isWhite);
            }

            this.boardLayout[toPos] = this.boardLayout[fromPos]
            delete this.boardLayout[fromPos]
            this.boardLayout[toPos].position = toPos;
            this.boardLayout["TEMP"] = this.boardLayout[toPos]

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

            this.stateChecks(fromPos, toPos)

            this.boardLayout[toPos] = this.boardLayout[fromPos]

            delete this.boardLayout[fromPos]

            this.boardLayout[toPos].position = toPos;

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
    }

    filterImpossibleMoves(moves, currentPos){
        return moves.filter((elem, index)=>{
            for (let i = 0; i < elem.conditions.length; i++){
                if (
                    !elem.conditions[i](
                        { 
                            board: this.boardLayout, 
                            from: currentPos, 
                            to: elem.pos,
                            rookActiveWhite: this.rookActiveWhite,
                            rookActiveBlack: this.rookActiveBlack,
                            thisTurn: this.currentTurn
                        }
                    ) 
                ) {
                    return false
                }
            }
            return true

        })
    }

    makePreValidatedMove(fromPos, toPos){
        
        // if starting a monkey jump to save king
        if ((toPos.isJail()) && this.boardLayout[fromPos].constructor.name == Monkey.name){
            let nextTo = nextToJail(toPos)

            this.boardLayout["TEMP"] = this.boardLayout[fromPos];
            this.boardLayout["TEMP"].position = nextTo

            this.boardLayout[nextTo] = this.boardLayout[toPos]
            this.boardLayout[nextTo].hasBanana = false;
            this.boardLayout[nextTo].position = nextTo;

            delete this.boardLayout[toPos]

        } else {
            this.stateChecks(fromPos, toPos)

            if (toPos.isJail()){
                if (this.boardLayout[fromPos].isWhite){
                    this.rookActiveWhite = true;
                } else {
                    this.rookActiveBlack = true;
                }
            }
            
            if (toPos.id != fromPos.id){
                if (this.boardLayout[toPos] != undefined) {
                    this.boardLayout["TEMP"] = this.boardLayout[toPos]
                } else {
                    this.boardLayout["TEMP"] = this.boardLayout[fromPos]
                    this.boardLayout["TEMP"].position = toPos
                }
        
                this.boardLayout[toPos] = this.boardLayout[fromPos]
        
                this.boardLayout[toPos].position = toPos
        
                delete this.boardLayout[fromPos]
            }

        }
        
        if (this.checkLoseCondition()) {
            console.log("calling game over callback function")
            this.gameOverCallbackFunc();
        }
        this.resetTiles();
        this.updatePieces();
        this.setPrevColor(fromPos)
        this.setPrevColor(toPos)
        this.playChessSound();
    }

    setPrevColor(toPos){
        if (toPos != "TEMP"){
            document.getElementById(toPos).style[canMoveKey(this.styleType)] = prevMoveColor
        }
    }

    checkLoseCondition(){
        if (this.isWhite){
            return ( this.boardLayout["x1"] && this.boardLayout["x2"] )
        } else {
            return ( this.boardLayout["y1"] && this.boardLayout["y2"] )
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
            element.style[canMoveKey(this.styleType)] = canMoveValue(this.styleType);
            element.style[canMoveKey(this.styleType)] = "";
        }
        elements = document.getElementsByClassName("chess-jail-box")
        for (let i = 0; i < elements.length; i++){
            let element = elements[i];
            element.style[canMoveKey(this.styleType)] = canMoveValue(this.styleType);
            element.style[canMoveKey(this.styleType)] = "";
        }

        for (let i = 0; i < moves.length; i++){
            let editTileDom = document.getElementById(moves[i].pos);
            editTileDom.style[canMoveKey(this.styleType)] = canMoveValue(this.styleType);
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

    validateMove(currentPosition, newPosition, newTurn){
        
        let jailMoves = (this.currentTurn == "Black Jail" && this.isWhite) || (this.currentTurn == "White Jail" && !this.isWhite);
        let monkeyMoves = (this.currentTurn == "Black Rescue" && this.isWhite) || (this.currentTurn == "White Rescue" && !this.isWhite);
        
        let monkeyJumpingNonRescue = (
            (this.currentTurn == "Black Jumping" && newTurn == "White" && this.boardLayout[currentPosition].constructor.name == Monkey.name) ||
            (this.currentTurn == "White Jumping" && newTurn == "Black" && this.boardLayout[currentPosition].constructor.name == Monkey.name) ||
            (this.currentTurn == "Black Jumping" && newTurn == "Black Jumping" && this.boardLayout[currentPosition].constructor.name == Monkey.name) ||
            (this.currentTurn == "White Jumping" && newTurn == "White Jumping" && this.boardLayout[currentPosition].constructor.name == Monkey.name)
        )

        let startMonkeyJumping = (
            (this.currentTurn == "White" && newTurn == "White Jumping" && this.boardLayout[currentPosition].constructor.name == Monkey.name) ||
            (this.currentTurn == "Black" && newTurn == "Black Jumping" && this.boardLayout[currentPosition].constructor.name == Monkey.name)
        )

        let tookRoyalty = (
            ( this.boardLayout[newPosition] && 
                (this.boardLayout[newPosition].constructor.name == Queen.name || this.boardLayout[newPosition].constructor.name == King.name) 
            ) &&
            (
                (newTurn == "White Jail" && this.currentTurn == "White") ||
                (newTurn == "Black Jail" && this.currentTurn == "Black") ||
                (newTurn == "White Jail" && this.currentTurn == "White Jumping") ||
                (newTurn == "Black Jail" && this.currentTurn == "Black Jumping")
            )
        )
        
        let didKingRescue = (
            ( this.boardLayout[newPosition] && this.boardLayout[newPosition].constructor.name == King.name ) &&
            (
                (newTurn == "White Rescue" && this.currentTurn == "White") ||
                (newTurn == "White Rescue" && this.currentTurn == "White Jumping") ||
                (newTurn == "Black Rescue" && this.currentTurn == "Black") ||
                (newTurn == "Black Rescue" && this.currentTurn == "Black Jumping")
            )
        )

        if (
            (newTurn == "White" && this.currentTurn == "Black") ||
            (newTurn == "Black" && this.currentTurn == "White") ||
            tookRoyalty ||
            (this.currentTurn == "White Jail" && newTurn == "Black") ||
            (this.currentTurn == "Black Jail" && newTurn == "White") ||
            didKingRescue ||
            (this.currentTurn == "White Rescue" && newTurn == "Black") ||
            (this.currentTurn == "Black Rescue" && newTurn == "White") ||
            startMonkeyJumping ||
            monkeyJumpingNonRescue
        ) {
            this.currentTurn = newTurn
        } else {
            console.error("new turn is invalid")
            return false
        }

        if (jailMoves){
            return (
                currentPosition?.isTemp() && 
                this.boardLayout[newPosition] == undefined && 
                (
                    (this.boardLayout["TEMP"].isWhite && newPosition.column == "x") || 
                    (!this.boardLayout["TEMP"].isWhite && newPosition.column == "y")
                )
            )
        } else if (monkeyMoves){
            let monkey = this.boardLayout["TEMP"]
            let king = this.boardLayout[monkey.position]

            this.boardLayout[monkey.position] = monkey;

            let legalMoves = this.filterImpossibleMoves(monkey.getJumpingMoves(), monkey.position)
    
            for (let i = 0; i < legalMoves.length; i++){
                if (legalMoves[i].pos == newPosition){ 
                    this.boardLayout[monkey.position] = king;
                    return true;
                }
            }
            console.error("received invalid move")
            return false

        } else {
            let thisPiece = this.boardLayout[currentPosition]
            let legalMoves = this.filterImpossibleMoves(thisPiece.getMoves(), thisPiece.position)

            if (startMonkeyJumping) {
                this.boardLayout["MONKEY_START"] = new Monkey (currentPosition, this.boardLayout[currentPosition].isWhite);
            }
            
            for (let i = 0; i < legalMoves.length; i++){
                if (legalMoves[i].pos == newPosition) return true;
            }

            if (monkeyJumpingNonRescue && currentPosition.id == newPosition.id){
                delete this.boardLayout["MONKEY_START"];
                return true;
            }

            debugger
            console.error("received invalid move")
            return false
        }
    }

    findAndRenderMoves(piece){
        let movesToRender = this.findMoves(piece)
        this.renderMoves(movesToRender)
    }

    renderPiece(tileDom, piece){
        let imageDom = document.createElement("img");
        imageDom.setAttribute("src", "./assets/"+this.styleType+"/"+piece.getImageSrc());
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
                document.getElementById(id).style[canMoveKey(this.styleType)] = ''
            }
        }
        document.getElementById("x1").style[canMoveKey(this.styleType)] = ''
        document.getElementById("x2").style[canMoveKey(this.styleType)] = ''
        document.getElementById("y1").style[canMoveKey(this.styleType)] = ''
        document.getElementById("y2").style[canMoveKey(this.styleType)] = ''
        document.getElementById("z1").style[canMoveKey(this.styleType)] = ''
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