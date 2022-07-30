package main

import (
	"strings"
	"syscall/js"
)

func getVersion(this js.Value, args []js.Value) any {
	return "1.0.0"
}

func act(this js.Value, args []js.Value) any {
	if len(args) < 2 {
		panic("nope")
	}
	turn := args[0].String()
	plugin := args[1]

	// Do nothing if it's the human player's turn
	if strings.HasPrefix(turn, "White") {
		return nil
	}

	// AI complains that it's not programmed yet
	plugin.Get("complain").Invoke(js.ValueOf("I don't know how to play yet"))

	return nil
}

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("getVersion", js.FuncOf(getVersion))
	js.Global().Set("act", js.FuncOf(act))
	<-c
}
