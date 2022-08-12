package boardmanager


// "chesstwoai/boardmanager"
// "fmt"

func wrapper ( myFunc func(int16) (*RawMove, bool), index int16 ) func() (*RawMove, bool) {
	return func() (*RawMove, bool) {
		return myFunc(index)
	}
}

func (state State) GetAllMovesGenerator() func() (*RawMove, bool) {
	
	// these both just store the state
	// since this function is pretty
	// much a generator
	var globalIndex = 0;
	var globalSubIndex = 0;
	var goingThroughDeferred = false;
	var moves PossibleMoves;
	var newMove RawMove;
	deferred := [2]func()(*RawMove, bool){nil, nil}


	return func () (*RawMove, bool) {

		// var globalIndex = 0;
		// var globalSubIndex = 0;
		// var goingThroughDeferred = false;
		
		if (!goingThroughDeferred){
			
			for ; globalIndex < 64; globalIndex++ {
				if state.Gb[globalIndex].IsWhite == state.IsWhite && state.Gb[globalIndex].ThisPieceType.Name != NullPiece.Name {
	
					if state.Gb[globalIndex].ThisPieceType.Name == Rook.Name {
						defIndex := 0;
						if deferred[0] != nil {
							defIndex = 1;
						}
	
						deferred[defIndex] = wrapper(
							func(index int16) (*RawMove, bool) {
								if (moves==nil) { moves = state.Gb[index].ThisPieceType.GetMoves(index, state, ConditionType{RookFilterStrict}) }
								for globalSubIndex < len(moves) {
									newMove = moves[globalSubIndex];
									globalSubIndex++;
									return &newMove, true;
								}
								globalSubIndex = 0;
								moves = nil;
								return nil, false;
							}, int16(globalIndex),
						)
							
							
					} else {
						if (moves == nil) { moves = state.Gb[globalIndex].ThisPieceType.GetMoves(int16(globalIndex), state, ConditionType{}) }
						for globalSubIndex < len(moves) {
							// So what I could do here in the future is check if a piece would be taken on this route.
							// If that's not the case, send it to a backlog which would be returned later. This would
							// hopefully increase pruning since the most extreme moves would be evaluated first.
							newMove = moves[globalSubIndex];
							globalSubIndex++;
							return &newMove, true;
						}
						globalSubIndex = 0;
						moves = nil;
					}
					
				}
			}
	
			goingThroughDeferred = true;
			globalIndex = 0;
			globalSubIndex = 0;

		} else {

			for ; globalIndex < 2; globalIndex++ {
				if deferred[globalIndex]==nil { 
					break;
				}
				move, isDone := deferred[globalIndex]()
				if (isDone) { 
					return move, true; 
				} else { 
					return nil, false 
				}
			}
		}
		return nil, false


	};
}

// func getAllMoves(state boardmanager.State) boardmanager.PossibleMoves {
	
// 	var moves boardmanager.PossibleMoves;
// 	deferred := [2]func(){nil, nil}
// 	for i := int16(0); i < 64; i++ {
// 		if state.Gb[i].IsWhite == state.IsWhite && state.Gb[i].ThisPieceType.Name != boardmanager.NullPiece.Name {

// 			if state.Gb[i].ThisPieceType.Name == boardmanager.Rook.Name {
// 				defIndex := 0;
// 				if deferred[0] != nil {
// 					defIndex = 1;
// 				}

// 				deferred[defIndex] = wrapper(
// 					func(index int16) {
// 						moves = append(moves, 
// 							state.Gb[index].ThisPieceType.GetMoves(index, state, boardmanager.ConditionType{boardmanager.RookFilterStrict})...
// 						)
// 					}, i,
// 				)
					
					
// 			} else {
// 				moves = append(moves, state.Gb[i].ThisPieceType.GetMoves(i, state, boardmanager.ConditionType{})...)
// 			}
			
// 		}
// 	}

// 	for i := 0; i < 2; i++ {
// 		if deferred[i]==nil { 
// 			break;
// 		}
// 		deferred[i]()
// 	}
// 	// moves.Print("\n")
// 	return moves;
// }