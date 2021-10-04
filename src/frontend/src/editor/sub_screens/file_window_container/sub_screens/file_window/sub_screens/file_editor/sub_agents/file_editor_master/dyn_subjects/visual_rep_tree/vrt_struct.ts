/**
 * This is a category that pertains to all
 * non-tex vrt elements
 */
import { VRTEditorLine } from "./vrt_editor_line";

export interface VRTStruct {
    get_editor_lines: () => VRTEditorLine[];
}
