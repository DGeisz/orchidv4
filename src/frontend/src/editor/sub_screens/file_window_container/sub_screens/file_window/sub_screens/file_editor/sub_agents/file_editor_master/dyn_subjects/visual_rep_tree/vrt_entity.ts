import { VRTCursorLocationRef } from "./vrt_cursor";

export interface VRTEntity {
    get_line_cursor_locations: () => VRTCursorLocationRef[];
}
