import React from "react"
import * as ReactDOM from "react-dom";
import Header from "./components/header"

export default function FAQPage(props){
    return <React.Fragment>
    <Header />
    <section>
        <div className="container-fluid text-white pt-5">
            <div className="container my-5 custom-bg-tertiary pb-5 rounded">
                <p className="display-3">Why?</p>
                <p>
                    This project was inspired by <a className="text-decoration-none" href="https://www.youtube.com/watch?v=mcivL8u176Y">I Made a BETTER Chess</a> by 
                    Oats Jenkins. I thought it would be fun to make, so I made it. Though I started this project on my own, I've since had major contributions from 
                    others. If you're interested in the contributors, or want to become a contributor yourself, check out the
                    <a href="https://github.com/Zarone/Chess2-FrontEnd" className="text-decoration-none"> GitHub Repository</a>.
                </p>
                <p className="display-3">Contact Info</p>
                <p>
                    If there are any bug, suggestions, or are just eager for discussion, then you can check out the <a href="https://discord.gg/4werTjmA">Discord</a>.
                </p>
                <p className="display-3">What of this website can you re-use, and how?</p>
                <p>
                    The general license for the code base is the MIT LICENSE.txt file in the root directory of the github repository. Certain assets 
                    may have an alternate license, as is the case with images for the High Res custom theme provided by SteamDemon296 under the <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
                </p>
            </div>
        </div>
    </section>
</React.Fragment>
}

function Root(props) { return <FAQPage></FAQPage> }

ReactDOM.render( Root(), document.getElementById('react-main-root') );