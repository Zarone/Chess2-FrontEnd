import React from "react"
import * as ReactDOM from "react-dom";
import Header from "./header";

export default function HomePage(props){
    return <React.Fragment>
    <Header />
    <section>
        <div class="container-fluid text-white pt-5">
            <div class="container my-5 custom-bg-tertiary pb-5 rounded">
                <p class="display-3">Why?</p>
                <p>
                    This project was inspired by <a class="text-decoration-none" href="https://www.youtube.com/watch?v=mcivL8u176Y">I Made a BETTER Chess</a> by 
                    Oats Jenkins. I thought it would be fun to make, so I made it. Though I started this project on my own, I've since had major contributions from 
                    others. If you're interested in the contributors, or want to become a contributor yourself, check out the
                    <a href="https://github.com/Zarone/Chess2-FrontEnd" class="text-decoration-none"> GitHub Repository</a>.
                </p>
                <p class="display-3">Contact Info</p>
                <p>
                    If there are any bug, suggestions, or are just eager for discussion, then you can check out the <a href="https://discord.gg/4werTjmA">Discord</a>.
                </p>
            </div>
        </div>
    </section>
</React.Fragment>
}

function Root(props) { return <HomePage></HomePage> }

ReactDOM.render( Root(), document.getElementById('react-main-root') );