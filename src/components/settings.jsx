import React from "react"
import SettingsMenu from "./settingsMenu";

export default function Settings({customStyle, setCustomStyle, soundOn, setSoundToggle}){
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
                        <SettingsMenu customStyle={customStyle} setCustomStyle={setCustomStyle} soundOn={soundOn} setSoundToggle={setSoundToggle} ></SettingsMenu>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Back</button>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>)
}