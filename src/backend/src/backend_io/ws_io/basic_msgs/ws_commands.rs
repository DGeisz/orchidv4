use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::{
    OrchidFilePath, OrchidOpenFiles,
};
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::OrchidOpenFolders;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Eq, PartialEq, Debug, Clone)]
pub enum WsCommand {
    /* Command to fetch the Orchid file from the
    root where the backend is being run*/
    GetRootOFT,
    GetOpenFiles,
    OpenFile { path: OrchidFilePath },
    SaveOpenFolders { open_folders: OrchidOpenFolders },
    SaveOpenFiles { open_files: OrchidOpenFiles },
}

// CommitInput {
//     file_id: String,
//     socket_id: String,
//     input: String,
//     side: SocketSide,
// }

#[derive(Deserialize, Serialize, Eq, PartialEq, Debug, Clone)]
pub enum SocketSide {
    Left,
    Right,
}
