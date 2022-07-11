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

    
    // room_join_button.addEventListener("click", ()=>{
    //     window.location.href="../game.html?friendRoom=true&roomID="+room_join_id.value+"&timeLimit="+(room_join_time.value||"100");
    // })


    let roomsCount_Dom = document.getElementById("rooms-count")
    let roomsCountRaw = await fetch(serverID()+"/getRoomCount")
    let roomsCountJson = await roomsCountRaw.json();

    roomsCount_Dom.innerText = "Rooms: " + roomsCountJson.roomCount;
}

foam.ENUM({
    package: 'chess2',
    name: 'GameMode',

    values: [
        { name: 'PLAYER_VS_PLAYER'   , label: 'Two Players'   },

        // TODO: implement these game modes
        // { name: 'PLAYER_ALONE'       , label: 'Singleplayer'  },
        // { name: 'PLAYER_VS_COMPUTER' , label: 'Battle the AI' },
    ]
});

foam.CLASS({
    package: 'chess2',
    name: 'GameConfig',

    properties: [
        {
            name: 'mode',
            class: 'Enum',
            of: 'chess2.GameMode'
        },
        {
            name: 'roomID',
            class: 'String',
            required: true
        },
        {
            name: 'playerTimeLimit',
            class: 'Duration',
            label: 'Time per Player'
        }
    ],

    actions: [
        {
            name: 'start',
            buttonStyle: 'PRIMARY',
            isEnabled: function ( roomID ) {
                return roomID != '';
            },
            code: function () {
                let url = "../game.html?friendRoom=true";
                url += `&roomID=${this.roomID}`;
                url += `&timeLimit=${this.playerTimeLimit || 100}`;
                window.location.href = url;
            }
        }
    ]
});

foam.CLASS({
    package: 'chess2',
    name: 'GameConfigView',
    extends: 'foam.u2.View',

    requires: [
        'foam.u2.borders.Block'
    ],

    properties: [
        {
            name: 'data',
            factory: function () {
                return chess2.GameConfig.create();
            }
        }
    ],

    css: `
        ^ {
            margin-top: 40px;
        }
        ^ input, ^ select {
            font-size: 1rem;
        }
        ^ button.btn {
            width: 100%;
        }
        ^row {
            display: flex;
            gap: 1.5rem;
        }
        ^row .foam-u2-PropertyBorder-propHolder > * {
            gap: 0 !important;
        }
        ^ .foam-u2-PropertyBorder-errorText {
            font-size: 1rem;
            color: #FAA;
        }
    `,

    methods: [
        function render() {
            this
                .addClass()
                .start('h2').add('Custom Game').end()
                .start()
                    .start()
                        .addClass(this.myClass('row'))
                        .tag(this.data.MODE.__)
                        .tag(this.data.ROOM_ID.__)
                        .tag(this.data.PLAYER_TIME_LIMIT.__)
                    .end()
                    .start('button')
                        .addClasses(['btn', 'btn-primary', 'btn-block'])
                        .attrs({
                            disabled: this.data.roomID$.map(v => !v)
                        })
                        .add(this.data.START.label)
                        .on('click', () => {
                            this.data.start();
                        })
                    .end()
                .end()
        }
    ]
});