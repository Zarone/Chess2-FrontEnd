package boardmanager

import (
	"fmt"
)

type Tile struct {
	IsWhite bool;
	ThisPieceType PieceType;
	HasBanana bool;
}

func (t Tile) equals(t2 Tile)bool{
	return t.IsWhite == t2.IsWhite && t.ThisPieceType.ID == t2.ThisPieceType.ID
}

func (t Tile) info() string {

	var color string
	if (t.ThisPieceType.Name == Bear.Name){
		color = "G"
	} else if (t.IsWhite){
		color = "W"
	} else if (t.ThisPieceType.Name != NullPiece.Name){
		color = "B"
	} else {
		color = " "
	}

	var secondaryChar string
	if (len(t.ThisPieceType.Name) > 4){
		secondaryChar = string(t.ThisPieceType.Name[4])
	} else {
		secondaryChar = " "
	}
	
	var primaryChar string
	if (len(t.ThisPieceType.Name) > 0){
		primaryChar = string(t.ThisPieceType.Name[0])
	} else {
		primaryChar = " "
	}

	return fmt.Sprintf("[%s %s%s]", color, primaryChar, secondaryChar)
}