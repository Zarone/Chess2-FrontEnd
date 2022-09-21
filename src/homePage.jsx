import React, { useEffect, useState } from "react"
import * as ReactDOM from "react-dom";
import Header from "./components/header"
import Footer from "./components/footer"
import SettingsMenu from "./components/settingsMenu";
import {initAndGetSound, cookieInit} from "../dist/helper-js/cookieManager"
import "../dist/helper-js/join";
import { styleList } from "./helper-js/StyleManager";
import { GameMode, GameModes } from "../src/helper-js/GameModes"
import { goToGame, LOADING_ROOMS_TEXT, serverID } from "../dist/helper-js/utils";
import { computerTypes } from "../src/helper-js/EnemyComputerSettings"
import styles from "../dist/styles/home.module.css"
import { Servers, ServerUtil } from "./helper-js/Servers";

export default function HomePage(props){

    const [customStyle, setCustomStyle] = useState(styleList[cookieInit() && globalThis.cookie.style] || styleList.oat)
    const [soundOn, setSoundToggle] = useState(initAndGetSound())

    const [gameMode, setGameMode] = useState(GameModes.SINGLE_PLAYER.modeName);
    const [server, setServer] = useState(undefined);
    const [serversAvailable, setServersAvailable] = useState([]);
    const [roomID, setRoomID] = useState();
    const [timeLimit, setTimeLimit] = useState(15)
    const [AILevel, setAILevel] = useState(2)
    const [AIType, setAIType] = useState(Object.keys(computerTypes)[0])

    useEffect(()=>{
        globalThis.cookie.style = customStyle.name
    }, [customStyle])
    
    useEffect(()=>{
        globalThis.cookie.sound = soundOn
    }, [soundOn])
    
    useEffect(() => {
        window.server = server || "heroku-1";
        (async () => {
            let initial = window.server;
            let roomsCount_Dom = document.getElementById("rooms-count")

            let roomsCountRaw;
            try {
                roomsCountRaw = await fetch(serverID()+"/getRoomCount")
            } catch(err) {
                console.log(initial, "error in fetch", err);
                return;
            }

            let roomsCountJson;
            try {
                roomsCountJson = await roomsCountRaw.json();
                console.log(initial, roomsCountJson)
                roomsCount_Dom.innerText = "Rooms: " + roomsCountJson.roomCount;
            } catch(err){
                console.log(initial, "error in to json", err)
                return;
            }

        })();
    }, [server])
    
    useEffect(()=>{
        (async ()=>{
            await ServerUtil.getAvailableServers(
                async (...args)=>{ 
                    setServersAvailable(...args); 
                    setServer(await ServerUtil.getDefault(...args)); 
                } 
            );
        })()
    }, [])

    const noticeMe = {
        'backgroundColor': 'rgb(159 36 199)',
        'fontSize': '1.2rem',
        'padding': '0.5rem',
        'marginBottom': '1rem',
    };

    return <React.Fragment>
    <script src="../dist/foam-bin.js"></script>
    <script src="./helper-js/join.js" type="module"></script>
    <section>
        <Header />
        <div className="d-title-section">
            <img className="logo d-title-img" src="./assets/_Logo.png" alt="" />
            <p class="d-title-text">Chess 2 by <a class="d-link" href="https://www.youtube.com/c/OatsJenkins">Oat Jenkins</a></p>
        </div>
        <div className="d-play-panel-container">
            <div className="d-play-panel">
                <div className="d-play-panel-flex">
                    <div className="d-play-panel-left">
                        <div className="d-play-panel-left-rules-container">
                            <h1 className="d-play-panel-left-rules-title">Rules</h1>
                            <iframe class="d-video" src="https://www.youtube-nocookie.com/embed/mcivL8u176Y?start=93" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            <br></br><a class="d-link d-play-panel-left-rules-link" href="./faq.html">OR Read Them Here...</a>
                        
                        </div>
                        <div className="d-play-panel-left-settings-container">
                        <h2 class="d-play-panel-left-settings-title">Settings</h2>
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










                    <div className="d-play-panel-right">

                    <div className="d-play-panel-right-flex">
                        <div >
        
                            <div class="d-select-container">
                            <div><p className="h2 text-center" class="d-play-panel-right-rooms-title" id="rooms-count">{LOADING_ROOMS_TEXT}</p></div>

                            <select className="d-select" title="Select Server" value={server} onChange={(e)=>{setServer(e.target.value)}}>
                                    {
                                        serversAvailable.map((el)=>{
                                            return <option class="d-option" key={el} value={el}>{Servers[el].label}</option>
                                        })
                                    }
                                </select>
                                <br></br>
                                Select another server if the rooms are full.
                                
                            </div>
                            
                            <div class="d-select-container">

                            <h2 class="d-h2-fontsize">Single Player</h2>
                            <p>
                                    Select a difficulty and play Chess 2 against an AI!
                            </p>
                            <div className="d-grid">
                            <div>
                                    <select className="d-select" defaultValue="2" onChange={e=>setAILevel(+e.target.value)}>
                                        <option value="1">Easy</option>
                                        <option value="2">Medium</option>
                                        <option value="3">Hard</option>
                                        <option value="4">Very Hard</option>
                                    </select>
                                </div>
                                <button type="button" 
                                    id="raw-singleplayer" 
                                    className="d-button d-button-mt"
                                    onClick={()=>{goToGame({modeName:GameModes.HUMAN_VS_AI.modeName, roomID, timeLimit: 100, computerLevel: AILevel, computerType: AIType})}} 
                                >
                                        Play (singleplayer)
                                </button>
                            </div>
                                


                                

                            </div>

                            <div class="d-select-container">
   


                            <h2 class="d-h2-fontsize">Quick Play (Online)</h2>

                            <div className="d-grid">
                            <p>
                                    Join/Create a random game to play (15 Min Timer).
                            </p>
                                <button type="button" id="raw-join-timed" className="d-button">Play (15 Min)</button>
                                
                            </div>
                            <div className="d-grid">
                            <p>
                            Join/Create a random game to play (No Timer).
                            </p>
                                <button type="button" id="raw-join" className="d-button">Play (untimed)</button>
                                
                            </div>

                            </div>

                            <div class="d-select-container">



                            <div className="d-grid">
                                {/* <foam className="chess2.GameConfigView" of="chess2.GameConfig"></foam> */}
                                <div>
                                    <h2 class="d-h2-fontsize">Custom Game (Online)</h2>
                                    <div>
                                        <div style={{textAlign: "center", margin: "0 auto"}}>
                                            <div >
                                                <label>Game Mode</label>
                                                <br/>
                                                <select className="d-select" title="Game Mode" defaultValue="disabled" onChange={(e)=>{setGameMode(e.target.value)}}>
                                                    <option value="disabled" disabled>Pick Gamemode...</option>
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
                                                    <br />
                                                    <input onChange={(e)=>setRoomID(e.target.value)} className={`rounded border-0 ${styles.customGameOption}`} type="text" />
                                                </div>
                                                : ""
                                            }
                                            { GameModes[gameMode].modeName == GameModes.HUMAN_VS_AI.modeName ? 
                                                <React.Fragment>
                                                    <div>
                                                        <label>AI Type</label>
                                                        <br />
                                                        <select className={`rounded ${styles.customGameOption}`} title="Game Mode" defaultValue={GameModes.SINGLE_PLAYER.modeName} onChange={(e)=>{setAIMode(e.target.value)}}>
                                                            {
                                                                Object.keys(computerTypes).map((el)=>{
                                                                    return <option key={el} value={el}>{el}</option>
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label>AI Level</label>
                                                        <br />
                                                        {/* <input onChange={e=>setAILevel(e.target.value)} type="number" placeholder="2" min="1" max="3" className="w-100 rounded border-0" /> */}
                                                        <select className="d-select" defaultValue="2" onChange={e=>setAILevel(+e.target.value)}>
                                                            <option value="1">Easy</option>
                                                            <option value="2">Medium</option>
                                                            <option value="3">Hard</option>
                                                            <option value="4">Very Hard</option>
                                                        </select>
                                                    </div>
                                                </React.Fragment>
                                                : ""
                                            }
                                            <div>
                                                <label>Time (minutes)</label> 
                                                <br/>
                                                <input onChange={e=>setTimeLimit(e.target.value)} className="d-select" type="number" />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={()=>{goToGame({modeName:gameMode, roomID, timeLimit, computerLevel: AILevel, computerType: AIType})}} 
                                            className="d-button d-button-mt"
                                            disabled={!GameModes[gameMode].singleplayer && roomID==""}
                                            >
                                                Play
                                        </button>
                                    </div>
                                </div>
                                <p>
                                    To play with friends, you can enter a custom room ID.<br></br>Try not to use a common room ID, to prevent other people from joining your game.
                                    
                                </p>
                            </div>

                            </div>
                            

                        </div>
                    </div>
                    </div>
                </div>
            </div>
            
        </div>
        
        <Footer /> 





    </section>
</React.Fragment>
}

function Root(props) { return <HomePage></HomePage> }

ReactDOM.render( Root(), document.getElementById('react-main-root') );