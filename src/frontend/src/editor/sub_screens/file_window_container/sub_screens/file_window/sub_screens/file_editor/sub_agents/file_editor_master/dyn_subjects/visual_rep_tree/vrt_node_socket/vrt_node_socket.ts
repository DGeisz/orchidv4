import { VRTNode } from "../vrt_node/vrt_node";
import {
    AVRContainer,
    AVRNode,
    AVRType,
} from "../../../../../editor_types/assembled_visual_rep/assembled_visual_rep";
import {
    is_vrs_container,
    is_vrs_line,
    VRSNodeSocket,
} from "../../../../../portable_reps/visual_rep_skeleton/visual_rep_skeleton";
import { VRTLine } from "../vrt_node/vrt_line/vrt_line";
import { VRTContainer } from "../vrt_node/vrt_container/vrt_container";
import { LATEX_EMPTY_SOCKET } from "../../../../../utils/latex_utils";
import { VRTEditorLine } from "../vrt_editor_line";
import { VRTStruct } from "../vrt_struct";

export class VRTNodeSocket implements VRTNode, VRTEditorLine, VRTStruct {
    id: string;
    node: VRTNode | null = null;

    constructor(node_socket: VRSNodeSocket) {
        this.id = node_socket.id;

        /* Determine what the node is, and initiate as such */
        if (!!node_socket.node) {
            if (is_vrs_line(node_socket.node)) {
                this.node = new VRTLine(node_socket.node.Line);
            } else if (is_vrs_container(node_socket.node)) {
                this.node = new VRTContainer(node_socket.node.Container);
            } else {
                this.node = null;
            }
        } else {
            this.node = null;
        }
    }

    is_line = () => false;

    get_id = () => {
        return this.id;
    };

    get_editor_lines = () => {
        if (!!this.node && !this.node.is_line()) {
            return this.node.get_editor_lines();
        } else {
            return [this];
        }
    };

    get_avr: () => AVRNode = () => {
        if (!!this.node) {
            return this.node.get_avr();
        } else {
            return {
                tag: AVRType.Line,
                main_tex: LATEX_EMPTY_SOCKET,
                right_tex: null,
                title: null,
                comment: null,
                label_tex: null,
                border_bottom: false,
                border_top: false,
            };
        }
    };
}
