use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::OrchidFilePath;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Eq, PartialEq, Debug, Clone)]
pub enum WsCommand {
    /* Command to fetch the Orchid file from the
    root where the backend is being run*/
    GetRootOFT,
    OpenFile { path: OrchidFilePath },
}
