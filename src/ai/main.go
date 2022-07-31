package main

import (
	"chesstwoai/processor"
	"os"
	"syscall/js"
	"fmt"
)

func getVersion(this js.Value, args []js.Value) any {
	return "1.0.0"
}


func main() {

	fmt.Println(os.Args)

	c := make(chan struct{}, 0)
	js.Global().Set("getVersion", js.FuncOf(getVersion))
	js.Global().Set("actAlgorithmic", js.FuncOf(processor.ActAlgorithm))
	js.Global().Set("actHeuristic", js.FuncOf(processor.ActHeuristic))
	<-c
}
