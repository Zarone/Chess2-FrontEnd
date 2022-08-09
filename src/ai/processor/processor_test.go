package processor 

import (
	"testing"
)


func TestBestMove(t *testing.T){

	for i:=0; i<10; i++{
		BestMove(defaultState)
	}
}