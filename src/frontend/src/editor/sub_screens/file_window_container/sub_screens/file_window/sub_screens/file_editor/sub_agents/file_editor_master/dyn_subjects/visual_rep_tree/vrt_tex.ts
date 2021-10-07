import { VRTCursorPosition } from "./vrt_cursor";

export interface VRTTex {
    get_tex: (cursor_position: VRTCursorPosition) => string;
}
