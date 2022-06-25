import {getQuerystring} from "./helper-js/utils.js"

window.onload = () => {
    let roomID = getQuerystring().roomID
    let roomID_Dom = document.getElementById("roomID")
    console.log("RoomID", roomID)
    roomID_Dom.innerText = "Room ID: " + roomID
}
