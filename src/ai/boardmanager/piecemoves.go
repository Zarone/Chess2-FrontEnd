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
	toVisit := [][]int16{{pos}};

	for (len(toVisit) > 0){
		visitingNode := toVisit[len(toVisit)-1]
		visiting := visitingNode[len(visitingNode)-1]
		fmt.Println("visiting", visiting)
		alreadyAdded[visiting] = true;
		
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

				alreadyVisited := alreadyAdded[newPos]
				withinBorders := inBorders(newRow, newCol);
				newElement := !alreadyAdded[newPos];
				somethingToJumpOff := withinBorders && state.Gb[rowColToPos(intermediateRow, intermediateCol)].ThisPieceType.Name != "undefined";
				targetDifferentColor := withinBorders && notSameType(thisConditionArgs)
				if (!alreadyVisited && withinBorders && newElement && somethingToJumpOff && targetDifferentColor){
					fmt.Println("Pass")
					newPath := append(visitingNode, newPos)
					
					var newMove []rawPartialMove;
					for k:=1; k<len(newPath); k++{
						newMove = append(newMove, rawPartialMove{fromPos: newPath[k-1], toPos: newPath[k], sameColor: true, turnType: " Jumping"})
					}

					lastElement := len(newMove)-1
					newMove[lastElement].sameColor = false;
					newMove[lastElement].turnType= "";


					moves = append(moves, newMove)
					if (empty(thisConditionArgs)){
						toVisit = append(toVisit, newPath) 
					}
				} else {
					fmt.Println("Fail")
				}
			}
		}
	}

	return moves;

}