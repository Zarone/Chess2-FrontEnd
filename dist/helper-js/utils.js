import { GameModes } from "../../src/helper-js/GameModes"
import { Position } from "./board.js"

const herokuServerID = "https://chess2-api.herokuapp.com"
const herokuSocketID = "ws://chess2-api.herokuapp.com"
const localServerID = "http://127.0.0.1:8080"
const localSocketID = "ws://127.0.0.1:8080"

export function goToGame({modeName, roomID, timeLimit, computerLevel, computerType}){
    let url = "../game.html?friendRoom=true";
    if ( roomID ) url += `&roomID=${roomID}`;
    url += `&timeLimit=${timeLimit || 100}`;
    url += `&gamemode=${modeName || GameModes.SINGLE_PLAYER.modeName}`;
    url += `&computerLevel=${computerLevel}`
    url += `&computerType=${computerType}`
    window.location.href = url;
}

export const canMoveColor = "red"
export const prevMoveColor = "green"

// export const START_TIME = 60 * 5

export const DISCONNECT_TIMER_START = 30

export const LOSE_TEXT = "You Lost. Better Luck Next Time! 😊"
export const WIN_TEXT = "You Win! 💯"
export const NEUTRAL_GAME_OVER = "Game Over"

export function disconnectText(secondRemaining){
    return "You've disconnect 😥 You have " + secondRemaining.toString() + " seconds to reconnect. Try reload the page."
}

export function serverID(){
    if (window.location.href.split(":")[1] == "//127.0.0.1" || window.location.href.split(":")[1] == "//localhost"){
        return localServerID
    }
    return herokuServerID
}

export function socketID(){
    if (window.location.href.split(":")[1] == "//127.0.0.1" || window.location.href.split(":")[1] == "//localhost"){
        return localSocketID
    }
    return herokuSocketID
}

export function getQuerystring() {
    let output={timeLimit: undefined}
    if(window.location.search){
    var queryParams = window.location.search.substring(1);
    var listQueries = queryParams.split("&");
        for(var query in listQueries) {
            if (listQueries.hasOwnProperty(query)) {
                var queryPair = listQueries[query].split('=');
                output[queryPair[0]] = decodeURIComponent(queryPair[1] || "");
            }
        }
    }
    return output;
}

// These exports are now static members of Position
export const toID = Position.toID;
export const toNum = Position.toNum;
export const getVerticalAndHorizontal = Position.getVerticalAndHorizontal;
export const verticalAndHorizontalToID = Position.verticalAndHorizontalToID;

export function nextToJail(id){
    let nextTo = null;
    if (id == "x1"){
        nextTo = "a4"
    } else if (id == "x2"){
        nextTo = "a5"
    } else if (id == "y1"){
        nextTo = "h4"
    } else if (id == "y2"){
        nextTo = "h5"
    }
    return nextTo
}
