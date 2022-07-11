import React from "react"

export default function Settings({setCustomStyle}){
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
                        <h4 className="modal-title" id="modal-heading-settings">Change your style preferences</h4>
                    </div>
            
                    <div className="modal-body">
                        <button type="button" className="btn btn-primary btn-block" onClick={()=>{setCustomStyle("oat")}}>Oats Style</button>
                        <button type="button" className="btn btn-primary btn-block" onClick={()=>{setCustomStyle("pixel")}}>Pixel Style</button>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Back</button>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>)
}