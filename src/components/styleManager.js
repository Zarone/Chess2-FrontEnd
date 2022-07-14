import oatStyle from "../../dist/styles/style_originalOat.module.css"
import pixelStyle from "../../dist/styles/style_pixelArt.module.css"

export default function getCustomStyle(style){
    switch (style) {
        case "oat":
            return oatStyle
            break;
        case "pixel":
            return pixelStyle
            break;
        default:
            return oatStyle
            break;
    }
}
