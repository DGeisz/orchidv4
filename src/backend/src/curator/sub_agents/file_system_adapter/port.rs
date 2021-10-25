use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::{
    OFPError, OrchidFilePath, OrchidOpenFiles,
};
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::{
    OFTError, OrchidFileTree, OrchidOpenFolders,
};

pub trait FSAControl {
    fn get_root_file_tree(&self) -> Result<OrchidFileTree, OFTError>;

    fn open_file(&self, path: &OrchidFilePath) -> Result<(), OFPError>;

    fn save_open_folders(
        &self,
        open_folders: OrchidOpenFolders,
    ) -> Result<OrchidFileTree, OFTError>;

    fn save_open_files(&self, open_files: OrchidOpenFiles) -> Result<OrchidFileTree, OFTError>;

    fn get_open_files(&self) -> Option<OrchidOpenFiles>;
}
