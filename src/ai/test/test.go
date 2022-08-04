package test

// I couldn't find a good way to implement a testing
// system without using the browser, but the code
// could be useful later, so I'm keeping it.

import (
	"chesstwoai/processor"
	"syscall/js"
)


func newTile(isWhite bool, pieceType string) js.Value {
	var tile js.Value;

	var constructor js.Value
	constructor.Set("name", js.ValueOf(pieceType))
	tile.Set("constructor", constructor);

	tile.Set("isWhite", js.ValueOf(isWhite));

	return tile;
}

func setTile(board *js.Value, id string, isWhite bool, pieceType string) {
	(*board).Set(id, newTile(isWhite, pieceType))
}

func Main(){
	var this js.Value
	var args []js.Value

	args[0] = js.ValueOf("White")
	args[1] = js.Value{}

	var board js.Value

	args[2] = board;

	processor.ActAlgorithm(this, args);
}