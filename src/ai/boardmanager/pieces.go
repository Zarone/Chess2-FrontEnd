package boardmanager

type PieceType struct {
	name string;

	getMoves func(uint8, GameBoard) []rawMove;
}

func test(a uint8, b GameBoard) []rawMove {
	return []rawMove{  }
}

var (
	Bear PieceType = PieceType{"Bear", test}
	Elephant PieceType = PieceType{"Elephant", test}
	Fish PieceType = PieceType{"Fish", test}
	FishQueen PieceType = PieceType{"FishQueen", test}
	King PieceType = PieceType{"King", test}
	Monkey PieceType = PieceType{"Monkey", test}
	Queen PieceType = PieceType{"Queen", test}
	Rook PieceType = PieceType{"Rook", test}
	NullPiece PieceType = PieceType{"undefined", test}
)

func nameToPiece(name string) PieceType {
	switch name {
		case Bear.name:
			return Bear
		case Elephant.name:
			return Elephant
		case Fish.name:
			return Fish
		case FishQueen.name:
			return FishQueen
		case King.name:
			return King;
		case Monkey.name:
			return Monkey
		case Queen.name:
			return Queen;
		case Rook.name:
			return Rook;
	}
	return NullPiece
}