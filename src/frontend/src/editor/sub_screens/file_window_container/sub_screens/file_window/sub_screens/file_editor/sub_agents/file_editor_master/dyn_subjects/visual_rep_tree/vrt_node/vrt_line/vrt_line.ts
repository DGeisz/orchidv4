import { VRTNode } from "../vrt_node";
import { VRTTexSocket } from "../../vrt_tex_socket/vrt_tex_socket";
import {
    AVRLine,
    AVRType,
} from "../../../../../../editor_types/assembled_visual_rep/assembled_visual_rep";

export class VRTLine extends VRTNode {
    title?: string;
    comment?: string;
    main_tex: VRTTexSocket;
    right_tex?: VRTTexSocket;
    label_tex?: VRTTexSocket;
    underlined?: boolean;
    overlined?: boolean;

    get_avr: () => AVRLine = () => {
        return {
            tag: AVRType.Line,
            title: this.title,
            comment: this.comment,
            main_tex: this.main_tex.get_tex(),
            right_tex: !!this.right_tex ? this.right_tex.get_tex() : undefined,
            label_tex: !!this.label_tex ? this.label_tex.get_tex() : undefined,
            underlined: this.underlined,
            overlined: this.overlined,
        };
    };
}
