import {serverID} from "./utils.js";
import {Cookie} from "./cookieManager.js"

import { GameMode, GameModes } from "../../src/helper-js/GameModes"

function rawJoin(time){
    window.location.href=`../game.html?gamemode=${GameModes.PLAYER_VS_PLAYER.modeName}&friendRoom=false&timeLimit=${time.toString()}`;
}

function rawSinglePlayer(time){
    window.location.href="../game.html?friendRoom=false&timeLimit="+time.toString();
}

window.onload = async () => {


    let raw_join_button = document.getElementById("raw-join");
    let raw_join_timed_button = document.getElementById("raw-join-timed");
    let raw_singleplayer = document.getElementById("raw-singleplayer");
    let room_join_button = document.getElementById("room-join");
    let room_join_id = document.getElementById("room-id");
    let room_join_time = document.getElementById("room-time");

    raw_join_button.addEventListener("click", () => rawJoin(100))
    raw_join_timed_button.addEventListener("click", () => rawJoin(15))
    raw_singleplayer.addEventListener("click", () => rawSinglePlayer(100))

    
    // room_join_button.addEventListener("click", ()=>{
    //     window.location.href="../game.html?friendRoom=true&roomID="+room_join_id.value+"&timeLimit="+(room_join_time.value||"100");
    // })


    let roomsCount_Dom = document.getElementById("rooms-count")
    let roomsCountRaw = await fetch(serverID()+"/getRoomCount")
    let roomsCountJson = await roomsCountRaw.json();

    roomsCount_Dom.innerText = "Rooms: " + roomsCountJson.roomCount;
}

// foam.ENUM({
//     package: 'chess2',
//     name: 'GameMode',

//     // 'GameModes' is the source of truth now, so generate
//     // enum options dynamically
//     values: Object.keys(GameModes).map(k => {
//         return { name: GameModes[k].modeName, label: GameModes[k].label };
//     }).filter(gm => gm.name != 'TEST_MODE')
// });

// foam.CLASS({
//     package: 'chess2',
//     name: 'GameConfig',

//     requires: [
//         'chess2.GameMode'
//     ],

//     properties: [
//         {
//             name: 'mode',
//             class: 'Enum',
//             of: 'chess2.GameMode'
//         },
//         {
//             name: 'roomID',
//             class: 'String',
//             visibility: function (mode) {
//                 return GameModes[mode.name].singleplayer ? 'HIDDEN' : 'RW';
//             }
//         },
//         {
//             name: 'playerTimeLimit',
//             class: 'Duration',
//             label: 'Time per Player'
//         }
//     ],

//     actions: [
//         {
//             name: 'start',
//             buttonStyle: 'PRIMARY',
//             code: function () {
//                 let url = "../game.html?friendRoom=true";
//                 if ( this.roomID ) url += `&roomID=${this.roomID}`;
//                 url += `&timeLimit=${this.playerTimeLimit || 100}`;
//                 url += `&gamemode=${this.mode.name}`;
//                 window.location.href = url;
//             }
//         }
//     ]
// });

// foam.CLASS({
//     package: 'chess2',
//     name: 'GameConfigView',
//     extends: 'foam.u2.View',

//     requires: [
//         'foam.u2.borders.Block',
//         'chess2.GameMode',
//     ],

//     properties: [
//         {
//             name: 'data',
//             factory: function () {
//                 return chess2.GameConfig.create();
//             }
//         }
//     ],

//     css: `
//         ^ {
//             margin-top: 40px;
//         }
//         ^ input, ^ select {
//             font-size: 1rem;
//         }
//         ^ button.btn {
//             width: 100%;
//         }
//         ^row {
//             display: flex;
//             gap: 1.5rem;
//         }
//         ^row .foam-u2-PropertyBorder-propHolder > * {
//             gap: 0 !important;
//         }
//         ^ .foam-u2-PropertyBorder-errorText {
//             font-size: 1rem;
//             color: #FAA;
//         }
//     `,

//     methods: [
//         function render() {
//             const self = this;
//             this
//                 .addClass()
//                 .start('h2').add('Custom Game').end()
//                 .start()
//                     .start()
//                         .addClass(this.myClass('row'))
//                         .tag(this.data.MODE.__)
//                         .tag(this.data.ROOM_ID.__)
//                         .tag(this.data.PLAYER_TIME_LIMIT.__)
//                     .end()
//                     .start('button')
//                         .addClasses(['btn', 'btn-primary', 'btn-block'])
//                         .attrs({
//                             disabled: this.slot(function (data$roomID, data$mode) {
//                                 if ( GameModes[data$mode.name].singleplayer ) {
//                                     return false;
//                                 }
//                                 return ! data$roomID;
//                             })
//                         })
//                         .add(this.data.START.label)
//                         .on('click', () => {
//                             this.data.start();
//                         })
//                     .end()
//                 .end()
//         }
//     ]
// });