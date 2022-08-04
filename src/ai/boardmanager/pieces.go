package boardmanager

import "fmt"

type PieceType struct {
	Name string

	GetMoves func(int16, State) possibleMoves
}

func test(a int16, b State) possibleMoves {
	fmt.Println("test move triggered")
	return []rawMove{}
}

var (
	Bear      PieceType = PieceType{"Bear", BearMove}
	Elephant  PieceType = PieceType{"Elephant", ElephantMove}
	Fish      PieceType = PieceType{"Fish", FishMove}
	FishQueen PieceType = PieceType{"FishQueen", QueenMove}
	King      PieceType = PieceType{"King", KingMove}
	Monkey    PieceType = PieceType{"Monkey", test}
	Queen     PieceType = PieceType{"Queen", QueenMove}
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