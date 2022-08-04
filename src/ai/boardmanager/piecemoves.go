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

func ElephantMove(pos int16, state State) possibleMoves {
	
	var moves possibleMoves;
	moves.add(
		pos, state,
		moveType{ coordsToFunc([][2]int16{{2, 2}, {-2, 2}, {-2, -2}, {2, -2}}, state.Gb[pos].isWhite ) },
		conditionType{empty},
	)
	fmt.Println("moves", moves)
	return moves;

}

func KingMove(pos int16, state State) possibleMoves {

	var moves possibleMoves;

	moves.add(
		pos, state,
		moveType{ coordsToFunc([][2]int16{
			{1, 1}, {0, 1}, {-1, 1},
			{1, 0}, {0, 0}, {-1, 0},
			{1, -1}, {0, -1}, {-1, -1},
		}, state.Gb[pos].isWhite)},
		conditionType{notSameType},
	)

	fmt.Println("moves", moves)
	return moves;
}

func MonkeyMove(pos int16, state State) possibleMoves {

	var moves possibleMoves;

	// do a depth first search
	alreadyAdded := map[int16]bool{};
	toVisit := []int16{pos};

	for (len(toVisit) > 0){
		visiting := toVisit[len(toVisit)-1]
		fmt.Println("visiting", visiting)
		
		fmt.Println("toVisit before", toVisit)
		toVisit = toVisit[:len(toVisit)-1]
		fmt.Println("toVisit after", toVisit)

		for i:=int16(-1); i<2; i++{
			for j:=int16(-1); j<2; j++ {
				if (i==0&&j==0) { continue; }
				row, col := posToRowCol(visiting);
				fmt.Println("row", row, "col", col)

				newRow := row + 2*i;
				newCol := col + 2*j;
				fmt.Println("newRow", newRow, "newCol", newCol)

				newPos := rowColToPos(newRow, newCol)
				intermediateRow := row + i;
				intermediateCol := col + j;

				thisConditionArgs := conditionArgs{fromPos: pos, toPos: newPos, state: state}

				withinBorders := inBorders(newRow, newCol);
				newElement := !alreadyAdded[newPos];
				somethingToJumpOff := withinBorders && state.Gb[rowColToPos(intermediateRow, intermediateCol)].ThisPieceType.Name != "undefined";
				targetDifferentColor := notSameType(thisConditionArgs)
				if (withinBorders && newElement && somethingToJumpOff && targetDifferentColor){
					fmt.Println("Pass")
					moves = append(moves, []rawPartialMove{{fromPos: visiting, toPos: newPos, sameColor: true, turnType: " Jumping"}})
					if (empty(thisConditionArgs)){
						toVisit = append(toVisit, newPos)
					}
				} else {
					fmt.Println("Fail")
				}
			}
		}
	}

	return moves;

}