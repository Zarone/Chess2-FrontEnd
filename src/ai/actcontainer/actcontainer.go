package actcontainer 

import (
	"chesstwoai/boardmanager"
	"chesstwoai/processor"
	"chesstwoai/jsboardinterface"
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
	state := initData[3].(boardmanager.State)
	state.Hash = processor.GetZobristHash(state)
	var level uint8 = uint8(initData[4].(int));

	// AI complains that it's not programmed yet
	plugin.Get("complain").Invoke(js.ValueOf("I don't know how to play yet"))

	move := processor.BestMove(state, level);
	// thisHash := processor.GetZobristHash(state)
	// fmt.Println("Zobrist map of state", thisHash)

	output := move.Output(thisColor, enemyColor)
	// output := []interface{}{ []interface{}{"h5", "y2", fmt.Sprintf("%v Rescue", thisColor)}, []interface{}{"TEMP", "f5", enemyColor} }
	actTail(output)
	return nil
}

func actTail(output []interface{}) {
	js.Global().Set("output", js.ValueOf(output))
}

func actHead(this js.Value, args []js.Value) ([]any) {

	fmt.Println("Initial Args", args)

	if len(args) < 2 {
		panic("nope")
	}
	turn := args[0].String()
	plugin := args[1]
	boardRaw := args[2]
	var isWhite bool = args[3].Bool()
	rookActiveWhite := args[4].Bool()
	rookActiveBlack := args[5].Bool()
	level := args[6].Int();


	state := boardmanager.State{Gb: jsboardinterface.BoardRawToArrayBoard(boardRaw), RookWhiteActive: rookActiveWhite, RookBlackActive: rookActiveBlack, IsWhite: isWhite}
	// fmt.Println("Initializing board")
	// state.Gb.Print()

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
	return []any{plugin, thisColor, enemyColor, state, level}
}