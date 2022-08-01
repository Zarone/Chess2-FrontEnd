package processor

import (
	"chesstwoai/boardmanager"
	"fmt"
	"strings"
	"syscall/js"
)

func ActHeuristic(this js.Value, args []js.Value) any {
	initData := actHead(this, args);
	plugin := initData[0].(js.Value)
	var thisColor string = initData[1].(string)
	var enemyColor string = initData[2].(string)

	// AI complains that it's not programmed yet
	plugin.Get("complain").Invoke(js.ValueOf("I don't know how to play yet"))

	output := []interface{}{ []interface{}{"h5", "y2", fmt.Sprintf("%v Rescue", thisColor)}, []interface{}{"TEMP", "f5", enemyColor} }
	actTail(output)
	return nil
}

func ActAlgorithm(this js.Value, args []js.Value) any {

	initData := actHead(this, args);
	plugin := initData[0].(js.Value)
	var thisColor string = initData[1].(string)
	var enemyColor string = initData[2].(string)
	board := initData[3].(boardmanager.GameBoard)

	// AI complains that it's not programmed yet
	plugin.Get("complain").Invoke(js.ValueOf("I don't know how to play yet"))

	// STEPS FOR GETTING PIECES
	// 	1. For the simple pieces (bear, elephant, fish, queen, king), just get all possible moves.
	//	   Make sure to add movement to jail if they capture royalty.
	//  2. For each monkey, use create node map to search for each space they can move to
	//  3. For each monkey, check if they can do any rescue
	//  4. For each rook, find spaces that are either
	//		a ) Not able to be taken the next turn.
	//     	b ) Defended, as in if the rook dies then another piece can take revenge.
	//	   and also it must be next to a piece of either color

	// for i:=0;i<64;i++{

	// }



	// plugin.Get("complain").Invoke(js.ValueOf(board[8].ThisPieceType.GetMoves(8, board)[0].Output(thisColor, enemyColor)))

	// plugin.Get("complain").Invoke(js.ValueOf( board[68].ThisPieceType.GetMoves(68, board)[0].Output(thisColor, enemyColor) ))

	// output := [0].Output(thisColor, enemyColor);

	output := board[8].ThisPieceType.GetMoves(8, board)[0].Output(thisColor, enemyColor)
	// output := []interface{}{ []interface{}{"h5", "y2", fmt.Sprintf("%v Rescue", thisColor)}, []interface{}{"TEMP", "f5", enemyColor} }
	actTail(output)
	return nil
}

func actTail(output []interface{}) {
	js.Global().Set("output", js.ValueOf(output))
}

func actHead(this js.Value, args []js.Value) ([]any) {

	if len(args) < 2 {
		panic("nope")
	}
	turn := args[0].String()
	plugin := args[1]
	boardRaw := args[2]
	var isWhite bool = args[3].Bool()

	board := boardmanager.BoardRawToArrayBoard(boardRaw)
	fmt.Println("Initializing board")
	board.Print()

	var thisColor string
	var enemyColor string
	if (isWhite) {
		thisColor = "White"; enemyColor = "Black";
	} else {
		thisColor="Black"; enemyColor = "White"
	}

	// Do nothing if it's the human player's turn
	if strings.HasPrefix(turn, enemyColor) {
		plugin.Get("errorFromAI").Invoke(js.ValueOf("AI cannot move because it's white's turn"))
	} 
	return []any{plugin, thisColor, enemyColor, board}
}