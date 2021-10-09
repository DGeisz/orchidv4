import { VRTCursorLocationRef, VRTCursorSocket } from "./vrt_cursor";

export interface VRTEntity {
    get_line_cursor_locations: () => VRTCursorLocationRef[];
    get_num_selectable_sockets: () => number;
    label_selectable_sockets: (labels: string[]) => string[];

    get_cursor_socket: (socket_id: string) => VRTCursorSocket | null;
}
