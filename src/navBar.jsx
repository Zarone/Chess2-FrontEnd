import React from "react"

export default function NavBar(){
    return <nav className="navbar navbar-expand-sm custom-bg-primary">
    <div className="container-fluid">
        <div className="navbar-collapse justify-content-center">
        <ul className="navbar-nav">
            <li className="nav-item">
                <a className="nav-link text-white" href="./index.html">Home</a>
            </li>
            <li className="nav-item">
                <a className="nav-link text-white" href="./game.html?timeLimit=15">Play!</a>
            </li>
            <li className="nav-item">
                <a className="nav-link text-white" href="./faq.html">Info</a>
            </li>
        </ul>
        </div>
    </div>
</nav>
}