package processor

import (
	"bytes"
	"chesstwoai/boardmanager"
	"fmt"
	"log"
	"math"

	"github.com/goccy/go-graphviz"
	"github.com/goccy/go-graphviz/cgraph"
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

const MAX_DEPTH = 2;

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

type debugNode struct {
	children []debugNode;
	value int16;
	name string;
	isWhite bool;
}


// alpha is the best available move for white
// beta is the best available move for black
func searchTree(state boardmanager.State, depth uint8, alpha int16, beta int16, debugThreshold uint8, parent *debugNode) (int16, *boardmanager.RawMove) {
	
	// check end game conditions
	if (state.Gb[64].ThisPieceType.Name != boardmanager.NullPiece.Name && state.Gb[65].ThisPieceType.Name != boardmanager.NullPiece.Name){
		return math.MinInt16, nil
	} else if (state.Gb[66].ThisPieceType.Name != boardmanager.NullPiece.Name && state.Gb[67].ThisPieceType.Name != boardmanager.NullPiece.Name){
		return math.MaxInt16, nil
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
	for incomplete { 
		rawMove, incomplete = nextMove();
		if (!incomplete) { break; }

		rawMove.ToState(&zobristInfo, states, state, index)
		
		newDebugNode := debugNode{children: []debugNode{}, name: fmt.Sprint(rawMove.Output("","")), isWhite: state.IsWhite};

		var eval int16;
		if depth > 1 {
			transpositionKey := getTranspositionKey((**states)[index])
			if (transpositionTable[transpositionKey] == -1){
				eval, _ = searchTree((**states)[index], depth-1, alpha, beta, debugThreshold, &newDebugNode)
				transpositionTable[transpositionKey] = eval;
			} else {
				eval = transpositionTable[transpositionKey]
			}
		} else {
			eval, _ = searchTree((**states)[index], depth-1, alpha, beta, debugThreshold, &newDebugNode)
		}

		newDebugNode.value = eval;
		parent.children = append(parent.children, newDebugNode)
			
		if state.IsWhite {
			if (eval > bestMoveEval){
				bestMoveEval = eval;
				bestMovePtr = rawMove;
			}
			alpha = maxInt16(alpha, bestMoveEval)
			if (alpha >= beta) {
				break;
			}
		} else {
			if (eval < bestMoveEval) {
				bestMoveEval = eval;
				bestMovePtr = rawMove;
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

func recursiveGraph(parentNode *debugNode, parentGraphNode *cgraph.Node, graph *cgraph.Graph, cumulativeName string){
	if len(parentNode.children) == 0 {return;}
	for _, child := range parentNode.children {
		newName := cumulativeName+"    "+child.name
		node, err := graph.CreateNode(newName)
		if err != nil {
			log.Fatal(err)
		}
		color := "White"
		if !child.isWhite {color="Black"}
		node.SetXLabel(fmt.Sprintf("%v [%v]", child.value, color))
		node.SetMargin(0.5)
		// nodeOffsetX := (indexInParent)/(len(parentNode.children))*100 - 50
		// nodeOffsetY := 1000;
		// node.SetPos(float64(parentX+nodeOffsetX), float64(parentY+nodeOffsetY))
		graph.CreateEdge("", parentGraphNode, node)
		// e.SetMinLen(5)
		// e.SetLabelAngle(90)
		// e.SetLabelDistance(5)
		// node.SetGradientAngle(-90)
		recursiveGraph(&child, node, graph, newName)
	}
}

func BestMove(state boardmanager.State) boardmanager.RawMove{

	fmt.Println("Starting Board")
	fmt.Println("isWhite", state.IsWhite, "rookIsBlack", state.RookBlackActive, "rookIsWhite", state.RookWhiteActive)
	state.Gb.Print()
	
	resetStatePtr()
	resetTranspositionTable()


	rootDebugNode := debugNode{name: "ROOT", value: 0, children: []debugNode{}}

	eval, move := searchTree(state, MAX_DEPTH, math.MinInt16, math.MaxInt16, 0, &rootDebugNode)
	rootDebugNode.value = eval;


	g := graphviz.New()
	graph, err := g.Graph()
	graph.SetGradientAngle(-90)

	
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := graph.Close(); err != nil {
			log.Fatal(err)
		}
		g.Close()
	}()

	

	n, err := graph.CreateNode("ROOT")
	n.SetXLabel(fmt.Sprint(eval))
	if err != nil {
		log.Fatal(err)
	}
	// m, err := graph.CreateNode("m")
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// e, err := graph.CreateEdge("e", n, m)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// e.SetLabel("e")

	recursiveGraph(&rootDebugNode, n, graph, "")
	n.SetMargin(0.5)
	n.SetPos(0, 0)
	
	var buf bytes.Buffer
	if err := g.Render(graph, "dot", &buf); err != nil {
		log.Fatal(err)
	}

	// fmt.Println(buf.String())
	g.RenderFilename(graph, graphviz.SVG, "../debugGraph.svg")



	if (move == nil){
		return nil;
	} else {
		return *move;
	}
}