import React, { useEffect, useState }  from "react"
import { onLoad } from "../../dist/game"

import boardStyle from "../../dist/styles/board.module.css"
import getCustomStyle from "./styleManager"

import Settings from "./settings"
import { initAndGetSound } from "../../dist/helper-js/cookieManager"

export default function GameBoard(props) {

    const [customStyle, setCustomStyleSheet] = useState(getCustomStyle(props.customStyle))
    const [reversed, setReversed] = useState({reversed: false});
    const [soundOn, setSoundToggle] = useState(initAndGetSound());
    
    useEffect(()=>{
        onLoad({...boardStyle, ...customStyle}, props.customStyle).then(res=>{
            let tempReverse = res.reversedPointer
            setReversed(tempReverse)
        });
    }, [])
    
    useEffect(()=>{
        let newStyles = getCustomStyle(props.customStyle)

        setCustomStyleSheet(newStyles)
        if (globalThis.gameboard) {
            globalThis.gameboard.styleType = props.customStyle
            globalThis.gameboard.styleSheetReference = { ...boardStyle, ...newStyles}
            globalThis.gameboard.updatePieces();
        }

        globalThis.cookie.style = props.customStyle;

    }, [props.customStyle])

    useEffect(()=>{
        if (globalThis.gameboard) {
            globalThis.gameboard.isSound = soundOn;
        }
        globalThis.cookie.sound = soundOn;
    }, [soundOn])

    const onReverse = () => {
      reversed.reversed = !reversed.reversed
    }

    return <React.Fragment>
        <div className="container-fluid d-flex justify-content-around align-items-center">
            <div className={`container custom-bg-tertiary mt-3 mb-3 rounded`} style={{margin: 0}}>
                <p id="roomID" className="display-6 text-white">Room ID: </p>
            </div>
            <Settings customStyle={props.customStyle} setCustomStyle={props.setCustomStyle} soundOn={soundOn} setSoundToggle={setSoundToggle}></Settings>
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
                        {
                        ("87654321")
                            .split("")
                            .map((number, numberIndex) => {
                                return ("abcdefgh")
                                .split("")
                                .map((letter, letterIndex) => {
                                    const isWhite = ( (numberIndex + letterIndex) % 2 == 0);
                                    return (
                                        <React.Fragment key={`tile_${letter}${number}`}>
                                            <div
                                                id={`${letter}${number}`}
                                                className={`${customStyle["chess-box"]} ${customStyle[isWhite ? "white-box" : "black-box"]}`}
                                            >
                                                <p>{letter}{number}</p>
                                            </div>
                                        </React.Fragment>
                                    );
                            });
                        })
                        }
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
