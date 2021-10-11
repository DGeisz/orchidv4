import { VisualRepSkeleton } from "../../../../../portable_reps/visual_rep_skeleton/visual_rep_skeleton";

export interface FullVRSRes {
    FullVRS: {
        vrs: VisualRepSkeleton;
    };
}

export function res_is_full_vrs(res: FemWsRes): res is FullVRSRes {
    return res.hasOwnProperty("FullVRS");
}

export type FemWsRes = FullVRSRes;
