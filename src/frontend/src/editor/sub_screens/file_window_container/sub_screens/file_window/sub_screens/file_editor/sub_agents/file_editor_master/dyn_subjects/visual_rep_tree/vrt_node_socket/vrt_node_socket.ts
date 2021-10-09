import { VRTNode } from "../vrt_node/vrt_node";
import {
    AVRLine,
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
import {
    active_socket_tex,
    LATEX_EMPTY_SOCKET,
    text_with_cursor,
    wrap_html_id,
} from "../../../../../utils/latex_utils";
import { VRTStruct } from "../vrt_struct";
import {
    CursorSide,
    VRTCursorLocationRef,
    VRTCursorPosition,
    VRTCursorSocket,
} from "../vrt_cursor";

export class VRTNodeSocket implements VRTStruct, VRTCursorSocket {
    id: string;
    node: VRTNode | null = null;

    /* This is the label used for vimium selection */
    label: string = "";

    left_cursor_entry: string = "";

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

    get_id = () => this.id;

    get_line_sockets: () => VRTNodeSocket[] = () => {
        if (!!this.node && !this.node.is_line()) {
            return this.node.get_line_sockets();
        } else {
            return [this];
        }
    };

    get_avr: (cursor_position: VRTCursorPosition) => AVRNode = (
        cursor_position: VRTCursorPosition
    ) => {
        if (!!this.node) {
            const avr = this.node.get_avr(cursor_position);

            if (cursor_position.id === this.id) {
                switch (cursor_position.side) {
                    case CursorSide.Left:
                        avr.left_cursor = true;
                        break;
                    case CursorSide.Right:
                        avr.right_cursor = true;
                        break;
                }
            }

            return avr;
        } else {
            let main_tex = wrap_html_id(LATEX_EMPTY_SOCKET, this.id);

            if (cursor_position.id === this.id) {
                main_tex = wrap_html_id(
                    active_socket_tex(
                        text_with_cursor(
                            this.left_cursor_entry,
                            cursor_position.position
                        )
                    ),
                    this.id
                );
            }

            const line: AVRLine = {
                tag: AVRType.Line,
                main_tex: main_tex,
                main_widgets: [{ id: this.id, label: this.label }],
                right_tex: null,
                right_widgets: [],
                title: null,
                comment: null,
                label_tex: null,
                label_widgets: [],
                border_bottom: false,
                border_top: false,
            };

            return line;
        }
    };

    can_set_entry = () => !this.node;

    get_line_cursor_locations: () => VRTCursorLocationRef[] = () => {
        if (!!this.node) {
            if (this.node.is_line()) {
                return [
                    {
                        id: this.id,
                        side: CursorSide.Left,
                        ref: this,
                    },
                    ...this.node.get_line_cursor_locations(),
                    {
                        id: this.id,
                        side: CursorSide.Right,
                        ref: this,
                    },
                ];
            } else {
                /* If this holds a container,
                 * then this socket isn't functioning
                 * as a line, so we return nothing */
                return [];
            }
        } else {
            return [
                {
                    id: this.id,
                    side: CursorSide.Left,
                    ref: this,
                },
            ];
        }
    };

    get_num_selectable_sockets = () => {
        if (!!this.node) {
            return this.node.get_num_selectable_sockets();
        } else {
            /* If this isn't filled, then it's selectable */
            return 1;
        }
    };

    label_selectable_sockets = (labels: string[]) => {
        if (!!this.node) {
            return this.node.label_selectable_sockets(labels);
        } else {
            /* Grab a label from the top, and return the remaining labels */
            const label = labels.pop();

            if (!!label) {
                this.label = label;
            } else {
                throw new Error("Ran out of labels");
            }

            return labels;
        }
    };

    get_left_entry = () => this.left_cursor_entry;
    get_right_entry = () => "";

    set_left_entry = (entry: string) => {
        if (!this.node) {
            this.left_cursor_entry = entry;
        }
    };

    set_right_entry = (_entry: string) => {};

    get_cursor_socket = (socket_id: string) => {
        if (this.id === socket_id) {
            return this;
        } else if (!!this.node) {
            return this.node.get_cursor_socket(socket_id);
        } else {
            return null;
        }
    };
}
