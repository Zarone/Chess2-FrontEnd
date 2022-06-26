import {serverID, socketID} from "./helper-js/utils.js";
import {getQuerystring} from "./helper-js/utils.js"

window.onload = async () => {
    let {roomID, friendRoom} = getQuerystring()
    console.log("RoomID", roomID)
    console.log("Friend Room", friendRoom)

    if (roomID == undefined){
        let openRoomRaw = await fetch(serverID+"/getOpenRoom")
        let openRoomJson = await openRoomRaw.json()
        let openRoom = openRoomJson.roomID
        console.log(openRoom)
        window.location.href="../client/game.html?roomID="+openRoom.toString();
        return
    }

    let roomID_Dom = document.getElementById("roomID")
    roomID_Dom.innerText = "Room ID: " + roomID

    let jail1_Dom = document.getElementById("jail-1")
    let jail2_Dom = document.getElementById("jail-2")
    let chessBoard_Dom = document.getElementById("chess-board")
    let chessBoardContainer_Dom = document.getElementById("board-container")

    let isWhite = undefined;
    let playerID = undefined;

    let socket = io(socketID)

    socket.emit('joined', {roomID, friendRoom: friendRoom == "true" ? true : false});

    socket.on('player', (playerInfo)=>{
        console.log(playerInfo)
        playerID = playerInfo.pid;
        isWhite = playerInfo.isWhite;

        if (!isWhite){
            jail1_Dom.style.flexWrap = "wrap-reverse"
            jail2_Dom.style.flexWrap = "wrap-reverse"
            chessBoard_Dom.style.flexWrap = "wrap-reverse"
            chessBoard_Dom.style.flexDirection = "row-reverse"
            chessBoardContainer_Dom.style.flexDirection = "row-reverse"
        }

    })

    socket.on('gameOver', winner=>{
        if (playerID == winner){
            alert("you win");
        } else {
            alert("you lose")
        }
    })

}
