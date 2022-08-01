package boardmanager

type rawMove struct {
	fromPos int8;
	toPos int8;
	sameColor bool;
	turnType string;
}

type possibleMoves []rawMove

type conditionArgs struct {
	fromPos int8;
	toPos int8;
	gb GameBoard;
}

func (moves possibleMoves) add(currentPos int8, move [](func(int8, []func(conditionArgs) bool) possibleMoves), conditions []func(conditionArgs) bool ){
	for i := 0; i < len(move); i++ {
		moves = append(moves, move[i](currentPos, conditions)...)
	}
}

type movement [2]int8
type position int8

func (pos position) add(mov movement){
	pos += (position) ((mov[0]) + 8*mov[1]);
}

func up(pos position, conditions []func(conditionArgs) bool) possibleMoves {
	var moves []position;
	moves = append(moves, pos.add([]movement{0, 1}))
}

// func diagonal(pos int8, conditions []func(conditionArgs) bool) possibleMoves {	
// 	for i := 0; i < len(conditions); i++{
// 		if (!conditions[i](conditionArgs{fromPos: pos, toPos: }))
// 	}
// }

func BearMove(pos int8, gb GameBoard) {

}