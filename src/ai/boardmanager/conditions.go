package boardmanager

type conditionArgs struct {
	fromPos int16
	toPos   int16
	state   State
}

func empty(args conditionArgs) bool {
	return args.state.Gb[args.toPos].ThisPieceType.Name == NullPiece.Name
}

func notSameType(args conditionArgs) bool {
	return empty(args) || args.state.Gb[args.fromPos].IsWhite != args.state.Gb[args.toPos].IsWhite
}

func rookCondition(args conditionArgs) bool {
	if args.state.Gb[args.fromPos].IsWhite {
		return args.state.RookWhiteActive
	} else {
		return args.state.RookBlackActive
	}
}

func RookFilterStrict(args conditionArgs) bool {
	hasTarget := nextToEnemyPiece(args.toPos, args.state)
	if (!hasTarget) { return false; }
	row, col := posToRowCol(args.toPos)
	
	// this just makes sure there's no fish to take the rook next turn
	if args.state.Gb[args.fromPos].IsWhite {
		
		pos1 := rowColToPos(row-1, col-1)
		
		if inBorders(row-1, col-1) &&
		args.state.Gb[pos1].ThisPieceType.Name == Fish.Name &&
		!args.state.Gb[pos1].IsWhite {
			return false;
		}
		
		pos2 := rowColToPos(row-1, col+1)

		if inBorders(row-1, col+1) &&
		args.state.Gb[pos2].ThisPieceType.Name == Fish.Name &&
		!args.state.Gb[pos2].IsWhite {
			return false;
		}
	} else {

		pos1 := rowColToPos(row+1, col-1)
		
		if inBorders(row+1, col-1) &&
		args.state.Gb[pos1].ThisPieceType.Name == Fish.Name &&
		args.state.Gb[pos1].IsWhite {
			return false;
		}
		
		pos2 := rowColToPos(row+1, col+1)

		if inBorders(row+1, col+1) &&
		args.state.Gb[pos2].ThisPieceType.Name == Fish.Name &&
		args.state.Gb[pos2].IsWhite {
			return false;
		}
	}

	return true;
}

func pieceInTheWay(args conditionArgs) bool {
	return args.state.Gb[(args.fromPos+args.toPos)/2].ThisPieceType.Name == NullPiece.Name
}