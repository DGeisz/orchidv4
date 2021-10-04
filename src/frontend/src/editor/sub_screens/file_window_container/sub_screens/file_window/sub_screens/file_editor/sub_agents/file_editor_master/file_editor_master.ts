import {
    file_path_eq,
    OrchidFilePath,
} from "../../../../../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import {
    exampleVRS,
    VisualRepSkeleton,
} from "../../portable_reps/visual_rep_skeleton/visual_rep_skeleton";
import { VRTNodeSocket } from "./dyn_subjects/visual_rep_tree/vrt_node_socket/vrt_node_socket";
import { AVRNode } from "../../editor_types/assembled_visual_rep/assembled_visual_rep";

export class FileEditorMaster {
    private readonly file_id: string;
    private readonly file_name: string;
    private readonly file_path: OrchidFilePath;
    private readonly formatted_name: string;
    private root_node_socket: VRTNodeSocket;

    private set_avr: (avr: AVRNode) => void;

    constructor(vrs: VisualRepSkeleton) {
        const {
            file_id,
            file_path,
            file_name,
            formatted_name,
            root_node_socket,
        } = vrs;

        this.file_id = file_id;
        this.file_name = file_name;
        this.formatted_name = formatted_name;
        this.file_path = file_path;
        this.root_node_socket = new VRTNodeSocket(exampleVRS);

        this.set_avr = () => {};
    }

    set_set_avr = (set_avr: (avr: AVRNode) => void) => {
        this.set_avr = set_avr;

        this.set_avr(this.root_node_socket.get_avr());
    };

    /* Getter for basic info */
    get_file_id = () => {
        return this.file_id;
    };

    get_file_name = () => {
        return this.file_name;
    };

    get_formatted_name = () => {
        return this.formatted_name;
    };

    get_file_path = () => {
        return this.file_path;
    };

    /* Returns whether another path maps
     * to the same location as this one */
    path_eq = (other_path: OrchidFilePath): boolean => {
        return file_path_eq(this.file_path, other_path);
    };

    /* Updates File editor master with the latest
     * rep skeleton */
    update = (vrs: VisualRepSkeleton) => {};
}
