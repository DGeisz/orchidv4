import { VRTEntity } from "../../visual_rep_tree/vrt_entity";
import { VRTSocket } from "../../visual_rep_tree/vrt_socket/vrt_socket";
import {
    AVRLine,
    AVRType,
} from "../../../../../editor_types/assembled_visual_rep/assembled_visual_rep";

export class BasicLine implements VRTEntity {
    tex_socket: VRTSocket;

    get_avr: () => AVRLine = () => {
        return {
            tag: AVRType.Line,
            main_tex: this.tex_socket.get_tex(),
        };
    };

    get_tex = () => {
        return this.tex_socket.get_tex();
    };
}
