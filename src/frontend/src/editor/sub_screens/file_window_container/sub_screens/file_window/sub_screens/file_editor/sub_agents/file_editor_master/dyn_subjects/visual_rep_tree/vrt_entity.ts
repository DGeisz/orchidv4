import { AVRNode } from "../../../../editor_types/assembled_visual_rep/assembled_visual_rep";

export interface VRTEntity {
    get_avr: () => AVRNode;
    get_tex: () => string;
}
