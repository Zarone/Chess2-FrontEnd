import {serverID} from "./utils.js";

window.onload = () => {
    let raw_join_button = document.getElementById("raw-join");
    let room_join_button = document.getElementById("room-join");
    let room_join_id = document.getElementById("room-id");

    raw_join_button.addEventListener("click", async ()=>{
        let openRoomRaw = await fetch(serverID+"/getOpenRoom")
        let openRoomJson = await openRoomRaw.json()
        let openRoom = openRoomJson.roomID
        console.log(openRoom)
        console.log("testing")
        window.location.href="../client/game.html?roomID=200";
    })
}