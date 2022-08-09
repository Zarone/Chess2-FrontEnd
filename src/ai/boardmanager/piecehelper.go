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

var TURN_DEFAULT string = ""
var TURN_RESCUE string = " Rescue"
var TURN_JUMPING string = " Jumping"
var TURN_JAIL string = " Jail"

type RawMove []rawPartialMove

func (move RawMove) Output(playerColor string, enemyColor string) []interface{} {
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

type singleMove (func(int16, State, []func(conditionArgs) bool) PossibleMoves)

type moveType []singleMove

type ConditionType []func(conditionArgs) bool

type PossibleMoves []RawMove

func (moves PossibleMoves) CanReach(includeSecondary bool) map[int16]bool{
	var canReach = make(map[int16]bool)
	for j:=0; j<len(moves); j++{
		// fmt.Println("possible move", moves[j])
	
		length := len(moves[j])

		if ( length>1 && moves[j][ length-2 ].turnType == TURN_JAIL ){
			canReach[moves[j][ len(moves[j])-2 ].toPos] = true
		} else {
			canReach[moves[j][ len(moves[j])-1 ].toPos] = true;
		}
		
		if ( length>1 && moves[j][ length-2 ].turnType == TURN_RESCUE && includeSecondary){
			canReach[moves[j][len( moves[j] ) - 2].toPos] = true;
		}
	}
	return canReach
}

func (moves PossibleMoves) ToState(overwritingStates *(*[]State), baseState State) {
	
	moveLen := len(moves)
	var stateLen int;
	if (*overwritingStates)==nil {
		stateLen = 0; 
	} else {
		stateLen = len(**overwritingStates)
	}

	if ( moveLen > stateLen){
		stateLen = moveLen;
		tempStates := make([]State, moveLen)
		*overwritingStates = &tempStates;
	}

	for index, element := range moves {
		(**overwritingStates)[index] = baseState.MakeMove(element)
	}

	if stateLen > moveLen {
		(**overwritingStates) = (**overwritingStates)[0:moveLen]
	}

	// var states []State = make([]State, len(moves));
	// for index, element := range moves {
	// 	states[index] = baseState.MakeMove(element)
	// }
	// return states;

	// var states []State;
	// for _, element := range moves {
	// 	states = append(states, baseState.MakeMove(element))
	// }
	// return states
}

func (moves PossibleMoves) Print(heading string){
	
	fmt.Println(heading);

	var canReach = moves.CanReach(true);

	for row:=int16(0); row<8; row++{

		fmt.Print(row, " ")
		
		if (row==4||row==3){

			if (row==3 && canReach[65]){
				fmt.Print("[X]")
			} else if (row==4 && canReach[64]){
				fmt.Print("[X]")
			} else {
				fmt.Print("[ ]")
			}

		} else {
			fmt.Print("   ")
		}


		for col:=int16(0); col<8; col++{
			
			if (canReach[row*8+col]) {
				fmt.Print("[X]")
			} else {
				fmt.Print("[ ]")
			}
	
		}

		if (row==4||row==3){

			if (row==3 && canReach[67]){
				fmt.Print("[X]")
			} else if (row==4 && canReach[65]){
				fmt.Print("[X]")
			} else {
				fmt.Print("[ ]")
			}

		} else {
			fmt.Print("   ")
		}
		fmt.Print("\n")

	}
}

func (moves *PossibleMoves) add(
	currentPos int16,
	state State,
	move moveType, 
	conditions ConditionType,
) {
	
	for i := 0; i < len(move); i++ {
		thisMove := move[i](currentPos, state, conditions)
		(*moves) = append((*moves), thisMove...)
	}
}

func getRawMoveDefault(fromPos int16, toPos int16, state State) *RawMove{
	moves := RawMove{{fromPos: fromPos, toPos: toPos, sameColor: false, turnType: TURN_DEFAULT}}
	checkRoyalty(toPos, state, &moves)
	return &moves;
}

func intToPosString(pos int16) string {

	switch pos {
		case 64: return "x1"
		case 65: return "x2"
		case 66: return "y1"
		case 67: return "y2"
		case 68: return "z1"
		case 69: return "TEMP"
	}

	col := pos%8;
	row := pos/8;
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

func coordsToFunc(coords [][2]int16, IsWhite bool) singleMove {
	
	// this is so that white fish and black fish can have to same
	// coordinates but be correctly oriented.
	var inverseModifier int16 = -1
	if (!IsWhite) { inverseModifier = 1; }
	
	return func( pos int16, state State, conditions []func(conditionArgs) bool ) PossibleMoves {
		
		
		var moves PossibleMoves;
		
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
					moves = append(moves, *move)
				}
			}
		}
		
		return moves;
	}
}

func queen(pos int16, state State, conditions []func(conditionArgs) bool) PossibleMoves {
	moves := PossibleMoves{}
	
	row, col := posToRowCol(pos);
	
	for r:=int16(-1);r<2;r+=1 {
		for c:=int16(-1);c<2;c+=1 {
			if (r==0&&c==0) { continue; }
			for i:=int16(1);i<8;i++{
				newRow := row+r*i
				newCol := col+c*i
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
						if notSameType(thisConditionArgs){
							if (conditionsMet){
								moves = append(moves, *getRawMoveDefault(pos, newPos, state))
							}
						}
						break;
					} else {
						if conditionsMet {
							moves = append(moves, *getRawMoveDefault(pos, newPos, state))
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

func allSlots(pos int16, state State, conditions []func(conditionArgs) bool) PossibleMoves {
	var moves PossibleMoves;
	var conditionsMet bool;
	var conditionsLen int;
	var conditionArgument = conditionArgs{fromPos: pos, toPos: 0, state: state}
	for i:=int16(0); i<64; i++ {
		conditionsMet = true;
		conditionsLen = len(conditions)
		for j:=0; j<conditionsLen; j++ {
			conditionArgument.toPos = i;
			if !(conditions[j](conditionArgument)) {
				conditionsMet = false;
				break;
			}
		}
		if conditionsMet {
			moves = append(moves, *getRawMoveDefault(pos, i, state))
		}
	} 
	return moves;
}

func straightNextTo(pos int16, state State, conditions []func(conditionArgs) bool) PossibleMoves {
	return coordsToFunc([][2]int16{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}, state.Gb[pos].IsWhite)(pos, state, conditions)
}

func checkRoyalty(pos int16, state State, move *RawMove) {
	if state.Gb[pos].ThisPieceType.Name == QUEEN_NAME || state.Gb[pos].ThisPieceType.Name == KING_NAME{
		var target int16;

		if state.Gb[pos].IsWhite {
			if state.Gb[64].ThisPieceType.Name == NullPiece.Name {
				target = 64
			} else {
				target = 65
			}
		} else {
			if state.Gb[66].ThisPieceType.Name == NullPiece.Name {
				target = 66;
			} else {
				target = 67;
			}
		}

		lastElement := len(*move)-1;
		(*move)[lastElement].sameColor = true;
		(*move)[lastElement].turnType = TURN_JAIL

		// 69 corresponds to "TEMP"
		*move = append(*move, rawPartialMove{fromPos: 69, toPos: target, sameColor: false, turnType: TURN_DEFAULT})

	}
}

func getCorrespondingJail(pos int16, isWhite bool) int16 {

	if (isWhite){
		switch pos {
		case 24:
			return 65;
		case 32:
			return 64;
		}
	} else {
		switch pos {
		case 31:
			return 67;
		case 39:
			return 66;
		}
	}

	return -1;
}


func differentType(pos1 int16, pos2 int16, state State) bool {
	return state.Gb[pos1].ThisPieceType.Name != NullPiece.Name &&
		state.Gb[pos2].ThisPieceType.Name != NullPiece.Name &&
		state.Gb[pos1].IsWhite != state.Gb[pos2].IsWhite
}

func nextToEnemyPiece(pos int16, state State) bool {
	row, col := posToRowCol(pos);
	if (differentType(pos, rowColToPos(row+1, col), state)) {return true;}
	if (differentType(pos, rowColToPos(row, col+1), state)) {return true;}
	if (differentType(pos, rowColToPos(row-1, col), state)) {return true;}
	if (differentType(pos, rowColToPos(row, col-1), state)) {return true;}
	return false;
}
