package boardmanager

import (
	"fmt"
)

type rawPartialMove struct {
	fromPos int16;
	toPos int16;
	sameColor bool;
	turnType string;
}

type rawMove []rawPartialMove

func (move rawMove) Output(playerColor string, enemyColor string) []interface{} {
	var output []interface{}
	for i:=0;i<len(move);i++{
		var turn string;
		if (move[i].sameColor){
			turn = playerColor+move[i].turnType
		} else {
			turn = enemyColor+move[i].turnType
		}
		output = append(output, []interface{}{ intToPosString(move[i].fromPos), intToPosString(move[i].toPos), turn })
	}
	return output
}

type singleMove (func(int16, State, []func(conditionArgs) bool) possibleMoves)

type moveType []singleMove

type conditionType []func(conditionArgs) bool

type conditionArgs struct {
	fromPos int16;
	toPos int16;
	state State;
}

type possibleMoves []rawMove

func (moves possibleMoves) Print(){
	for row:=0; row<8; row++{

		fmt.Print(row, " ")

		for col:=0; col<8; col++{
			
			moveHere := false;
			for j:=0; j<len(moves); j++{
				if (moves[j][ len(moves[j])-1 ].toPos == int16(row*8+col)) {
					moveHere = true
					break
				}
			}

			if (moveHere) {
				fmt.Print("[X]")
			} else {
				fmt.Print("[ ]")
			}
	
		}

		fmt.Print("\n")

	}
}

func (moves *possibleMoves) add(
	currentPos int16,
	state State,
	move moveType, 
	conditions conditionType,
	) {
		for i := 0; i < len(move); i++ {
		(*moves) = append((*moves), move[i](currentPos, state, conditions)...)
	}
}

func getRawMoveDefault(fromPos int16, toPos int16, state State) rawMove{
	moves := rawMove{{fromPos: fromPos, toPos: toPos, sameColor: false, turnType: ""}}
	checkRoyalty(toPos, state, &moves)
	return moves;
}

func intToPosString(pos int16) string {

	switch pos {
		case 64: return "x1"
		case 65: return "x2"
		case 66: return "y1"
		case 67: return "y2"
		case 68: return "z1"
		case -1: return "TEMP"
	}

	col := pos%8;
	row := pos/8;
	// fmt.Println("pos", pos, "col", col, "row", row)
	return fmt.Sprintf("%v%v", string(rune(ASCII_OFFSET+col)), 8-row)
}

func posToRowCol (pos int16) (int16, int16) {
	return pos/8, pos%8
}

func rowColToPos (row int16, col int16) int16 {
	return row*8+col
}

func inBorders(row int16, col int16) bool {
	return row < 8 && row > -1 && col < 8 && col > -1
}

func coordsToFunc(coords [][2]int16, isWhite bool) singleMove {
	
	var inverseModifier int16 = -1
	if (!isWhite) { inverseModifier = 1; }
	
	return func( pos int16, state State, conditions []func(conditionArgs) bool ) possibleMoves {
		var moves possibleMoves;

		for i:=0;i<len(coords);i++{
			
			col := pos%8
			row := pos/8

			newCol := col+coords[i][0]
			newRow := row+inverseModifier*coords[i][1]

			if inBorders(newRow, newCol) {
				toPos := newCol+newRow*8
				conditionMet := true;
				for j:=0;j<len(conditions);j++{
					if (!conditions[j](conditionArgs{fromPos: pos, toPos: toPos, state: state})) {
						conditionMet = false;
						break;
					}
				}
				if (conditionMet){
					move := getRawMoveDefault(pos, toPos, state)
					moves = append(moves, move)
				}
			}
		}

		return moves;
	}
}

func queen(pos int16, state State, conditions []func(conditionArgs) bool) possibleMoves {
	moves := possibleMoves{}
	
	row, col := posToRowCol(pos);
	fmt.Println(
		"row", row,
		"col", col,
	)
	
	for r:=int16(-1);r<2;r+=1 {
		for c:=int16(-1);c<2;c+=1 {
			if (r==0&&c==0) { continue; }
			for i:=int16(1);i<8;i++{
				fmt.Println(r, c, i)
				newRow := row+r*i
				newCol := col+c*i
				fmt.Println(
					"newRow", newRow,
					"newCol", newCol,
					"isBorders", inBorders(newRow, newCol),
				)
				if (inBorders(newRow, newCol) ){
					newPos := rowColToPos(newRow,newCol)
					
					conditionsMet := true;
					thisConditionArgs := conditionArgs{fromPos: pos, toPos: newPos, state: state}

					for j:=0; j<len(conditions); j++ {
						if !conditions[j](thisConditionArgs){
							conditionsMet = false;
							break;
						}
					}

					if (!empty(thisConditionArgs)){
						fmt.Println("not empty", thisConditionArgs.fromPos, thisConditionArgs.toPos)
						if notSameType(thisConditionArgs){
							fmt.Println("not same type")
							if (conditionsMet){
								fmt.Println("conditions met")
								moves = append(moves, getRawMoveDefault(pos, newPos, state))
							}
						}
						break;
					} else {
						if conditionsMet {
							moves = append(moves, getRawMoveDefault(pos, newPos, state))
						}
					}

				} else {
					break
				}
			}
		}
	}

	return moves;
}

func allSlots(pos int16, state State, conditions []func(conditionArgs) bool) possibleMoves {
	var moves possibleMoves;
	for i:=int16(0); i<64; i++ {
		conditionsMet := true;
		for j:=0; j<len(conditions); j++ {
			if !(conditions[j](conditionArgs{fromPos: pos, toPos: i, state: state})) {
				conditionsMet = false;
				break;
			}
		}
		if conditionsMet {
			moves = append(moves, getRawMoveDefault(pos, i, state))
		}
	}
	return moves;
}

func straightNextTo(pos int16, state State, conditions []func(conditionArgs) bool) possibleMoves {
	return coordsToFunc([][2]int16{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}, state.Gb[pos].isWhite)(pos, state, conditions)
}

func checkRoyalty(pos int16, state State, move *rawMove) {
	if state.Gb[pos].ThisPieceType.Name == QUEEN_NAME || state.Gb[pos].ThisPieceType.Name == KING_NAME{
		var target int16;

		if state.Gb[pos].isWhite {
			if state.Gb[64].ThisPieceType.Name == "undefined" {
				target = 64
			} else {
				target = 65
			}
		} else {
			if state.Gb[66].ThisPieceType.Name == "undefined" {
				target = 66;
			} else {
				target = 67;
			}
		}

		lastElement := len(*move)-1;
		(*move)[lastElement].sameColor = true;
		(*move)[lastElement].turnType = " Jail"

		// -1 corresponds to "TEMP"
		*move = append(*move, rawPartialMove{fromPos: -1, toPos: target, sameColor: false, turnType: ""})

	}
}