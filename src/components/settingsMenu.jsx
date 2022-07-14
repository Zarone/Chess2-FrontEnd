import React from 'react'
import sliderStyles from "../../dist/styles/slider.module.css"

export default function SettingsMenu({customStyle, setCustomStyle, soundOn, setSoundToggle}){
        
    return <React.Fragment>
        <div className="container m-3">
            <p className="h5">Choose your style</p>
            <button type="button" className="btn btn-primary btn-block m-2" disabled={customStyle=="oat"} onClick={()=>{setCustomStyle("oat")}}>Oats Style</button>
            <button type="button" className="btn btn-primary btn-block m-2" disabled={customStyle=="pixel"} onClick={()=>{setCustomStyle("pixel")}}>Pixel Style</button>
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
    </React.Fragment>
}