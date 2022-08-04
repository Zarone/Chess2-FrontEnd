package boardmanager

import "fmt"

func BearMove(pos int16, state State) possibleMoves {
	var moves possibleMoves

	if (pos == 68) { 
		moves = append(moves, 
			getRawMoveDefault(pos, 27),
			getRawMoveDefault(pos, 28),
			getRawMoveDefault(pos, 35),
			getRawMoveDefault(pos, 36),
		)
	} else {
		moves.add(
			pos, state, 
			moveType{ coordsToFunc([][2]int16{
				{1, 1}, {0, 1}, {-1, 1},
				{1, 0}, {0, 0}, {-1, 0},
				{1, -1}, {0, -1}, {-1, -1},
			}, state.Gb[pos].isWhite ) },
			conditionType{empty},
		)
	}

	fmt.Println("moves", moves)
	return moves
}

func FishMove(pos int16, state State) possibleMoves {
	var moves possibleMoves;
	moves.add(
		pos, state, 
		moveType{coordsToFunc([][2]int16{{0, 1}, {1, 1}, {-1, 1}, {1, 0}, {-1, 0}}, state.Gb[pos].isWhite)}, 
		conditionType{notSameType},
	)

	fmt.Println("moves", moves)
	return moves;
}

func QueenMove(pos int16, state State) possibleMoves {
	var moves possibleMoves;
	moves.add(
		pos, state,
		moveType{queen},
		conditionType{notSameType},
	)
	fmt.Println("moves", moves)
	return moves;
}

func RookMove(pos int16, state State) possibleMoves {
	
	var moves possibleMoves;
	moves.add(
		pos, state,
		moveType{allSlots},
		conditionType{empty},
	)
	moves.add(
		pos, state,
		moveType{straightNextTo},
		conditionType{notSameType, rookCondition},
	)
	fmt.Println("moves", moves)
	return moves;

}