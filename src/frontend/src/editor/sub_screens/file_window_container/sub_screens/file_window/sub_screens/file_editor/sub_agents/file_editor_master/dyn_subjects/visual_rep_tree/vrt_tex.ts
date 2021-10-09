import { VRTCursorPosition } from "./vrt_cursor";
import { TexWidgetProperties } from "../../../../building_blocks/rct_node/building_blocks/tex_element/building_blocks/tex_widget/tex_widget_types/tex_widget_types";

export interface VRTTex {
    get_tex: (
        cursor_position: VRTCursorPosition
    ) => [string, TexWidgetProperties[]];
}
