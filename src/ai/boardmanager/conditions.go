package boardmanager

func empty(args conditionArgs) bool {
	return args.state.Gb[args.toPos].ThisPieceType.Name == "undefined";
}

func notSameType(args conditionArgs) bool {
	return empty(args) || args.state.Gb[args.fromPos].isWhite != args.state.Gb[args.toPos].isWhite
}

func rookCondition(args conditionArgs) bool {
	if (args.state.Gb[args.fromPos].isWhite){
		return args.state.RookWhiteActive
	} else {
		return args.state.RookBlackActive
	}
}