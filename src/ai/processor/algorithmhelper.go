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
func searchTree(state boardmanager.State, depth uint8, alpha int16, beta int16) (int16, boardmanager.RawMove) {
	
	
	// check end game conditions
	if (state.Gb[64].ThisPieceType.Name != boardmanager.NullPiece.Name && state.Gb[65].ThisPieceType.Name != boardmanager.NullPiece.Name){
		return math.MinInt16, nil
	} else if (state.Gb[66].ThisPieceType.Name != boardmanager.NullPiece.Name && state.Gb[67].ThisPieceType.Name != boardmanager.NullPiece.Name){
		return math.MaxInt16, nil
	}
	if depth == 0 { return staticEvaluation(state), nil; }

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

			// fmt.Println("move", moves[index].Output("White", "Black"))

			var eval int16;
			if depth > 1 {
				transpositionKey := getTranspositionKey(move)
				moves[index].Output("White", "Black")
				if (transpositionTable[transpositionKey] == -1){
					eval, _ = searchTree(move, depth-1, alpha, beta)
					fmt.Println("depth", depth)
					// fmt.Printf("%v => %v\n", eval, transpositionKey)
					// move.Print()
					// move.Gb.Print()
					transpositionTable[transpositionKey] = eval;
				} else {
					eval = transpositionTable[transpositionKey]
					fmt.Println("depth", depth)
					// fmt.Printf("Found %v: %v", transpositionKey, eval)
					// move.Print()
					// move.Gb.Print()
				}
			} else {
				eval, _ = searchTree(move, depth-1, alpha, beta)
			}
			
			// fmt.Println("eval", eval);
			if (eval > bestMoveEval){
				bestMoveEval = eval;
				bestMoveIndex = index;
			}

			alpha = maxInt16(alpha, bestMoveEval)
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
		bestMoveEval = math.MaxInt16
		for index, move := range **states {
			// fmt.Println("move", moves[index].Output("White", "Black"))

			var eval int16;
			if depth > 1 {
				transpositionKey := getTranspositionKey(move)
				moves[index].Output("White", "Black")
				if (transpositionTable[transpositionKey] == -1){
					eval, _ = searchTree(move, depth-1, alpha, beta)
					fmt.Println("depth", depth)
					// fmt.Printf("%v => %v\n", eval, transpositionKey)
					// move.Print()
					// move.Gb.Print()
					transpositionTable[transpositionKey] = eval;
				} else {
					eval = transpositionTable[transpositionKey]
					fmt.Println("depth", depth)
					// fmt.Printf("Found %v: %v", transpositionKey, eval)
					// move.Print()
					// move.Gb.Print()
				}
			} else {
				eval, _ = searchTree(move, depth-1, alpha, beta)
			}

			// fmt.Println("eval", eval)
			if (eval < bestMoveEval) {
				bestMoveEval = eval;
				bestMoveIndex = index;
			}

			
			beta = minInt16(beta, bestMoveEval)
			if (alpha >= beta) {break;}
		}
	}

	var bestMove boardmanager.RawMove = nil;
	if (bestMoveIndex != -1) { bestMove = moves[bestMoveIndex] }

	return bestMoveEval, bestMove
}

func BestMove(state boardmanager.State) boardmanager.RawMove{

	// fmt.Println("Starting Board")
	// fmt.Println("isWhite", state.IsWhite, "rookIsBlack", state.RookBlackActive, "rookIsWhite", state.RookWhiteActive)
	// state.Gb.Print()
	
	resetStatePtr()
	_, move := searchTree(state, MAX_DEPTH, math.MinInt16, math.MaxInt16)
	return move//getAllMoves(state)[6]
}