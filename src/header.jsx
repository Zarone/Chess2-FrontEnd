import React from "react"
import Helmet from "react-helmet"
import NavBar from "./navBar";

export default function Header(){
    return <header>
    <Helmet>
        <link rel="icon" href="../assets/oat/White King Banana.png" type="image/x-icon"></link>
    </Helmet>
    <NavBar></NavBar>
</header>
}