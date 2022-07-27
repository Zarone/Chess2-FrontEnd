import { Module } from "webpack"
import oatStyle from "../../dist/styles/style_originalOat.module.css"
import pixelStyle from "../../dist/styles/style_pixelArt.module.css"

class KeyValueWrapper {
   
    key: string[];
    value: string[];

    constructor (key:(string|string[]),value:(string|string[])){
        if (typeof key == "string"){
            this.key = [key];
        } else if (typeof key == "object") {
            this.key = key;
        }

        if (typeof value == "string"){
            this.value = [value];
        } else if (typeof value == "object"){
            this.value = value;
        }
    }

    checkAgainst(obj: Object){
        console.log("checking against", obj);
        for (let i = 0; i < this.key.length; i++){
            if (obj.style[this.key[i]] != this.value[i]) {
                console.log(this.key[i], "does not match");
                return false;
            }
        }

        return true;
    }
    
    setAt(obj: Object){
        console.log("this.key", this.key);
        console.log("this.value", this.value);
        for (let i = 0; i < this.key.length; i++){
            obj.style[this.key[i]] = this.value[i];
        }
    }

    unsetAt(obj: Object){
        for (let i = 0; i < this.key.length; i++){
            obj.style[this.key[i]] = "";
        }
    }
}

class CustomStyle {
    name: string;
    module: Module;
    canMove: KeyValueWrapper;  
    constructor(name: string, module: Module, canMoveKey: (string|string[]), canMoveValue: (string|string[])) {
        console.log(canMoveKey,"canMoveKey");
        this.name = name;
        this.module = module;
        this.canMove = new KeyValueWrapper(canMoveKey,canMoveValue);
     }
}

export const styleList = {
    oat: new CustomStyle("oat", oatStyle, "backgroundColor", "red"),
    pixel: new CustomStyle("pixel", pixelStyle, ["backgroundImage", "backgroundPosition", "backgroundRepeat", "backgroundAttachment", "backgroundColor"], [`url("./assets/pixel/To Move.png")`, "center center", "no-repeat", "scroll", "rgba(255, 0, 154, 0.3)"]),// center center no-repeat scroll rgba(255, 0, 153, 0.3)`),
    highRes: new CustomStyle("highRes", oatStyle, "backgroundColor", "red"),
}

export function getCustomStyle(style: CustomStyle): Module { return style.module } ;
