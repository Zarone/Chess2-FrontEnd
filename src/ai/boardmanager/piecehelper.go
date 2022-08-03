package boardmanager

import "fmt"

type rawPartialMove struct {
	fromPos int16;
	toPos int16;
	sameColor bool;
	turnType string;
}

type rawMove []rawPartialMove

func intToPosString(pos int16) string {

	switch pos {
		case 64: return "x1"
		case 65: return "x2"
		case 66: return "y1"
		case 67: return "y2"
		case 68: return "z1"
	}

	col := pos%8;
	row := pos/8;
	fmt.Println("pos", pos, "col", col, "row", row)
	return fmt.Sprintf("%v%v", string(rune(ASCII_OFFSET+col)), 8-row)
}

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

type singleMove (func(int16, GameBoard, []func(conditionArgs) bool) possibleMoves)

type moveType []singleMove

type conditionType []func(conditionArgs) bool

type possibleMoves []rawMove

func (moves *possibleMoves) add(
	currentPos int16,
	gb GameBoard,
	move moveType, 
	conditions conditionType,
) {
	for i := 0; i < len(move); i++ {
		(*moves) = append((*moves), move[i](currentPos, gb, conditions)...)
	}
}

type conditionArgs struct {
	fromPos int16;
	toPos int16;
	gb GameBoard;
}

func getRawMoveDefault(fromPos int16, toPos int16) rawMove{
	return []rawPartialMove{{fromPos: fromPos, toPos: toPos, sameColor: false, turnType: ""}}
}

func coordsToFunc(coords [][2]int16, isWhite bool) singleMove {
	
	var inverseModifier int16 = -1
	if (!isWhite) { inverseModifier = 1; }
	
	return func( pos int16, gb GameBoard, conditions []func(conditionArgs) bool ) possibleMoves {
		var moves possibleMoves;

		for i:=0;i<len(coords);i++{
			
			col := pos%8
			row := pos/8

			newCol := col+coords[i][0]
			newRow := row+inverseModifier*coords[i][1]

			if newCol < 8 && newCol > -1 && newRow < 8 && newRow > -1 {
				toPos := newCol+newRow*8
				conditionMet := true;
				for j:=0;j<len(conditions);j++{
					if (!conditions[i](conditionArgs{fromPos: pos, toPos: toPos, gb: gb})) {
						conditionMet = false;
						break;
					}
				}
				if (conditionMet){
					moves = append(moves, getRawMoveDefault(pos, toPos))	
				}
			}
		}

		return moves;
	}
}