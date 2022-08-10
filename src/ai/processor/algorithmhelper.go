package processor

import (
	"chesstwoai/boardmanager"
	"fmt"
	"math"
)

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

const MAX_DEPTH = 3;

// this is a way of optimizing states, so that instead
// of allocating new memory for each collection of 
// states, you just rewrite the old ones. This wouldn't
// work if you were using multithreading.
var statesInEachLayer [MAX_DEPTH]*[]boardmanager.State
func getStatePtr(depth uint8) **[]boardmanager.State {
	return &statesInEachLayer[depth-1];
}
func resetStatePtr() {
	statesInEachLayer = [MAX_DEPTH]*[]boardmanager.State{};
}

// alpha is the best available move for white
// beta is the best available move for black
func searchTree(state boardmanager.State, depth uint8, alpha int16, beta int16, debug bool) (int16, boardmanager.RawMove) {
	
	
	// check end game conditions
	if (state.Gb[64].ThisPieceType.Name != boardmanager.NullPiece.Name && state.Gb[65].ThisPieceType.Name != boardmanager.NullPiece.Name){
		return math.MinInt16, nil
	} else if (state.Gb[66].ThisPieceType.Name != boardmanager.NullPiece.Name && state.Gb[67].ThisPieceType.Name != boardmanager.NullPiece.Name){
		return math.MaxInt16, nil
	}
	if depth == 0 { return staticEvaluation(state), nil; }
	if (debug) { fmt.Printf("\nstart depth %v\n", depth) }

	moves := getAllMoves(state)

	if len(moves) == 0 {
		fmt.Println("NO AVAILABLE MOVES")
		state.Print()
		state.Gb.Print()	
	}

	// you only need one state per layer, since
	// everything runs consecutively
	states := getStatePtr(depth);
	
	moves.ToState(&zobristInfo, states, state)

	// for i:=0;i<len((**states));i++{
		// 	fmt.Println(moves[i].Output("White", "Black")...)
	// 	(**states)[i].Gb.Print()
	// }
	
	var bestMoveIndex int = -1;
	var bestMoveEval int16;
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
		bestMoveEval = math.MinInt16
		for index, move := range **states {
			
			if debug { fmt.Println("check out move", moves[index].Output("White", "Black")) }
			// move.Gb.Print()
			
			var eval int16;
			if depth > 1 {
				transpositionKey := getTranspositionKey(move)
				// fmt.Println(moves[index].Output("White", "Black"))
				if (transpositionTable[transpositionKey] == -1){
					eval, _ = searchTree(move, depth-1, alpha, beta, debug)
					if (debug) { fmt.Println("\nEvaluated depth", depth-1) }
					if (debug) { fmt.Printf("%v => %v\n", eval, transpositionKey) }
					// move.Print()
					// move.Gb.Print()
					transpositionTable[transpositionKey] = eval;
				} else {
					eval = transpositionTable[transpositionKey]
					if (debug) { fmt.Println("\nEvaluated depth", depth-1) }
					if (debug) { fmt.Printf("Found %v: %v\n", transpositionKey, eval) }
					// move.Print()
					// move.Gb.Print()
				}
			} else {
				eval, _ = searchTree(move, depth-1, alpha, beta, debug)
				// fmt.Println("Evaluated depth", depth-1)
				if debug { fmt.Println("(no transposition) eval", eval) }
				// fmt.Println(moves[index])
				// move.Print()
				// move.Gb.Print()
			}
			if debug { fmt.Println("checked out move", moves[index].Output("White", "Black")) }
			
			// fmt.Println("eval", eval);
			if (eval > bestMoveEval){
				bestMoveEval = eval;
				bestMoveIndex = index;
			}

			alpha = maxInt16(alpha, bestMoveEval)
			if (alpha >= beta) {
				if debug { fmt.Printf("Pruning: %v >= %v\n", alpha, beta) }
				break;
			}
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
		bestMoveEval = math.MaxInt16
		for index, move := range **states {
			if debug { fmt.Println("check out move", moves[index].Output("White", "Black")) }
			// move.Gb.Print()
			
			var eval int16;
			if depth > 1 {
				transpositionKey := getTranspositionKey(move)
				// fmt.Println(moves[index].Output("White", "Black"))
				if (transpositionTable[transpositionKey] == -1){
					eval, _ = searchTree(move, depth-1, alpha, beta, debug)
					if debug { fmt.Println("\nEvaluated depth", depth-1) }
					if debug { fmt.Printf("%v => %v\n", eval, transpositionKey) }
					// move.Print()
					// move.Gb.Print()
					transpositionTable[transpositionKey] = eval;
				} else {
					eval = transpositionTable[transpositionKey]
					if debug { fmt.Println("\nEvaluated depth", depth-1) }
					if debug { fmt.Printf("Found %v: %v\n", transpositionKey, eval) }
					// move.Print()
					// move.Gb.Print()
				}
			} else {
				eval, _ = searchTree(move, depth-1, alpha, beta, debug)
				// fmt.Println("Evaluated depth", depth-1)
				if debug { fmt.Println("(no transposition) eval", eval) }
				// fmt.Println(moves[index])
				// move.Print()
				// move.Gb.Print()
			}
			if debug { fmt.Println("checked out move", moves[index].Output("White", "Black")) }

			// fmt.Println("eval", eval)
			if (eval < bestMoveEval) {
				bestMoveEval = eval;
				bestMoveIndex = index;
			}

			
			beta = minInt16(beta, bestMoveEval)
			if (alpha >= beta) {
				
				if debug { fmt.Printf("Pruning: %v >= %v\n", alpha, beta) }
				break;
			}
		}
	}

	var bestMove boardmanager.RawMove = nil;
	if (bestMoveIndex != -1) { bestMove = moves[bestMoveIndex] }

	return bestMoveEval, bestMove
}

func BestMove(state boardmanager.State) boardmanager.RawMove{

	fmt.Println("Starting Board")
	fmt.Println("isWhite", state.IsWhite, "rookIsBlack", state.RookBlackActive, "rookIsWhite", state.RookWhiteActive)
	state.Gb.Print()
	
	resetStatePtr()
	_, move := searchTree(state, MAX_DEPTH, math.MinInt16, math.MaxInt16, false)
	return move//getAllMoves(state)[6]
}