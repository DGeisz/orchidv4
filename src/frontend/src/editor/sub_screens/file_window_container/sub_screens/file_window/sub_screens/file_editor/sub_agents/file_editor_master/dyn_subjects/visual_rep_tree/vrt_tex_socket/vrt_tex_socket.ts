import { VRTTexElement } from "../vrt_tex_element/vrt_tex_element";
import { VRSTexSocket } from "../../../../../portable_reps/visual_rep_skeleton/visual_rep_skeleton";
import {
    LATEX_EMPTY_SOCKET,
    text_with_cursor,
} from "../../../../../utils/latex_utils";
import { VRTEntity } from "../vrt_entity";
import {
    CursorSide,
    VRTCursorLocationRef,
    VRTCursorPosition,
    VRTCursorSocket,
} from "../vrt_cursor";
import { VRTTex } from "../vrt_tex";

export class VRTTexSocket implements VRTEntity, VRTTex, VRTCursorSocket {
    private readonly id: string;
    element: VRTTexElement | null;

    left_cursor_entry: string = "";
    right_cursor_entry: string = "";

    constructor(tex_socket: VRSTexSocket) {
        this.id = tex_socket.id;
        this.element =
            tex_socket.element && new VRTTexElement(tex_socket.element);
    }

    get_tex = (cursor_position: VRTCursorPosition) => {
        if (!!this.element) {
            const element_tex = this.element.get_tex(cursor_position);

            if (cursor_position.id === this.id) {
                switch (cursor_position.side) {
                    case CursorSide.Left:
                        return `${text_with_cursor(
                            this.left_cursor_entry,
                            cursor_position.position
                        )} ${element_tex}`;
                    case CursorSide.Right:
                        return `${element_tex} ${text_with_cursor(
                            this.right_cursor_entry,
                            cursor_position.position
                        )}`;
                }
            } else {
                return element_tex;
            }
        } else {
            if (cursor_position.id === this.id) {
                return text_with_cursor(
                    this.left_cursor_entry,
                    cursor_position.position
                );
            } else {
                return LATEX_EMPTY_SOCKET;
            }
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

    get_left_entry = () => this.left_cursor_entry;
    get_right_entry = () => this.right_cursor_entry;

    set_left_entry = (entry: string) => {
        this.left_cursor_entry = entry;
    };

    set_right_entry = (entry: string) => {
        this.right_cursor_entry = entry;
    };
}
