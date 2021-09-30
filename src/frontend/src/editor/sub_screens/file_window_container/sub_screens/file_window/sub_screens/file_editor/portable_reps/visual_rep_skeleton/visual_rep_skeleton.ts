import { OrchidFilePath } from "../../../../../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";

export interface VisualRepSkeleton {
    file_id: String;
    file_name: String;
    file_path: OrchidFilePath;
    formatted_name: String;
}
