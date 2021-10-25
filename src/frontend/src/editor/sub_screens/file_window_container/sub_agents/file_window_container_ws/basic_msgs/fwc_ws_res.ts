import { VisualRepSkeleton } from "../../../sub_screens/file_window/sub_screens/file_editor/portable_reps/visual_rep_skeleton/visual_rep_skeleton";
import { OrchidOpenFiles } from "../../../../file_explorer/sub_agents/file_explorer_ws/portable_reps/orchid_file_path/orchid_file_path";

export interface FullVRSRes {
    FullVRS: {
        vrs: VisualRepSkeleton;
        caller_id: null | string;
    };
}

export function res_is_full_vrs(res: FwcWsRes): res is FullVRSRes {
    return res.hasOwnProperty("FullVRS");
}

export interface OpenFilesRes {
    OpenFiles: OrchidOpenFiles;
}

export function res_is_open_files(res: FwcWsRes): res is OpenFilesRes {
    return res.hasOwnProperty("OpenFiles");
}

export type FwcWsRes = FullVRSRes | OpenFilesRes;
