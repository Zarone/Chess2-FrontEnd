package processor

import (
	"chesstwoai/boardmanager"
	"fmt"
	"math"
	"math/rand"
)

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

// 2 ^ 16
const transpositionSize int = 65536

func getZobristHash(state boardmanager.State) int64 {
	
	if (!hasInitializedTable){
		for i:=0; i<69; i++{
			for j:=0; j<16; j++{
				zobristTable[i][j] = rand.Int63();
			}
		}
		zobristTurnOffset = rand.Int63();
		hasInitializedTable = true;
		fmt.Println("Initialized Zobrist Table")
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

func getTranspositionKey(state boardmanager.State) int {
	return int(getZobristHash(state) % int64(transpositionSize))
}

func uint8b(b bool) uint8{
	if b {
		return 1
	} else {
		return 0
	}
}

func maxInt16(a int16, b int16) int16 {
	if ( a > b ){
		return a;
	} else {
		return b
	}
}

func staticEvaluation(state boardmanager.State) int16{
	return 0;
}

// alpha is the best available move for white
// beta is the best available move for black
func searchTree(state boardmanager.State, depth uint8, alpha int16, beta int16) (int16) {
	if depth == 0 { return staticEvaluation(state); }

	moves := getAllMoves(state)
	states := moves.ToState(state)

	if state.IsWhite {
		// for each move
		// 	best move = math.Inf(-1)
		// 	evaluate it
		// 	set alpha to this evaluation if it's higher
		// 	// after these evaluations, black will have to option to ignore this.
		// 	// if white has an available move here that's better than what black 
		// 	// would have elsewhere, this path isn't worth considering for black.
		// 	if alpha >= beta
		// 		break
		// 	return best move
		var bestMove int16 = math.MinInt16
		for index, move := range states {

			fmt.Println(moves[index].Output("White", "Black"))

			var eval int16;
			if depth > 1 {
				// add logic to search transposition table.
				// don't forget to make hash a part of state
				// so that it can just mutate on game action.
				eval = searchTree(move, depth-1, alpha, beta)
			} else {
				eval = searchTree(move, depth-1, alpha, beta)
			}

			
			fmt.Println("eval", eval);
			bestMove = maxInt16(bestMove, eval);

			alpha = maxInt16(alpha, bestMove)
			if (alpha >= beta) {break;}
		}
		return int16(bestMove)
	} else {
		// for each move
		// 	best move = math.Inf(1)
		// 	evaluate it
		// 	set beta to this evaluation if it's lower
		// 	// after these evaluations, white will have the option to ignore this.
		// 	// if black has an available move here that's better than what white
		// 	// would have elsewhere, this path isn't worth considering for white.
		// 	if alpha >= beta
		// 		break
		// 	return best move
	}
	return 0;
}

func bestMove(state boardmanager.State) boardmanager.RawMove{
	
	searchTree(state, 1, int16(math.Inf(-1)), int16(math.Inf(1)))
	return getAllMoves(state)[6]
}