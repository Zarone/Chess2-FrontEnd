package boardmanager

import (
	// "chesstwoai/boardmanager"
	// "fmt"
)

func wrapper (myFunc func(int16), index int16) func(){
	return func(){myFunc(index)};
}

func (state State) GetAllMovesGenerator() <- chan *RawMove{
	ch := make(chan *RawMove);
	go func (){

		var moves PossibleMoves;
		deferred := [2]func(){nil, nil}
		for i := int16(0); i < 64; i++ {
			if state.Gb[i].IsWhite == state.IsWhite && state.Gb[i].ThisPieceType.Name != NullPiece.Name {

				if state.Gb[i].ThisPieceType.Name == Rook.Name {
					defIndex := 0;
					if deferred[0] != nil {
						defIndex = 1;
					}

					deferred[defIndex] = wrapper(
						func(index int16) {
							moves = state.Gb[index].ThisPieceType.GetMoves(index, state, ConditionType{RookFilterStrict})
							for _, move := range moves {
								// fmt.Println("rook sending", move)
								ch <- &move;
							}	
						}, i,
					)
						
						
				} else {
					moves = state.Gb[i].ThisPieceType.GetMoves(i, state, ConditionType{})
					for _, move := range moves {
						// fmt.Println("sending", move)
						newMove := move;
						ch <- &newMove;
					}
				}
				
			}
		}

		for i := 0; i < 2; i++ {
			if deferred[i]==nil { 
				break;
			}
			deferred[i]()
		}
		close(ch)
	} ();
	return ch;
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