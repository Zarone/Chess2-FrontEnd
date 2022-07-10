import { getVerticalAndHorizontal, nextToJail, verticalAndHorizontalToID } from "./utils.js"

export function noPiece({board, to}){
    if (board == undefined || to == undefined){
        console.error("incorrect args provided to noPiece")
    }
    
    return (board[to] == undefined)
}

export function noDiagonalBlocking({board, from, to}){
    if (board == undefined || from == undefined || to == undefined){
        console.error("incorrect args provided to noDiagonalBlocking")
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
        console.error("incorrect args provided to noStraightBlocking")
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

export function diagonalBlocking({board, from, to}){

    if (board == undefined || from == undefined || to == undefined){
        console.error("incorrect args provided to diagonalBlocking")
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
                    return true;
                }
            }
        } else {
            for (let i = 1; i < (toHorizontal-fromHorizontal); i++){
                if (
                    board[verticalAndHorizontalToID(
                        fromVertical-i, fromHorizontal+i
                    )] != undefined
                ) {
                    return true
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
                    return true
                }
            }
        } else {
            for (let i = 1; i < (fromHorizontal-toHorizontal); i++){
                if (
                    board[verticalAndHorizontalToID(
                        fromVertical-i, fromHorizontal-i
                    )] != undefined
                ) {
                    return true
                }
            }
        }
    }
    return false;
}

export function straightBlocking({board, from, to}){
    if (board == undefined || from == undefined || to == undefined){
        console.error("incorrect args provided to straightBlocking")
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
                return true
            }
        }
    } else if (toVertical < fromVertical){
        // straight down
        for (let i = 1; i < (fromVertical-toVertical); i++){
            if (board[verticalAndHorizontalToID(
                fromVertical-i, fromHorizontal
            )] != undefined){
                return true
            }
        }
    } else if (toHorizontal > fromHorizontal){
        for (let i = 1; i < (toHorizontal - fromHorizontal); i++){
            if (board[verticalAndHorizontalToID(
                fromVertical, fromHorizontal+i
            )] != undefined){
                return true
            }
        }
    } else if (toHorizontal < fromHorizontal){
        for (let i = 1; i < (fromHorizontal - toHorizontal); i++){
            if (board[verticalAndHorizontalToID(
                fromVertical, fromHorizontal-i
            )] != undefined){
                return true
            }
        }
    }

    return false;
}

export function notSameType({board, from, to}){
    if (!from) debugger
    if (board == undefined || from == undefined || to == undefined){
        console.error("incorrect args provided to notSameType")
    }
    return (board[to] == undefined || board[from].isWhite != board[to].isWhite)
}

export function rookActive({board, rookActiveWhite, rookActiveBlack, from}){
    if (board == undefined || from == undefined || rookActiveWhite == undefined || 
        rookActiveBlack == undefined
    ){
        console.error("incorrect args provided to rookActive")
    }
    return (board[from].isWhite && rookActiveWhite) || (!board[from].isWhite && rookActiveBlack)
}

export function canMonkeyPrisonJump({board, from, to}) {
    return (from == nextToJail(to) && board[to] && board[to].hasBanana)
}

export function sameMonkeyTurn({board, from, thisTurn}){
    return ((thisTurn == "White Jumping" && board[from].isWhite) || (thisTurn == "Black Jumping" && !board[from].isWhite))
}

export function nonInitMonkeyJump({board, to}){
    return !board["MONKEY_START"] || (to != board["MONKEY_START"].position.id);
}