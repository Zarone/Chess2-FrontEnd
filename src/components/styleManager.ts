import { Module } from "webpack"
import oatStyle from "../../dist/styles/style_originalOat.module.css"
import pixelStyle from "../../dist/styles/style_pixelArt.module.css"

class CustomStyle {
    name: string;
    module: Module;
    canMoveKey: string;
    canMoveValue: string;
    constructor(name: string, module: Module, canMoveKey: string, canMoveValue: string) {
        this.name = name;
        this.module = module;
        this.canMoveKey = canMoveKey;
        this.canMoveValue = canMoveValue;
    }
}

export const styleList = {
    oat: new CustomStyle("oat", oatStyle, "backgroundColor", "red"),
    pixel: new CustomStyle("pixel", pixelStyle, "background", `url("./assets/pixel/To Move.png") center center no-repeat scroll rgba(255, 0, 153, 0.3)`),
    highRes: new CustomStyle("highRes", oatStyle, "backgroundColor", "red"),
}

export function getCustomStyle(style: CustomStyle): Module { return style.module } ;
