import { AVRNode } from "../../../../../editor_types/assembled_visual_rep/assembled_visual_rep";
import { VRTStruct } from "../vrt_struct";

export interface VRTNode extends VRTStruct {
    get_avr: () => AVRNode;
    is_line: () => boolean;
}
