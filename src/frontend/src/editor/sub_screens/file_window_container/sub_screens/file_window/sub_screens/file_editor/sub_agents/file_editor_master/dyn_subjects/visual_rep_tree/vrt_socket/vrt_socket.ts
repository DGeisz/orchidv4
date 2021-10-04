import {
    AVRLine,
    AVRType,
} from "../../../../../editor_types/assembled_visual_rep/assembled_visual_rep";
import { VRTEntity } from "../vrt_entity";

export class VRTSocket implements VRTEntity {
    get_tex = () => {
        return "Fuck you";
    };

    get_avr: () => AVRLine = () => {
        return {
            tag: AVRType.Line,
            main_tex: "Fuck you",
        };
    };
}
