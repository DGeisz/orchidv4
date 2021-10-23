use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::OrchidOpenFolders;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Eq, PartialEq, Clone)]
pub struct OrchidConfig {
    pub open_folders: OrchidOpenFolders,
}
