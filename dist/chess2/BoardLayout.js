import { SubEmitter } from "../game/Emitter";
import { Event } from "../game/Events";
import { Turn } from "../game/model/Turn";
import { Position } from "../helper-js/board";
import { PowerClass } from "../../src/helper-js/PowerClass";
import { And, Not, Either } from "../helper-js/Predicate";
import { JAIL, JUMPING, NORMAL, RESCUE } from "../helper-js/TurnUtil";
import { nextToJail } from "../helper-js/utils";
import { Fish } from "../pieces-js/Fish";
import { FishQueen } from "../pieces-js/FishQueen";
import { Monkey } from "../pieces-js/Monkey";
import { Pieces } from "../pieces-js/pieces";

export class BoardLayout extends PowerClass {

    // Same as: constructor (layout) { this.data = layout; }
    static initializer = PowerClass.DATA_PROPERTY_INITIALIZER;

    static TOPIC_SET = Event.create('update.set')
    static TOPIC_DEL = Event.create('update.del')
    static TOPIC_MOVE = Event.create('update.move')

    // Handler turns "a1", "b2" etc into properties of 'this'
    static handler = {
        get ( target, key ) {
            if ( Position.isValidPositionID(key) ) {
                return target.data[key];
            }
            
            // Default behaviour
            return Reflect.get(...arguments)
        },
        set ( target, key, val ) {
            if ( Position.isValidPositionID(key) ) {
                target.setData(key, val);
                return true;
            }
            return Reflect.set(...arguments);
        },
        deleteProperty ( target, key ) {
            if ( key in target.data ) {
                target.delData(key);
                return true;
            }

            return Reflect.deleteProperty(...arguments);
        }
    };

    installEmitter (emitter) {
        // Being able to use BoardLayout as a drop-in replacement for a data
        //   object had the consequence that "._unproxied" is needed to set
        //   properties on the "real" this.
        this.emitter = emitter;
    }

    delData(posID) {
        this.emitter.emit(BoardLayout.TOPIC_DEL, posID);
        delete this.data[posID];
    }

    setData(posID, piece) {
        if (!this.emitter) return; // this only happens if you use a temporary boardLayout
        this.emitter.emit(BoardLayout.TOPIC_SET, posID, piece);
        this.data[posID] = piece;
    }

    move (fromPos, toPos, options) {
        fromPos = Position.adapt(fromPos);
        toPos = Position.adapt(toPos);

        if ( fromPos.equals(toPos) ) return;

        const piece = this.data[fromPos];

        const extra = {};

        if ( this.data[toPos] != undefined ) {
            extra.victim = this.data.TEMP = this.data[toPos];
        } else if ( ! options?.noTemp ) {
            this.data.TEMP = this.data[fromPos];
        }

        this.data[toPos] = piece;
        piece.position = toPos;
        delete this.data[fromPos];

        const eventInfo = { fromPos, toPos, piece, ...extra };

        this.emitter.emit(BoardLayout.TOPIC_MOVE, eventInfo);
        return eventInfo;
    }

    moveToTemp (fromPos) {
        this.data.TEMP = this.data[fromPos];
        this.data.TEMP.position = 'TEMP';
    }

    get boardLayout () {
        return this.data;
    }

    isEmpty(pos) {
        pos = Position.adapt(pos);
        return this.data[pos.id] == undefined;
    }

    clone() {
        return BoardLayout.create({ ...this.data });
    }

    filterImpossibleMoves (game, moves, currentPos) {
        return moves.filter((elem, index)=>{
            for (let i = 0; i < elem.conditions.length; i++){
                if (
                    !elem.conditions[i](
                        { 
                            board: this,
                            from: currentPos, 
                            to: elem.pos,
                            rookActiveWhite: game.get('rookActiveWhite'),
                            rookActiveBlack: game.get('rookActiveBlack'),
                            thisTurn: game.get('currentTurn')
                        }
                    ) 
                ) {
                    return false
                }
            }
            return true

        })
    }

    makePreValidatedMove (game, fromPos, toPos) {
        if (toPos.isJail() && this.data[fromPos] instanceof Monkey){
            let nextTo = nextToJail(toPos)

            const monkey = this.data[fromPos];

            // Lift monkey into the air
            this.moveToTemp(fromPos);
            monkey.position = nextTo;

            // Move king out of jail
            const { piece } = this.move(toPos, nextTo);
            piece.hasBanana = false;

        } else {

            if (toPos.isJail()){
                if (this.data[fromPos].isWhite){
                    game.set('rookActiveWhite', true);
                } else {
                    game.set('rookActiveBlack', true);
                }
            }
            
            this.move(fromPos, toPos);

        }
    }

    validateMove (game, currentTurn, moveInfo) {

        if (!this.boardLayout[moveInfo.fromPos]) return new Error("[Validate Move] Try to move from blank tile")

        // Note: nothing else uses CurrentTurn class yet, so this is always true
        currentTurn = Turn.adapt(currentTurn);
        let newTurn = Turn.adapt(moveInfo.newTurn);

        const samePlayer = currentTurn.player == newTurn.player;

        const monkeyJumpingStart =
            currentTurn.is(Either(NORMAL, RESCUE)) && newTurn.is(JUMPING) && samePlayer;
        
        const monkeyJumpingContinue =
            currentTurn.is(JUMPING) && newTurn.is(JUMPING) && samePlayer;

        const monkeyJumpingStop =
            currentTurn.is(JUMPING) && newTurn.is(NORMAL) && ! samePlayer;

        const monkeyJumpingNonRescue = monkeyJumpingContinue || monkeyJumpingStop;

        const tookRoyalty =
            currentTurn.is(Either(NORMAL, JUMPING)) && newTurn.is(JAIL) && samePlayer;
        
        const didKingRescue =
            currentTurn.is(Either(NORMAL, JUMPING)) && newTurn.is(RESCUE) && samePlayer;
        
        if ( ! (
            (
                currentTurn.is(Either(NORMAL, JAIL, RESCUE)) && 
                newTurn.is(NORMAL) && ! samePlayer 
            ) ||
            tookRoyalty ||
            didKingRescue ||
            monkeyJumpingStart ||
            monkeyJumpingNonRescue
        ) ) {
            return new Error(`[Validate Move] New Turn "${newTurn}" Invalid`);
        }

        const jailMoves = currentTurn.is(JAIL);
        const rescueMoves = currentTurn.is(RESCUE);

        if ( jailMoves ) {
            return moveInfo.fromPos?.isTemp() &&
                this.isEmpty(moveInfo.toPos) &&
                moveInfo.toPos.isJailControlledBy(currentTurn.player) ? true : new Error("[Validate Move] Jail Move Invalid")
        }

        if ( rescueMoves ) {
            let monkey = this.data['TEMP'];

            const testBoard = this.clone();
            testBoard[monkey.position] = monkey;
            const legalMoves = testBoard.filterImpossibleMoves(
                game, monkey.getJumpingMoves(), monkey.position);
            
            for ( const move of legalMoves ) {
                if ( moveInfo.toPos.equals(move.pos) ) return true;
            }
            
            return new Error("[Validate Move] Rescue Move Invalid");
        }

        const thisPiece = this.data[moveInfo.fromPos];
        const legalMoves = this.filterImpossibleMoves(
            game, thisPiece.getMoves(), thisPiece.position)
        
        if ( monkeyJumpingStart ) {
            this.data['MONKEY_START'] = new Monkey(
                moveInfo.fromPos, this.data[moveInfo.fromPos].isWhite);
        }

        for ( const move of legalMoves ) {
            if ( moveInfo.toPos.equals(move.pos) ) return true;
        }

        if ( monkeyJumpingNonRescue && moveInfo.fromPos.equals(moveInfo.toPos) ) {
            delete this.data['MONKEY_START'];
            return true;
        }

        return new Error("[Validate Move] Movement Invalid");
    }
}

export class BoardFactory {
    static create (layoutSpec) {
        const layout = {};

        for ( const [cellID, classID, isWhite] of layoutSpec ) {
            const cls = Pieces.getClassFromID(classID);
            layout[cellID] = new cls(cellID, isWhite);
        }

        return BoardLayout.create(layout);
    }
}

export class BoardLayouts {
    // TODO: move to JSON file now that this is pure data
    static DEFAULT = [
        ["a8", 'Rook', false],
        ["b8", 'Monkey', false],
        ["c8", 'Fish', false],
        ["d8", 'Queen', false],
        ["e8", 'King', false],
        ["f8", 'Fish', false],
        ["g8", 'Monkey', false],
        ["h8", 'Rook', false],

        ["a7", 'Fish', false],
        ["b7", 'Fish', false],
        ["c7", 'Elephant', false],
        ["d7", 'Fish', false],
        ["e7", 'Fish', false],
        ["f7", 'Elephant', false],
        ["g7", 'Fish', false],
        ["h7", 'Fish', false],

        
        ["a1", 'Rook', true],
        ["b1", 'Monkey', true],
        ["c1", 'Fish', true],
        ["d1", 'Queen', true],
        ["e1", 'King', true],
        ["f1", 'Fish', true],
        ["g1", 'Monkey', true],
        ["h1", 'Rook', true],

        ["a2", 'Fish', true],
        ["b2", 'Fish', true],
        ["c2", 'Elephant', true],
        ["d2", 'Fish', true],
        ["e2", 'Fish', true],
        ["f2", 'Elephant', true],
        ["g2", 'Fish', true],
        ["h2", 'Fish', true],

        ["z1", 'Bear'],
    ]
    
    static MONKEY_SAVE_TEST_BLACK = [
        ["h5", 'Monkey', false],
        ["y2", 'King', false],
        ["g5", 'Fish', false],
        ["z1", 'Bear'],
    ]

    static MONKEY_SAVE_TEST = [
        ["a4", 'Monkey', true],
        ["x1", 'King', true],
        ["b4", 'Fish', true],
        ["z1", 'Bear'],
    ]

    static FISHY_QUEEN_TEST = [
        ["b7", 'Fish', true],
        ["g2", 'Fish', false],
    ]

    static ROOK_PARTY = [
        ...('abcdefgh'.split('').map(l => [l+'1', 'Rook', true])),
        ...('abcdefgh'.split('').map(l => [l+'2', 'Rook', false])),
        ['b4', 'Fish', true],
        ['c5', 'Fish', false],
        ['d4', 'Fish', true],
        ['e5', 'Fish', false],
        ['f4', 'Fish', true],
        ['g5', 'Fish', false],
    ]

    static QUEEN_TEST = [
        ["b7", 'Queen', false],
        ["g2", 'Queen', true]
    ]

    static KING_TEST = [
        ["b8", 'King', false],
        ["g1", 'King', true]
    ]

    static MONKEY_TEST = [
        ["e5", 'Monkey', false],
        ["f5", 'Monkey', false],
        ["d5", 'Monkey', false],
        ["e4", 'Monkey', false],
        ["a1", 'Fish', true],
        ['g5', 'Fish', true],
        ["e2", "Fish", false],
        ["e1", 'King', true]
    ]
}
