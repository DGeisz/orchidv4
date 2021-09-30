import { OrchidFilePath } from "../../../../../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";
import { VisualRepSkeleton } from "../../portable_reps/visual_rep_skeleton/visual_rep_skeleton";

export class FileEditorMaster {
    constructor(vrs: VisualRepSkeleton) {}

    /* Returns whether another path maps
     * to the same location as this one */
    path_eq = (other_path: OrchidFilePath): boolean => {
        /*TODO: Actually implement this bitch*/
        return false;
    };

    /* Updates File editor master with the latest
     * rep skeleton */
    update = (vrs: VisualRepSkeleton) => {};
}
