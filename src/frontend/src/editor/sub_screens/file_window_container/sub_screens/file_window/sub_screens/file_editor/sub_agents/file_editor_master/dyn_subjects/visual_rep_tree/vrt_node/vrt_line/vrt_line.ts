import { VRTNode } from "../vrt_node";
import { VRTTexSocket } from "../../vrt_tex_socket/vrt_tex_socket";
import {
    AVRLine,
    AVRType,
} from "../../../../../../editor_types/assembled_visual_rep/assembled_visual_rep";
import { VRSLine } from "../../../../../../portable_reps/visual_rep_skeleton/visual_rep_skeleton";
import { VRTEditorLine } from "../../vrt_editor_line";

export class VRTLine implements VRTNode, VRTEditorLine {
    id: string;
    title: string | null;
    comment: string | null;
    main_tex: VRTTexSocket;
    right_tex: VRTTexSocket | null;
    label_tex: VRTTexSocket | null;
    border_bottom: boolean;
    border_top: boolean;

    constructor(line: VRSLine) {
        this.title = line.title;
        this.id = line.id;
        this.comment = line.comment;
        this.main_tex = new VRTTexSocket(line.main_tex);
        this.right_tex = line.right_tex && new VRTTexSocket(line.right_tex);
        this.label_tex = line.label_tex && new VRTTexSocket(line.label_tex);
        this.border_top = line.border_top;
        this.border_bottom = line.border_bottom;
    }

    is_line = () => true;

    get_id = () => {
        return this.id;
    };

    get_avr: () => AVRLine = () => {
        return {
            tag: AVRType.Line,
            title: this.title,
            comment: this.comment,
            main_tex: this.main_tex.get_tex(),
            right_tex: !!this.right_tex ? this.right_tex.get_tex() : null,
            label_tex: !!this.label_tex ? this.label_tex.get_tex() : null,
            border_bottom: this.border_bottom,
            border_top: this.border_top,
        };
    };

    get_editor_lines = () => {
        return [];
    };
}
