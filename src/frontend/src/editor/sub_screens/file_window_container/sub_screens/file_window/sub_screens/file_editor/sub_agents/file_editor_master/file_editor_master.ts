import {
    file_path_eq,
    OrchidFilePath,
} from "../../../../../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import { VisualRepSkeleton } from "../../portable_reps/visual_rep_skeleton/visual_rep_skeleton";

export class FileEditorMaster {
    private readonly file_id: string;
    private readonly file_name: string;
    private readonly file_path: OrchidFilePath;
    private readonly formatted_name: string;

    constructor(vrs: VisualRepSkeleton) {
        const { file_id, file_path, file_name, formatted_name } = vrs;

        this.file_id = file_id;
        this.file_name = file_name;
        this.formatted_name = formatted_name;
        this.file_path = file_path;
    }

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
