package jsboardinterface

import (
	"chesstwoai/boardmanager"
	"fmt"
	"syscall/js"
)

func addToBoard(raw js.Value, gb *boardmanager.GameBoard, index int, tile string){
	piece := raw.Get(tile)
	if (!piece.IsUndefined()){

		isWhite := piece.Get("isWhite")
		isGray := isWhite.IsNull()
		var boolIsWhite bool
		if (!isGray) {
			boolIsWhite = isWhite.Bool()
		} else {
			boolIsWhite = false;
		}

		hasBananaRaw := piece.Get("hasBanana")
		hasBanana := false;
		// fmt.Println("hasBananaRaw", hasBananaRaw)
		if (!hasBananaRaw.IsUndefined()){
			hasBanana = hasBananaRaw.Bool()
		}
		
		(*gb)[index] = boardmanager.Tile{
			IsWhite: boolIsWhite,
			ThisPieceType: boardmanager.NameToPiece(piece.Get("constructor").Get("name").String()),
			HasBanana: hasBanana,
		}
	} else {
		(*gb)[index] = boardmanager.Tile{
			IsWhite: false,
			ThisPieceType: boardmanager.NullPiece,
			HasBanana: false,
		}
	}
}

func BoardRawToArrayBoard(boardRaw js.Value) boardmanager.GameBoard {
	
	var boardArray boardmanager.GameBoard;

	for i := 7; i > -1; i-- { // i corresponds to the number
		for j := 0; j < 8; j++ { // while j corresponds to the letter
			tileString := fmt.Sprintf("%s%d", string(rune(boardmanager.ASCII_OFFSET+j)), i+1)
			addToBoard(boardRaw, &boardArray, j+(7-i)*8, tileString)
		}
	}
	addToBoard(boardRaw, &boardArray, 64, "x1")
	addToBoard(boardRaw, &boardArray, 65, "x2")
	addToBoard(boardRaw, &boardArray, 66, "y1")
	addToBoard(boardRaw, &boardArray, 67, "y2")
	addToBoard(boardRaw, &boardArray, 68, "z1")
	return boardArray
}