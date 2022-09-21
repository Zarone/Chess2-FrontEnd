import React from "react"
import * as ReactDOM from "react-dom";
import Header from "./components/header"

export default function FAQPage(props){
    return <React.Fragment>
    <Header />
    <section>
        <div className="d-info-container text-white">
            <div className="d-info">
                <p className="display-3">Why?</p>
                <p>
                    This project was inspired by <a className="text-decoration-none d-info-link" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=mcivL8u176Y">I Made a BETTER Chess</a> by 
                    Oats Jenkins. I thought it would be fun to make, so I made it. Though I started this project on my own, I've since had major contributions from 
                    others. If you're interested in the contributors, or want to become a contributor yourself, check out the
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/Zarone/Chess2-FrontEnd" className="text-decoration-none d-info-link"> GitHub Repository</a>.
                </p>
                <p className="display-3">Rules</p>
                <ul>
                    <li>
                        <p>Rules of Chess 2</p>
                        <ul>
                            <li><p>Main Goal: Capture both the enemy King and enemy Queen, putting them in jail.</p></li>
                        </ul>
                    </li>
                    <li>
                        <p>Pieces</p>
                        <ul>
                            <li>
                                <p>Fish</p>
                                <ul>
                                    <li>Can move one space in any direction except backwards</li>
                                    <li>Can only take pieces on a diagonal</li>
                                    <li>Becomes a Fishy Queen when moved to the end of the board</li>
                                </ul>
                            </li>
                            <li>
                                <p>Elephant</p>
                                <ul>	
                                    <li>Moves exactly 2 spaces in each diagonal direction</li>
                                    <li>Takes only the piece landed on</li>
                                    <li>Cannot jump over pieces</li>
                                </ul>
                            </li>
                            <li>
                                <p>Rook</p>
                                <ul>
                                    <li>Can move to any free space on the board</li>
                                    <li>Can only take pieces exactly 1 space from it horizontally or vertically</li>
                                    <li>Pieces can only be taken by the Rook if a friendly piece was taken the previous turn</li>
                                </ul>
                            </li>
                            <li>
                                <p>Monkey</p>
                                <ul>
                                    <li>Can move exactly one space horizontally, vertically or diagonally</li>
                                    <li>The monkey can also swing over pieces</li>
                                    <ul>
                                        <li>-If there is any piece of any colour where a monkey can normally move, it will swing over the piece</li>
                                        <li>-This swing places the monkey on the other side of the piece</li>
                                        <li>-As long as there are pieces to swing over, the monkey can swing forever</li>
                                        <li>-If an enemy piece is on the other side, that piece is taken</li>
                                        <li>-Monkey swinging ends when a piece is taken or when its space is double-clicked</li>
                                    </ul>
                                </ul>
                            </li>
                            <li>
                                <p>Fishy Queen</p>
                                <ul>
	                                <li>Can move any amount in any direction horizontally, diagonally or vertically</li>
	                                <li>No special conditions when taken</li>
                                </ul>
                            </li>
                            <li>
                                <p>Queen</p>
                                <ul>
	                                <li>Can move any amount in any cardinal or diagonal direction</li>
	                                <li>If captured, the player who captured it puts in jail on their right of the board</li>
                                </ul>
                            </li>
                            <li>
                                <p>King</p>
                                <ul>
	                                <li>Can move one space in any cardinal or diagonal direction</li>
	                                <li>If captured, the player who captured it puts in jail on their right of the board</li>
	                                <li>Starts the game holding the banana</li>
                                    <ul>
		                                <li>While holding a banana, the King can be saved by the monkey</li>
		                                <li>If the monkey is adjacent to the king's jail space, the monkey can horizontal swing into the jail space, rescuing the king</li>
		                                <li>The King loses the banana when this happens, and can never recover it</li>
		                                <li>The monkey must be able to continue swinging after this or the king cannot be saved</li>
		                                <li>This does not apply to the Queen as she does not have a banana</li>
                                    </ul>
                                </ul>
                            </li>
                            <li>
                                <p>Bear</p>
                                <ul>
                                    <li>Can be controlled by both players</li>
                                    <li>Starts the game in the center of the board, where D4/E5 intersect</li>
                                    <li>Can move to D4, D5, E4 or E5 on its initial movement</li>
                                    <li>Otherwise, moves one space in any cardinal or horizontal direction</li>
                                    <li>Note: the Bear cannot take pieces, but can be taken and swung over.</li>
                                    <li>Cannot take pieces</li>
                                    <li>Can be taken</li>
                                    <li>Can be swung over</li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
                <p className="display-3">Contact Info</p>
                <p>
                    If there are any bug, suggestions, or are just eager for discussion, then you can check out the <a class="d-info-link" target="_blank" rel="noopener noreferrer" href="https://discord.gg/aGFThSgGsj">Discord</a>.
                </p>
                <p className="display-3">What of this website can you re-use, and how?</p>
                <p>
                    The general license for the code base is the MIT LICENSE.txt file in the root directory of the github repository. Certain assets 
                    may have an alternate license, as is the case with images for the High Res custom theme provided by SteamDemon296 under the <a class="d-info-link" target="_blank" rel="noopener noreferrer license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
                </p>
            </div>
        </div>

        
        <Footer />

    </section>
</React.Fragment>
}

function Root(props) { return <FAQPage></FAQPage> }

ReactDOM.render( Root(), document.getElementById('react-main-root') );