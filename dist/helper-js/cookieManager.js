export class Cookie{
    
    get pid(){
        return this.getCookie("pid")
    }
    
    set pid(v){
        document.cookie = `pid=${v};path="/"`
    }
    
    get sound(){
        return this.getCookie("sound")
    }

    set sound(v){
        document.cookie = `sound=${v};path="/"`
    }

    get style(){
        return this.getCookie("style")
    }
    
    set style(v){
        document.cookie = `style=${v};path="/"`
    }

    getCookie(cookieName){
        let cookies = document.cookie.split("; ")
        for (let i = 0; i < cookies.length; i++){
            let [elName, elValue] = cookies[i].split("=")
            console.log(elName, elValue, elName==cookieName)
            if (elName == cookieName) {
                return elValue;
            }
        }
    }
}

export const cookieInit = () => {
    if (!globalThis.cookie) globalThis.cookie = new Cookie()
    return true;
}

export const initAndGetSound = () => {
    cookieInit();
    let currentSound = globalThis.cookie.sound
    if (currentSound === undefined || currentSound === "true") {
        return true
    } else {
        return false;
    }
}