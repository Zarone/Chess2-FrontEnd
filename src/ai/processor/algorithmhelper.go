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

// const MAX_DEPTH = 3;


// this is a way of optimizing states, so that instead
// of allocating new memory for each collection of 
// states, you just rewrite the old ones. This wouldn't
// work if you were using multithreading.
var statesInEachLayer []*[]boardmanager.State
func getStatePtr(depth uint8) **[]boardmanager.State {
	return &statesInEachLayer[depth-1];
}
func resetStatePtr(level uint8) {
	statesInEachLayer = make([]*[]boardmanager.State, level);
}

type debugNode struct {
	value int16;
	name string;
	isWhite bool;
	children []debugNode;
	parent *debugNode;
}


// alpha is the best available move for white
// beta is the best available move for black
func searchTree(state boardmanager.State, depth uint8, alpha int16, beta int16, debugThreshold int8, parent *debugNode) (int16, *boardmanager.RawMove) {
	
	// check end game conditions
	if (state.Gb[64].ThisPieceType.Name != boardmanager.NullPiece.Name && state.Gb[65].ThisPieceType.Name != boardmanager.NullPiece.Name){
		return math.MinInt16+1, nil
	} else if (state.Gb[66].ThisPieceType.Name != boardmanager.NullPiece.Name && state.Gb[67].ThisPieceType.Name != boardmanager.NullPiece.Name){
		return math.MaxInt16-1, nil
	}
	if depth == 0 { return staticEvaluation(state), nil; }

	// you only need one state per layer, since
	// everything runs consecutively
	states := getStatePtr(depth);
	
	var index int = 0;
	
	var bestMovePtr *boardmanager.RawMove = nil;
	var bestMoveEval int16;

	nextMove, rawMove, incomplete := state.GetAllMovesGenerator(), (*boardmanager.RawMove)(nil), true
	if state.IsWhite { bestMoveEval = math.MinInt16 } else { bestMoveEval = math.MaxInt16 }
	var newDebugNode debugNode;
	for incomplete { 
		rawMove, incomplete = nextMove();
		if (!incomplete) { break; }

		rawMove.ToState(&zobristInfo, states, state, index)
		
		if (debugThreshold > -1) { newDebugNode = debugNode{parent: parent, children: []debugNode{}, name: fmt.Sprint(rawMove.Output("","")), isWhite: state.IsWhite}; }

		var eval int16;
		if depth > 1 {
			transpositionKey := getTranspositionKey((**states)[index])
			if (transpositionTable[transpositionKey] == -1){
				eval, _ = searchTree((**states)[index], depth-1, alpha, beta, debugThreshold, &newDebugNode)
				transpositionTable[transpositionKey] = eval;
			} else {				
				eval = transpositionTable[transpositionKey]
				if (debugThreshold > -1) { newDebugNode.children = append(newDebugNode.children, debugNode{name: fmt.Sprintf("TRANSPOSITION TABLE: KEY %v", transpositionKey)}) }
			}
		} else {
			eval, _ = searchTree((**states)[index], depth-1, alpha, beta, debugThreshold, &newDebugNode)
		}

		if debugThreshold > -1 {
			newDebugNode.value = eval;
			parent.children = append(parent.children, newDebugNode)
		}
			
		if state.IsWhite {
			if (eval > bestMoveEval){
				bestMoveEval = eval;
				newBestMove := *rawMove;
				bestMovePtr = &newBestMove;
			}
			alpha = maxInt16(alpha, bestMoveEval)
			if (alpha >= beta) {
				break;
			}
		} else {
			if (eval < bestMoveEval) {
				bestMoveEval = eval;
				newBestMove := *rawMove;
				bestMovePtr = &newBestMove;
			}
			
			beta = minInt16(beta, bestMoveEval)
			if (alpha >= beta) {
				break;
			}
		}

		index++;
	}

	return bestMoveEval, bestMovePtr 
}

func BestMove(state boardmanager.State, level uint8) boardmanager.RawMove{

	fmt.Println("Starting Board")
	fmt.Println("isWhite", state.IsWhite, "rookIsBlack", state.RookBlackActive, "rookIsWhite", state.RookWhiteActive)
	state.Gb.Print()
	
	resetStatePtr(level)
	resetTranspositionTable()

	rootDebugNode := debugNode{name: "ROOT", value: 0, children: []debugNode{}}
	eval, move := searchTree(state, level, math.MinInt16, math.MaxInt16, 0, &rootDebugNode)
	rootDebugNode.value = eval;
	
	if (move == nil){
		return nil;
	} else {
		return *move;
	}
}