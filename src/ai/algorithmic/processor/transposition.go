package processor

import (
	"chesstwoai/algorithmic/boardmanager"
	"chesstwoai/algorithmic/helper"
	"fmt"
	"math/rand"
)

var zobristInfo helper.ZobristInfo;

// var zobristTable [69][16]int64;
// var zobristTurnOffset int64;
var hasInitializedTable = false;

// 2 ^ 24 + 1
const transpositionSize int = 16777217
var transpositionTable [transpositionSize]int16;

func resetTranspositionTable(){
	for i:=0; i < transpositionSize; i++{
		transpositionTable[i] = -1;
	}
}

func GetZobristHash(state boardmanager.State) int64 {
	
	if (!hasInitializedTable){
		resetTranspositionTable()
		for i:=0; i<69; i++{
			for j:=0; j<16; j++{
				zobristInfo.Table[i][j] = rand.Int63();
			}
		}
		zobristInfo.TurnOffset = rand.Int63();
		zobristInfo.RookBlackOffset = rand.Int63();
		zobristInfo.RookWhiteOffset = rand.Int63();
		hasInitializedTable = true;
		fmt.Println("Initialized Zobrist Table")
	}

	var thisHash int64 = 0;
	if (state.IsWhite) { thisHash = zobristInfo.TurnOffset; }

	for i:=0; i<69; i++{
		if state.Gb[i].ThisPieceType.Name != boardmanager.NullPiece.Name {
			thisHash ^= zobristInfo.Table[i][state.Gb[i].ThisPieceType.ID + 8*helper.Uint8b(state.Gb[i].IsWhite)]
		}
	}

	return thisHash

}

func getTranspositionKey(state boardmanager.State) int {
	zobristHash := GetZobristHash(state)
	return int(zobristHash % int64(transpositionSize))
}
