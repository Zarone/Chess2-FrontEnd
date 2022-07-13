import React, { useState } from "react"
import * as ReactDOM from "react-dom";
import GameBoard from "./gameBoard"
import Header from "./header"

function GamePage(props) {
    const [customStyle, setCustomStyle] = useState("oat");

    return <React.Fragment>
        <Header />
        <section>
            <GameBoard customStyle={customStyle} setCustomStyle={setCustomStyle}></GameBoard>
        </section>
    </React.Fragment>
}

function Root(props) {
    return <GamePage></GamePage>
}

ReactDOM.render( Root(), document.getElementById('react-main-root') );