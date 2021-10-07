import { VRTNode } from "../vrt_node";
import {
    AVRContainer,
    AVRType,
} from "../../../../../../editor_types/assembled_visual_rep/assembled_visual_rep";
import { VRTNodeSocket } from "../../vrt_node_socket/vrt_node_socket";
import { VRSContainer } from "../../../../../../portable_reps/visual_rep_skeleton/visual_rep_skeleton";
import { VRTCursorPosition } from "../../vrt_cursor";

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

    get_avr: (cursor_position: VRTCursorPosition) => AVRContainer = (
        cursor_position: VRTCursorPosition
    ) => {
        return {
            tag: AVRType.Container,
            id: this.id,
            left_border: this.left_border,
            indented: this.indented,
            children: this.children.map((child) =>
                child.get_avr(cursor_position)
            ),
        };
    };

    get_line_sockets = () => {
        return this.children.reduce<VRTNodeSocket[]>(
            (previousValue, currentValue) => [
                ...previousValue,
                ...currentValue.get_line_sockets(),
            ],
            []
        );
    };

    /* We just return nothing here because a container doesn't
     * ever act as a line */
    get_line_cursor_locations = () => [];
}
