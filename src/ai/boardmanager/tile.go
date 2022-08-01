package boardmanager

import (
	"fmt"
)

type tile struct {
	isWhite bool;
	pieceType PieceType;
}


func (t tile) info() string {

	var color string
	if (t.pieceType.name == Bear.name){
		color = "G"
	} else if (t.isWhite){
		color = "W"
	} else if (t.pieceType.name != NullPiece.name){
		color = "B"
	} else {
		color = " "
	}

	var secondaryChar string
	if (len(t.pieceType.name) > 4){
		secondaryChar = string(t.pieceType.name[4])
	} else {
		secondaryChar = " "
	}
	
	var primaryChar string
	if (len(t.pieceType.name) > 0){
		primaryChar = string(t.pieceType.name[0])
	} else {
		primaryChar = " "
	}

	return fmt.Sprintf("[%s %s%s]", color, primaryChar, secondaryChar)
}