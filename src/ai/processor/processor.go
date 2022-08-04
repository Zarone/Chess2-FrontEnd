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
	isWhite := thisColor == "White"
	var enemyColor string = initData[2].(string)
	state := initData[3].(boardmanager.State)

	// AI complains that it's not programmed yet
	plugin.Get("complain").Invoke(js.ValueOf("I don't know how to play yet"))

	/*moves := */getAllMoves(state, isWhite);

	// // based on presets for DEFAULT board layout
	// fmt.Println("Fish")
	// state.Gb[8].ThisPieceType.GetMoves(8, state).Print()
	// fmt.Println("Bear")
	// state.Gb[68].ThisPieceType.GetMoves(68, state).Print()
	// fmt.Println("Elephant", state.Gb[10].ThisPieceType.Name)
	// state.Gb[10].ThisPieceType.GetMoves(10, state).Print()

	// based on presets for QUEEN_TEST board layout
	// fmt.Println("Queen")
	// output := state.Gb[9].ThisPieceType.GetMoves(9, state)[20].Output(thisColor, enemyColor)

	// // based on presets for ROOK_PARTY board layout
	// fmt.Println("Rook", state.Gb[54].ThisPieceType.Name)
	// state.Gb[54].ThisPieceType.GetMoves(54, state).Print()

	// // based on presets for KING_TEST board layout
	// fmt.Println("Rook", state.Gb[1].ThisPieceType.Name)
	// state.Gb[1].ThisPieceType.GetMoves(1, state).Print()

	// // based on presets for MONKEY_TEST board layout
	// fmt.Println("Monkey", state.Gb[28].ThisPieceType.Name)
	// state.Gb[28].ThisPieceType.GetMoves(28, state).Print()
	// // output := state.Gb[28].ThisPieceType.GetMoves(28, state)[3].Output(thisColor, enemyColor)

	// // based on presets for MONKEY_RESCUE_TEST layout
	// fmt.Println("Monkey", state.Gb[31].ThisPieceType.Name);
	// state.Gb[31].ThisPieceType.GetMoves(31, state).Print()
	// output := state.Gb[31].ThisPieceType.GetMoves(31, state)

	output := []interface{}{ []interface{}{"h5", "y2", fmt.Sprintf("%v Rescue", thisColor)}, []interface{}{"TEMP", "f5", enemyColor} }
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


	state := boardmanager.State{Gb: boardmanager.BoardRawToArrayBoard(boardRaw), RookWhiteActive: rookActiveWhite, RookBlackActive: rookActiveBlack}
	fmt.Println("Initializing board")
	state.Gb.Print()

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
	return []any{plugin, thisColor, enemyColor, state}
}