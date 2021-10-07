import { AVRNode } from "../../../../../editor_types/assembled_visual_rep/assembled_visual_rep";
import { VRTStruct } from "../vrt_struct";
import { VRTCursorPosition } from "../vrt_cursor";

export interface VRTNode extends VRTStruct {
    get_avr: (cursor_position: VRTCursorPosition) => AVRNode;
    is_line: () => boolean;
}
