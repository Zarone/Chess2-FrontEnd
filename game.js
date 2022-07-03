import { ChessBoard } from "./chess2.js";
import {serverID, socketID , LOSE_TEXT, WIN_TEXT, disconnectText, DISCONNECT_TIMER_START} from "./helper-js/utils.js";
import {getQuerystring} from "./helper-js/utils.js"
import {Cookie} from "./helper-js/cookieManager.js"
import { Bear } from "./pieces-js/Bear.js";
import { Elephant } from "./pieces-js/Elephant.js";
import { FishQueen } from "./pieces-js/FishQueen.js";
import { Monkey } from "./pieces-js/Monkey.js";
import { Fish } from "./pieces-js/Fish.js";
import { King } from "./pieces-js/King.js";
import { Queen } from "./pieces-js/Queen.js";
import { Rook } from "./pieces-js/Rook.js";

window.onload = async () => {
    let {roomID, friendRoom} = getQuerystring()

    let cookie = new Cookie();

    let playerID = parseInt(cookie.pid)

    let gameOverModal_Dom = document.getElementById("myModal")
    let modalHeading_Dom = document.getElementById("modal-heading")
    let gameOverModal = new bootstrap.Modal(gameOverModal_Dom, {keyboard: false})

    if (roomID == undefined){
        roomID = null
        // let openRoomRaw = await fetch(serverID()+"/getOpenRoom")
        // let openRoomJson = await openRoomRaw.json()
        // let openRoom = openRoomJson.roomID
        // if (openRoom == null){
        //     gameOverModal.toggle();
        //     modalHeading_Dom.innerText = "Maximum players on server. Please try again later."
        // } else {
        //     window.location.href="../game.html?roomID="+openRoom.toString();
        // }
        // return
    }

    let roomID_Dom = document.getElementById("roomID")
    let turn_Dom = document.getElementById("turn")
    turn_Dom.innerText = "...Waiting for player to join"

    let jail1_Dom = document.getElementById("jail-1")
    let jail2_Dom = document.getElementById("jail-2")
    let chessBoard_Dom = document.getElementById("chess-board")
    let chessBoardContainer_Dom = document.getElementById("board-container")

    let socket = io(socketID())

    let disconnectTimer = DISCONNECT_TIMER_START
    socket.on("disconnect", () => {
        gameOverModal.toggle()
        disconnectTimer = DISCONNECT_TIMER_START
        modalHeading_Dom.innerText = disconnectText(disconnectTimer)

        let timer = setInterval(()=>{
            if (disconnectTimer < 0){
                modalHeading_Dom.innerText = LOSE_TEXT
            } else {
                disconnectTimer -= 1;
                modalHeading_Dom.innerText = disconnectText(disconnectTimer)
            }
        }, 1000)
    })

    socket.emit('joined', {roomID, friendRoom: friendRoom == "true" ? true : false, playerID});

    socket.on("maximumPlayers", ()=>{
        gameOverModal.toggle();
        modalHeading_Dom.innerText = "Maximum players on server. Please try again later."
    })

    socket.on("fullRoom", ()=>{
        gameOverModal.toggle();
        modalHeading_Dom.innerText = "The room you tried to join is full."
    })
    
    let chessBoard = new ChessBoard(
        (moveInfo)=>{
            socket.emit("makeMove", {player: playerID, room: roomID, moveInfo})
            turn_Dom.innerText = "Turn: "+chessBoard.currentTurn
        },
        ()=>{
            socket.emit("admitDefeat")
            gameOverModal.toggle()
            modalHeading_Dom.innerText = LOSE_TEXT
        }
    )

    socket.on('player', (playerInfo)=>{

        console.log("on player")

        playerID = playerInfo.pid;
        if (cookie.pid !== playerID){
            cookie.pid = playerID.toString();
            cookie.setCookie()
        }

        roomID = playerInfo.roomID
        roomID_Dom.innerText = "Room ID: " + playerInfo.roomID

        chessBoard.isWhite = playerInfo.isWhite
        
        if (!playerInfo.isWhite){
            jail1_Dom.style.flexWrap = "wrap-reverse"
            jail2_Dom.style.flexWrap = "wrap-reverse"
            chessBoard_Dom.style.flexWrap = "wrap-reverse"
            chessBoard_Dom.style.flexDirection = "row-reverse"
            chessBoardContainer_Dom.style.flexDirection = "row-reverse"
        }

    })

    socket.on("twoPlayers", (sentRoomID)=>{
        if (roomID == sentRoomID){
            chessBoard.currentTurn = "White"
            turn_Dom.innerText = "Turn: " + chessBoard.currentTurn
        }
    })

    socket.on('gameOver', ({room, id})=>{
        if (room == roomID){
            if (playerID == id){
                gameOverModal.toggle()
                modalHeading_Dom.innerText = WIN_TEXT
            } else {
                gameOverModal.toggle()
                modalHeading_Dom.innerText = LOSE_TEXT
            }
        }
    })
    
    chessBoard.updatePieces()

    socket.on("registeredMove", args=>{
        if (roomID == args.room && playerID != args.player){
            if (chessBoard.validateMove(args.moveInfo.fromPos, args.moveInfo.toPos, args.moveInfo.newTurn)){
                chessBoard.makePreValidatedMove(args.moveInfo.fromPos, args.moveInfo.toPos);
                chessBoard.currentTurn = args.moveInfo.newTurn
                turn_Dom.innerText = "Turn: " + chessBoard.currentTurn
            } else {
                console.error("move is not allowed")
            }
        }
    })
    
    socket.on("needReconnectData", args=>{
        if (roomID == args.roomID && playerID != args.playerID){
            socket.emit("reconnectData", {
                layout: Object.keys(chessBoard.boardLayout).map((val, index)=>{
                    return {position: val, isWhite: chessBoard.boardLayout[val].isWhite, type: chessBoard.boardLayout[val].constructor.name, hasBanana: chessBoard.boardLayout[val].hasBanana }
                }), 
                rookActiveWhite: chessBoard.rookActiveWhite,
                rookActiveBlack: chessBoard.rookActiveBlack,
                currentTurn: chessBoard.currentTurn
            })
        }
    })

    socket.on("partialReconnect", playerInfo=>{

        playerID = playerInfo.pid;
        if (cookie.pid !== playerID){
            cookie.pid = playerID.toString();
            cookie.setCookie()
        }

        roomID = playerInfo.roomID
        roomID_Dom.innerText = "Room ID: " + playerInfo.roomID

        chessBoard.isWhite = playerInfo.isWhite
        
        if (!playerInfo.isWhite){
            jail1_Dom.style.flexWrap = "wrap-reverse"
            jail2_Dom.style.flexWrap = "wrap-reverse"
            chessBoard_Dom.style.flexWrap = "wrap-reverse"
            chessBoard_Dom.style.flexDirection = "row-reverse"
            chessBoardContainer_Dom.style.flexDirection = "row-reverse"
        }
    })

    socket.on("establishReconnection", (args)=>{
        
        gameOverModal.hide()

        if (args.roomID == roomID && args.pid != playerID){
                        
            chessBoard.boardLayout = {};
            for (let i = 0; i < args.layout.length; i++){
                switch (args.layout[i].type) {
                    case Bear.name:
                        chessBoard.boardLayout[args.layout[i].position] = new Bear(args.layout[i].position)
                        break;
                    case Elephant.name:
                        chessBoard.boardLayout[args.layout[i].position] = 
                            new Elephant(args.layout[i].position, args.layout[i].isWhite)
                        break;
                    case Fish.name:
                        chessBoard.boardLayout[args.layout[i].position] = 
                            new Fish(args.layout[i].position, args.layout[i].isWhite)
                        break;
                    case FishQueen.name:
                        chessBoard.boardLayout[args.layout[i].position] = 
                            new FishQueen(args.layout[i].position, args.layout[i].isWhite)
                        break;
                    case King.name:
                        chessBoard.boardLayout[args.layout[i].position] = 
                            new King(args.layout[i].position, args.layout[i].isWhite)
                        chessBoard.boardLayout[args.layout[i].position].hasBanana = args.layout[i].hasBanana
                        break;
                    case Monkey.name:
                        chessBoard.boardLayout[args.layout[i].position] = 
                            new Monkey(args.layout[i].position, args.layout[i].isWhite)
                        break;
                    case Queen.name:
                        chessBoard.boardLayout[args.layout[i].position] = 
                            new Queen(args.layout[i].position, args.layout[i].isWhite)
                        break;
                    case Rook.name:
                        chessBoard.boardLayout[args.layout[i].position] = 
                            new Rook(args.layout[i].position, args.layout[i].isWhite)
                        break;
                    default:
                        break;
                }
            }
            chessBoard.rookActiveWhite = args.rookActiveWhite;
            chessBoard.rookActiveBlack = args.rookActiveBlack;
            chessBoard.currentTurn = args.currentTurn;
            turn_Dom.innerText = "Turn: " + chessBoard.currentTurn

            chessBoard.updatePieces();
            
            // if the player was holding royalty piece when they disconnected
            if(
                chessBoard.boardLayout["TEMP"] &&
                (chessBoard.boardLayout["TEMP"].constructor.name == Queen.name || chessBoard.boardLayout["TEMP"].constructor.name == King.name) &&
                (
                    (chessBoard.currentTurn == "White Jail" && chessBoard.isWhite) ||
                    (chessBoard.currentTurn == "Black Jail" && !chessBoard.isWhite)
                )
            ){
                chessBoard.manageTakeKingOrQueen(chessBoard.boardLayout["TEMP"])
            } else if (
                chessBoard.boardLayout["TEMP"] &&
                chessBoard.boardLayout["TEMP"].constructor.name == Monkey.name &&
                (
                    (chessBoard.currentTurn == "White Monkey" && chessBoard.isWhite) ||
                    (chessBoard.currentTurn == "Black Monkey" && !chessBoard.isWhite)
                )
            ){
                let location = null;
                if (chessBoard.isWhite){
                    if (chessBoard.boardLayout["a4"] && chessBoard.boardLayout["a4"].constructor.name == King.name){
                        location = "a4"
                    } else if (chessBoard.boardLayout["a5"] && chessBoard.boardLayout["a5"].constructor.name == King.name){
                        location = "a5"
                    }
                } else {
                    if (chessBoard.boardLayout["h4"] && chessBoard.boardLayout["h4"].constructor.name == King.name){
                        location = "h4"
                    } else if (chessBoard.boardLayout["h5"] && chessBoard.boardLayout["h5"].constructor.name == King.name){
                        location = "h5"
                    }
                }
                chessBoard.manageMonkeyJumping(chessBoard.boardLayout[location])
            }
            
        }
    })
    
    document.addEventListener("mouseup", event => chessBoard.dragEnd(event))
    document.addEventListener("mousemove", event=>chessBoard.cursorMove(event))


}
