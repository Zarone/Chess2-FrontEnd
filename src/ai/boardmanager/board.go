package boardmanager

import (
	"fmt"
	"testing"
)

// The 8x8 board, plus 2 jail positions for each player, plus bear starting position = 69
type GameBoard [69]Tile

type State struct {
	Gb GameBoard;
	RookWhiteActive bool;
	RookBlackActive bool;
	IsWhite bool;
}

func (state State) MakeMove(move RawMove) State {
	var newState State;
	newState.IsWhite = !state.IsWhite;
	copy(newState.Gb[:], state.Gb[:])
	lastElem := len(move)-1
	secondToLastElem := lastElem-1
	
	// fmt.Print("\n", move.Output("Black", "White"), "\n")
	
	nullTile := Tile{HasBanana: false, IsWhite: false, ThisPieceType: NullPiece}

	containsRescue := false;
	rescueIndex := -1
	for index, partialMove := range move {
		if partialMove.turnType == TURN_RESCUE{
			containsRescue = true;
			rescueIndex = index;
			break;
		}
	}

	if len(move) > 1 {
		if (move[secondToLastElem].turnType == TURN_JUMPING && !containsRescue){
			newState.Gb[move[lastElem].toPos] = state.Gb[move[0].fromPos];
			newState.Gb[move[0].fromPos] = nullTile
		} else if (move[secondToLastElem].turnType == TURN_JAIL) {
			newState.Gb[move[lastElem].toPos] = state.Gb[move[secondToLastElem].toPos]
			newState.Gb[move[secondToLastElem].toPos] = state.Gb[move[0].fromPos] 
			newState.Gb[move[0].fromPos] = nullTile
		} else if containsRescue {
			if (move[0].fromPos != move[lastElem].toPos){
				newState.Gb[move[lastElem].toPos] = state.Gb[move[0].fromPos];
				newState.Gb[move[0].fromPos] = nullTile
			}
			newState.Gb[move[rescueIndex].fromPos] = state.Gb[move[rescueIndex].toPos]
			newState.Gb[move[rescueIndex].toPos] = nullTile
		} else {
			panic("un-managed multi-move")
		}
	} else {
		newState.Gb[move[lastElem].toPos] = state.Gb[move[lastElem].fromPos];
		newState.Gb[move[lastElem].fromPos] = Tile{HasBanana: false, IsWhite: false, ThisPieceType: NullPiece};
	}
	// newState.Gb.Print()
	return newState
}

func (gb GameBoard) TestPrint(t *testing.T){
	for i := 0; i < 8; i++ {
		thisLine := fmt.Sprintf("%v ", 8-i)
		for j := 0; j < 8; j++ {
			thisLine+=fmt.Sprintf("%v", gb[i*8+j].info())
		}
		t.Log(thisLine)
	}
	t.Logf("Jail X: %v, %v\n", gb[64].info(), gb[65].info())
	t.Logf("Jail Y: %v, %v\n", gb[66].info(), gb[67].info())
	t.Logf("Z: %v\n", gb[68].info())
}

func (gb GameBoard) Print(){
	for i := 0; i < 8; i++ {
		fmt.Printf("%v ", 8-i)
		for j := 0; j < 8; j++ {
			fmt.Print(gb[i*8+j].info())
		}
		fmt.Print("\n")
	}
	fmt.Printf("Jail X: %v, %v\n", gb[64].info(), gb[65].info())
	fmt.Printf("Jail Y: %v, %v\n", gb[66].info(), gb[67].info())
	fmt.Printf("Z: %v\n", gb[68].info())
}

// This is the ASCII code for the "a" character
const ASCII_OFFSET = 97;
