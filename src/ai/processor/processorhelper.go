package processor

import (
	"chesstwoai/boardmanager"
	"fmt"
	"math/rand"
)

func wrapper (myFunc func(int16), index int16) func(){
	return func(){myFunc(index)};
}

func getAllMoves(state boardmanager.State, isWhite bool) boardmanager.PossibleMoves {
	
	var moves boardmanager.PossibleMoves;
	deferred := []func(){}
	for i := int16(0); i < 64; i++ {
		if state.Gb[i].IsWhite == isWhite {

			if state.Gb[i].ThisPieceType.Name == boardmanager.Rook.Name {
				deferred = append(deferred, 
					wrapper(
						func(index int16) {
							fmt.Println("Running deferred function")
							fmt.Println("i", index)
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
	moves.Print("Before deferred")
	for i := 0; i < len(deferred); i++ {
		deferred[i]()
	}
	moves.Print("After deferred")
	return moves;
}

type node struct {
	state boardmanager.State;
	children []boardmanager.State;
}

func getNodeTree(state boardmanager.State) node {
	return node{state: state, children: []boardmanager.State{}}
}

var zobristTable [69][16]int64;
var zobristTurnOffset int64;
var hasInitializedTable = false;

func uint8b(b bool) uint8{
	if b {
		return 1
	} else {
		return 0
	}
}

func zobristMap(state boardmanager.State) int64 {

	if (!hasInitializedTable){
		for i:=0; i<69; i++{
			for j:=0; j>14; j++{
				zobristTable[i][j] = rand.Int63();
			}
		}
		zobristTurnOffset = rand.Int63();
		hasInitializedTable = true;
		fmt.Println("Initialized zobrist table")
	}

	var thisHash int64 = 0;
	if (state.IsWhite) { thisHash = zobristTurnOffset; }

	for i:=0; i<69; i++{
		if state.Gb[i].ThisPieceType.Name != boardmanager.NullPiece.Name {
			thisHash ^= zobristTable[i][state.Gb[i].ThisPieceType.ID + 8*uint8b(state.Gb[i].IsWhite)]
		}
	}

	return thisHash

}