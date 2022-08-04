package boardmanager

import "fmt"

func BearMove(pos int16, state State, _ ConditionType) PossibleMoves {
	var moves PossibleMoves

	if (pos == 68) { 
		moves = append(moves, 
			getRawMoveDefault(pos, 27, state),
			getRawMoveDefault(pos, 28, state),
			getRawMoveDefault(pos, 35, state),
			getRawMoveDefault(pos, 36, state),
		)
	} else {
		moves.add(
			pos, state, 
			moveType{ coordsToFunc([][2]int16{
				{1, 1}, {0, 1}, {-1, 1},
				{1, 0}, {0, 0}, {-1, 0},
				{1, -1}, {0, -1}, {-1, -1},
			}, state.Gb[pos].IsWhite ) },
			ConditionType{empty},
		)
	}

	fmt.Println("moves", moves)
	return moves
}

func FishMove(pos int16, state State, _ ConditionType) PossibleMoves {
	var moves PossibleMoves;
	moves.add(
		pos, state, 
		moveType{coordsToFunc([][2]int16{{0, 1}, {1, 1}, {-1, 1}, {1, 0}, {-1, 0}}, state.Gb[pos].IsWhite)}, 
		ConditionType{notSameType},
	)

	fmt.Println("moves", moves)
	return moves;
}

func QueenMove(pos int16, state State, _ ConditionType) PossibleMoves {
	var moves PossibleMoves;
	moves.add(
		pos, state,
		moveType{queen},
		ConditionType{notSameType},
	)
	fmt.Println("moves", moves)
	return moves;
}

func RookMove(pos int16, state State, filterConditions ConditionType) PossibleMoves {
	
	var moves PossibleMoves;

	moves.add(
		pos, state,
		moveType{allSlots},
		append(ConditionType{empty}, filterConditions...),
	)
	
	moves.add(
		pos, state,
		moveType{straightNextTo},
		ConditionType{notSameType, rookCondition},
	)

	fmt.Println("moves", moves)
	return moves;

}

func ElephantMove(pos int16, state State, _ ConditionType) PossibleMoves {
	
	var moves PossibleMoves;
	moves.add(
		pos, state,
		moveType{ coordsToFunc([][2]int16{{2, 2}, {-2, 2}, {-2, -2}, {2, -2}}, state.Gb[pos].IsWhite ) },
		ConditionType{empty},
	)
	fmt.Println("moves", moves)
	return moves;

}

func KingMove(pos int16, state State, _ ConditionType) PossibleMoves {

	var moves PossibleMoves;

	moves.add(
		pos, state,
		moveType{ coordsToFunc([][2]int16{
			
		}, state.Gb[pos].IsWhite)},
		ConditionType{notSameType},
	)

	fmt.Println("moves", moves)
	return moves;
}

func MonkeyMove(pos int16, state State, _ ConditionType) PossibleMoves {

	var moves PossibleMoves;

	// do a depth first search
	alreadyAdded := map[int16]bool{};
	toVisit := [][]int16{{pos}};

	for (len(toVisit) > 0){
		visitingNode := toVisit[len(toVisit)-1]
		visiting := visitingNode[len(visitingNode)-1]
		alreadyAdded[visiting] = true;
		
		toVisit = toVisit[:len(toVisit)-1]

		for i:=int16(-1); i<2; i++{
			for j:=int16(-1); j<2; j++ {
				if (i==0&&j==0) { continue; }
				row, col := posToRowCol(visiting);

				newRow := row + 2*i;
				newCol := col + 2*j;

				newPos := rowColToPos(newRow, newCol)
				intermediateRow := row + i;
				intermediateCol := col + j;

				thisConditionArgs := conditionArgs{fromPos: pos, toPos: newPos, state: state}

				alreadyVisited := alreadyAdded[newPos]
				withinBorders := inBorders(newRow, newCol);
				somethingToJumpOff := withinBorders && state.Gb[rowColToPos(intermediateRow, intermediateCol)].ThisPieceType.Name != NullPiece.Name;
				targetDifferentColor := withinBorders && notSameType(thisConditionArgs)

				if (!alreadyVisited && withinBorders && somethingToJumpOff && targetDifferentColor){
						
					var newMove rawMove;
					for k:=1; k<len(visitingNode); k++{
						newMove = append(newMove, rawPartialMove{fromPos: visitingNode[k-1], toPos: visitingNode[k], sameColor: true, turnType: TURN_JUMPING})
					}

					var backupSlice rawMove;
					copy(backupSlice, newMove)

					newMove = append(newMove, rawPartialMove{fromPos: visitingNode[len(visitingNode)-1], toPos: newPos, sameColor: false, turnType: TURN_DEFAULT})

					checkRoyalty(newPos, state, &newMove)


					moves = append(moves, newMove)
					if (empty(thisConditionArgs)){
						toVisit = append(toVisit, append(visitingNode, newPos)) 
					}
		
					nextToJail := getCorrespondingJail(visiting, state.Gb[pos].IsWhite)
					if (nextToJail!=-1)&&(state.Gb[nextToJail].hasBanana){
						backupSlice = append(backupSlice, 
							rawPartialMove{fromPos: visitingNode[len(visitingNode)-1], toPos: nextToJail, sameColor: true, turnType: TURN_RESCUE},
							rawPartialMove{fromPos: 69, toPos: newPos, sameColor: false, turnType: TURN_DEFAULT},
						)

						moves = append(moves, backupSlice)
					}
				}

			}
		}
	}

	moves.add(
		pos, state,
		moveType{ coordsToFunc([][2]int16{
			{1, 1}, {0, 1}, {-1, 1},
			{1, 0}, {0, 0}, {-1, 0},
			{1, -1}, {0, -1}, {-1, -1},
		}, state.Gb[pos].IsWhite) },
		ConditionType{empty},
	)

	fmt.Println("moves", moves)
	return moves;

}