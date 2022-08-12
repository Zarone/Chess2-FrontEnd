package boardmanager

func (state State) GetAllMovesGenerator() func() (*RawMove, bool) {
	
	// these both just store the state
	// since this function is pretty
	// much a generator
	var globalIndex = 0;
	var globalSubIndex = 0;
	var moves PossibleMoves;
	var newMove RawMove;

	// so buffer stores less extreme moves that aren't
	// sent back to the caller of this function immediately.
	// this system is for pruning, so that more extreme moves
	// are looked at first.
	var buffer [1][]*RawMove;

	return func () (*RawMove, bool) {

		for ; globalIndex < 64; globalIndex++ {
			if state.Gb[globalIndex].IsWhite == state.IsWhite && state.Gb[globalIndex].ThisPieceType.Name != NullPiece.Name {
				
				if (moves == nil) { moves = state.Gb[globalIndex].ThisPieceType.GetMoves(int16(globalIndex), state, ConditionType{}) }
				for globalSubIndex < len(moves) {
					// So what I could do here in the future is check if a piece would be taken on this route.
					// If that's not the case, send it to a backlog which would be returned later. This would
					// hopefully increase pruning since the most extreme moves would be evaluated first.
					
					newMove = moves[globalSubIndex];
					globalSubIndex++;
					
					lastElem := len(newMove)-1
					secondToLastElem := lastElem-1
					
					capturedPiece := false;
					
					containsRescue := false;
					if len(newMove) > 1 {
						for _, partialMove := range newMove {
							if partialMove.turnType == TURN_RESCUE{
								containsRescue = true;
								break;
							}
						}
						if (newMove[secondToLastElem].turnType == TURN_JUMPING && !containsRescue){
							// handle piece captures
							if (state.Gb[newMove[lastElem].toPos].ThisPieceType.Name != NullPiece.Name){ capturedPiece = true;	}
						} else if (newMove[secondToLastElem].turnType == TURN_JAIL) {
							// handle piece captures
							capturedPiece = true
						} else if containsRescue {
							// handle piece captures
							if (state.Gb[newMove[lastElem].toPos].ThisPieceType.Name != NullPiece.Name ){ capturedPiece = true; }
						}
					} else {
						// handle piece captures
						if (state.Gb[newMove[lastElem].toPos].ThisPieceType.Name != NullPiece.Name){ capturedPiece = true; }
					}

					if capturedPiece {
						return &newMove, true;
					} else {
						bufferAddition := newMove;
						buffer[0] = append(buffer[0], &bufferAddition)
					}
					
				}
				globalSubIndex = 0;
				moves = nil;
				
			}
		}
		
		
		primaryBufferLen := len(buffer[0])
		if primaryBufferLen > 0 {
			
			firstElement := buffer[0][0]
			buffer[0] = buffer[0][1:primaryBufferLen]
			return firstElement, true;
			
		}
		globalSubIndex = 0;
		globalIndex = 0;

		return nil, false


	};
}