import { VRTTexSocket } from "../vrt_tex_socket/vrt_tex_socket";
import { VRSTexElement } from "../../../../../portable_reps/visual_rep_skeleton/visual_rep_skeleton";
import { INVALID_TEX } from "../../../../../utils/latex_utils";
import { VRTEntity } from "../vrt_entity";
import { VRTCursorLocationRef, VRTCursorPosition } from "../vrt_cursor";
import { VRTTex } from "../vrt_tex";

export class VRTTexElement implements VRTEntity, VRTTex {
    tex_template: string[];
    tex_sockets: VRTTexSocket[];

    constructor(tex_element: VRSTexElement) {
        this.tex_template = tex_element.tex_template;
        this.tex_sockets = tex_element.tex_sockets.map(
            (socket) => new VRTTexSocket(socket)
        );
    }

    get_tex = (cursor_position: VRTCursorPosition) => {
        /* First make sure all the lengths are correct */
        if (this.tex_template.length === this.tex_sockets.length + 1) {
            let base_tex = "";

            for (let i = 0; i < this.tex_sockets.length; i++) {
                base_tex +=
                    this.tex_template[i] +
                    this.tex_sockets[i].get_tex(cursor_position);
            }

            /* Finish out with the last element of the template */
            base_tex += this.tex_template[this.tex_template.length - 1];

            return base_tex;
        } else {
            return INVALID_TEX;
        }
    };

    get_line_cursor_locations = () => {
        return this.tex_sockets.reduce<VRTCursorLocationRef[]>(
            (prev, curr) => [...prev, ...curr.get_line_cursor_locations()],
            []
        );
    };
}
