package processor

import (
	"fmt"
	"testing"
)


func TestBestMove(t *testing.T){

	defaultState.Hash = GetZobristHash(defaultState);
	for i:=0; i<1; i++ {
		fmt.Println(BestMove(defaultState, 5));
	}
}