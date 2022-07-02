export class Cookie{
    
    path="/"
    pid=""
    
    constructor(){
        console.log("current cookie", document.cookie);
        console.log(document.cookie.split(";"))
        if(document.cookie.split(";")[0] && document.cookie.split(";")[0]!="pid=") {
            console.log("this.pid")
            this.pid=parseInt(document.cookie.split(";")[0].split("=")[1])
        }
        if(document.cookie.split(";")[1]) {
            this.path=document.cookie.split(";")[1].split("=")[1]
        }
    }

    setCookie(){
        console.log("this.getCookie()", this.getCookie())
        document.cookie = this.getCookie();
    }

    getCookie(){
        return "pid="+this.pid+";"+" path="+this.path+";"
    }
}