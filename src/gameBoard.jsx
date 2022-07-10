import React, { useEffect }  from "react"
import * as ReactDOM from "react-dom";

import { onLoad } from "../dist/game"

export default function GameBoard(props) {
    
    useEffect(()=>{
        onLoad();
    }, [])

    return <React.Fragment>
        <div className="container custom-bg-tertiary mt-3 mb-3 rounded">
            <p id="roomID" className="display-6 text-white">Room ID: </p>
        </div>
        <div className="container">
            <div className="container mt-3 mb-3 rounded">
                <p id="turn" className="display-6 rounded text-center">Turn: </p>
            </div>
            <div className="container">
                <div className="container custom-bg-tertiary timer-container">
                    <p className="h3 text-weight-normal text-white timer-top" id="timer-top">---</p>
                </div>            
                <div className="container-fluid d-flex justify-content-center align-items-center" id="board-container">
                    <div className="bear-container" id="z1"></div>
                    <div className="jail-1" id="jail-1">
                        <div id="x2" className="chess-jail-box white-box"><p>x2</p></div>
                        <div id="x1" className="chess-jail-box black-box"><p>x1</p></div>
                    </div>
                    <div className="chess-board container" id="chess-board">
                        <div id="a8" className="chess-box white-box"><p>a8</p></div>
                        <div id="b8" className="chess-box black-box"><p>b8</p></div>
                        <div id="c8" className="chess-box white-box"><p>c8</p></div>
                        <div id="d8" className="chess-box black-box"><p>d8</p></div>
                        <div id="e8" className="chess-box white-box"><p>e8</p></div>
                        <div id="f8" className="chess-box black-box"><p>f8</p></div>
                        <div id="g8" className="chess-box white-box"><p>g8</p></div>
                        <div id="h8" className="chess-box black-box"><p>h8</p></div>
                        
                        <div id="a7" className="chess-box black-box"><p>a7</p></div>
                        <div id="b7" className="chess-box white-box"><p>b7</p></div>
                        <div id="c7" className="chess-box black-box"><p>c7</p></div>
                        <div id="d7" className="chess-box white-box"><p>d7</p></div>
                        <div id="e7" className="chess-box black-box"><p>e7</p></div>
                        <div id="f7" className="chess-box white-box"><p>f7</p></div>
                        <div id="g7" className="chess-box black-box"><p>g7</p></div>
                        <div id="h7" className="chess-box white-box"><p>h7</p></div>
                
                        <div id="a6" className="chess-box white-box"><p>a6</p></div>
                        <div id="b6" className="chess-box black-box"><p>b6</p></div>
                        <div id="c6" className="chess-box white-box"><p>c6</p></div>
                        <div id="d6" className="chess-box black-box"><p>d6</p></div>
                        <div id="e6" className="chess-box white-box"><p>e6</p></div>
                        <div id="f6" className="chess-box black-box"><p>f6</p></div>
                        <div id="g6" className="chess-box white-box"><p>g6</p></div>
                        <div id="h6" className="chess-box black-box"><p>h6</p></div>
                        
                        <div id="a5" className="chess-box black-box"><p>a5</p></div>
                        <div id="b5" className="chess-box white-box"><p>b5</p></div>
                        <div id="c5" className="chess-box black-box"><p>c5</p></div>
                        <div id="d5" className="chess-box white-box"><p>d5</p></div>
                        <div id="e5" className="chess-box black-box"><p>e5</p></div>
                        <div id="f5" className="chess-box white-box"><p>f5</p></div>
                        <div id="g5" className="chess-box black-box"><p>g5</p></div>
                        <div id="h5" className="chess-box white-box"><p>h5</p></div>
                        
                        <div id="a4" className="chess-box white-box"><p>a4</p></div>
                        <div id="b4" className="chess-box black-box"><p>b4</p></div>
                        <div id="c4" className="chess-box white-box"><p>c4</p></div>
                        <div id="d4" className="chess-box black-box"><p>d4</p></div>
                        <div id="e4" className="chess-box white-box"><p>e4</p></div>
                        <div id="f4" className="chess-box black-box"><p>f4</p></div>
                        <div id="g4" className="chess-box white-box"><p>g4</p></div>
                        <div id="h4" className="chess-box black-box"><p>h4</p></div>
                
                        <div id="a3" className="chess-box black-box"><p>a3</p></div>
                        <div id="b3" className="chess-box white-box"><p>b3</p></div>
                        <div id="c3" className="chess-box black-box"><p>c3</p></div>
                        <div id="d3" className="chess-box white-box"><p>d3</p></div>
                        <div id="e3" className="chess-box black-box"><p>e3</p></div>
                        <div id="f3" className="chess-box white-box"><p>f3</p></div>
                        <div id="g3" className="chess-box black-box"><p>g3</p></div>
                        <div id="h3" className="chess-box white-box"><p>h3</p></div>
                
                        <div id="a2" className="chess-box white-box"><p>a2</p></div>
                        <div id="b2" className="chess-box black-box"><p>b2</p></div>
                        <div id="c2" className="chess-box white-box"><p>c2</p></div>
                        <div id="d2" className="chess-box black-box"><p>d2</p></div>
                        <div id="e2" className="chess-box white-box"><p>e2</p></div>
                        <div id="f2" className="chess-box black-box"><p>f2</p></div>
                        <div id="g2" className="chess-box white-box"><p>g2</p></div>
                        <div id="h2" className="chess-box black-box"><p>h2</p></div>
                
                        <div id="a1" className="chess-box black-box"><p>a1</p></div>
                        <div id="b1" className="chess-box white-box"><p>b1</p></div>
                        <div id="c1" className="chess-box black-box"><p>c1</p></div>
                        <div id="d1" className="chess-box white-box"><p>d1</p></div>
                        <div id="e1" className="chess-box black-box"><p>e1</p></div>
                        <div id="f1" className="chess-box white-box"><p>f1</p></div>
                        <div id="g1" className="chess-box black-box"><p>g1</p></div>
                        <div id="h1" className="chess-box white-box"><p>h1</p></div>
                    </div>
                    <div className="jail-2" id="jail-2">
                        <div id="y2" className="chess-jail-box black-box"><p>y2</p></div>
                        <div id="y1" className="chess-jail-box white-box"><p>y1</p></div>
                    </div>
                </div>
                <div className="container custom-bg-tertiary timer-container">
                    <p className="h3 text-weight-normal text-white timer-bottom" id="timer-bottom">---</p>
                </div>
            </div>
        </div>
    </React.Fragment>
}
