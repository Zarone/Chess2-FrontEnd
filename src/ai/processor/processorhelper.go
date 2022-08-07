package processor

import (
	"chesstwoai/boardmanager"
)

func wrapper (myFunc func(int16), index int16) func(){
	return func(){myFunc(index)};
}

func getAllMoves(state boardmanager.State) boardmanager.PossibleMoves {
	
	var moves boardmanager.PossibleMoves;
	deferred := []func(){}
	for i := int16(0); i < 64; i++ {
		if state.Gb[i].IsWhite == state.IsWhite {

			if state.Gb[i].ThisPieceType.Name == boardmanager.Rook.Name {
				deferred = append(deferred, 
					wrapper(
						func(index int16) {
							// fmt.Println("Running deferred function")
							// fmt.Println("i", index)
							moves = append(moves, 
								state.Gb[index].ThisPieceType.GetMoves(index, state, boardmanager.ConditionType{boardmanager.RookFilterStrict(moves.CanReach(false))})...
							)
						}, i,
					),
				)
			} else {
				moves = append(moves, state.Gb[i].ThisPieceType.GetMoves(i, state, boardmanager.ConditionType{})...)
			}

		}
	}
	// moves.Print("Before deferred")
	// for i := 0; i < len(deferred); i++ {
	// 	deferred[i]()
	// }
	// moves.Print("After deferred")
	return moves;
}