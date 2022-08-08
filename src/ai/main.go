package main

// testing address
// http://localhost:5500/game.html?friendRoom=false&timeLimit=100&computerLevel=5&computerType=ALGORITHMIC&gamemode=HUMAN_VS_AI

import (
	"chesstwoai/actcontainer"
	"syscall/js"
)

func getVersion(this js.Value, args []js.Value) any {
	return "1.0.0"
}


func main() {

	c := make(chan struct{}, 0)
	js.Global().Set("getVersion", js.FuncOf(getVersion))
	js.Global().Set("actAlgorithmic", js.FuncOf(actcontainer.ActAlgorithm))
	js.Global().Set("actHeuristic", js.FuncOf(actcontainer.ActHeuristic))
	<-c
}
