package boardmanager 

// moved to piece types, only here for reference

// var ELEPHANT_VALUE int = 100;
// var FISH_VALUE int = 100;
// var FISH_QUEEN_VALUE int = 500;
// var KING_VALUE int = 500;
// var MONKEY_VALUE int = 400;
// var QUEEN_VALUE int = 800;
// var ROOK_VALUE int = 300;
// var NULL_VALUE int = 0;

var multiplier = int16(1)

var row int16;

func StaticEvaluation(state State) int16{

	val := int16(0);

	for i:=int16(0); i<64; i++{
		if (!state.Gb[i].IsWhite) { multiplier = -1; } else {multiplier = 1}

		if (state.Gb[i].ThisPieceType.ID == Fish.ID){
			row = i / 8;
			if (state.Gb[i].IsWhite){
				row = 7-row;
			}
			val += (state.Gb[i].ThisPieceType.StaticValue + RowToBonus[row]) * multiplier
		} else {
			val += state.Gb[i].ThisPieceType.StaticValue * multiplier
		}

	}
	return val;
}