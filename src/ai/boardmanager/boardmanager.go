package boardmanager

import (
	"syscall/js"
	"fmt"
)

type tile struct {

}

// This is the ASCII code for the "a" character
const ASCII_OFFSET = 97;

func BoardRawToArrayBoard(boardRaw js.Value) [69]tile {
	for i := 7; i > -1; i-- {
		for j := 0; j < 8; j++ {
			tileString := fmt.Sprintf("%s%d", string(rune(ASCII_OFFSET+j)), i+1)
			piece := boardRaw.Get(tileString)
			if (!piece.IsUndefined()){
				fmt.Println( tileString, piece.Get("constructor").Get("name") )
			} else {
				fmt.Println( tileString, "undefined" )
			}
		}
	}
	return [69]tile{}
}