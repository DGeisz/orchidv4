import { AVRNode } from "../../../../../editor_types/assembled_visual_rep/assembled_visual_rep";

export interface VRTNode {
    get_avr: () => AVRNode;
}
