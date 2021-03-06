import React, { useEffect, useState } from "react"
import * as ReactDOM from "react-dom";
import Header from "./components/header"
import SettingsMenu from "./components/settingsMenu";
import {initAndGetSound, cookieInit} from "../dist/helper-js/cookieManager"
import "../dist/helper-js/join";
import { styleList } from "./helper-js/StyleManager";
import { GameMode, GameModes } from "../src/helper-js/GameModes"
import { goToGame } from "../dist/helper-js/utils";

export default function HomePage(props){

    const [customStyle, setCustomStyle] = useState(styleList[cookieInit() && globalThis.cookie.style] || styleList.oat)
    const [soundOn, setSoundToggle] = useState(initAndGetSound())

    const [gameMode, setGameMode] = useState(GameModes.SINGLE_PLAYER.modeName);
    const [roomID, setRoomID] = useState();
    const [timeLimit, setTimeLimit] = useState(15)

    useEffect(()=>{
        globalThis.cookie.style = customStyle.name
        console.log(globalThis.cookie.style)
    }, [customStyle])

    useEffect(()=>{
        globalThis.cookie.sound = soundOn
        console.log(globalThis.cookie.sound)
    }, [soundOn])


    return <React.Fragment>
    <script src="../dist/foam-bin.js"></script>
    <script src="./helper-js/join.js" type="module"></script>
    <Header />
    <section>
        <div className="container-fluid text-white pt-5">
            <div className="container my-5 custom-bg-primary pb-5 rounded">
                <div className="row mb-4">
                    <div className="col-lg-7 pt-5 mt-5">
                        <div className="container">
                            <img className="logo" src="./assets/_Logo.png" alt="" />
                        </div>
                        <p className="h3">Chess 2 by <a className="text-decoration-none" href="https://www.youtube.com/c/OatsJenkins">Oats Jenkins</a></p>
                        <p className="h3">Website by Zach Alfano</p>
                        <p className="h3">Chess 2 <a href="https://discord.gg/vMvvt533">Discord</a> by sup lloooll</p>
                    </div>
                    <div className="col-lg-5 pt-5">
                        <div className="container custom-bg-tertiary rounded pt-3 pb-3">
                            <div><p className="h2 text-center" id="rooms-count">Loading room count...</p></div>
                            
                            <h2>Quick Play</h2>

                            <div className="d-grid">
                                <button type="button" id="raw-singleplayer" className="btn btn-primary btn-block">Play (singleplayer)</button>
                                <p>
                                    Press this button if you just want to jump into a singleplayer game!
                                </p>
                            </div>
                            <div className="d-grid">
                                <button type="button" id="raw-join-timed" className="btn btn-primary btn-block">Play (timed 15 minutes)</button>
                                <p>
                                    Press this button if you just want to jump into a timed online game!
                                </p>
                            </div>
                            <div className="d-grid">
                                <button type="button" id="raw-join" className="btn btn-primary btn-block">Play (un-timed)</button>
                                <p>
                                    Press this button if you just want to jump into an online game!
                                </p>
                            </div>

                            <div className="d-grid">
                                {/* <foam className="chess2.GameConfigView" of="chess2.GameConfig"></foam> */}
                                <div>
                                    <h2>Custom Game</h2>
                                    <div>
                                        <div style={{display: "flex", gap: "1.5rem"}}>
                                            <div>
                                                <label>Game Mode</label>
                                                <br/>
                                                <select className="rounded" title="Game Mode" defaultValue={GameModes.SINGLE_PLAYER.modeName} onChange={(e)=>{setGameMode(e.target.value)}}>
                                                    {
                                                        Object.keys(GameModes).map((el)=>{
                                                            return GameModes[el].hidden ? "" : <option key={el} value={el}>{GameModes[el].label}</option>
                                                        })
                                                    }
                                                </select>

                                            </div>
                                            { !GameModes[gameMode].singleplayer ?
                                                <div>
                                                    <label>Room ID</label>
                                                    <input onChange={(e)=>setRoomID(e.target.value)} className="w-100 rounded border-0" type="text" />
                                                </div>
                                                : ""
                                            }
                                            <div>
                                                <label>Time (minutes)</label> 
                                                <br/>
                                                <input onChange={e=>setTimeLimit(e.target.value)} className="w-100 rounded border-0" type="number" />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={()=>{goToGame({modeName:gameMode, roomID, timeLimit})}} 
                                            className="btn btn-primary btn-block w-100 mt-4"
                                            disabled={!GameModes[gameMode].singleplayer && roomID==""}
                                            >
                                                Start
                                        </button>
                                    </div>
                                </div>
                                <p>
                                    If you want to play with friends, you can enter a custom room ID! Please use an uncommon room name so that you're 
                                    less likely to join someone else's game by accident.
                                </p>
                            </div>
                            
                            <h2 className="mt-5">Settings</h2>
                            <div>
                                <SettingsMenu 
                                    customStyle={customStyle} 
                                    setCustomStyle={setCustomStyle} 
                                    soundOn={soundOn} 
                                    setSoundToggle={setSoundToggle}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</React.Fragment>
}

function Root(props) { return <HomePage></HomePage> }

ReactDOM.render( Root(), document.getElementById('react-main-root') );