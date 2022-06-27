import {Rook} from "./pieces-js/Rook.js"
import {Monkey} from "./pieces-js/Monkey.js"
import {Fish} from "./pieces-js/Fish.js"
import {FishQueen} from "./pieces-js/FishQueen.js"
import {Queen} from "./pieces-js/Queen.js"
import {King} from "./pieces-js/King.js"
import {Elephant} from "./pieces-js/Elephant.js"
import {Bear} from "./pieces-js/Bear.js"

import {nextToJail, toID} from "./helper-js/utils.js"

export class ChessBoard {

    boardLayout = {} // set in constructor
    dragging = false
    draggingRoyalty = false
    draggingMonkey = false
    draggingPiece = null
    draggingPieceWidth = null
    draggingPieceHeight = null
    draggingPieceDom = null

    isWhite = undefined

    rookActiveWhite = false;
    rookActiveBlack = false;

    currentTurn = "White"; // either "White", "Black", "White Jail", "Black Jail", "White Monkey", "Black Monkey"

    makeMoveCallbackFunc = undefined;

    constructor(callback){
        this.boardLayout = {
            "a8": new Rook("a8", false),
            "b8": new Monkey("b8", false),
            "c8": new Fish("c8", false),
            "d8": new Queen("d8", false),
            // "e8": new King("e8", false),
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
            // "e1": new King("e1", true),
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

            "x1": new King("x1", true),
            "y1": new King("y1", false)
        }

        this.makeMoveCallbackFunc = callback;
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
        
        this.draggingPiece = this.boardLayout[event.srcElement.parentNode.id]
        
        let sameColorAsPlayer = (this.draggingPiece.isWhite == null || (this.isWhite && this.draggingPiece.isWhite) || (!this.isWhite && !this.draggingPiece.isWhite))
        if (!sameColorAsPlayer) return;

        this.draggingPieceDom = event.target
        this.draggingPieceWidth = event.target.offsetWidth
        this.draggingPieceHeight = event.target.offsetHeight
        this.dragging = true
        
        this.findAndRenderMoves(this.draggingPiece)
    }

    dragEnd(event){

        if (!this.dragging) return

        this.draggingPieceDom.parentNode.removeChild(this.draggingPieceDom.parentNode.lastChild)

        let attemptMoveTo = document.elementFromPoint(event.clientX, event.clientY)

        if (attemptMoveTo.nodeName == "IMG"){
            attemptMoveTo = attemptMoveTo.parentElement
        }

        this.makeMove(attemptMoveTo)
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

            let rowName = toPos.split("")[1]
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
                document.getElementById("y1").style.backgroundColor = 'red'
            }
            if (this.boardLayout["y2"] == undefined) {
                document.getElementById("y2").style.backgroundColor = 'red'
            }
        } else {
            if (this.boardLayout["x1"] == undefined) {
                document.getElementById("x1").style.backgroundColor = 'red'
            }
            if (this.boardLayout["x2"] == undefined) {
                document.getElementById("x2").style.backgroundColor = 'red'
            }
        }
    }

    renderMovesForJumpingMonkey(piece){
        this.boardLayout["TEMP"].position = piece.position
        this.renderMoves(this.boardLayout["TEMP"].getMoves())
    }

    manageTakeKingOrQueen(piece){
        this.draggingPieceDom = document.createElement('img');
        this.draggingPieceDom.setAttribute("src", "./images/"+piece.getImageSrc());
        this.draggingPieceDom.setAttribute("class", "piece-image");

        document.getElementById("x1").appendChild(this.draggingPieceDom);

        this.draggingPieceWidth = this.draggingPieceDom.offsetWidth
        this.draggingPieceHeight = this.draggingPieceDom.offsetHeight
        this.dragging = true
        this.draggingRoyalty = true

        this.draggingPiece = piece;

        this.renderMovesForTakenKingQueen()
    }

    manageMonkeyJumping(piece){
        this.draggingPieceDom = document.createElement('img');

        console.log("this.boardLayout[\"TEMP\"]", this.boardLayout["TEMP"])

        this.draggingPieceDom.setAttribute("src", "./images/"+this.boardLayout["TEMP"].getImageSrc());
        this.draggingPieceDom.setAttribute("class", "piece-image");

        document.getElementById("x1").appendChild(this.draggingPieceDom);

        this.draggingPieceWidth = this.draggingPieceDom.offsetWidth
        this.draggingPieceHeight = this.draggingPieceDom.offsetHeight
        this.dragging = true
        this.draggingMonkey = true

        this.draggingPiece = this.boardLayout["TEMP"];

        this.renderMovesForJumpingMonkey(piece)
    }

    makeMove(moveToDom){
        let classNames = moveToDom.className.split(" ")
        
        if (this.draggingRoyalty){

            if (!classNames.includes("chess-box") && !classNames.includes("chess-jail-box")){
                console.log("not a tile on the game board")
            } else if (moveToDom.id == this.draggingPiece.position){
                console.log("moving to same tile as you're already on")
            } else if (moveToDom.style.backgroundColor == 'red'){
                
                let toPos = moveToDom.id;
                this.boardLayout[toPos] = this.draggingPiece
                this.boardLayout[toPos].position = this.boardLayout[toPos];
                
                this.draggingRoyalty = false;
                this.dragging = false
                this.resetTiles();
                this.updatePieces();

                let newTurn;
                if (this.currentTurn == "White Jail") {
                    newTurn = "Black"
                } else if (this.currentTurn == "Black Jail") {
                    newTurn = "White"
                }
    
                this.currentTurn = newTurn
    
                this.makeMoveCallbackFunc({fromPos: "TEMP", toPos, newTurn})
            }
            
        } else {
            
            let tookKingOrQueen = false;
            let monkeyJumping = false;
            
            let tempPiece = undefined;

            if (!classNames.includes("chess-box") && !classNames.includes("chess-jail-box")){
                console.log("not a tile on the game board")
            } else if (moveToDom.id == this.draggingPiece.position){
                console.log("moving to same tile as you're already on")
            } else if(moveToDom.style.backgroundColor == 'red'){
    
                let toPos = moveToDom.id;
                
                let fromPos = this.draggingPiece.position;
    
                let column = toPos.split("")[0]

                // if monkey prison break
                if (column == "x" || column == "y"){
                    monkeyJumping = true;

                    let nextTo = nextToJail(toPos)

                    this.boardLayout[nextTo] = this.boardLayout[toPos]
                    this.boardLayout[nextTo].position = nextTo

                    tempPiece = this.boardLayout[toPos]
                    this.boardLayout["TEMP"] = this.boardLayout[fromPos]
                    console.log("set to", this.boardLayout["TEMP"])
                    delete this.boardLayout[fromPos]

                    let newTurn;
                    if (this.currentTurn == "White") {
                        newTurn = "White Monkey"
                    } else if (this.currentTurn == "Black") {
                        newTurn = "Black Monkey"
                    }
                    this.currentTurn = newTurn
                    this.makeMoveCallbackFunc({fromPos, toPos, newTurn})

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
        
                    let newTurn;
                    if (this.currentTurn == "White") {
                        if (tookKingOrQueen) {
                            newTurn = "White Jail"
                        } else {
                            newTurn = "Black"
                        }
                    } else if (this.currentTurn == "Black") {
                        if (tookKingOrQueen) {
                            newTurn = "Black Jail"
                        } else {
                            newTurn = "White"
                        }
                    }
                    this.currentTurn = newTurn
                    this.makeMoveCallbackFunc({fromPos, toPos, newTurn})
                }
    
                
            }
            
            this.dragging = false
            this.resetTiles();
            this.updatePieces();
    
            if (tookKingOrQueen) this.manageTakeKingOrQueen(tempPiece);
            if (monkeyJumping) this.manageMonkeyJumping(tempPiece);
        }

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
                            rookActiveBlack: this.rookActiveBlack
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
        this.stateChecks(fromPos, toPos)

        if (this.boardLayout[toPos] != undefined) this.boardLayout["TEMP"] = this.boardLayout[toPos]

        this.boardLayout[toPos] = this.boardLayout[fromPos]

        this.boardLayout[toPos].position = toPos

        delete this.boardLayout[fromPos]

        this.resetTiles();
        this.updatePieces();
    }

    renderMoves(moves){
        for (let i = 0; i < moves.length; i++){
            let editTileDom = document.getElementById(moves[i].pos);
            editTileDom.style.backgroundColor = 'red'
        }
    }

    findMoves(piece){
        let movesFromPiece = piece.getMoves()
        return this.filterImpossibleMoves(movesFromPiece, piece.position)
    }

    validateMove(currentPosition, newPosition, newTurn){
        
        let jailMoves = (this.currentTurn == "Black Jail" && this.isWhite) || (this.currentTurn == "White Jail" && !this.isWhite);
        
        if (
            (newTurn == "White" && this.currentTurn == "Black") ||
            (newTurn == "Black" && this.currentTurn == "White") ||
            (
                ( this.boardLayout[newPosition] && (this.boardLayout[newPosition].constructor.name == Queen.name || this.boardLayout[newPosition].constructor.name == King.name) ) &&
                (
                    (newTurn == "White Jail" && this.currentTurn == "White") ||
                    (newTurn == "Black Jail" && this.currentTurn == "Black")
                )
            ) ||
            (this.currentTurn == "White Jail" && newTurn == "Black") ||
            (this.currentTurn == "Black Jail" && newTurn == "White")
        ) {
            this.currentTurn = newTurn
        } else {
            console.error("new turn is invalid")
            return false
        }

        if (jailMoves){
            return (
                currentPosition == "TEMP" && 
                this.boardLayout[newPosition] == undefined && 
                (
                    (this.boardLayout["TEMP"].isWhite && newPosition.split("")[0] == "x") || 
                    (!this.boardLayout["TEMP"].isWhite && newPosition.split("")[0] == "y")
                )
            )
        } else {
            let thisPiece = this.boardLayout[currentPosition]
            let legalMoves = this.filterImpossibleMoves(thisPiece.getMoves(), thisPiece.position)
    
            for (let i = 0; i < legalMoves.length; i++){
                if (legalMoves[i].pos == newPosition) return true;
            }
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
        imageDom.setAttribute("src", "./images/"+piece.getImageSrc());
        imageDom.setAttribute("class", "piece-image");
        while (tileDom.hasChildNodes()) {
            tileDom.removeChild(tileDom.lastChild);
        }
        tileDom.appendChild(imageDom)
    }

    addPieceEvents(tileDom){
        tileDom.addEventListener("dragstart", event => this.dragStart(event))
    }

    resetTiles(){
        for (let i = 1; i < 9; i++){
            for (let j = 1; j < 9; j++){
                let id = toID[i]+(j);
                document.getElementById(id).style.backgroundColor = ''
            }
        }
        document.getElementById("x1").style.backgroundColor = ''
        document.getElementById("x2").style.backgroundColor = ''
        document.getElementById("y1").style.backgroundColor = ''
        document.getElementById("y2").style.backgroundColor = ''
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