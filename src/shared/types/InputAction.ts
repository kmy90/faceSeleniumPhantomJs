import { HtmlAttribute } from "./HtmlAttribute";

export class InputAction {
    searcherParameter: string;
    htmlAttributes: HtmlAttribute[];
    sendValue: string;
    requireExtraAction:boolean;
    extraAction:string
}