use crate::abstract_file_master::portable_reps::visual_rep_skeleton::VisualRepSkeleton;
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_path::{
    OFPError, OrchidFilePath, OrchidOpenFiles,
};
use crate::curator::sub_agents::file_system_adapter::portable_reps::orchid_file_tree::{
    OFTError, OrchidFileTree, OrchidOpenFolders,
};
use mockall::*;

/// Control port for the curator
#[automock]
pub trait CuratorControl {
    fn get_root_file_tree(&self) -> Result<OrchidFileTree, OFTError>;

    fn open_file(&mut self, path: OrchidFilePath) -> Result<VisualRepSkeleton, OFPError>;

    fn save_open_folders(
        &mut self,
        open_folders: OrchidOpenFolders,
    ) -> Result<OrchidFileTree, OFTError>;

    fn save_open_files(&mut self, open_files: OrchidOpenFiles) -> Result<OrchidFileTree, OFTError>;

    fn get_open_files(&self) -> Option<OrchidOpenFiles>;
}

pub fn mock_curator_control() -> MockCuratorControl {
    MockCuratorControl::new()
}
