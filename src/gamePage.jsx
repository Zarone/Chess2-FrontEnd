import React, { useState } from "react"
import * as ReactDOM from "react-dom";
import GameBoard from "./components/gameBoard"
import Header from "./components/header"
import { cookieInit } from "../dist/helper-js/cookieManager"
import { styleList } from "./helper-js/StyleManager"

function GamePage(props) {
    const [customStyle, setCustomStyle] = useState( styleList[cookieInit() && globalThis.cookie.style] || styleList.oat );

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