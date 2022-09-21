import React from "react"

export default function Footer(){
    return <div className="d-footer">
            <p className="d-footer-text">
                <span className="d-footer-text-title">Website Info</span><br></br>
                Website created by Zach Alfano<br></br>
                Website design updated by TheDeer#8821 on Discord<br></br><br></br>
                <span className="d-footer-text-title">Check out Oats Jenkins</span><br></br>
                <a class="d-link" href="https://www.youtube.com/c/OatsJenkins">YouTube</a><br></br>
                <a class="d-link" href="https://www.instagram.com/oatsjenkins/?utm_source=qr">Instagram</a><br></br>
                <a class="d-link" href='https://twitter.com/OatsJenkins?t=RYdPzIAjQaWbyAL6ccX6Zg'>Twitter</a><br></br>
                <a class="d-link" href="https://www.tiktok.com/@oatsjenkins">TikTok</a><br></br><br></br>
                <span className="d-footer-text-title">Join the Chess 2 Discord</span><br></br>
                <span className="d-footer-text-own">Owned by sup lloooll</span>
                <br></br>
                <div className="d-discord-btn-container">
                    <a class="d-discord-anchor" href="https://discord.com/invite/aGFThSgGsj">    
                    <div className="d-discord-btn">
                            <img src="./assets/d-assets/d-discord-logo.svg" alt="" className="d-discord-btn-img"/>
                    </div></a>
                </div>
        </p>            
    </div>
}