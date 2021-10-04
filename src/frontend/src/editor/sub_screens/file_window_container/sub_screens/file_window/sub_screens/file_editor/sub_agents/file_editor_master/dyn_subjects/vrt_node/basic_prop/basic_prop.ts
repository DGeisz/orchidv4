import { VRTEntity } from "../../visual_rep_tree/vrt_entity";
import { VRTSocket } from "../../visual_rep_tree/vrt_socket/vrt_socket";
import {
    AVRLine,
    AVRType,
} from "../../../../../editor_types/assembled_visual_rep/assembled_visual_rep";
import { INVALID_TEX } from "../../../../../utils/latex_utils";

export class BasicProp implements VRTEntity {
    prop_socket: VRTSocket;
    proof_socket: VRTSocket;
    var_line_socket: VRTSocket;

    get_avr: () => AVRLine = () => {
        return {
            tag: AVRType.Line,
            main_tex: this.prop_socket.get_tex(),
            right_tex: this.proof_socket.get_tex(),
            label: this.var_line_socket.get_tex(),
        };
    };

    get_tex = () => {
        return INVALID_TEX;
    };
}
