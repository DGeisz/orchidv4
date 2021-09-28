use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::OrchidFileTree;
use serde::{Deserialize, Serialize};

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub enum WsResponse {
    OFT(OrchidFileTree),
    Err(WsError),
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub enum WsError {
    NoOp,
}
