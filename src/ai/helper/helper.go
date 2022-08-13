package helper

// This file is really just to avoid dependency cycles

func Uint8b(b bool) uint8{
	if b {
		return 1
	} else {
		return 0
	}
}

func Int16b(b bool) int16 {
	if b {
		return 1;
	} else {
		return 0
	}
}
	
type ZobristInfo struct {
	Table [69][16]int64;
	TurnOffset int64;
	RookWhiteOffset int64;
	RookBlackOffset int64;
}