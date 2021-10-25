use crate::abstract_file_master::portable_reps::visual_rep_skeleton::VisualRepSkeleton;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::OrchidOpenFiles;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::OrchidFileTree;
use serde::{Deserialize, Serialize};

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub enum WsResponse {
    OFT(OrchidFileTree),
    OpenFiles(OrchidOpenFiles),
    FullVRS { vrs: VisualRepSkeleton },
    Err(WsError),
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub enum WsError {
    NoOp,
}
