import React, { useState } from "react"
import * as ReactDOM from "react-dom";
import GameBoard from "./gameBoard"
import Helmet from "react-helmet"

function GamePage(props) {
    const [customStyle, setCustomStyle] = useState("oat");

    return <React.Fragment>
        <Helmet>
            <link rel="icon" href="../assets/oat/White King Banana.png" type="image/x-icon"></link>
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
            <GameBoard customStyle={customStyle} setCustomStyle={setCustomStyle}></GameBoard>
        </section>
    


        
    </React.Fragment>
}

function Root(props) {
    return <GamePage></GamePage>
}

ReactDOM.render( Root(), document.getElementById('react-main-root') );