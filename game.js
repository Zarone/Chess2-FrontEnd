import { ChessBoard } from "./chess2.js";
import {serverID, socketID} from "./helper-js/utils.js";
import {getQuerystring} from "./helper-js/utils.js"

window.onload = async () => {
    let {roomID, friendRoom} = getQuerystring()

    let gameOverModal_Dom = document.getElementById("myModal")
    let modalHeading_Dom = document.getElementById("modal-heading")
    let gameOverModal = new bootstrap.Modal(gameOverModal_Dom, {keyboard: false})

    if (roomID == undefined){
        let openRoomRaw = await fetch(serverID+"/getOpenRoom")
        let openRoomJson = await openRoomRaw.json()
        let openRoom = openRoomJson.roomID
        console.log(openRoom)
        if (openRoom == null){
            gameOverModal.toggle();
            modalHeading_Dom.innerText = "Maximum players on server. Please try again later."
        } else {
            window.location.href="../client/game.html?roomID="+openRoom.toString();
        }
        return
    }

    let roomID_Dom = document.getElementById("roomID")
    roomID_Dom.innerText = "Room ID: " + roomID
    let turn_Dom = document.getElementById("turn")

    let jail1_Dom = document.getElementById("jail-1")
    let jail2_Dom = document.getElementById("jail-2")
    let chessBoard_Dom = document.getElementById("chess-board")
    let chessBoardContainer_Dom = document.getElementById("board-container")

    let playerID = undefined;

    let socket = io(socketID)

    socket.emit('joined', {roomID, friendRoom: friendRoom == "true" ? true : false});

    socket.on("maximumPlayers", ()=>{
        gameOverModal.toggle();
        modalHeading_Dom.innerText = "Maximum players on server. Please try again later."
    })
    
    let chessBoard = new ChessBoard((moveInfo)=>{
        socket.emit("makeMove", {player: playerID, room: roomID, moveInfo})
        // turn_Dom.innerText = "...Waiting for player to join"
    })

    socket.on('player', (playerInfo)=>{
        // console.log(playerInfo)
        playerID = playerInfo.pid;

        chessBoard.isWhite = playerInfo.isWhite
        turn_Dom.innerText = "...Waiting for player to join"
        
        if (!playerInfo.isWhite){
            jail1_Dom.style.flexWrap = "wrap-reverse"
            jail2_Dom.style.flexWrap = "wrap-reverse"
            chessBoard_Dom.style.flexWrap = "wrap-reverse"
            chessBoard_Dom.style.flexDirection = "row-reverse"
            chessBoardContainer_Dom.style.flexDirection = "row-reverse"
        }

    })

    socket.on("twoPlayers", ()=>{
        turn_Dom.innerText = "Turn: " + chessBoard.currentTurn
    })

    socket.on('gameOver', ({room, id})=>{
        if (room == roomID){
            if (playerID == id){
                gameOverModal.toggle()
                modalHeading_Dom.innerText = "You Win! 💯"
            } else {
                gameOverModal.toggle()
                modalHeading_Dom.innerText = "You Lost. Better Luck Next Time 😊"
            }
        }
    })
    
    chessBoard.updatePieces()

    socket.on("registeredMove", args=>{
        console.log("registered move")
        console.log(args, roomID, playerID)
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
    
    document.addEventListener("mouseup", event => chessBoard.dragEnd(event))
    document.addEventListener("mousemove", event=>chessBoard.cursorMove(event))


}
