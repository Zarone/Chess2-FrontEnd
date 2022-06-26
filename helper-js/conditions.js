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

export function notSameType({board, from, to}){
    if (board == undefined || from == undefined || to == undefined){
        console.log("incorrect args provided to noPiece")
    }
    return (board[to] == undefined || board[from].isWhite != board[to].isWhite)
}