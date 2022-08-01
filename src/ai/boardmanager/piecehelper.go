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
	col := pos%8;
	row := pos/8;
	fmt.Println(pos, "col", col, "row", row)
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

func newMovement(x int16, y int16) int16 {
	return x+y*8
}

func up(pos int16, gb GameBoard, conditions []func(conditionArgs) bool) possibleMoves {
	var moves possibleMoves;
	
	fromPos := pos;
	toPos := pos + newMovement(0, 1)

	for i:=0; i<len(conditions);i++{
		if (!conditions[i](conditionArgs{fromPos, toPos, gb})) { return possibleMoves{} };
	}

	moves = append(moves, getRawMoveDefault(
		fromPos, toPos,	
	))
	return moves;
}

func coordsToFunc(coords [][2]int16, isWhite bool) singleMove {
	
	var inverseModifier int16 = -1
	if (!isWhite) { inverseModifier = 1; }
	fmt.Println("inverseMod", inverseModifier)
	
	return func( pos int16, gb GameBoard, conditions []func(conditionArgs) bool ) possibleMoves {
		var moves possibleMoves;

		for i:=0;i<len(coords);i++{
			toPos := pos + newMovement(inverseModifier*coords[i][0], inverseModifier*coords[i][1]);

			if toPos > -1 && toPos < 64 {
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