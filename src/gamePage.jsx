import React from "react"
import * as ReactDOM from "react-dom";
import GameBoard from "./gameBoard"
import Helmet from "react-helmet"

function GamePage(props) {
    return <React.Fragment>
        <Helmet>
            <link rel="icon" href="../assets/White King Banana.png" type="image/x-icon"></link>
        </Helmet>

        <header>
            <nav className="navbar navbar-expand-sm custom-bg-primary">
                <div className="container-fluid">
                    <div className=" navbar-collapse justify-content-center">
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
            <GameBoard></GameBoard>
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
    </React.Fragment>
}

ReactDOM.render( GamePage(), document.getElementById('react-main-root') );