import React, { useState } from "react"
import * as ReactDOM from "react-dom";
import GameBoard from "./gameBoard"
import Helmet from "react-helmet"

function GamePage_(props) {
    let settingsModal;
    const [customStyle, setCustomStyle] = useState("oat");

    return <React.Fragment>
        <Helmet>
            <link rel="icon" href="../assets/White King Banana.png" type="image/x-icon"></link>
        </Helmet>

        <header>
            <nav className="navbar navbar-expand-sm custom-bg-primary">
                <div className="container-fluid">
                    <div className="navbar-collapse justify-content-center">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                        <a className="nav-link text-white" href="./index.html">Home</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link text-white" href="./faq.html">Why?</a>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>
        </header>
        <section>
            <GameBoard customStyle={customStyle}></GameBoard>
        </section>
    
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

        <button type="button" className="btn btn-primary" data-toggle="modal" onClick={()=>{
            if (!settingsModal) settingsModal = new bootstrap.Modal(document.getElementById("customStyleModal"))
            settingsModal.toggle()
        }
        }>
            Settings
        </button>

        <div className="modal" id="customStyleModal">
            <div className="modal-dialog">
                <div className="modal-content">
            
                    <div className="modal-header">
                        <h4 className="modal-title" id="modal-heading">Change your style preferences</h4>
                    </div>
            
                    <div className="modal-body">
                        <button type="button" className="btn btn-primary btn-block" onClick={()=>{setCustomStyle("oat")}}>Oats Style</button>
                        <button type="button" className="btn btn-primary btn-block" onClick={()=>{setCustomStyle("pixel")}}>Pixel Style</button>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Back</button>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
}

function GamePage(props) {

    return <GamePage_></GamePage_>
    
}

ReactDOM.render( GamePage(), document.getElementById('react-main-root') );