import { OrchidFileTree } from "../portable_reps/orchid_file_tree";

export interface OFTRes {
    OFT: OrchidFileTree;
}

export function res_is_oft(res: OFTRes): res is OFTRes {
    return res.hasOwnProperty("OFT");
}

export type FeWsRes = OFTRes;
