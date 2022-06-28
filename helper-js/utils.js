const herokuServerID = "https://chess2-api.herokuapp.com"
const herokuSocketID = "ws://chess2-api.herokuapp.com"
const localServerID = "http://127.0.0.1:8080"
const localSocketID = "ws://127.0.0.1:8080"

export function serverID(){
    if (window.location.href.split(":")[1] == "//127.0.0.1"){
        return localServerID
    }
    return herokuServerID
}

export function socketID(){
    if (window.location.href.split(":")[1] == "//127.0.0.1"){
        return localSocketID
    }
    return herokuSocketID
}

export function getQuerystring() {
    let output={}
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

export const toID = [
    null, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'
]

export const toNum = {
    'a': 1,
    'b': 2,
    'c': 3,
    'd': 4,
    'e': 5,
    'f': 6,
    'g': 7,
    'h': 8,
}

export function getVerticalAndHorizontal(id){
    let individualCoords = id.split("")
    let vertical = +individualCoords[1]
    let horizontal = toNum[individualCoords[0]]
    return {vertical, horizontal}
}

export function verticalAndHorizontalToID(vertical, horizontal){
    return toID[horizontal] + vertical
}

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