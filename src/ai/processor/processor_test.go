package processor

import (
	"fmt"
	"testing"
)


func TestBestMove(t *testing.T){

	defaultState.Hash = GetZobristHash(testState1);
	for i:=0; i<1; i++ {
		fmt.Println(BestMove(testState1, 6));
	}
}