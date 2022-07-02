import {serverID} from "./utils.js";
import {Cookie} from "./cookieManager.js"

function rawJoin(){
    window.location.href="../game.html?friendRoom=false";
}

window.onload = async () => {


    let raw_join_button = document.getElementById("raw-join");
    let room_join_button = document.getElementById("room-join");
    let room_join_id = document.getElementById("room-id");

    raw_join_button.addEventListener("click", rawJoin)

    room_join_button.addEventListener("click", ()=>{
        window.location.href="../game.html?friendRoom=true&roomID="+room_join_id.value;
    })

    let roomsCount_Dom = document.getElementById("rooms-count")
    let roomsCountRaw = await fetch(serverID()+"/getRoomCount")
    let roomsCountJson = await roomsCountRaw.json();

    roomsCount_Dom.innerText = "Rooms: " + roomsCountJson.roomCount;
}