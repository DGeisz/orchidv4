import { VRTSocket } from "../../visual_rep_tree/vrt_socket/vrt_socket";
import { VRTEntity } from "../../visual_rep_tree/vrt_entity";
import {
    AVRContainer,
    AVRType,
} from "../../../../../editor_types/assembled_visual_rep/assembled_visual_rep";
import { v4 } from "uuid";
import { INVALID_TEX } from "../../../../../utils/latex_utils";

export class IndentedWrapper implements VRTEntity {
    node_id: string;
    header_socket: VRTSocket;
    steps_socket: VRTSocket;
    footer_socket: VRTSocket;

    constructor() {
        this.node_id = v4();
    }

    get_avr: () => AVRContainer = () => {
        return {
            tag: AVRType.Container,
            indented: true,
            children: [
                {
                    tag: AVRType.Line,
                    main_tex: this.header_socket.get_tex(),
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
