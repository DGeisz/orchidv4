import { VRTNode } from "../vrt_node";
import {
    AVRContainer,
    AVRType,
} from "../../../../../../editor_types/assembled_visual_rep/assembled_visual_rep";
import { VRTNodeSocket } from "../../vrt_node_socket/vrt_node_socket";
import { VRSContainer } from "../../../../../../portable_reps/visual_rep_skeleton/visual_rep_skeleton";
import { VRTEditorLine } from "../../vrt_editor_line";

export class VRTContainer implements VRTNode {
    id: string;
    left_border: boolean;
    indented: boolean;
    children: VRTNodeSocket[];

    constructor(container: VRSContainer) {
        this.id = container.id;
        this.left_border = container.left_border;
        this.indented = container.indented;
        this.children = container.children.map(
            (child) => new VRTNodeSocket(child)
        );
    }

    is_line = () => false;

    get_avr: () => AVRContainer = () => {
        return {
            tag: AVRType.Container,
            id: this.id,
            left_border: this.left_border,
            indented: this.indented,
            children: this.children.map((child) => child.get_avr()),
        };
    };

    get_editor_lines = () => {
        return this.children.reduce<VRTEditorLine[]>(
            (previousValue, currentValue) => [
                ...previousValue,
                ...currentValue.get_editor_lines(),
            ],
            []
        );
    };
}
