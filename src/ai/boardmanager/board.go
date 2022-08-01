package boardmanager

import (
	"fmt"
	"syscall/js"
)

// The 8x8 board, plus 2 jail positions for each player, plus bear starting position = 69
type GameBoard [69]tile

func (gb GameBoard) print(){
	for i := 0; i < 8; i++ {
		fmt.Printf("%v ", 8-i)
		for j := 0; j < 8; j++ {
			fmt.Print(gb[i*8+j].info())
		}
		fmt.Print("\n")
	}
}

// This is the ASCII code for the "a" character
const ASCII_OFFSET = 97;

func BoardRawToArrayBoard(boardRaw js.Value) GameBoard {
	
	var boardArray GameBoard;

	for i := 7; i > -1; i-- { // i corresponds to the number
		for j := 0; j < 8; j++ { // while j corresponds to the letter
			tileString := fmt.Sprintf("%s%d", string(rune(ASCII_OFFSET+j)), i+1)
			piece := boardRaw.Get(tileString)
			if (!piece.IsUndefined()){

				isWhite := piece.Get("isWhite")
				isGray := isWhite.IsNull()
				var boolIsWhite bool
				if (!isGray) {
					boolIsWhite = isWhite.Bool()
				} else {
					boolIsWhite = false;
				}
				
				boardArray[j+(7-i)*8] = tile{
					isWhite: boolIsWhite,
					pieceType: nameToPiece(piece.Get("constructor").Get("name").String()),
				}
				// fmt.Println( tileString, piece.Get("constructor").Get("name") )
			} else {
				boardArray[j+(7-i)*8] = tile{
					isWhite: false,
					pieceType: NullPiece,
				}
				// fmt.Println( tileString, "undefined" )
			}
		}
	}
	// fmt.Println( boardArray )
	boardArray.print()
	return GameBoard{}
}