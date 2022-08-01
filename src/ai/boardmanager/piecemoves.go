package boardmanager

import "fmt"

func BearMove(pos int16, gb GameBoard) possibleMoves {
	var moves possibleMoves
	moves.add(pos, gb, moveType{up}, conditionType{})
	fmt.Println("moves", moves)
	return moves
}

func FishMove(pos int16, gb GameBoard) possibleMoves {
	var moves possibleMoves;
	moves.add(pos, gb, moveType{coordsToFunc([][2]int16{{0, 1}, {1, 1}, {-1, 1}, {1, 0}, {-1, 0}}, gb[pos].isWhite)}, conditionType{})
	fmt.Println("moves", moves)
	return moves;
}