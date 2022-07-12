import React from "react"
import sliderStyles from "../dist/styles/slider.module.css"

export default function Settings({setCustomStyle, soundOn, setSoundToggle}){
    let settingsModal;
    return (<React.Fragment>
        <button type="button" className="btn btn-light" data-toggle="modal" style={{height: "100%"}} onClick={()=>{
            if (!settingsModal) settingsModal = new bootstrap.Modal(document.getElementById("customStyleModal"))
            settingsModal.toggle()
        }
        }>
            <img src="../assets/settings.png" style={{width: "3rem", height: "3rem"}}></img>
        </button>

        <div className="modal" id="customStyleModal">
            <div className="modal-dialog">
                <div className="modal-content">
            
                    <div className="modal-header">
                        <h4 className="modal-title" id="modal-heading-settings">Settings</h4>
                    </div>
            
                    <div className="modal-body">
                        <div className="container m-3">
                            <p className="h5">Choose your style</p>
                            <button type="button" className="btn btn-primary btn-block m-2" onClick={()=>{setCustomStyle("oat")}}>Oats Style</button>
                            <button type="button" className="btn btn-primary btn-block m-2" onClick={()=>{setCustomStyle("pixel")}}>Pixel Style</button>
                        </div>
                        <div className="container m-3">
                            <p className="h5">Sound Effects</p>
                            <label className={`${sliderStyles.switch} m-2`}>
                                <input onChange={(e)=>{setSoundToggle(e.target.checked)}} type="checkbox" checked={soundOn}/>
                                <span className={sliderStyles.slider}></span>
                            </label>
                        </div>
                        {/* <div className="container m-3">
                            <p className="h5">Music</p>
                            <label className={`${sliderStyles.switch} m-2`}>
                                <input onChange={(e)=>{console.log("toggle music", e.target.checked)}} type="checkbox" />
                                <span className={sliderStyles.slider}></span>
                            </label>
                        </div> */}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Back</button>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>)
}