package boardmanager

type rawMove struct {
	fromPos uint8;
	toPos uint8;
	sameColor bool;
	turnType string;
}

type possibleMoves []rawMove

func BearMove(pos uint8, gb GameBoard) {
	
}