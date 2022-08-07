package boardmanager

type PieceType struct {
	Name string

	GetMoves func(int16, State, ConditionType) PossibleMoves

	ID uint8

	StaticValue int16
}

func test(a int16, b State, _ ConditionType) PossibleMoves {
	// fmt.Println("test move triggered")
	return []RawMove{}
}

// this just prevents the reference loop:
// 	- King => KingMove => checkRoyalty => King.Name
var KING_NAME = "King"
var QUEEN_NAME = "Queen"

var (
	Bear      PieceType = PieceType{"Bear", BearMove, 0, 0}
	Elephant  PieceType = PieceType{"Elephant", ElephantMove, 1, 100}
	Fish      PieceType = PieceType{"Fish", FishMove, 2, 100}
	FishQueen PieceType = PieceType{"FishQueen", QueenMove, 3, 500}
	King      PieceType = PieceType{KING_NAME, KingMove, 4, 500}
	Monkey    PieceType = PieceType{"Monkey", MonkeyMove, 5, 400}
	Queen     PieceType = PieceType{QUEEN_NAME, QueenMove, 6, 800}
	Rook      PieceType = PieceType{"Rook", RookMove, 7, 300}
	NullPiece PieceType = PieceType{"undefined", test, 8, 0}
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