use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::{
    OFPError, OrchidFilePath,
};
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::{
    OFTError, OrchidFileTree, OrchidOpenFolders,
};

pub trait FSAControl {
    fn get_root_file_tree(&self) -> Result<OrchidFileTree, OFTError>;

    fn open_file(&self, path: &OrchidFilePath) -> Result<(), OFPError>;

    fn save_open_folders(&self, open_folders: OrchidOpenFolders) -> Result<(), OFTError>;
}
