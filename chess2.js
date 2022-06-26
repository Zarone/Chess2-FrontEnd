import {Rook} from "./pieces-js/Rook.js"
import {Monkey} from "./pieces-js/Monkey.js"
import {Fish} from "./pieces-js/Fish.js"
import {Queen} from "./pieces-js/Queen.js"
import {King} from "./pieces-js/King.js"
import {Elephant} from "./pieces-js/Elephant.js"
import {Bear} from "./pieces-js/Bear.js"

export class ChessBoard {

    boardLayout = {} // set in constructor
    dragging = false
    draggingPiece = null
    draggingPieceWidth = null
    draggingPieceHeight = null
    draggingPieceDom = null

    constructor(){
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

            "a2": new Fish("a1", true),
            "b2": new Fish("b1", true),
            "c2": new Elephant("c1", true),
            "d2": new Fish("d1", true),
            "e2": new Fish("e1", true),
            "f2": new Elephant("f1", true),
            "g2": new Fish("g1", true),
            "h2": new Fish("h1", true),

            "z1": new Bear("z1")
        }
    }

    cursorMove(event){
        if (this.dragging){
            // console.log(event)
            this.draggingPieceDom.style.left = (event.clientX - this.draggingPieceWidth/2 - 0) + "px"
            this.draggingPieceDom.style.top = (event.clientY - this.draggingPieceHeight/2 - 0) + "px"
        }
    }

    dragStart(event){
        console.log("drag start", event.target)

        this.draggingPieceDom = event.target
        this.draggingPieceWidth = event.target.offsetWidth
        this.draggingPieceHeight = event.target.offsetHeight
        event.preventDefault();
        this.draggingPiece = this.boardLayout[event.srcElement.parentNode.id]
        this.dragging = true
    }

    dragEnd(event){
        this.draggingPieceDom.parentNode.removeChild(this.draggingPieceDom.parentNode.lastChild)

        
        let attemptMoveTo = document.elementFromPoint(event.clientX, event.clientY)
        console.log("drag end", attemptMoveTo)

        this.dragging = false
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

    updatePieces(){
        let allPieces = Object.keys(this.boardLayout)
        for (let i = 0; i < allPieces.length; i++){
            let tileDom = document.getElementById(allPieces[i]);
            let piece = this.boardLayout[allPieces[i]]
            
            this.renderPiece(tileDom, piece)
            
            this.addPieceEvents(tileDom)
        }
    }
}