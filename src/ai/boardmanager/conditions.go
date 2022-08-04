package boardmanager


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