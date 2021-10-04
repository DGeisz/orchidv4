import { VRTEntity } from "../../visual_rep_tree/vrt_entity";
import { VRTSocket } from "../../visual_rep_tree/vrt_socket/vrt_socket";
import {
    AVRLine,
    AVRType,
} from "../../../../../editor_types/assembled_visual_rep/assembled_visual_rep";
import { INVALID_TEX } from "../../../../../utils/latex_utils";

export class TexElement implements VRTEntity {
    tex_template_elements: string[];
    sockets: VRTSocket[];

    get_avr: () => AVRLine = () => {
        return {
            tag: AVRType.Line,
            main_tex: INVALID_TEX,
        };
    };

    get_tex = () => {
        if (this.tex_template_elements.length !== this.sockets.length + 1) {
            return INVALID_TEX;
        } else {
            let base_tex = "";

            for (let i = 0; i < this.sockets.length; i++) {
                base_tex +=
                    this.tex_template_elements[i] + this.sockets[i].get_tex();
            }

            base_tex +=
                this.tex_template_elements[
                    this.tex_template_elements.length - 1
                ];

            return base_tex;
        }
    };
}
