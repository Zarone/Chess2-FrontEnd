package boardmanager

import (
	"fmt"
	"syscall/js"
)

// The 8x8 board, plus 2 jail positions for each player, plus bear starting position = 69
type GameBoard [69]Tile

type State struct {
	Gb GameBoard;
	RookWhiteActive bool;
	RookBlackActive bool;
	IsWhite bool;
}

func (gb GameBoard) Print(){
	for i := 0; i < 8; i++ {
		fmt.Printf("%v ", 8-i)
		for j := 0; j < 8; j++ {
			fmt.Print(gb[i*8+j].info())
		}
		fmt.Print("\n")
	}
	fmt.Printf("Jail X: %v, %v\n", gb[64].info(), gb[65].info())
	fmt.Printf("Jail Y: %v, %v\n", gb[66].info(), gb[67].info())
	fmt.Printf("Z: %v\n", gb[68].info())
}

// This is the ASCII code for the "a" character
const ASCII_OFFSET = 97;

func addToBoard(raw js.Value, gb *GameBoard, index int, tile string){
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
		fmt.Println("hasBananaRaw", hasBananaRaw)
		if (!hasBananaRaw.IsUndefined()){
			hasBanana = hasBananaRaw.Bool()
		}
		
		(*gb)[index] = Tile{
			IsWhite: boolIsWhite,
			ThisPieceType: nameToPiece(piece.Get("constructor").Get("name").String()),
			hasBanana: hasBanana,
		}
	} else {
		(*gb)[index] = Tile{
			IsWhite: false,
			ThisPieceType: NullPiece,
			hasBanana: false,
		}
	}
}

func BoardRawToArrayBoard(boardRaw js.Value) GameBoard {
	
	var boardArray GameBoard;

	for i := 7; i > -1; i-- { // i corresponds to the number
		for j := 0; j < 8; j++ { // while j corresponds to the letter
			tileString := fmt.Sprintf("%s%d", string(rune(ASCII_OFFSET+j)), i+1)
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