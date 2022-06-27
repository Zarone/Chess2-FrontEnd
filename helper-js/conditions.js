import { getVerticalAndHorizontal, verticalAndHorizontalToID } from "./utils.js"

export function noPiece({board, to}){
    if (board == undefined || to == undefined){
        console.log("incorrect args provided to noPiece")
    }
    if (board[to] != undefined){
        console.log("piece on", to)
    }
    return (board[to] == undefined)
}

export function noDiagonalBlocking({board, from, to}){
    if (board == undefined || from == undefined || to == undefined){
        console.log("incorrect args provided to noPiece")
    }
    
    let fromCoords = getVerticalAndHorizontal(from)
    let fromVertical = fromCoords.vertical
    let fromHorizontal = fromCoords.horizontal

    let toCoords = getVerticalAndHorizontal(to)
    let toVertical = toCoords.vertical
    let toHorizontal = toCoords.horizontal

    if (toHorizontal > fromHorizontal){
        if (toVertical > fromVertical){
            for (let i = 1; i < (toHorizontal-fromHorizontal); i++){
                if (
                    board[verticalAndHorizontalToID(
                        fromVertical+i, fromHorizontal+i
                    )] != undefined
                ) {
                    console.log("checking", fromVertical+i, fromHorizontal+i)
                    return false;
                }
            }
        } else {
            for (let i = 1; i < (toHorizontal-fromHorizontal); i++){
                if (
                    board[verticalAndHorizontalToID(
                        fromVertical-i, fromHorizontal+i
                    )] != undefined
                ) {
                    console.log("checking", fromVertical-i, fromHorizontal+i)
                    return false
                }
            }
        }
    } else {
        if (toVertical > fromVertical){
            for (let i = 1; i < (fromHorizontal-toHorizontal); i++){
                if (
                    board[verticalAndHorizontalToID(
                        fromVertical+i, fromHorizontal-i
                    )] != undefined
                ) {
                    console.log("checking", fromVertical+i, fromHorizontal-i)
                    return false
                }
            }
        } else {
            for (let i = 1; i < (fromHorizontal-toHorizontal); i++){
                if (
                    board[verticalAndHorizontalToID(
                        fromVertical-i, fromHorizontal-i
                    )] != undefined
                ) {
                    console.log("checking", fromVertical-i, fromHorizontal-i)
                    return false
                }
            }
        }
    }
    return true;
}

export function noStraightBlocking({board, from, to}){
    if (board == undefined || from == undefined || to == undefined){
        console.log("incorrect args provided to noPiece")
    }

    let fromCoords = getVerticalAndHorizontal(from)
    let fromVertical = fromCoords.vertical
    let fromHorizontal = fromCoords.horizontal

    let toCoords = getVerticalAndHorizontal(to)
    let toVertical = toCoords.vertical
    let toHorizontal = toCoords.horizontal

    console.log("noStraightBlocking", from, to)

    if (toVertical > fromVertical){
        // straight up
        for (let i = 1; i < (toVertical-fromVertical); i++){
            if (board[verticalAndHorizontalToID(
                fromVertical+i, fromHorizontal
            )] != undefined){
                console.log("straight blocking returned false: toVertical > fromVertical")
                return false
            }
        }
    } else if (toVertical < fromVertical){
        // straight down
        for (let i = 1; i < (fromVertical-toVertical); i++){
            if (board[verticalAndHorizontalToID(
                fromVertical-i, fromHorizontal
            )] != undefined){
                console.log("straight blocking returned false: toVertical < fromVertical")
                return false
            }
        }
    } else if (toHorizontal > fromHorizontal){
        for (let i = 1; i < (toHorizontal - fromHorizontal); i++){
            if (board[verticalAndHorizontalToID(
                fromVertical, fromHorizontal+i
            )] != undefined){
                console.log("straight blocking returned false: toHorizontal > fromHorizontal")
                return false
            }
        }
    } else if (toHorizontal < fromHorizontal){
        for (let i = 1; i < (fromHorizontal - toHorizontal); i++){
            if (board[verticalAndHorizontalToID(
                fromVertical, fromHorizontal-i
            )] != undefined){
                console.log("straight blocking returned false: toHorizontal < fromHorizontal")
                return false
            }
        }
    }

    console.log("straight blocking returned true")
    return true;
}

export function notSameType({board, from, to}){
    if (board == undefined || from == undefined || to == undefined){
        console.log("incorrect args provided to noPiece")
    }
    return (board[to] == undefined || board[from].isWhite != board[to].isWhite)
}

export function rookActive({board, rookActiveWhite, rookActiveBlack, from}){
    if (board == undefined || from == undefined || rookActiveWhite == undefined || 
        rookActiveBlack == undefined
    ){
        console.log("incorrect args provided to noPiece")
    }
    return (board[from].isWhite && rookActiveWhite) || (!board[from].isWhite && rookActiveBlack)
}

function containsObject(obj, list) {
    for (let i = 0; i < list.length; i++) {
        console.log(list[i], obj, list[i].hor===obj.hor && list[i].vert == obj.vert)
        if (list[i].hor === obj.hor && list[i].vert === obj.vert) {
            return true;
        }
    }

    return false;
}

export function canMonkeyJump({board, from, to}){
    if (board == undefined || from == undefined || to == undefined){
        console.log("incorrect args provided to noPiece")
    }

    console.log("can monkey jump?", from, to)

    let fromCoords = getVerticalAndHorizontal(from)
    let fromVertical = fromCoords.vertical
    let fromHorizontal = fromCoords.horizontal

    let toCoords = getVerticalAndHorizontal(to)
    let toVertical = toCoords.vertical
    let toHorizontal = toCoords.horizontal

    console.log(fromVertical, fromHorizontal)

    // construct a graph of current neighbors that the monkey can jump to
    let toCheck = []

    // make a list of all nodes we've checked
    let hasChecked = []

    let addToLists = (inputVertical, inputHorizontal) => {

        let tempID = verticalAndHorizontalToID(inputVertical+1, inputHorizontal)
        let tempToID = verticalAndHorizontalToID(inputVertical+2, inputHorizontal)
        if ((inputVertical + 2) < 9 && 
            board[tempID] != undefined && 
            (board[tempToID] == undefined || board[tempToID].isWhite != board[from].isWhite || board[tempToID].isWhite == null)
        ) {
            let insertElement = {vert: inputVertical+2, hor: inputHorizontal}
            if (!containsObject(insertElement, hasChecked)){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                if (board[tempToID] == undefined){
                    toCheck.push(insertElement);
                    hasChecked.push(insertElement);
                }
            }
        }

        tempID = verticalAndHorizontalToID(inputVertical-1, inputHorizontal)
        tempToID = verticalAndHorizontalToID(inputVertical-2, inputHorizontal)
        if ((inputVertical - 2) > 0 && 
            board[tempID] != undefined && 
            (board[tempToID] == undefined || board[tempToID].isWhite != board[from].isWhite || board[tempToID].isWhite == null)
        ){
            let insertElement = {vert: inputVertical-2, hor: inputHorizontal}
            if (!containsObject(insertElement, hasChecked)){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                if (board[tempToID] == undefined){
                    toCheck.push(insertElement);
                    hasChecked.push(insertElement);
                }
            }
        }

        tempID = verticalAndHorizontalToID(inputVertical, inputHorizontal+1)
        tempToID = verticalAndHorizontalToID(inputVertical, inputHorizontal+2)
        if ((inputHorizontal + 2) < 9 && 
            board[tempID] != undefined && 
            (board[tempToID] == undefined || board[tempToID].isWhite != board[from].isWhite || board[tempToID].isWhite == null)
        ) {
            let insertElement = {vert: inputVertical, hor: inputHorizontal+2}
            if (!containsObject(insertElement, hasChecked)){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                if (board[tempToID] == undefined){
                    toCheck.push(insertElement);
                    hasChecked.push(insertElement);
                }
            }
        }

        tempID = verticalAndHorizontalToID(inputVertical, inputHorizontal-1)
        tempToID = verticalAndHorizontalToID(inputVertical, inputHorizontal-2)
        if ((inputHorizontal - 2) > 0 && 
            board[tempID] != undefined && 
            (board[tempToID] == undefined || board[tempToID].isWhite != board[from].isWhite || board[tempToID].isWhite == null)
        ) {
            let insertElement = {vert: inputVertical, hor: inputHorizontal-2}
            if (!containsObject(insertElement, hasChecked)){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                if (board[tempToID] == undefined){
                    toCheck.push(insertElement);
                    hasChecked.push(insertElement);
                }
            }
        }
        
        tempID = verticalAndHorizontalToID(inputVertical+1, inputHorizontal+1)
        tempToID = verticalAndHorizontalToID(inputVertical+2, inputHorizontal+2)
        if ((inputVertical + 2) < 9 && 
            (inputHorizontal+2) < 9 && 
            board[tempID] != undefined && 
            (board[tempToID] == undefined || board[tempToID].isWhite != board[from].isWhite || board[tempToID].isWhite == null)
        ) {
            let insertElement = {vert: inputVertical+2, hor: inputHorizontal+2}
            if (!containsObject(insertElement, hasChecked)){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                if (board[tempToID] == undefined){
                    toCheck.push(insertElement);
                    hasChecked.push(insertElement);
                }
            }
        }

        tempID = verticalAndHorizontalToID(inputVertical-1, inputHorizontal+1)
        tempToID = verticalAndHorizontalToID(inputVertical-2, inputHorizontal+2)
        if ((inputVertical - 2) > 0 && 
            (inputHorizontal+2) < 9 && 
            board[tempID] != undefined && 
            (board[tempToID] == undefined || board[tempToID].isWhite != board[from].isWhite || board[tempToID].isWhite == null)
        ){
            let insertElement = {vert: inputVertical-2, hor: inputHorizontal+2}
            if (!containsObject(insertElement, hasChecked)){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                if (board[tempToID] == undefined){
                    toCheck.push(insertElement);
                    hasChecked.push(insertElement);
                }
            }
        }

        tempID = verticalAndHorizontalToID(inputVertical+1, inputHorizontal-1)
        tempToID = verticalAndHorizontalToID(inputVertical+2, inputHorizontal-2)
        if ((inputHorizontal - 2) > 0 && 
            (inputVertical+2) < 9 && 
            board[tempID] != undefined && 
            (board[tempToID] == undefined || board[tempToID].isWhite != board[from].isWhite || board[tempToID].isWhite == null)
        ) {
            let insertElement = {vert: inputVertical+2, hor: inputHorizontal-2}
            if (!containsObject(insertElement, hasChecked)){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                if (board[tempToID] == undefined){
                    toCheck.push(insertElement);
                    hasChecked.push(insertElement);
                }
            }
        }

        tempID = verticalAndHorizontalToID(inputVertical-1, inputHorizontal-1)
        tempToID = verticalAndHorizontalToID(inputVertical-2, inputHorizontal-2)
        if ((inputHorizontal - 2) > 0 && 
            (inputVertical - 2) > 0 && 
            board[tempID] != undefined && 
            (board[tempToID] == undefined || board[tempToID].isWhite != board[from].isWhite || board[tempToID].isWhite == null)
        ) {
            let insertElement = {vert: inputVertical-2, hor: inputHorizontal-2}
            if (!containsObject(insertElement, hasChecked)){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                if (board[tempToID] == undefined){
                    toCheck.push(insertElement);
                    hasChecked.push(insertElement);
                }
            }
        }
        return false
    }

    let addToListsResult = addToLists(fromVertical, fromHorizontal);
    console.log("initial addToLists", addToListsResult);
    if (addToListsResult) return true

    console.log("toCheck start", JSON.stringify(toCheck))

    // on each neighbor, check other neighbors
    while (toCheck.length > 0){
        let checkingNode = toCheck.shift()
        console.log("hasChecked", JSON.stringify(hasChecked))
        console.log("checkingNode",JSON.stringify(checkingNode))
        if (addToLists(checkingNode.vert, checkingNode.hor)) return true
        console.log("toCheck", JSON.stringify(toCheck))
    }
    return false

}