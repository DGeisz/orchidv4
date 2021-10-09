import { VRTTexSocket } from "../vrt_tex_socket/vrt_tex_socket";
import { VRSTexElement } from "../../../../../portable_reps/visual_rep_skeleton/visual_rep_skeleton";
import { INVALID_TEX } from "../../../../../utils/latex_utils";
import { VRTEntity } from "../vrt_entity";
import { VRTCursorLocationRef, VRTCursorPosition } from "../vrt_cursor";
import { VRTTex } from "../vrt_tex";
import { TexWidgetProperties } from "../../../../../building_blocks/rct_node/building_blocks/tex_element/building_blocks/tex_widget/tex_widget_types/tex_widget_types";

export class VRTTexElement implements VRTEntity, VRTTex {
    tex_template: string[];
    tex_sockets: VRTTexSocket[];

    constructor(tex_element: VRSTexElement) {
        this.tex_template = tex_element.tex_template;
        this.tex_sockets = tex_element.tex_sockets.map(
            (socket) => new VRTTexSocket(socket)
        );
    }

    get_tex: (
        cursor_position: VRTCursorPosition
    ) => [string, TexWidgetProperties[]] = (
        cursor_position: VRTCursorPosition
    ) => {
        /* First make sure all the lengths are correct */
        if (this.tex_template.length === this.tex_sockets.length + 1) {
            let base_tex = "";
            let widgets: TexWidgetProperties[] = [];

            for (let i = 0; i < this.tex_sockets.length; i++) {
                const [socket_tex, socket_widgets] =
                    this.tex_sockets[i].get_tex(cursor_position);

                base_tex += this.tex_template[i] + socket_tex;

                widgets = widgets.concat(socket_widgets);
            }

            /* Finish out with the last element of the template */
            base_tex += this.tex_template[this.tex_template.length - 1];

            return [base_tex, widgets];
        } else {
            return [INVALID_TEX, []];
        }
    };

    get_line_cursor_locations = () => {
        return this.tex_sockets.reduce<VRTCursorLocationRef[]>(
            (prev, curr) => [...prev, ...curr.get_line_cursor_locations()],
            []
        );
    };

    get_num_selectable_sockets = () => {
        return this.tex_sockets.reduce(
            (acc, next) => acc + next.get_num_selectable_sockets(),
            0
        );
    };

    label_selectable_sockets = (labels: string[]) => {
        return this.tex_sockets.reduce(
            (acc, next) => next.label_selectable_sockets(acc),
            labels
        );
    };

    is_leaf = () => this.tex_template.length === 1;

    get_cursor_socket = (socket_id: string) => {
        for (let socket of this.tex_sockets) {
            const cursor = socket.get_cursor_socket(socket_id);

            if (!!cursor) {
                return cursor;
            }
        }

        return null;
    };
}
