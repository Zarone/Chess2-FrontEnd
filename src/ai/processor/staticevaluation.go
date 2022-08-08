package processor 

import "chesstwoai/boardmanager"

var ELEPHANT_VALUE int = 100;
var FISH_VALUE int = 100;
var FISH_QUEEN_VALUE int = 500;
var KING_VALUE int = 500;
var MONKEY_VALUE int = 400;
var QUEEN_VALUE int = 800;
var ROOK_VALUE int = 300;
var NULL_VALUE int = 0;

func staticEvaluation(state boardmanager.State) int16{
	val := int16(0)
	for i:=0; i<64; i++{
		multiplier := int16(1);
		if (!state.Gb[i].IsWhite) { multiplier = -1; }
		val += state.Gb[i].ThisPieceType.StaticValue * multiplier
	}
	return val;
}