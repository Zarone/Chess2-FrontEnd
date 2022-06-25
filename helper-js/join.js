
window.onload = () => {
    let raw_join_button = document.getElementById("raw-join");
    let room_join_button = document.getElementById("room-join");
    let room_join_id = document.getElementById("room-id");

    raw_join_button.addEventListener("click", async ()=>{
        window.location.href="../client/game.html?friendRoom=false";
    })

    room_join_button.addEventListener("click", async ()=>{
        window.location.href="../client/game.html?friendRoom=true&roomID="+room_join_id.value;
    })
}