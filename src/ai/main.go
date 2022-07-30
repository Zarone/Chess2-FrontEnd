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

	initData, error := actBase(this, args);
	plugin, isPlugin := initData[0].(js.Value)
	if (!isPlugin) { panic("plugin not provided") }
	
	if (error != nil){
		plugin.Get("errorFromAI").Invoke(js.ValueOf(error.Error()))
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

func actAlgorithm(this js.Value, args []js.Value) any {

	initData, error := actBase(this, args);
	plugin, isPlugin := initData[0].(js.Value)
	if (!isPlugin) { panic("plugin not provided") }
	
	if (error != nil){
		plugin.Get("errorFromAI").Invoke(js.ValueOf(error.Error()))
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

func actBase(this js.Value, args []js.Value) ([]any, error) {

	if len(args) < 2 {
		panic("nope")
	}
	turn := args[0].String()
	plugin := args[1]

	// Do nothing if it's the human player's turn
	if strings.HasPrefix(turn, "White") {
		return []any{plugin}, errors.New("Cannot move because it's white's turn")
	} else {
		return []any{plugin}, nil
	}
}

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("getVersion", js.FuncOf(getVersion))
	js.Global().Set("actAlgorithmic", js.FuncOf(actAlgorithm))
	js.Global().Set("actHeuristic", js.FuncOf(actHeuristic))
	<-c
}
