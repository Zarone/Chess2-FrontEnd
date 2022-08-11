package boardmanager

import (
	"chesstwoai/helper"
	"fmt"
)

// The 8x8 board, plus 2 jail positions for white then black, plus bear starting position = 69
type GameBoard [69]Tile

type State struct {
	Gb GameBoard;
	RookWhiteActive bool;
	RookBlackActive bool;
	IsWhite bool;
	Hash int64;
}


// this does the same thing as setting Gb directly, except this also mutates the hash
func (state *State) UpdateBoard(table *[69][16]int64, pos int16, newPiece Tile){
	if state.Gb[pos].equals(newPiece) { return }
	if (state.Gb[pos].ThisPieceType.ID + 8*helper.Uint8b(state.Gb[pos].IsWhite)>15) {
		fmt.Println(state.Gb[pos])
	}
	if newPiece.ThisPieceType.Name == NullPiece.Name {
		// undo the piece that's already there
		// (a number XOR itself equals 0)

		

		state.Hash = state.Hash ^ (*table)[pos][state.Gb[pos].ThisPieceType.ID + 8*helper.Uint8b(state.Gb[pos].IsWhite)]
	} else {
		state.Hash = state.Hash ^ (*table)[pos][newPiece.ThisPieceType.ID + 8*helper.Uint8b(newPiece.IsWhite)]
	}
	state.Gb[pos] = newPiece;
}

func (state State) Print() {
	fmt.Println("Rook White: ", state.RookWhiteActive, ", Rook Black: ", state.RookBlackActive, ", White's Turn: ", state.IsWhite)
}

func (state State) MakeMove(move RawMove, zobristInfo *helper.ZobristInfo) State {
	var newState State;
	newState.IsWhite = !state.IsWhite;
	
	newState.RookBlackActive = false;
	if state.RookBlackActive { newState.Hash ^= zobristInfo.RookBlackOffset }
	newState.RookWhiteActive = false;
	if state.RookWhiteActive { newState.Hash ^= zobristInfo.RookWhiteOffset }

	newState.Hash = state.Hash ^ zobristInfo.TurnOffset;
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
			// newState.Gb[move[lastElem].toPos] = state.Gb[move[0].fromPos];
			newState.UpdateBoard(&zobristInfo.Table, move[lastElem].toPos, state.Gb[move[0].fromPos])
			// newState.Gb[move[0].fromPos] = nullTile
			newState.UpdateBoard(&zobristInfo.Table, move[0].fromPos, nullTile)
			
			// handle piece captures
			if (state.Gb[move[lastElem].toPos].ThisPieceType.Name != NullPiece.Name && state.Gb[move[lastElem].toPos].ThisPieceType.Name != Bear.Name){
				if (state.Gb[move[lastElem].toPos].IsWhite){
					newState.RookWhiteActive = true;
					newState.Hash ^= zobristInfo.RookWhiteOffset
				} else {
					newState.RookBlackActive = true;
					newState.Hash ^= zobristInfo.RookBlackOffset
				}
			}
		} else if (move[secondToLastElem].turnType == TURN_JAIL) {
			// newState.Gb[move[lastElem].toPos] = state.Gb[move[secondToLastElem].toPos]
			newState.UpdateBoard(&zobristInfo.Table, move[lastElem].toPos, state.Gb[move[secondToLastElem].toPos])
			// newState.Gb[move[secondToLastElem].toPos] = state.Gb[move[0].fromPos]
			newState.UpdateBoard(&zobristInfo.Table, move[secondToLastElem].toPos, state.Gb[move[0].fromPos])
			// newState.Gb[move[0].fromPos] = nullTile
			newState.UpdateBoard(&zobristInfo.Table, move[0].fromPos, nullTile)

			// handle piece captures
			if state.Gb[move[lastElem].toPos].IsWhite {
				newState.RookWhiteActive = true;
				newState.Hash ^= zobristInfo.RookWhiteOffset
			} else {
				newState.RookBlackActive = true;
				newState.Hash ^= zobristInfo.RookBlackOffset
			}

			// handles possible fish promotion
			if newState.Gb[move[lastElem].toPos].ThisPieceType.Name == Fish.Name {
				if newState.Gb[move[lastElem].toPos].IsWhite {
					if move[lastElem].toPos < 8 {
						// newState.Gb[move[lastElem].toPos] = Tile{IsWhite: true, ThisPieceType: FishQueen, HasBanana: false}
						newState.UpdateBoard(&zobristInfo.Table, move[lastElem].toPos, Tile{IsWhite: true, ThisPieceType: FishQueen, HasBanana: false})
					}
				} else {
					if move[lastElem].toPos > 55 {
						// newState.Gb[move[lastElem].toPos] = Tile{IsWhite: false, ThisPieceType: FishQueen, HasBanana: false}
						newState.UpdateBoard(&zobristInfo.Table, move[lastElem].toPos, Tile{IsWhite: false, ThisPieceType: FishQueen, HasBanana: false})
					}
				}
			}

		} else if containsRescue {

			// if the piece doesn't move back to it's original position, switch them
			if (move[0].fromPos != move[lastElem].toPos){
				// newState.Gb[move[lastElem].toPos] = state.Gb[move[0].fromPos];
				newState.UpdateBoard(&zobristInfo.Table, move[lastElem].toPos, state.Gb[move[0].fromPos])
				// newState.Gb[move[0].fromPos] = nullTile
				newState.UpdateBoard(&zobristInfo.Table, move[0].fromPos, nullTile)
			}
			// newState.Gb[move[rescueIndex].fromPos] = state.Gb[move[rescueIndex].toPos]
			newState.UpdateBoard(&zobristInfo.Table, move[rescueIndex].fromPos, state.Gb[move[rescueIndex].toPos])
			// newState.Gb[move[rescueIndex].toPos] = nullTile
			newState.UpdateBoard(&zobristInfo.Table, move[rescueIndex].toPos, nullTile)

			// handle piece captures
			if (state.Gb[move[lastElem].toPos].ThisPieceType.Name != NullPiece.Name && state.Gb[move[lastElem].toPos].ThisPieceType.Name != Bear.Name){
				if (state.Gb[move[lastElem].toPos].IsWhite){
					newState.RookWhiteActive = true;
					newState.Hash ^= zobristInfo.RookWhiteOffset
				} else {
					newState.RookBlackActive = true;
					newState.Hash ^= zobristInfo.RookBlackOffset
				}
			}
			// handles possible fish promotion
			if newState.Gb[move[lastElem].toPos].ThisPieceType.Name == Fish.Name {
				if newState.Gb[move[lastElem].toPos].IsWhite {
					if move[lastElem].toPos < 8 {
						// newState.Gb[move[lastElem].toPos] = Tile{IsWhite: true, ThisPieceType: FishQueen, HasBanana: false}
						newState.UpdateBoard(&zobristInfo.Table, move[lastElem].toPos, Tile{IsWhite: true, ThisPieceType: FishQueen, HasBanana: false})
					}
				} else {
					if move[lastElem].toPos > 55 {
						// newState.Gb[move[lastElem].toPos] = Tile{IsWhite: false, ThisPieceType: FishQueen, HasBanana: false}
						newState.UpdateBoard(&zobristInfo.Table, move[lastElem].toPos, Tile{IsWhite: false, ThisPieceType: FishQueen, HasBanana: false})
					}
				}
			}
		} else {
			panic("un-managed multi-move")
		}
	} else {
		// newState.Gb[move[lastElem].toPos] = state.Gb[move[lastElem].fromPos];
		newState.UpdateBoard(&zobristInfo.Table, move[lastElem].toPos, state.Gb[move[lastElem].fromPos])
		// newState.Gb[move[lastElem].fromPos] = Tile{HasBanana: false, IsWhite: false, ThisPieceType: NullPiece};
		newState.UpdateBoard(&zobristInfo.Table, move[lastElem].fromPos, Tile{HasBanana: false, IsWhite: false, ThisPieceType: NullPiece})

		// handle piece captures
		if (state.Gb[move[lastElem].toPos].ThisPieceType.Name != NullPiece.Name && state.Gb[move[lastElem].toPos].ThisPieceType.Name != Bear.Name){
			if (state.Gb[move[lastElem].toPos].IsWhite){
				newState.RookWhiteActive = true;
				newState.Hash ^= zobristInfo.RookWhiteOffset
			} else {
				newState.RookBlackActive = true;
				newState.Hash ^= zobristInfo.RookBlackOffset
			}
		}
	}
	// newState.Gb.Print()
	return newState
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
