package main

import (
	"syscall/js"
)

func getVersion(this js.Value, args []js.Value) any {
	return "1.0.0"
}

func main() {
	c := make(chan struct{}, 0)
	js.Global().Set("getVersion", js.FuncOf(getVersion))
	<-c
}
