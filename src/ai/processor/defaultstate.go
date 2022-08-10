package processor

import "chesstwoai/boardmanager"

var defaultState boardmanager.State = boardmanager.State{
	Gb: boardmanager.GameBoard{
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Rook, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Monkey, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Queen, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.King, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Monkey, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Rook, HasBanana: false},

		boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Elephant, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Elephant, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},

        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
			  
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        
		boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
		boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        
		boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
	
		boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},
		boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},
		boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Elephant, HasBanana: false},
		boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},
		boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},
		boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Elephant, HasBanana: false},
		boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},
		boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},

        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Rook, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Monkey, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Queen, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.King, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Monkey, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Rook, HasBanana: false},

        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Bear, HasBanana: false},

	},
	RookWhiteActive: false,
	RookBlackActive: false,
	IsWhite: true,
}


var testState1 boardmanager.State = boardmanager.State{
	Gb: boardmanager.GameBoard{
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Rook, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.King, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Monkey, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Rook, HasBanana: false},

		boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Elephant, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Elephant, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},

        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Monkey, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
			  
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Queen, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        
		boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
		boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
	
		boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},
		boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},
		boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Elephant, HasBanana: false},
		boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
		boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
		boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Elephant, HasBanana: false},
		boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},
		boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},

        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Rook, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Monkey, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.King, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Fish, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Monkey, HasBanana: false},
        boardmanager.Tile{IsWhite: true, ThisPieceType: boardmanager.Rook, HasBanana: false},

        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Queen, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.NullPiece, HasBanana: false},
        boardmanager.Tile{IsWhite: false, ThisPieceType: boardmanager.Bear, HasBanana: false},

	},
	RookWhiteActive: false,
	RookBlackActive: false,
	IsWhite: false,
}