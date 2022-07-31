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

	// AI complains that it's not programmed yet
	plugin.Get("complain").Invoke(js.ValueOf("I don't know how to play yet"))

	actTail("g7", "g6", "", "")
	return nil
}

func ActAlgorithm(this js.Value, args []js.Value) any {

	initData := actHead(this, args);
	plugin := initData[0].(js.Value)

	// AI complains that it's not programmed yet
	plugin.Get("complain").Invoke(js.ValueOf("I don't know how to play yet"))

	actTail("g7", "g6", "", "")
	return nil
}

func actTail(pFrom string, pTo string, sFrom string, sTo string) {
	var outputPrimary = []interface{}{pFrom, pTo}
	var outputSecondary = []interface{}{sFrom, sTo}	
	var output []interface{}
	output = append(output, outputPrimary, outputSecondary)
	
	js.Global().Set("output", js.ValueOf(output))
}

func actHead(this js.Value, args []js.Value) ([]any) {

	if len(args) < 2 {
		panic("nope")
	}
	turn := args[0].String()
	plugin := args[1]
	boardRaw := args[2]

	fmt.Println(boardRaw.Get("a1").Get("isWhite").Bool())
	boardmanager.BoardRawToArrayBoard(boardRaw)

	// Do nothing if it's the human player's turn
	if strings.HasPrefix(turn, "White") {
		plugin.Get("errorFromAI").Invoke(js.ValueOf("AI cannot move because it's white's turn"))
		return []any{plugin}
	} else {
		return []any{plugin}
	}
}