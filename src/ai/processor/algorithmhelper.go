package processor

import (
	"chesstwoai/boardmanager"
	"fmt"
	"math"
	"math/rand"
)


var zobristTable [69][16]int64;
var zobristTurnOffset int64;
var hasInitializedTable = false;

// 2 ^ 16
const transpositionSize int = 65536

func GetZobristHash(state boardmanager.State) int64 {
	
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
	fmt.Println("REMINDER: make transposition map hold array of possible hash codes, so that collisions are reduced")
	return int(GetZobristHash(state) % int64(transpositionSize))
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

func minInt16(a int16, b int16) int16 {
	if (a < b) {
		return a;
	} else {
		return b;
	}
}

const MAX_DEPTH = 4;

// this is a way of optimizing states, so that instead
// of allocating new memory for each collection of 
// states, you just rewrite the old ones. This wouldn't
// work if you were using multithreading.
var statesInEachLayer [MAX_DEPTH]*[]boardmanager.State
func getStatePtr(depth uint8) **[]boardmanager.State {
	return &statesInEachLayer[depth-1];
}

// alpha is the best available move for white
// beta is the best available move for black
func searchTree(state boardmanager.State, depth uint8, alpha int16, beta int16) (int16, boardmanager.RawMove) {
	if depth == 0 { return staticEvaluation(state), nil; }

	moves := getAllMoves(state)

	// you only need one state per layer, since
	// everything runs consecutively

	states := getStatePtr(depth);
	
	moves.ToState(states, state)

	// for i:=0;i<len((**states));i++{
	// 	fmt.Println(moves[i].Output("White", "Black")...)
	// 	(**states)[i].Gb.Print()
	// }
	
	var bestMoveIndex int = -1;
	var bestMove int16;
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
		bestMove = math.MinInt16
		for index, move := range **states {

			// fmt.Println("move", moves[index].Output("White", "Black"))

			var eval int16;
			if depth > 1 {
				// add logic to search transposition table.
				// don't forget to make hash a part of state
				// so that it can just mutate on game action.
				eval, _ = searchTree(move, depth-1, alpha, beta)
			} else {
				eval, _ = searchTree(move, depth-1, alpha, beta)
			}
			
			// fmt.Println("eval", eval);
			if (eval > bestMove){
				bestMove = eval;
				bestMoveIndex = index;
			}

			alpha = maxInt16(alpha, bestMove)
			if (alpha >= beta) {break;}
		}
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
		bestMove = math.MaxInt16
		for index, move := range **states {
			// fmt.Println("move", moves[index].Output("White", "Black"))

			var eval int16;
			eval, _ = searchTree(move, depth-1, alpha, beta)

			// fmt.Println("eval", eval)
			if (eval < bestMove) {
				bestMove = eval;
				bestMoveIndex = index;
			}

			
			beta = minInt16(beta, bestMove)
			if (alpha >= beta) {break;}
		}
	}
	return bestMove, moves[bestMoveIndex]
}

func BestMove(state boardmanager.State) boardmanager.RawMove{
	
	_, move := searchTree(state, MAX_DEPTH, math.MinInt16, math.MaxInt16)
	return move//getAllMoves(state)[6]
}