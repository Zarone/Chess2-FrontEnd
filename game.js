import {serverID} from "./helper-js/utils.js";
import {getQuerystring} from "./helper-js/utils.js"

window.onload = async () => {
    let roomID = getQuerystring().roomID
    console.log("RoomID", roomID)
    if (roomID == undefined){
        let openRoomRaw = await fetch(serverID+"/getOpenRoom")
        let openRoomJson = await openRoomRaw.json()
        let openRoom = openRoomJson.roomID
        console.log(openRoom)
        window.location.href="../client/game.html?roomID="+openRoom.toString();
    } else {
        let roomID_Dom = document.getElementById("roomID")
        roomID_Dom.innerText = "Room ID: " + roomID
    }
}
