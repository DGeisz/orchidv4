import { VRTTexElement } from "../vrt_tex_element/vrt_tex_element";
import { VRSTexSocket } from "../../../../../portable_reps/visual_rep_skeleton/visual_rep_skeleton";
import { LATEX_EMPTY_SOCKET } from "../../../../../utils/latex_utils";

export class VRTTexSocket {
    private readonly id: string;
    element: VRTTexElement | null;

    constructor(tex_socket: VRSTexSocket) {
        this.id = tex_socket.id;
        this.element =
            tex_socket.element && new VRTTexElement(tex_socket.element);
    }

    get_tex = () => {
        if (!!this.element) {
            return this.element.get_tex();
        } else {
            return LATEX_EMPTY_SOCKET;
        }
    };
}
