import { VRTTexElement } from "../vrt_tex_element/vrt_tex_element";
import { VRSTexSocket } from "../../../../../portable_reps/visual_rep_skeleton/visual_rep_skeleton";
import {
    active_socket_tex,
    create_tex_text,
    LATEX_EMPTY_SOCKET,
    LATEX_SPACE,
    text_with_cursor,
    wrap_html_id,
} from "../../../../../utils/latex_utils";
import { VRTEntity } from "../vrt_entity";
import {
    CursorSide,
    VRTCursorLocationRef,
    VRTCursorPosition,
    VRTCursorSocket,
} from "../vrt_cursor";
import { VRTTex } from "../vrt_tex";
import { TexWidgetProperties } from "../../../../../building_blocks/rct_node/building_blocks/tex_element/building_blocks/tex_widget/tex_widget_types/tex_widget_types";

export class VRTTexSocket implements VRTEntity, VRTTex, VRTCursorSocket {
    private readonly id: string;
    element: VRTTexElement | null;

    /* Vimium selection label */
    label: string = "_";

    left_cursor_entry: string = "";
    right_cursor_entry: string = "";

    constructor(tex_socket: VRSTexSocket) {
        this.id = tex_socket.id;
        this.element =
            tex_socket.element && new VRTTexElement(tex_socket.element);
    }

    get_tex: (
        cursor_position: VRTCursorPosition
    ) => [string, TexWidgetProperties[]] = (
        cursor_position: VRTCursorPosition
    ) => {
        const this_widget: TexWidgetProperties = {
            id: this.id,
            label: this.label,
        };

        if (!!this.element) {
            let [element_tex, widgets] = this.element.get_tex(cursor_position);

            /* If this is a leaf, add a widget for this socket into the mix */
            if (this.element.is_leaf()) {
                widgets = [this_widget, ...widgets];
                element_tex = wrap_html_id(element_tex, this.id);
            }

            if (cursor_position.id === this.id) {
                switch (cursor_position.side) {
                    case CursorSide.Left:
                        return [
                            active_socket_tex(
                                `${text_with_cursor(
                                    this.left_cursor_entry,
                                    cursor_position.position
                                )} ${LATEX_SPACE} ${element_tex}`
                            ),
                            widgets,
                        ];
                    case CursorSide.Right:
                        return [
                            active_socket_tex(
                                `${element_tex} ${LATEX_SPACE} ${text_with_cursor(
                                    this.right_cursor_entry,
                                    cursor_position.position
                                )}`
                            ),
                            widgets,
                        ];
                }
            } else {
                return [element_tex, widgets];
            }
        } else {
            let base_tex;

            if (cursor_position.id === this.id) {
                base_tex = text_with_cursor(
                    this.left_cursor_entry,
                    cursor_position.position
                );
            } else {
                base_tex = create_tex_text(LATEX_EMPTY_SOCKET);
            }

            base_tex = wrap_html_id(base_tex, this.id);

            return [base_tex, [this_widget]];
        }
    };

    get_line_cursor_locations: () => VRTCursorLocationRef[] = () => {
        if (!!this.element) {
            return [
                {
                    id: this.id,
                    side: CursorSide.Left,
                    ref: this,
                },
                ...this.element.get_line_cursor_locations(),
                {
                    id: this.id,
                    side: CursorSide.Right,
                    ref: this,
                },
            ];
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

    get_num_selectable_sockets: () => number = () => {
        if (!!this.element) {
            if (this.element.is_leaf()) {
                /* If the element is a leaf, then we can select it */
                return 1;
            } else {
                /* Otherwise, we can't select it, but we can select children */
                return this.element.get_num_selectable_sockets();
            }
        } else {
            /* An empty socket is a selectable socket */
            return 1;
        }
    };

    label_selectable_sockets: (labels: string[]) => string[] = (
        labels: string[]
    ) => {
        /* Basically mirror get_num_selectable */
        if (!this.element || (!!this.element && this.element.is_leaf())) {
            const label = labels.pop();
            if (!!label) {
                this.label = label;
            } else {
                throw new Error("Ran out of labels!");
            }

            return labels;
        } else if (!!this.element) {
            return this.element.label_selectable_sockets(labels);
        }

        return labels;
    };

    get_cursor_socket: (socket_id: string) => VRTCursorSocket | null = (
        socket_id: string
    ) => {
        if (this.id === socket_id) {
            return this;
        } else if (!!this.element) {
            return this.element.get_cursor_socket(socket_id);
        } else {
            return null;
        }
    };

    get_left_entry = () => this.left_cursor_entry;
    get_right_entry = () => this.right_cursor_entry;

    set_left_entry = (entry: string) => {
        this.left_cursor_entry = entry;
    };

    set_right_entry = (entry: string) => {
        this.right_cursor_entry = entry;
    };

    can_set_entry = () => true;
}
