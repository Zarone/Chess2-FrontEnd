import { getVerticalAndHorizontal, nextToJail, verticalAndHorizontalToID } from "./utils.js"

export function noPiece({board, to}){
    if (board == undefined || to == undefined){
        console.error("incorrect args provided to noPiece")
    }
    
    return (board[to] == undefined)
}

export function noDiagonalBlocking({board, from, to}){
    if (board == undefined || from == undefined || to == undefined){
        console.error("incorrect args provided to noPiece")
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
                    return false
                }
            }
        }
    }
    return true;
}

export function noStraightBlocking({board, from, to}){
    if (board == undefined || from == undefined || to == undefined){
        console.error("incorrect args provided to noPiece")
    }

    let fromCoords = getVerticalAndHorizontal(from)
    let fromVertical = fromCoords.vertical
    let fromHorizontal = fromCoords.horizontal

    let toCoords = getVerticalAndHorizontal(to)
    let toVertical = toCoords.vertical
    let toHorizontal = toCoords.horizontal


    if (toVertical > fromVertical){
        // straight up
        for (let i = 1; i < (toVertical-fromVertical); i++){
            if (board[verticalAndHorizontalToID(
                fromVertical+i, fromHorizontal
            )] != undefined){
                return false
            }
        }
    } else if (toVertical < fromVertical){
        // straight down
        for (let i = 1; i < (fromVertical-toVertical); i++){
            if (board[verticalAndHorizontalToID(
                fromVertical-i, fromHorizontal
            )] != undefined){
                return false
            }
        }
    } else if (toHorizontal > fromHorizontal){
        for (let i = 1; i < (toHorizontal - fromHorizontal); i++){
            if (board[verticalAndHorizontalToID(
                fromVertical, fromHorizontal+i
            )] != undefined){
                return false
            }
        }
    } else if (toHorizontal < fromHorizontal){
        for (let i = 1; i < (fromHorizontal - toHorizontal); i++){
            if (board[verticalAndHorizontalToID(
                fromVertical, fromHorizontal-i
            )] != undefined){
                return false
            }
        }
    }

    return true;
}

export function notSameType({board, from, to}){
    if (board == undefined || from == undefined || to == undefined){
        console.error("incorrect args provided to noPiece")
    }
    return (board[to] == undefined || board[from].isWhite != board[to].isWhite)
}

export function rookActive({board, rookActiveWhite, rookActiveBlack, from}){
    if (board == undefined || from == undefined || rookActiveWhite == undefined || 
        rookActiveBlack == undefined
    ){
        console.error("incorrect args provided to noPiece")
    }
    return (board[from].isWhite && rookActiveWhite) || (!board[from].isWhite && rookActiveBlack)
}

function containsObject(obj, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].hor === obj.hor && list[i].vert === obj.vert) {
            return true;
        }
    }

    return false;
}

function addToLists(board, from, toVertical, toHorizontal, outputPushRef, hasCheckedRef, inputVertical, inputHorizontal) {

    let tempID = verticalAndHorizontalToID(inputVertical+1, inputHorizontal)
    let tempToID = verticalAndHorizontalToID(inputVertical+2, inputHorizontal)
    if ((inputVertical + 2) < 9 && 
        board[tempID] != undefined && 
        (board[tempToID] == undefined || board[tempToID].isWhite != board[from].isWhite || board[tempToID].isWhite == null)
    ) {
        let insertElement = {vert: inputVertical+2, hor: inputHorizontal}
        if (!containsObject(insertElement, hasCheckedRef)){
            if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                return true
            if (board[tempToID] == undefined){
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
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
        if (!containsObject(insertElement, hasCheckedRef)){
            if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                return true
            if (board[tempToID] == undefined){
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
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
        if (!containsObject(insertElement, hasCheckedRef)){
            if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                return true
            if (board[tempToID] == undefined){
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
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
        if (!containsObject(insertElement, hasCheckedRef)){
            if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                return true
            if (board[tempToID] == undefined){
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
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
        if (!containsObject(insertElement, hasCheckedRef)){
            if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                return true
            if (board[tempToID] == undefined){
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
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
        if (!containsObject(insertElement, hasCheckedRef)){
            if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                return true
            if (board[tempToID] == undefined){
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
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
        if (!containsObject(insertElement, hasCheckedRef)){
            if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                return true
            if (board[tempToID] == undefined){
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
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
        if (!containsObject(insertElement, hasCheckedRef)){
            if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                return true
            if (board[tempToID] == undefined){
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
            }
        }
    }
    return false
}

export function canMonkeyJump({board, from, to}){
    if (board == undefined || from == undefined || to == undefined){
        console.error("incorrect args provided to noPiece")
    }

    let fromCoords = getVerticalAndHorizontal(from)
    let fromVertical = fromCoords.vertical
    let fromHorizontal = fromCoords.horizontal

    let toCoords = getVerticalAndHorizontal(to)
    let toVertical = toCoords.vertical
    let toHorizontal = toCoords.horizontal

    // construct a graph of current neighbors that the monkey can jump to
    let toCheck = []

    // make a list of all nodes we've checked
    let hasChecked = []

    let addToListsResult = addToLists(board, from, toVertical, toHorizontal, toCheck, hasChecked, fromVertical, fromHorizontal);
    if (addToListsResult) return true

    // on each neighbor, check other neighbors
    while (toCheck.length > 0){
        let checkingNode = toCheck.shift()
        if (addToLists(board, from, fromVertical, fromHorizontal, toCheck, hasChecked, checkingNode.vert, checkingNode.hor)) return true
    }
    return false

}

function addToListsForceEmpty(board, from, toVertical, toHorizontal, outputPushRef, hasCheckedRef, inputVertical, inputHorizontal) {

    let tempID = verticalAndHorizontalToID(inputVertical+1, inputHorizontal)
    let tempToID = verticalAndHorizontalToID(inputVertical+2, inputHorizontal)
    if ((inputVertical + 2) < 9 && 
        board[tempID] != undefined && 
        (board[tempToID] == undefined || board[tempToID].isWhite != board[from].isWhite || board[tempToID].isWhite == null)
    ) {
        let insertElement = {vert: inputVertical+2, hor: inputHorizontal}
        if (!containsObject(insertElement, hasCheckedRef)){
            if (board[tempToID] == undefined){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
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
        if (!containsObject(insertElement, hasCheckedRef)){
            if (board[tempToID] == undefined){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
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
        if (!containsObject(insertElement, hasCheckedRef)){
            if (board[tempToID] == undefined){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
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
        if (!containsObject(insertElement, hasCheckedRef)){
            if (board[tempToID] == undefined){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
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
        if (!containsObject(insertElement, hasCheckedRef)){
            if (board[tempToID] == undefined){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
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
        if (!containsObject(insertElement, hasCheckedRef)){
            if (board[tempToID] == undefined){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
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
        if (!containsObject(insertElement, hasCheckedRef)){
            if (board[tempToID] == undefined){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
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
        if (!containsObject(insertElement, hasCheckedRef)){
            if (board[tempToID] == undefined){
                if (insertElement.vert == toVertical && insertElement.hor == toHorizontal) 
                    return true
                outputPushRef.push(insertElement);
                hasCheckedRef.push(insertElement);
            }
        }
    }
    return false
}

export function canMonkeyPrisonJump({board, from, to}){

    if (board == undefined || from == undefined || to == undefined){
        console.error("incorrect args provided to noPiece")
    }

    if (board[to] && !board[to].hasBanana) return false;

    let fromCoords = getVerticalAndHorizontal(from)
    let fromVertical = fromCoords.vertical
    let fromHorizontal = fromCoords.horizontal

    let secondaryLocation = nextToJail(to);
    
    let toCoords = getVerticalAndHorizontal(secondaryLocation)
    let toVertical = toCoords.vertical
    let toHorizontal = toCoords.horizontal

    if (fromHorizontal == toHorizontal && fromVertical == toVertical){
        let output = []
        addToListsForceEmpty(board, from, -1, -1, output, [], fromVertical, fromHorizontal)
        if (output.length > 0){
            return true
        } else {
            return false
        }
    }

    // construct a graph of current neighbors that the monkey can jump to
    let toCheck = []

    // make a list of all nodes we've checked
    let hasChecked = []

    let addToListsResult = addToListsForceEmpty(board, from, toVertical, toHorizontal, toCheck, hasChecked, fromVertical, fromHorizontal);
    if (addToListsResult) return true

    // on each neighbor, check other neighbors
    while (toCheck.length > 0){
        let checkingNode = toCheck.shift()
        if (addToListsForceEmpty(board, from, fromVertical, fromHorizontal, toCheck, hasChecked, checkingNode.vert, checkingNode.hor)) return true
    }
    return false
}