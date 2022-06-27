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

    if (toVertical > fromVertical){
        // straight up
        for (let i = 1; i <= (toVertical-fromVertical); i++){
            if (board[verticalAndHorizontalToID(
                fromVertical+i, fromHorizontal
            )] != undefined){
                return false
            }
        }
    } else if (toVertical < fromVertical){
        // straight down
        for (let i = 1; i <= (fromVertical-toVertical); i++){
            if (board[verticalAndHorizontalToID(
                fromVertical-i, fromHorizontal
            )] != undefined){
                return false
            }
        }
    } else if (toHorizontal > fromHorizontal){
        for (let i = 1; i <= (toHorizontal - fromHorizontal); i++){
            if (board[verticalAndHorizontalToID(
                fromVertical, fromHorizontal+i
            )] != undefined){
                return false
            }
        }
    } else if (toHorizontal < fromHorizontal){
        for (let i = 1; i <= (fromHorizontal - toHorizontal); i++){
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

export function canMonkeyJump({board, from, to}){
    if (board == undefined || from == undefined || to == undefined){
        console.log("incorrect args provided to noPiece")
    }

    let fromCoords = getVerticalAndHorizontal(from)
    let fromVertical = fromCoords.vertical
    let fromHorizontal = fromCoords.horizontal

    let toCoords = getVerticalAndHorizontal(to)
    let toVertical = toCoords.vertical
    let toHorizontal = toCoords.horizontal

    // construct a graph of current neighbors that the monkey can jump to

    let toCheck = []
    let hasChecked = []
    

    // make a list of all nodes we've checked
    // on each neighbor, check other neighbors
}