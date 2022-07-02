export class Cookie{
    
    path="/"
    pid=""
    
    constructor(){
        if(document.cookie.split(";")[0] && document.cookie.split(";")[0]!="pid=") {
            this.pid=parseInt(document.cookie.split(";")[0].split("=")[1])
        }
        if(document.cookie.split(";")[1]) {
            this.path=document.cookie.split(";")[1].split("=")[1]
        }
    }

    setCookie(){
        document.cookie = this.getCookie();
    }

    getCookie(){
        return "pid="+this.pid+";"+" path="+this.path+";"
    }
}