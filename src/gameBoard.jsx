import React, { useEffect, useState }  from "react"
import { onLoad } from "../dist/game"

import boardStyle from "../dist/styles/board.module.css"
import getCustomStyle from "./styleManager"

import Settings from "./settings"

export default function GameBoard(props) {

    const [customStyle, setCustomStyleSheet] = useState(getCustomStyle(props.customStyle))
    const [chessBoard, setChessBoard] = useState(null);
    const [reversed, setReversed] = useState({reversed: false});
    const [soundOn, setSoundToggle] = useState(true);
    
    useEffect(()=>{
        onLoad({...boardStyle, ...customStyle}, props.customStyle).then(res=>{
            let tempBoard = res.chessBoard
            let tempReverse = res.reversedPointer
            setChessBoard(tempBoard)
            setReversed(tempReverse)
        });
    }, [])
    
    useEffect(()=>{
        let newStyles = getCustomStyle(props.customStyle)

        setCustomStyleSheet(newStyles)
        if (chessBoard) {
            chessBoard.styleType = props.customStyle
            chessBoard.styleSheetReference = { ...boardStyle, ...newStyles}
            chessBoard.updatePieces();
        }
        // onLoad({...boardStyle, ...customStyle});
    }, [props.customStyle])

    useEffect(()=>{
        if (chessBoard) {
            chessBoard.isSound = soundOn;
        }
    }, [soundOn])

    const onReverse = () => {
      reversed.reversed = !reversed.reversed
    //   chessBoard.updatePieces()
    }

    return <React.Fragment>
        <div className="container-fluid d-flex justify-content-around align-items-center">
            <div className={`container custom-bg-tertiary mt-3 mb-3 rounded`} style={{margin: 0}}>
                <p id="roomID" className="display-6 text-white">Room ID: </p>
            </div>
            <Settings setCustomStyle={props.setCustomStyle} soundOn={soundOn} setSoundToggle={setSoundToggle}></Settings>
            <button type="button" className="btn btn-light" data-toggle="modal" style={{height: "100%"}} onClick={onReverse}>Reverse</button>
        </div>
        <div className="container">
            <div className="container mt-3 mb-3 rounded">
                <p id="turn" className="display-6 rounded text-center">Turn: </p>
            </div>
            <div className="container">
                <div className={`container custom-bg-tertiary ${customStyle["timer-container"]}`}>
                    <p className={`h3 text-weight-normal text-white ${customStyle["timer-top"]}`} id="timer-top">---</p>
                </div>            
                <div className="container-fluid d-flex justify-content-center align-items-center" id="board-container">
                    <div className={`${boardStyle["bear-container"]}`} id="z1"></div>
                    <div className={boardStyle["jail-1"]} id="jail-1">
                        <div id="x2" className={`${customStyle["chess-jail-box"]} ${customStyle["white-box"]}`}><p>x2</p></div>
                        <div id="x1" className={`${customStyle["chess-jail-box"]} ${customStyle["black-box"]}`}><p>x1</p></div>
                    </div>
                    <div className={` ${boardStyle["chess-board"]} container`} id="chess-board">
                        <div id="a8" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>a8</p></div>
                        <div id="b8" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>b8</p></div>
                        <div id="c8" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>c8</p></div>
                        <div id="d8" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>d8</p></div>
                        <div id="e8" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>e8</p></div>
                        <div id="f8" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>f8</p></div>
                        <div id="g8" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>g8</p></div>
                        <div id="h8" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>h8</p></div>
                        
                        <div id="a7" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>a7</p></div>
                        <div id="b7" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>b7</p></div>
                        <div id="c7" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>c7</p></div>
                        <div id="d7" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>d7</p></div>
                        <div id="e7" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>e7</p></div>
                        <div id="f7" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>f7</p></div>
                        <div id="g7" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>g7</p></div>
                        <div id="h7" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>h7</p></div>
                
                        <div id="a6" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>a6</p></div>
                        <div id="b6" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>b6</p></div>
                        <div id="c6" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>c6</p></div>
                        <div id="d6" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>d6</p></div>
                        <div id="e6" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>e6</p></div>
                        <div id="f6" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>f6</p></div>
                        <div id="g6" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>g6</p></div>
                        <div id="h6" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>h6</p></div>
                        
                        <div id="a5" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>a5</p></div>
                        <div id="b5" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>b5</p></div>
                        <div id="c5" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>c5</p></div>
                        <div id="d5" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>d5</p></div>
                        <div id="e5" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>e5</p></div>
                        <div id="f5" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>f5</p></div>
                        <div id="g5" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>g5</p></div>
                        <div id="h5" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>h5</p></div>
                        
                        <div id="a4" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>a4</p></div>
                        <div id="b4" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>b4</p></div>
                        <div id="c4" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>c4</p></div>
                        <div id="d4" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>d4</p></div>
                        <div id="e4" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>e4</p></div>
                        <div id="f4" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>f4</p></div>
                        <div id="g4" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>g4</p></div>
                        <div id="h4" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>h4</p></div>
                
                        <div id="a3" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>a3</p></div>
                        <div id="b3" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>b3</p></div>
                        <div id="c3" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>c3</p></div>
                        <div id="d3" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>d3</p></div>
                        <div id="e3" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>e3</p></div>
                        <div id="f3" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>f3</p></div>
                        <div id="g3" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>g3</p></div>
                        <div id="h3" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>h3</p></div>
                
                        <div id="a2" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>a2</p></div>
                        <div id="b2" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>b2</p></div>
                        <div id="c2" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>c2</p></div>
                        <div id="d2" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>d2</p></div>
                        <div id="e2" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>e2</p></div>
                        <div id="f2" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>f2</p></div>
                        <div id="g2" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>g2</p></div>
                        <div id="h2" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>h2</p></div>
                
                        <div id="a1" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>a1</p></div>
                        <div id="b1" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>b1</p></div>
                        <div id="c1" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>c1</p></div>
                        <div id="d1" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>d1</p></div>
                        <div id="e1" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>e1</p></div>
                        <div id="f1" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>f1</p></div>
                        <div id="g1" className={`${customStyle["chess-box"]} ${customStyle["black-box"]}`}><p>g1</p></div>
                        <div id="h1" className={`${customStyle["chess-box"]} ${customStyle["white-box"]}`}><p>h1</p></div>
                    </div>
                    <div className={`${boardStyle["jail-2"]}`} id="jail-2">
                        <div id="y2" className={`${customStyle["chess-jail-box"]} ${customStyle["black-box"]}`}><p>y2</p></div>
                        <div id="y1" className={`${customStyle["chess-jail-box"]} ${customStyle["white-box"]}`}><p>y1</p></div>
                    </div>
                </div>
                <div className={`container custom-bg-tertiary ${customStyle["timer-container"]}`}>
                    <p className={`h3 text-weight-normal text-white ${customStyle["timer-bottom"]}`} id="timer-bottom">---</p>
                </div>
            </div>
        </div>
        <div className="modal" id="myModal">
            <div className="modal-dialog">
                <div className="modal-content">
            
                    <div className="modal-header">
                        <h4 className="modal-title" id="modal-heading">Modal Heading</h4>
                    </div>
            
                    <div className="modal-footer">
                        <a href="./index.html"><button type="button" className="btn btn-danger" data-bs-dismiss="modal">Home</button></a>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
}
