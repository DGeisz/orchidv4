import { VisualRepSkeleton } from "../../../sub_screens/file_window/sub_screens/file_editor/portable_reps/visual_rep_skeleton/visual_rep_skeleton";

export interface FullVRSRes {
    FullVRS: {
        vrs: VisualRepSkeleton;
        caller_id: null | string;
    };
}

export function res_is_full_vrs(res: FwcWsRes): res is FullVRSRes {
    return res.hasOwnProperty("FullVRS");
}

export type FwcWsRes = FullVRSRes;
