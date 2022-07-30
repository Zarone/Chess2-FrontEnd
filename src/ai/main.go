package main

import (
	"errors"
	"strings"
	"syscall/js"
)


func getVersion(this js.Value, args []js.Value) any {
	return "1.0.0"
}

func actHeuristic(this js.Value, args []js.Value) any {

	initData := actBase(this, args);
	plugin, isPlugin := initData[1].(js.Value)
	if (!isPlugin) { panic("plugin not provided") }
	errorInfo, error := initData[0].(error)
	if (error){
		plugin.Get("complain").Invoke(js.ValueOf(errorInfo.Error()))
	}

	// AI complains that it's not programmed yet
	plugin.Get("complain").Invoke(js.ValueOf("I don't know how to play yet"))

	return nil
}

func actAlgorithm(this js.Value, args []js.Value) any {

	initData := actBase(this, args);
	plugin, isPlugin := initData[1].(js.Value)
	if (!isPlugin) { panic("plugin not provided") }
	errorInfo, error := initData[0].(error)
	if (error){
		plugin.Get("errorFromAI").Invoke(js.ValueOf(errorInfo.Error()))
	}

	// AI complains that it's not programmed yet
	plugin.Get("complain").Invoke(js.ValueOf("I don't know how to play yet"))

	var outputPrimary []interface{}
	outputPrimary = append(outputPrimary, "e7", "e6")

	var outputSecondary []interface{}
	outputSecondary = append(outputSecondary, "", "")
	
	var output []interface{}
	output = append(output, outputPrimary, outputSecondary)

	js.Global().Set("output", js.ValueOf(output))
	return nil
}

func actBase(this js.Value, args []js.Value) ([]any) {

	if len(args) < 2 {
		panic("nope")
	}
	turn := args[0].String()
	plugin := args[1]

	// Do nothing if it's the human player's turn
	if strings.HasPrefix(turn, "White") {
		return []any{errors.New("Cannot move because it's white's turn"), plugin}
	} else {
		return []any{(*int8)(nil), plugin}
	}
}

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("getVersion", js.FuncOf(getVersion))
	js.Global().Set("actAlgorithmic", js.FuncOf(actAlgorithm))
	js.Global().Set("actHeuristic", js.FuncOf(actHeuristic))
	<-c
}
