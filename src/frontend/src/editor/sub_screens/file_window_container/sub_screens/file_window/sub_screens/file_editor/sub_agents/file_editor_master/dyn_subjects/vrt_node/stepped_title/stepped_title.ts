import { VRTEntity } from "../../visual_rep_tree/vrt_entity";
import { VRTSocket } from "../../visual_rep_tree/vrt_socket/vrt_socket";
import {
    AVRContainer,
    AVRType,
} from "../../../../../editor_types/assembled_visual_rep/assembled_visual_rep";
import { INVALID_TEX } from "../../../../../utils/latex_utils";

export class SteppedTitle implements VRTEntity {
    title: string;
    node_id: string;
    comment?: string;
    prop_socket: VRTSocket;
    proof_socket: VRTSocket;
    var_line_socket: VRTSocket;
    steps_socket: VRTSocket;
    footer_socket: VRTSocket;

    get_avr: () => AVRContainer = () => {
        return {
            tag: AVRType.Container,
            left_border: true,
            id: this.node_id,
            children: [
                {
                    tag: AVRType.Line,
                    title: this.title,
                    comment: this.comment,
                    main_tex: this.prop_socket.get_tex(),
                    right_tex: this.proof_socket.get_tex(),
                    label_tex: this.var_line_socket.get_tex(),
                },
                this.steps_socket.get_avr(),
                {
                    tag: AVRType.Line,
                    main_tex: this.footer_socket.get_tex(),
                },
            ],
        };
    };

    get_tex = () => {
        return INVALID_TEX;
    };
}
