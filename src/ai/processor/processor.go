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

	// AI complains that it's not programmed yet
	plugin.Get("complain").Invoke(js.ValueOf("I don't know how to play yet"))

	// STEPS
	// 1. For the simple pieces (elephant, fish, queen, king)

	output := []interface{}{ []interface{}{"h5", "y2", fmt.Sprintf("%v Rescue", thisColor)}, []interface{}{"TEMP", "f5", enemyColor} }
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

	boardmanager.BoardRawToArrayBoard(boardRaw)

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
	return []any{plugin, thisColor, enemyColor}
}