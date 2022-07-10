import {serverID} from "./utils.js";
import {Cookie} from "./cookieManager.js"

function rawJoin(time){
    window.location.href="../game.html?friendRoom=false&timeLimit="+time.toString();
}

window.onload = async () => {


    let raw_join_button = document.getElementById("raw-join");
    let raw_join_timed_button = document.getElementById("raw-join-timed");
    let room_join_button = document.getElementById("room-join");
    let room_join_id = document.getElementById("room-id");
    let room_join_time = document.getElementById("room-time");

    raw_join_button.addEventListener("click", () => rawJoin(100))
    raw_join_timed_button.addEventListener("click", () => rawJoin(15))

    
    room_join_button.addEventListener("click", ()=>{
        window.location.href="../game.html?friendRoom=true&roomID="+room_join_id.value+"&timeLimit="+(room_join_time.value||"100");
    })


    let roomsCount_Dom = document.getElementById("rooms-count")
    let roomsCountRaw = await fetch(serverID()+"/getRoomCount")
    let roomsCountJson = await roomsCountRaw.json();

    roomsCount_Dom.innerText = "Rooms: " + roomsCountJson.roomCount;
}