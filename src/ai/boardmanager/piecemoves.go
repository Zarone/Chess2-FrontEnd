package boardmanager

func BearMove(pos int16, state State, _ ConditionType) PossibleMoves {
	var moves PossibleMoves

	if pos == 68 {
		moves = append(moves,
			*GetRawMoveDefault(pos, 27, state),
			*GetRawMoveDefault(pos, 28, state),
			*GetRawMoveDefault(pos, 35, state),
			*GetRawMoveDefault(pos, 36, state),
		)
	} else {
		moves.add(
			pos, state,
			moveType{coordsToFunc([][2]int16{
				{1, 1}, {0, 1}, {-1, 1},
				{1, 0}, {0, 0}, {-1, 0},
				{1, -1}, {0, -1}, {-1, -1},
			}, state.Gb[pos].IsWhite)},
			ConditionType{empty},
		)
	}

	// fmt.Println("moves", moves)
	return moves
}

func FishMove(pos int16, state State, _ ConditionType) PossibleMoves {
	var moves PossibleMoves

	moves.add(
		pos, state,
		moveType{coordsToFunc([][2]int16{{1, 1}, {-1, 1}}, state.Gb[pos].IsWhite)},
		ConditionType{notSameType},
	)

	moves.add(
		pos, state,
		moveType{coordsToFunc([][2]int16{{-1, 0}, {1, 0}, {0, 1}}, state.Gb[pos].IsWhite)},
		ConditionType{empty},
	)

	// fmt.Println("moves", moves)
	return moves
}

func QueenMove(pos int16, state State, _ ConditionType) PossibleMoves {
	var moves PossibleMoves
	moves.add(
		pos, state,
		moveType{queen},
		ConditionType{notSameType},
	)
	// fmt.Println("moves", moves)
	return moves
}

func RookMove(pos int16, state State, filterConditions ConditionType) PossibleMoves {

	var moves PossibleMoves

	moves.add(
		pos, state,
		moveType{allSlots},
		ConditionType{empty, RookFilterStrict},
	)

	moves.add(
		pos, state,
		moveType{straightNextTo},
		ConditionType{notSameType, rookCondition},
	)

	// fmt.Println("moves", moves)
	return moves

}

func ElephantMove(pos int16, state State, _ ConditionType) PossibleMoves {

	var moves PossibleMoves
	moves.add(
		pos, state,
		moveType{coordsToFunc([][2]int16{{2, 2}, {-2, 2}, {-2, -2}, {2, -2}}, state.Gb[pos].IsWhite)},
		ConditionType{notSameType, pieceInTheWay},
	)
	// fmt.Println("moves", moves)
	return moves

}

func KingMove(pos int16, state State, _ ConditionType) PossibleMoves {

	var moves PossibleMoves

	moves.add(
		pos, state,
		moveType{coordsToFunc([][2]int16{
			{1, 1}, {0, 1}, {-1, 1},
			{1, 0}, {0, 0}, {-1, 0},
			{1, -1}, {0, -1}, {-1, -1},
		}, state.Gb[pos].IsWhite)},
		ConditionType{notSameType},
	)

	// fmt.Println("moves", moves)
	return moves
}

func MonkeyMove(pos int16, state State, _ ConditionType) PossibleMoves {

	var moves PossibleMoves

	// do a depth first search
	alreadyAdded := map[int16]bool{}
	toVisit := [][]int16{{pos}}
	allPaths := [][]int16{{pos}}

	for len(toVisit) > 0 {
		visitingNode := toVisit[len(toVisit)-1]
		visiting := visitingNode[len(visitingNode)-1]
		alreadyAdded[visiting] = true

		toVisit = toVisit[:len(toVisit)-1]

		for i := int16(-1); i < 2; i++ {
			for j := int16(-1); j < 2; j++ {
				if i == 0 && j == 0 {
					continue
				}

				row, col := posToRowCol(visiting)

				newRow := row + 2*i
				newCol := col + 2*j

				newPos := rowColToPos(newRow, newCol)
				intermediateRow := row + i
				intermediateCol := col + j

				thisConditionArgs := conditionArgs{fromPos: pos, toPos: newPos, state: state}

				alreadyVisited := alreadyAdded[newPos]
				withinBorders := inBorders(newRow, newCol)
				somethingToJumpOff := withinBorders && state.Gb[rowColToPos(intermediateRow, intermediateCol)].ThisPieceType.Name != NullPiece.Name
				targetDifferentColor := withinBorders && notSameType(thisConditionArgs)

				if !alreadyVisited && withinBorders && somethingToJumpOff && targetDifferentColor {

					var newMove RawMove
					for k := 1; k < len(visitingNode); k++ {
						newMove = append(newMove, RawPartialMove{fromPos: visitingNode[k-1], toPos: visitingNode[k], sameColor: true, turnType: TURN_JUMPING})
					}

					newMove = append(newMove, RawPartialMove{fromPos: visitingNode[len(visitingNode)-1], toPos: newPos, sameColor: false, turnType: TURN_DEFAULT})

					checkRoyalty(newPos, state, &newMove)

					moves = append(moves, newMove)
					if empty(thisConditionArgs) {
						toVisit = append(toVisit, append(visitingNode, newPos))
						allPaths = append(allPaths, append(visitingNode, newPos))
					}

				}

			}
		}
	}

	for _, value := range allPaths {
		valueLen := len(value)
		// fmt.Println(value)

		if valueLen < 2 {
			continue
		}
		for thisIndex, thisPos := range value {
			nextToJail := getCorrespondingJail(thisPos, state.Gb[thisPos].IsWhite)
			if nextToJail != -1 {

				if thisIndex == valueLen-1 {
					continue
				}

				// fmt.Println("value", value, "thisPos", thisPos)
				var newMove RawMove
				for i := 0; i < thisIndex; i++ {
					newMove = append(newMove, RawPartialMove{fromPos: value[i], toPos: value[i+1], sameColor: true, turnType: TURN_JUMPING})
				}
				newMove = append(newMove, RawPartialMove{fromPos: value[thisIndex], toPos: nextToJail, sameColor: true, turnType: TURN_RESCUE})

				newMove = append(newMove, RawPartialMove{fromPos: 69, toPos: value[thisIndex+1], sameColor: true, turnType: TURN_JUMPING})
				for i := thisIndex + 1; i < (valueLen - 1); i++ {
					newMove = append(newMove, RawPartialMove{fromPos: value[i], toPos: value[i+1], sameColor: true, turnType: TURN_JUMPING})
				}
				newMove[len(newMove)-1].sameColor = false
				newMove[len(newMove)-1].turnType = TURN_DEFAULT

				// fmt.Println("newMove", newMove)
				moves = append(moves, newMove)

				break
			}
		}
	}

	moves.add(
		pos, state,
		moveType{coordsToFunc([][2]int16{
			{1, 1}, {0, 1}, {-1, 1},
			{1, 0}, {0, 0}, {-1, 0},
			{1, -1}, {0, -1}, {-1, -1},
		}, state.Gb[pos].IsWhite)},
		ConditionType{empty},
	)

	// fmt.Println("moves", moves)
	return moves

}