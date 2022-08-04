package boardmanager

import "fmt"

type PieceType struct {
	Name string

	GetMoves func(int16, State, ConditionType) PossibleMoves
}

func test(a int16, b State, _ ConditionType) PossibleMoves {
	fmt.Println("test move triggered")
	return []rawMove{}
}

// this just prevents the reference loop:
// 	- King => KingMove => checkRoyalty => King.Name
var KING_NAME = "King"
var QUEEN_NAME = "Queen"

var (
	Bear      PieceType = PieceType{"Bear", BearMove}
	Elephant  PieceType = PieceType{"Elephant", ElephantMove}
	Fish      PieceType = PieceType{"Fish", FishMove}
	FishQueen PieceType = PieceType{"FishQueen", QueenMove}
	King      PieceType = PieceType{KING_NAME, KingMove}
	Monkey    PieceType = PieceType{"Monkey", MonkeyMove}
	Queen     PieceType = PieceType{QUEEN_NAME, QueenMove}
	Rook      PieceType = PieceType{"Rook", RookMove}
	NullPiece PieceType = PieceType{"undefined", test}
)

func nameToPiece(name string) PieceType {
	switch name {
	case Bear.Name:
		return Bear
	case Elephant.Name:
		return Elephant
	case Fish.Name:
		return Fish
	case FishQueen.Name:
		return FishQueen
	case King.Name:
		return King
	case Monkey.Name:
		return Monkey
	case Queen.Name:
		return Queen
	case Rook.Name:
		return Rook
	}
	return NullPiece
}