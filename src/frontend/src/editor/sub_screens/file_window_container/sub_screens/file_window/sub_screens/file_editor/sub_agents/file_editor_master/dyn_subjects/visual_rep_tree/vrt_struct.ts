/**
 * This is a category that pertains to all
 * non-tex vrt elements
 */
import { VRTNodeSocket } from "./vrt_node_socket/vrt_node_socket";
import { VRTEntity } from "./vrt_entity";

/** Structs encompass all things that
 * aren't directly TeX related, so all nodes
 * and node sockets */
export interface VRTStruct extends VRTEntity {
    /* A 'line socket' is any socket that doesn't hold a container */
    get_line_sockets: () => VRTNodeSocket[];
}
